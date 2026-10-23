import { NextRequest, NextResponse } from "next/server";
import { queueRegistrationSchema, statusTransitionSchema } from "@/lib/validations/queue";
import { INITIAL_SERVICES, LiveQueueTicket } from "@/lib/data/mock-data";
import { RuntimeQueueStore } from "@/lib/data/runtime-store";
import { calculateEstimatedWait } from "@/lib/utils/queue-estimator";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lane = searchParams.get("lane") as "MALE" | "FEMALE" | null;

  const allQueues = RuntimeQueueStore.getQueues();
  const filtered = RuntimeQueueStore.getQueues(lane);

  // Calculate live statistics per lane
  const maleWaiting = allQueues.filter(
    (q) => q.lane === "MALE" && q.status === "WAITING"
  );
  const maleInTherapy = allQueues.filter(
    (q) => q.lane === "MALE" && (q.status === "IN_THERAPY" || q.status === "CALLED")
  );
  const maleCalled = allQueues.filter((q) => q.lane === "MALE" && q.status === "CALLED");
  const maleTherapyOnly = allQueues.filter((q) => q.lane === "MALE" && q.status === "IN_THERAPY");
  const maleCurrentServing = maleCalled[maleCalled.length - 1] ?? maleTherapyOnly[maleTherapyOnly.length - 1];

  const femaleWaiting = allQueues.filter(
    (q) => q.lane === "FEMALE" && q.status === "WAITING"
  );
  const femaleInTherapy = allQueues.filter(
    (q) => q.lane === "FEMALE" && (q.status === "IN_THERAPY" || q.status === "CALLED")
  );
  const femaleCalled = allQueues.filter((q) => q.lane === "FEMALE" && q.status === "CALLED");
  const femaleTherapyOnly = allQueues.filter((q) => q.lane === "FEMALE" && q.status === "IN_THERAPY");
  const femaleCurrentServing = femaleCalled[femaleCalled.length - 1] ?? femaleTherapyOnly[femaleTherapyOnly.length - 1];

  const maleWaitEstimation = calculateEstimatedWait(maleWaiting.length, {
    lane: "MALE",
    activeRooms: 2,
    averageServiceDurationMinutes: 45,
  });

  const femaleWaitEstimation = calculateEstimatedWait(femaleWaiting.length, {
    lane: "FEMALE",
    activeRooms: 2,
    averageServiceDurationMinutes: 45,
  });

  const rooms = RuntimeQueueStore.getRooms();
  const stats = RuntimeQueueStore.getDashboardStats();

  return NextResponse.json(
    {
      success: true,
      data: {
        queues: filtered,
        allQueues,
        rooms,
        stats,
        lanes: {
          male: {
            code: "P",
            name: "Jalur Pria (Ikhwan)",
            currentServing: maleCurrentServing ? maleCurrentServing.ticketNumber : "-",
            currentRoom: maleCurrentServing?.roomName ?? "-",
            waitingCount: maleWaiting.length,
            inTherapyCount: maleInTherapy.length,
            estimatedWaitMinutes: maleWaitEstimation.estimatedMinutes,
            minEstimatedMinutes: maleWaitEstimation.minEstimatedMinutes,
            maxEstimatedMinutes: maleWaitEstimation.maxEstimatedMinutes,
          },
          female: {
            code: "W",
            name: "Jalur Wanita (Akhwat)",
            currentServing: femaleCurrentServing ? femaleCurrentServing.ticketNumber : "-",
            currentRoom: femaleCurrentServing?.roomName ?? "-",
            waitingCount: femaleWaiting.length,
            inTherapyCount: femaleInTherapy.length,
            estimatedWaitMinutes: femaleWaitEstimation.estimatedMinutes,
            minEstimatedMinutes: femaleWaitEstimation.minEstimatedMinutes,
            maxEstimatedMinutes: femaleWaitEstimation.maxEstimatedMinutes,
          },
        },
        updatedAt: new Date().toISOString(),
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = queueRegistrationSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validasi data antrean gagal",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { fullName, phone, gender, serviceId } = validated.data;

    // Resolve service
    const service = INITIAL_SERVICES.find((s) => s.id === serviceId) ?? INITIAL_SERVICES[0];

    // Compute next sequence number per lane
    const prefix = gender === "MALE" ? "P" : "W";
    const existingSameLane = RuntimeQueueStore.getQueues(gender);
    const nextSeq = existingSameLane.length + 1;
    const ticketNumber = `${prefix}-${String(nextSeq).padStart(3, "0")}`;

    // Cryptographically unique secret token for public ticket url
    const randomHex = Math.random().toString(36).substring(2, 10);
    const secretToken = `tk_${ticketNumber.toLowerCase().replace("-", "")}_${randomHex}`;

    // Calculate queue wait position
    const waitingSameLane = existingSameLane.filter((q) => q.status === "WAITING");
    const peopleAhead = waitingSameLane.length;
    const waitEst = calculateEstimatedWait(peopleAhead, {
      lane: gender,
      activeRooms: 2,
      averageServiceDurationMinutes: service.durationMinutes,
    });

    const maskedPhone =
      phone.length > 7
        ? `${phone.substring(0, 4)}****${phone.substring(phone.length - 3)}`
        : "0812****";
    const maskedName = `${fullName.split(" ")[0]} *** (${maskedPhone})`;

    const newTicket: LiveQueueTicket = {
      id: `q-${Date.now()}`,
      ticketNumber,
      lane: gender,
      status: "WAITING",
      serviceName: service.name,
      serviceDuration: service.durationMinutes,
      secretToken,
      checkInTime: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      estimatedWaitMinutes: waitEst.estimatedMinutes,
      peopleAhead,
      maskedPatientName: maskedName,
    };

    RuntimeQueueStore.addQueue(newTicket, {
      patientName: fullName,
      patientPhone: phone,
      serviceId,
    });

    return NextResponse.json({
      success: true,
      message: `Pendaftaran berhasil. Nomor antrean Anda: ${ticketNumber}`,
      data: {
        id: newTicket.id,
        ticketNumber,
        secretToken,
        lane: gender,
        serviceName: service.name,
        price: service.price,
        estimatedWaitMinutes: waitEst.estimatedMinutes,
        minEstimatedMinutes: waitEst.minEstimatedMinutes,
        maxEstimatedMinutes: waitEst.maxEstimatedMinutes,
        peopleAhead,
        ticketUrl: `/ticket/${secretToken}`,
      },
    });
  } catch (error) {
    console.error("Queue registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan server saat mendaftarkan antrean.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = statusTransitionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Payload status transition tidak valid",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { queueId, status, roomName, roomNumber, therapistName, actor, reason } =
      validated.data;

    const updated = RuntimeQueueStore.updateQueueStatus(queueId, status, {
      roomName: roomName ?? undefined,
      roomNumber: roomNumber ?? undefined,
      therapistName: therapistName ?? undefined,
      actor: actor ?? "Petugas Klinik",
      reason: reason ?? undefined,
    });

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: `Antrean dengan ID atau nomor ${queueId} tidak ditemukan.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status antrean ${updated.ticketNumber} berhasil diperbarui menjadi ${status}.`,
      data: {
        queue: updated,
        rooms: RuntimeQueueStore.getRooms(),
        stats: RuntimeQueueStore.getDashboardStats(),
      },
    });
  } catch (error) {
    console.error("Queue status update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan server saat memperbarui status antrean.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    RuntimeQueueStore.clearAllQueues();
    return NextResponse.json({
      success: true,
      message: "Seluruh data antrean, bilik terapi, rekam medis, dan transaksi berhasil dibersihkan.",
      data: {
        queues: [],
        rooms: RuntimeQueueStore.getRooms(),
        stats: RuntimeQueueStore.getDashboardStats(),
      },
    });
  } catch (error) {
    console.error("Clear queues error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal membersihkan data antrean.",
      },
      { status: 500 }
    );
  }
}

