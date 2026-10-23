import { NextRequest, NextResponse } from "next/server";
import { RuntimeQueueStore, BillingRecord } from "@/lib/data/runtime-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticket = searchParams.get("ticket") || searchParams.get("ticketId");

  if (ticket) {
    const billing = RuntimeQueueStore.getBilling(ticket);
    return NextResponse.json({
      success: true,
      data: billing,
    });
  }

  const billings = RuntimeQueueStore.getAllBillings();
  const totalRevenue = billings
    .filter((b) => b.paymentStatus === "PAID")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return NextResponse.json({
    success: true,
    data: {
      billings,
      totalRevenue,
      paidCount: billings.filter((b) => b.paymentStatus === "PAID").length,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ticketId,
      ticketNumber,
      patientName,
      serviceName,
      serviceFee,
      herbFee,
      discount,
      paymentMethod,
      cashierName,
      cashierNotes,
    } = body;

    if (!ticketId || !ticketNumber) {
      return NextResponse.json(
        { success: false, error: "ticketId dan ticketNumber wajib disertakan." },
        { status: 400 }
      );
    }

    const sFee = Number(serviceFee) || 85000;
    const hFee = Number(herbFee) || 0;
    const disc = Number(discount) || 0;
    const totalAmount = Math.max(0, sFee + hFee - disc);

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const cleanNum = ticketNumber.replace(/[^a-zA-Z0-9]/g, "");
    const invoiceNumber = `INV-${dateStr}-${cleanNum}`;

    const billing: BillingRecord = {
      id: `bill-${Date.now()}`,
      ticketId,
      ticketNumber,
      invoiceNumber,
      patientName: patientName || ticketNumber,
      serviceName: serviceName || "Layanan Terapi Bekam",
      serviceFee: sFee,
      herbFee: hFee,
      discount: disc,
      totalAmount,
      paymentStatus: "PAID",
      paymentMethod: paymentMethod || "CASH",
      paidAt: now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      cashierName: cashierName || "Kasir Bekam Bintan",
      cashierNotes: cashierNotes || "",
      createdAt: now.toISOString(),
    };

    RuntimeQueueStore.saveBilling(billing);

    // Ensure queue is marked completed
    RuntimeQueueStore.updateQueueStatus(ticketNumber, "COMPLETED", {
      actor: billing.cashierName,
      reason: `Pembayaran lunas via ${billing.paymentMethod} (No. Inv: ${invoiceNumber})`,
    });

    return NextResponse.json({
      success: true,
      message: `Pembayaran ${ticketNumber} sebesar Rp ${totalAmount.toLocaleString("id-ID")} berhasil diselesaikan.`,
      data: billing,
    });
  } catch (error) {
    console.error("Billing error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat memproses transaksi pembayaran." },
      { status: 500 }
    );
  }
}
