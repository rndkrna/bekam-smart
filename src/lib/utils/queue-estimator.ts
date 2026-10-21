export interface LaneQueueStats {
  lane: "MALE" | "FEMALE";
  waitingCount: number;
  inTherapyCount: number;
  activeRooms: number;
  averageDurationMinutes: number;
  cleaningBufferMinutes?: number;
}

export interface EstimatedWaitResult {
  estimatedMinutes: number;
  minEstimatedMinutes: number;
  maxEstimatedMinutes: number;
  peopleAhead: number;
  estimatedCallTime: Date | null;
  statusLabel: string;
}

/**
 * Calculate dynamic wait time for a specific patient ticket based on:
 * - Lane ('MALE' for Pria 'P', 'FEMALE' for Wanita 'W')
 * - Position in queue (tickets ahead in WAITING status)
 * - Currently running therapy sessions in the same lane
 * - Number of available/operational rooms for that lane
 * - Service duration (defaults to 40-45 mins per cupping session)
 * - Sterilization and linen change buffer (5 mins)
 */
export function calculateEstimatedWait(
  peopleAhead: number,
  options: {
    lane: "MALE" | "FEMALE";
    activeRooms?: number;
    averageServiceDurationMinutes?: number;
    cleaningBufferMinutes?: number;
  }
): EstimatedWaitResult {
  const activeRooms = Math.max(1, options.activeRooms ?? 2);
  const avgDuration = options.averageServiceDurationMinutes ?? 45;
  const cleaningBuffer = options.cleaningBufferMinutes ?? 5;
  const cycleTime = avgDuration + cleaningBuffer;

  if (peopleAhead <= 0) {
    const estimatedMinutes = 5;
    return {
      estimatedMinutes,
      minEstimatedMinutes: 1,
      maxEstimatedMinutes: 8,
      peopleAhead: 0,
      estimatedCallTime: null,
      statusLabel: "Giliran Anda Berikutnya — Mohon bersiap di dekat ruang tunggu",
    };
  }

  // Each room can handle 1 patient per cycleTime.
  // People ahead get distributed across active rooms.
  const turnsAhead = Math.floor(peopleAhead / activeRooms);
  const baseMinutes = Math.max(10, turnsAhead * cycleTime);

  // Variance range ± 15%
  const minEstimatedMinutes = Math.max(5, Math.floor(baseMinutes * 0.85));
  const maxEstimatedMinutes = Math.ceil(baseMinutes * 1.2);

  return {
    estimatedMinutes: baseMinutes,
    minEstimatedMinutes,
    maxEstimatedMinutes,
    peopleAhead,
    estimatedCallTime: null,
    statusLabel:
      baseMinutes <= 15
        ? "Segera Dipanggil — Harap tetap di area ruang tunggu"
        : baseMinutes <= 40
        ? "Estimasi Panggilan Dalam 1 Siklus Terapi"
        : "Waktu tunggu moderat — Anda dapat memantau tiket digital ini secara live",
  };
}

/**
 * Format minutes into Indonesian user-friendly string
 * e.g. "± 35 - 45 Menit" or "< 5 Menit"
 */
export function formatWaitDuration(min: number, max: number): string {
  if (max <= 5) return "< 5 Menit";
  if (min === max) return `± ${min} Menit`;
  return `± ${min} - ${max} Menit`;
}
