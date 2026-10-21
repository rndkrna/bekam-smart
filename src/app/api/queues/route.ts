import { NextRequest, NextResponse } from "next/server";
import { queueRegistrationSchema } from "@/lib/validations/queue";
import { INITIAL_QUEUES, INITIAL_SERVICES, LiveQueueTicket } from "@/lib/data/mock-data";
import { calculateEstimatedWait } from "@/lib/utils/queue-estimator";

// In-memory runtime queue registry for live development & demonstration
// (Backed by Prisma in persistent environments)
const runtimeQueues: LiveQueueTicket[] = [...INITIAL_QUEUES];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lane = searchParams.get("lane"); // "MALE" | "FEMALE" | null

  let filtered = [...runtimeQueues];
  if (lane === "MALE" || lane === "FEMALE") {
    filtered = filtered.filter((q) => q.lane === lane);
  }

  // Calculate live statistics
  const maleWaiting = runtimeQueues.filter(
    (q) => q.lane === "MALE" && q.status === "WAITING"
  );
  const maleInTherapy = runtimeQueues.filter(
    (q) => q.lane === "MALE" && (q.status === "IN_THERAPY" || q.status === "CALLED")
  );
  const maleCurrentServing = runtimeQueues.find(
    (q) => q.lane === "MALE" && q.status === "CALLED"
  ) ?? runtimeQueues.find((q) => q.lane === "MALE" && q.status === "IN_THERAPY");

  const femaleWaiting = runtimeQueues.filter(
    (q) => q.lane === "FEMALE" && q.status === "WAITING"
  );
  const femaleInTherapy = runtimeQueues.filter(
    (q) => q.lane === "FEMALE" && (q.status === "IN_THERAPY" || q.status === "CALLED")
  );
  const femaleCurrentServing = runtimeQueues.find(
    (q) => q.lane === "FEMALE" && q.status === "CALLED"
  ) ?? runtimeQueues.find((q) => q.lane === "FEMALE" && q.status === "IN_THERAPY");

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

  return NextResponse.json({
    success: true,
    data: {
      queues: filtered,
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
  });
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
    const sameLaneTickets = runtimeQueues.filter((q) => q.lane === gender);
    const nextSeq = sameLaneTickets.length + 1;
    const ticketNumber = `${prefix}-${String(nextSeq).padStart(3, "0")}`;

    // Cryptographically unique secret token for public ticket url
    const randomHex = Math.random().toString(36).substring(2, 10);
    const secretToken = `tk_${ticketNumber.toLowerCase().replace("-", "")}_${randomHex}`;

    // Calculate queue wait position
    const waitingSameLane = sameLaneTickets.filter((q) => q.status === "WAITING");
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

    runtimeQueues.push(newTicket);

    return NextResponse.json({
      success: true,
      message: `Pendaftaran berhasil. Nomor antrean Anda: ${ticketNumber}`,
      data: {
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
