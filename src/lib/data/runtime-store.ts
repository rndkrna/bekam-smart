import fs from "fs";
import path from "path";
import { INITIAL_QUEUES, INITIAL_SERVICES, LiveQueueTicket } from "./mock-data";
import { calculateEstimatedWait } from "@/lib/utils/queue-estimator";
import { prisma } from "@/lib/prisma";

export interface RoomItem {
  id: string;
  roomNumber: number;
  name: string;
  lane: "MALE" | "FEMALE";
  status: "AVAILABLE" | "OCCUPIED" | "CLEANING" | "MAINTENANCE";
  currentTicketNumber?: string;
  therapistName?: string;
  lastSanitizedTime?: string;
}

export interface MedicalScreeningRecord {
  id: string;
  ticketId: string;
  ticketNumber: string;
  patientName: string;
  systolicBP: number;
  diastolicBP: number;
  pulseRateBpm?: number;
  bloodSugarMgDl?: number;
  bloodPressureCategory: "NORMAL" | "PRE_HYPERTENSION" | "HYPERTENSION_STAGE_1" | "HYPERTENSION_STAGE_2" | "HYPOTENSION";
  hasHemophilia: boolean;
  hasSevereAnemia: boolean;
  isTakingBloodThinner: boolean;
  isPregnant: boolean;
  hasAcuteInfection: boolean;
  selectedCuppingPoints: string[];
  cupQuantity: number;
  therapistNotes: string;
  isEligibleForCupping: boolean;
  therapistName: string;
  screenedAt: string;
}

export interface BillingRecord {
  id: string;
  ticketId: string;
  ticketNumber: string;
  invoiceNumber: string;
  patientName: string;
  serviceName: string;
  serviceFee: number;
  herbFee: number;
  discount: number;
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  paymentMethod?: "CASH" | "QRIS" | "TRANSFER";
  paidAt?: string;
  cashierName?: string;
  cashierNotes?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  ticketId: string;
  ticketNumber: string;
  fromStatus?: string;
  toStatus: string;
  actor: string;
  reason?: string;
  timestamp: string;
}

// Global runtime singleton to preserve state across hot-reloads and API calls
interface RuntimeStoreState {
  queues: LiveQueueTicket[];
  rooms: RoomItem[];
  screenings: Map<string, MedicalScreeningRecord>;
  billings: Map<string, BillingRecord>;
  auditLogs: AuditLogItem[];
}

const INITIAL_ROOMS: RoomItem[] = [
  {
    id: "rm-1",
    roomNumber: 1,
    name: "Ruang Terapi 1 (Ikhwan)",
    lane: "MALE",
    status: "AVAILABLE",
    therapistName: "Ustadz Hasan (Terapis ITBI)",
    lastSanitizedTime: "09:00",
  },
  {
    id: "rm-2",
    roomNumber: 2,
    name: "Ruang Terapi 2 (Ikhwan)",
    lane: "MALE",
    status: "AVAILABLE",
    therapistName: "Ustadz Hasan (Terapis ITBI)",
    lastSanitizedTime: "09:00",
  },
  {
    id: "rm-3",
    roomNumber: 3,
    name: "Ruang Terapi 3 (Akhwat)",
    lane: "FEMALE",
    status: "AVAILABLE",
    therapistName: "Ummu Aisyah (Terapis Akhwat)",
    lastSanitizedTime: "09:00",
  },
  {
    id: "rm-4",
    roomNumber: 4,
    name: "Ruang Terapi 4 (Akhwat)",
    lane: "FEMALE",
    status: "AVAILABLE",
    therapistName: "Terapis Akhwat Asisten",
    lastSanitizedTime: "09:00",
  },
];

const globalStore = globalThis as unknown as {
  __bekamQueueStore?: RuntimeStoreState;
};

if (!globalStore.__bekamQueueStore) {
  globalStore.__bekamQueueStore = {
    queues: [...INITIAL_QUEUES],
    rooms: [...INITIAL_ROOMS],
    screenings: new Map<string, MedicalScreeningRecord>(),
    billings: new Map<string, BillingRecord>(),
    auditLogs: [],
  };
}

const store = globalStore.__bekamQueueStore;

const PERSISTENCE_FILE = path.join(process.cwd(), ".runtime-queues.json");

function syncFromDisk() {
  try {
    if (fs.existsSync(PERSISTENCE_FILE)) {
      const content = fs.readFileSync(PERSISTENCE_FILE, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.queues)) {
        store.queues = parsed.queues;
      }
      if (Array.isArray(parsed.rooms)) {
        store.rooms = parsed.rooms;
      }
    }
  } catch {
    // Ignore error
  }
}

function syncToDisk() {
  try {
    fs.writeFileSync(
      PERSISTENCE_FILE,
      JSON.stringify({ queues: store.queues, rooms: store.rooms }, null, 2),
      "utf-8"
    );
  } catch {
    // Ignore error
  }
}

// Initial sync on load
syncFromDisk();

export const RuntimeQueueStore = {
  getQueues(lane?: "MALE" | "FEMALE" | null) {
    syncFromDisk();
    if (!lane || (lane !== "MALE" && lane !== "FEMALE")) {
      return [...store.queues];
    }
    return store.queues.filter((q) => q.lane === lane);
  },

  getQueueByIdOrToken(idOrToken: string) {
    syncFromDisk();
    const q = idOrToken.toLowerCase().trim();
    return store.queues.find(
      (item) =>
        item.id.toLowerCase() === q ||
        item.ticketNumber.toLowerCase() === q ||
        item.secretToken.toLowerCase() === q
    );
  },

  addQueue(
    newTicket: LiveQueueTicket,
    extra?: { patientName?: string; patientPhone?: string; serviceId?: string }
  ) {
    syncFromDisk();
    store.queues.push(newTicket);
    this.addAuditLog(newTicket.id, newTicket.ticketNumber, undefined, "WAITING", "Sistem Registrasi Online", "Pendaftaran baru");
    syncToDisk();

    // Persist asynchronously to SQLite via Prisma
    (async () => {
      try {
        let patient = await prisma.patient.findFirst({
          where: { phone: extra?.patientPhone || "081200000000" },
        });
        if (!patient) {
          patient = await prisma.patient.create({
            data: {
              fullName: extra?.patientName || newTicket.maskedPatientName,
              phone: extra?.patientPhone || "081200000000",
              gender: newTicket.lane,
            },
          });
        }

        const service =
          (await prisma.service.findFirst({
            where: { id: extra?.serviceId || "srv-01" },
          })) || (await prisma.service.findFirst());

        if (service) {
          await prisma.queueTicket.upsert({
            where: { ticketNumber: newTicket.ticketNumber },
            update: {
              status: newTicket.status,
              lane: newTicket.lane,
              estimatedWaitMinutes: newTicket.estimatedWaitMinutes,
            },
            create: {
              id: newTicket.id,
              ticketNumber: newTicket.ticketNumber,
              lane: newTicket.lane,
              sequenceNumber: parseInt(newTicket.ticketNumber.replace(/\D/g, "")) || 1,
              secretToken: newTicket.secretToken,
              status: newTicket.status,
              patientId: patient.id,
              serviceId: service.id,
              estimatedWaitMinutes: newTicket.estimatedWaitMinutes,
            },
          });
        }
      } catch (err) {
        console.error("DB persist queue error:", err);
      }
    })();

    return newTicket;
  },

  updateQueueStatus(
    idOrTicketNumber: string,
    newStatus: LiveQueueTicket["status"],
    options?: {
      roomName?: string;
      roomNumber?: number;
      therapistName?: string;
      actor?: string;
      reason?: string;
    }
  ) {
    syncFromDisk();
    const idx = store.queues.findIndex(
      (q) =>
        q.id === idOrTicketNumber ||
        q.ticketNumber.toLowerCase() === idOrTicketNumber.toLowerCase()
    );

    if (idx === -1) return null;

    const current = store.queues[idx];
    const oldStatus = current.status;

    const updated: LiveQueueTicket = {
      ...current,
      status: newStatus,
      roomName: options?.roomName ?? current.roomName,
      roomNumber: options?.roomNumber ?? current.roomNumber,
      therapistName: options?.therapistName ?? current.therapistName,
      calledTime:
        newStatus === "CALLED"
          ? new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
          : current.calledTime,
    };

    store.queues[idx] = updated;

    // Synchronize room occupancy
    if (newStatus === "CALLED" || newStatus === "IN_THERAPY") {
      const room = store.rooms.find(
        (r) =>
          r.name === updated.roomName ||
          (updated.roomNumber && r.roomNumber === updated.roomNumber)
      );
      if (room) {
        room.status = "OCCUPIED";
        room.currentTicketNumber = updated.ticketNumber;
        if (updated.therapistName) room.therapistName = updated.therapistName;
      }
    } else if (newStatus === "COMPLETED" || newStatus === "CANCELLED" || newStatus === "NO_SHOW") {
      const room = store.rooms.find((r) => r.currentTicketNumber === updated.ticketNumber);
      if (room) {
        room.status = "CLEANING";
        room.currentTicketNumber = undefined;
        room.lastSanitizedTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      }
    }

    this.addAuditLog(
      updated.id,
      updated.ticketNumber,
      oldStatus,
      newStatus,
      options?.actor ?? "Staf Klinik",
      options?.reason
    );

    syncToDisk();

    // Persist status update to SQLite Database
    (async () => {
      try {
        const queue = await prisma.queueTicket.findFirst({
          where: { ticketNumber: updated.ticketNumber },
        });
        if (queue) {
          let roomId: string | undefined;
          if (options?.roomNumber) {
            const room = await prisma.room.findUnique({
              where: { roomNumber: options.roomNumber },
            });
            roomId = room?.id;
          }
          await prisma.queueTicket.update({
            where: { id: queue.id },
            data: {
              status: newStatus,
              roomId: roomId ?? undefined,
              calledTime: newStatus === "CALLED" ? new Date() : undefined,
            },
          });
          await prisma.queueAuditLog.create({
            data: {
              queueTicketId: queue.id,
              fromStatus: oldStatus,
              toStatus: newStatus,
              reason: options?.reason,
            },
          });
        }
      } catch (err) {
        console.error("DB update status error:", err);
      }
    })();

    return updated;
  },

  getRooms() {
    syncFromDisk();
    return [...store.rooms];
  },

  updateRoomStatus(roomId: string, status: RoomItem["status"], therapistName?: string) {
    syncFromDisk();
    const room = store.rooms.find((r) => r.id === roomId || String(r.roomNumber) === roomId);
    if (!room) return null;
    room.status = status;
    if (therapistName) room.therapistName = therapistName;
    if (status === "AVAILABLE" || status === "CLEANING") {
      room.lastSanitizedTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      room.currentTicketNumber = undefined;
    }
    syncToDisk();

    // Persist room update to SQLite
    (async () => {
      try {
        await prisma.room.updateMany({
          where: { id: room.id },
          data: {
            status,
            therapistName: room.therapistName,
          },
        });
      } catch (err) {
        console.error("DB room update error:", err);
      }
    })();

    return room;
  },

  getScreening(ticketIdOrNumber: string) {
    return store.screenings.get(ticketIdOrNumber) ?? null;
  },

  saveScreening(data: MedicalScreeningRecord) {
    store.screenings.set(data.ticketId, data);
    store.screenings.set(data.ticketNumber, data);

    // Persist to SQLite via Prisma
    (async () => {
      try {
        const ticket = await prisma.queueTicket.findFirst({
          where: { ticketNumber: data.ticketNumber },
        });
        if (ticket) {
          await prisma.medicalScreening.upsert({
            where: { queueTicketId: ticket.id },
            update: {
              systolicBP: data.systolicBP,
              diastolicBP: data.diastolicBP,
              pulseRateBpm: data.pulseRateBpm,
              bloodSugarMgDl: data.bloodSugarMgDl,
              hasHemophilia: data.hasHemophilia,
              hasSevereAnemia: data.hasSevereAnemia,
              isTakingBloodThinner: data.isTakingBloodThinner,
              isPregnant: data.isPregnant,
              hasAcuteInfection: data.hasAcuteInfection,
              isEligibleForCupping: data.isEligibleForCupping,
              screeningNotes: data.therapistNotes,
            },
            create: {
              queueTicketId: ticket.id,
              systolicBP: data.systolicBP,
              diastolicBP: data.diastolicBP,
              pulseRateBpm: data.pulseRateBpm,
              bloodSugarMgDl: data.bloodSugarMgDl,
              hasHemophilia: data.hasHemophilia,
              hasSevereAnemia: data.hasSevereAnemia,
              isTakingBloodThinner: data.isTakingBloodThinner,
              isPregnant: data.isPregnant,
              hasAcuteInfection: data.hasAcuteInfection,
              isEligibleForCupping: data.isEligibleForCupping,
              screeningNotes: data.therapistNotes,
            },
          });
        }
      } catch (err) {
        console.error("DB screening persist error:", err);
      }
    })();

    return data;
  },

  getBilling(ticketIdOrNumber: string) {
    return store.billings.get(ticketIdOrNumber) ?? null;
  },

  saveBilling(data: BillingRecord) {
    store.billings.set(data.ticketId, data);
    store.billings.set(data.ticketNumber, data);

    // Persist to SQLite via Prisma
    (async () => {
      try {
        const ticket = await prisma.queueTicket.findFirst({
          where: { ticketNumber: data.ticketNumber },
        });
        if (ticket) {
          await prisma.billing.upsert({
            where: { queueTicketId: ticket.id },
            update: {
              invoiceNumber: data.invoiceNumber,
              serviceFee: data.serviceFee,
              herbFee: data.herbFee,
              discount: data.discount,
              totalAmount: data.totalAmount,
              paymentStatus: data.paymentStatus,
              paymentMethod: data.paymentMethod || "CASH",
              paidAt: data.paymentStatus === "PAID" ? new Date() : undefined,
              cashierNotes: data.cashierNotes,
            },
            create: {
              id: data.id,
              queueTicketId: ticket.id,
              invoiceNumber: data.invoiceNumber,
              serviceFee: data.serviceFee,
              herbFee: data.herbFee,
              discount: data.discount,
              totalAmount: data.totalAmount,
              paymentStatus: data.paymentStatus,
              paymentMethod: data.paymentMethod || "CASH",
              paidAt: data.paymentStatus === "PAID" ? new Date() : undefined,
              cashierNotes: data.cashierNotes,
            },
          });
        }
      } catch (err) {
        console.error("DB billing persist error:", err);
      }
    })();

    return data;
  },

  getAllBillings() {
    return Array.from(store.billings.values());
  },

  addAuditLog(
    ticketId: string,
    ticketNumber: string,
    fromStatus: string | undefined,
    toStatus: string,
    actor: string,
    reason?: string
  ) {
    const log: AuditLogItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ticketId,
      ticketNumber,
      fromStatus,
      toStatus,
      actor,
      reason,
      timestamp: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
    store.auditLogs.unshift(log);
    if (store.auditLogs.length > 100) store.auditLogs.pop();
    return log;
  },

  getAuditLogs(ticketId?: string) {
    if (!ticketId) return [...store.auditLogs];
    return store.auditLogs.filter((l) => l.ticketId === ticketId || l.ticketNumber === ticketId);
  },

  getDashboardStats() {
    const waiting = store.queues.filter((q) => q.status === "WAITING");
    const inTherapy = store.queues.filter(
      (q) => q.status === "IN_THERAPY" || q.status === "CALLED"
    );
    const completed = store.queues.filter((q) => q.status === "COMPLETED");

    let totalRevenue = 0;
    for (const b of store.billings.values()) {
      if (b.paymentStatus === "PAID") totalRevenue += b.totalAmount;
    }
    // Fallback estimate for completed queues without billing record
    if (totalRevenue === 0) {
      totalRevenue = completed.length * 85000 + inTherapy.length * 50000;
    }

    const maleWaiting = waiting.filter((q) => q.lane === "MALE").length;
    const femaleWaiting = waiting.filter((q) => q.lane === "FEMALE").length;

    return {
      waitingCount: waiting.length,
      maleWaitingCount: maleWaiting,
      femaleWaitingCount: femaleWaiting,
      inTherapyCount: inTherapy.length,
      completedCount: completed.length,
      totalRevenue,
      rooms: [...store.rooms],
      activeQueues: store.queues,
    };
  },

  clearAllQueues() {
    syncFromDisk();
    store.queues = [];
    store.rooms.forEach((r) => {
      r.status = "AVAILABLE";
      r.currentTicketNumber = undefined;
    });
    store.screenings.clear();
    store.billings.clear();
    store.auditLogs = [];
    syncToDisk();

    // Clear from SQLite Database
    (async () => {
      try {
        await prisma.billing.deleteMany({});
        await prisma.medicalScreening.deleteMany({});
        await prisma.queueAuditLog.deleteMany({});
        await prisma.queueTicket.deleteMany({});
        await prisma.room.updateMany({
          data: { status: "AVAILABLE", currentQueueId: null },
        });
      } catch (err) {
        console.error("DB clear error:", err);
      }
    })();

    return true;
  },
};
