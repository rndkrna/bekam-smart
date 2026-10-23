import { NextRequest, NextResponse } from "next/server";
import { RuntimeQueueStore, RoomItem } from "@/lib/data/runtime-store";

export async function GET() {
  const rooms = RuntimeQueueStore.getRooms();
  return NextResponse.json({
    success: true,
    data: rooms,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, status, therapistName } = body;

    if (!roomId || !status) {
      return NextResponse.json(
        { success: false, error: "roomId dan status wajib disertakan." },
        { status: 400 }
      );
    }

    const updated = RuntimeQueueStore.updateRoomStatus(
      roomId,
      status as RoomItem["status"],
      therapistName
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Ruangan dengan ID ${roomId} tidak ditemukan.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status ${updated.name} berhasil diubah menjadi ${status}.`,
      data: {
        room: updated,
        rooms: RuntimeQueueStore.getRooms(),
      },
    });
  } catch (error) {
    console.error("Room update error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat memperbarui status bilik ruang terapi." },
      { status: 500 }
    );
  }
}
