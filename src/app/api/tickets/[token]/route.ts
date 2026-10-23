import { NextRequest, NextResponse } from "next/server";
import { RuntimeQueueStore } from "@/lib/data/runtime-store";
import { calculateEstimatedWait } from "@/lib/utils/queue-estimator";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token tidak diberikan" },
      { status: 400 }
    );
  }

  // Lookup in unified runtime store
  const ticket = RuntimeQueueStore.getQueueByIdOrToken(token);

  if (!ticket) {
    return NextResponse.json(
      {
        success: false,
        error: "Nomor antrean atau tiket digital tidak ditemukan atau telah kedaluwarsa.",
      },
      { status: 404 }
    );
  }

  // Re-calculate real-time people ahead
  const allQueues = RuntimeQueueStore.getQueues();
  const sameLaneWaiting = allQueues.filter(
    (q) => q.lane === ticket.lane && q.status === "WAITING"
  );
  const ticketIndex = sameLaneWaiting.findIndex((q) => q.id === ticket.id);
  const currentPeopleAhead = ticketIndex >= 0 ? ticketIndex : 0;

  const waitEst = calculateEstimatedWait(currentPeopleAhead, {
    lane: ticket.lane,
    activeRooms: 2,
    averageServiceDurationMinutes: ticket.serviceDuration,
  });

  // Strict privacy: NO PII (No patient real name, No patient phone, No medical conditions)
  return NextResponse.json({
    success: true,
    data: {
      ticketNumber: ticket.ticketNumber,
      secretToken: ticket.secretToken,
      lane: ticket.lane,
      laneCode: ticket.lane === "MALE" ? "P" : "W",
      laneLabel:
        ticket.lane === "MALE"
          ? "Jalur Ikhwan (Pria)"
          : "Jalur Akhwat (Wanita)",
      status: ticket.status,
      serviceName: ticket.serviceName,
      serviceDuration: ticket.serviceDuration,
      roomName: ticket.roomName ?? null,
      roomNumber: ticket.roomNumber ?? null,
      therapistName: ticket.therapistName ?? null,
      checkInTime: ticket.checkInTime,
      calledTime: ticket.calledTime ?? null,
      peopleAhead: currentPeopleAhead,
      estimatedWaitMinutes:
        ticket.status === "WAITING" ? waitEst.estimatedMinutes : 0,
      minEstimatedMinutes: waitEst.minEstimatedMinutes,
      maxEstimatedMinutes: waitEst.maxEstimatedMinutes,
      statusLabel:
        ticket.status === "CALLED"
          ? "Silakan Segera Masuk ke Ruang Terapi"
          : ticket.status === "IN_THERAPY"
          ? "Sedang Menjalani Tindakan Terapi Bekam"
          : ticket.status === "COMPLETED"
          ? "Terapi Selesai — Silakan menuju meja kasir"
          : waitEst.statusLabel,
      clinic: {
        name: "Bekam Bintan Therapy",
        address: "Jl. Indunsuri No. 116C, Taman Kota, Desa Teluk Sasah, Kec. Seri Kuala Lobam, Kab. Bintan",
        phone: "Pria: 0812-6832-0072 / Wanita: 0812-7530-2567",
        hours: "Praktek Setiap Hari: 09:00 - 22:00 WIB",
      },
      preCuppingGuidelines: [
        "Hindari makan berat 1 - 2 jam sebelum proses bekam",
        "Gunakan pakaian longgar dan nyaman",
        "Informasikan kepada terapis bila memiliki riwayat anemia atau diabetes",
        "Minum air putih hangat sebelum dan sesudah terapi",
      ],
      updatedAt: new Date().toISOString(),
    },
  });
}
