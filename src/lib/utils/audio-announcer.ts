// Audio & Text-to-Speech Announcer for Bekam Smart Queue
// Specifically configured for Bahasa Indonesia with proper phonetics & voice selection

const INDONESIAN_NUMBERS: Record<string, string> = {
  "0": "nol",
  "1": "satu",
  "2": "dua",
  "3": "tiga",
  "4": "empat",
  "5": "lima",
  "6": "enam",
  "7": "tujuh",
  "8": "delapan",
  "9": "sembilan",
};

/**
 * Convert ticket number (e.g. "P-005") into clear Indonesian phonetic words
 * Result: "P, nol nol lima"
 */
export function formatTicketNumberForSpeech(ticketNumber: string): string {
  if (!ticketNumber) return "";

  const parts = ticketNumber.split("-");
  const prefix = parts[0]?.trim() || "";
  const numberPart = parts[1]?.trim() || "";

  const prefixWord = prefix.toUpperCase() === "P" ? "P" : prefix.toUpperCase() === "W" ? "W" : prefix;

  const spelledDigits = numberPart
    .split("")
    .map((digit) => INDONESIAN_NUMBERS[digit] || digit)
    .join(" ");

  return `${prefixWord}, ${spelledDigits}`;
}

/**
 * Convert room name into clean spoken Indonesian (e.g. "Ruang Terapi 1 (Ikhwan)" -> "Ruang Terapi satu, Ikhwan")
 */
export function formatRoomNameForSpeech(roomName: string): string {
  if (!roomName) return "Ruang Terapi";

  return roomName
    .replace(/\b1\b/g, "satu")
    .replace(/\b2\b/g, "dua")
    .replace(/\b3\b/g, "tiga")
    .replace(/\b4\b/g, "empat")
    .replace(/\(|\)/g, "");
}

/**
 * Play a soothing hospital/airport chime before voice announcement
 */
export function playChimeTone(audioContext?: AudioContext): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        resolve();
        return;
      }

      const ctx = audioContext || new AudioCtx();
      const now = ctx.currentTime;

      // Tone 1: D5 (587.33 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.45);

      // Tone 2: A5 (880 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.frequency.setValueAtTime(880, now + 0.22);
      gain2.gain.setValueAtTime(0.18, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.22);
      osc2.stop(now + 0.75);

      setTimeout(resolve, 650);
    } catch {
      resolve();
    }
  });
}

/**
 * Find the best available Indonesian voice from SpeechSynthesis
 */
export function getIndonesianVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Search for explicit Indonesian language tag (id-ID or id)
  const exactIdVoice = voices.find(
    (v) =>
      v.lang.toLowerCase() === "id-id" ||
      v.lang.toLowerCase() === "id_id" ||
      v.lang.toLowerCase().startsWith("id")
  );
  if (exactIdVoice) return exactIdVoice;

  // 2. Search for voice name containing "indonesia", "gadis", or "ardi"
  const namedIdVoice = voices.find((v) => {
    const name = v.name.toLowerCase();
    return name.includes("indonesia") || name.includes("gadis") || name.includes("ardi");
  });
  if (namedIdVoice) return namedIdVoice;

  // 3. Fallback: Malay (ms-MY) which has nearly identical pronunciation
  const malayVoice = voices.find((v) => v.lang.toLowerCase().startsWith("ms"));
  if (malayVoice) return malayVoice;

  return null;
}

/**
 * Announce queue ticket callout in fluent Bahasa Indonesia
 */
export async function announceQueueCallout(
  ticketNumber: string,
  roomName: string,
  options?: {
    playChime?: boolean;
    onEnd?: () => void;
  }
): Promise<void> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }

  // 1. Play chime tone
  if (options?.playChime !== false) {
    await playChimeTone();
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Format phonetic Indonesian text
  const spokenTicket = formatTicketNumberForSpeech(ticketNumber);
  const spokenRoom = formatRoomNameForSpeech(roomName);
  const speechText = `Nomor antrean ${spokenTicket}, silakan menuju ke ${spokenRoom}.`;

  const utterance = new SpeechSynthesisUtterance(speechText);
  utterance.lang = "id-ID";
  utterance.rate = 0.88; // Slightly slower for clear, professional announcement
  utterance.pitch = 1.0;

  // Explicitly assign the Indonesian voice
  const indonesianVoice = getIndonesianVoice();
  if (indonesianVoice) {
    utterance.voice = indonesianVoice;
  } else {
    // If voices are still loading asynchronously, listen for voiceschanged once
    window.speechSynthesis.onvoiceschanged = () => {
      const v = getIndonesianVoice();
      if (v) utterance.voice = v;
    };
  }

  if (options?.onEnd) {
    utterance.onend = options.onEnd;
  }

  window.speechSynthesis.speak(utterance);
}
