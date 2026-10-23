import { NextRequest, NextResponse } from "next/server";
import { RuntimeQueueStore, MedicalScreeningRecord } from "@/lib/data/runtime-store";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ticket = searchParams.get("ticket") || searchParams.get("ticketId");

  if (!ticket) {
    return NextResponse.json(
      { success: false, error: "Parameter ticket atau ticketId dibutuhkan." },
      { status: 400 }
    );
  }

  const screening = RuntimeQueueStore.getScreening(ticket);

  return NextResponse.json({
    success: true,
    data: screening,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ticketId,
      ticketNumber,
      patientName,
      systolicBP,
      diastolicBP,
      pulseRateBpm,
      bloodSugarMgDl,
      hasHemophilia,
      hasSevereAnemia,
      isTakingBloodThinner,
      isPregnant,
      hasAcuteInfection,
      selectedCuppingPoints,
      cupQuantity,
      therapistNotes,
      therapistName,
      advanceQueueStatus,
    } = body;

    if (!ticketId || !ticketNumber) {
      return NextResponse.json(
        { success: false, error: "ticketId dan ticketNumber wajib disertakan." },
        { status: 400 }
      );
    }

    const sys = Number(systolicBP) || 120;
    const dia = Number(diastolicBP) || 80;

    // Automatic Blood Pressure Category Classification (AHA / Kemenkes RI Standard)
    let bpCategory: MedicalScreeningRecord["bloodPressureCategory"] = "NORMAL";
    if (sys < 90 || dia < 60) {
      bpCategory = "HYPOTENSION";
    } else if (sys >= 140 || dia >= 90) {
      bpCategory = "HYPERTENSION_STAGE_2";
    } else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
      bpCategory = "HYPERTENSION_STAGE_1";
    } else if (sys >= 120 && sys <= 129 && dia < 80) {
      bpCategory = "PRE_HYPERTENSION";
    } else {
      bpCategory = "NORMAL";
    }

    // Safety eligibility check
    const hasCriticalContraindication =
      Boolean(hasHemophilia) ||
      Boolean(hasSevereAnemia) ||
      Boolean(isTakingBloodThinner);

    const isEligibleForCupping = !hasCriticalContraindication;

    const screeningRecord: MedicalScreeningRecord = {
      id: `scr-${Date.now()}`,
      ticketId,
      ticketNumber,
      patientName: patientName || ticketNumber,
      systolicBP: sys,
      diastolicBP: dia,
      pulseRateBpm: Number(pulseRateBpm) || 75,
      bloodSugarMgDl: bloodSugarMgDl ? Number(bloodSugarMgDl) : undefined,
      bloodPressureCategory: bpCategory,
      hasHemophilia: Boolean(hasHemophilia),
      hasSevereAnemia: Boolean(hasSevereAnemia),
      isTakingBloodThinner: Boolean(isTakingBloodThinner),
      isPregnant: Boolean(isPregnant),
      hasAcuteInfection: Boolean(hasAcuteInfection),
      selectedCuppingPoints: Array.isArray(selectedCuppingPoints) ? selectedCuppingPoints : [],
      cupQuantity: Number(cupQuantity) || 10,
      therapistNotes: therapistNotes || "",
      isEligibleForCupping,
      therapistName: therapistName || "Terapis Bekam Bintan Therapy",
      screenedAt: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    RuntimeQueueStore.saveScreening(screeningRecord);

    // Optionally advance queue status to IN_THERAPY if requested
    if (advanceQueueStatus) {
      RuntimeQueueStore.updateQueueStatus(ticketNumber, "IN_THERAPY", {
        therapistName: screeningRecord.therapistName,
        actor: screeningRecord.therapistName,
        reason: "Skrining vital signs selesai, tindakan bekam dimulai",
      });
    }

    return NextResponse.json({
      success: true,
      message: isEligibleForCupping
        ? "Skrining medis berhasil disimpan. Pasien memenuhi syarat tindakan bekam."
        : "PERINGATAN: Pasien memiliki kontraindikasi absolut/kritis!",
      data: screeningRecord,
    });
  } catch (error) {
    console.error("Screening save error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat menyimpan rekam skrining medis." },
      { status: 500 }
    );
  }
}
