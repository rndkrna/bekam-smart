"use client";

import * as React from "react";
import Link from "next/link";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Clock,
  Tv,
  ArrowLeft,
  Users,
  Activity,
  Maximize,
} from "lucide-react";
import { INITIAL_QUEUES, LiveQueueTicket } from "@/lib/data/mock-data";
import {
  announceQueueCallout,
  formatTicketNumberForSpeech,
  formatRoomNameForSpeech,
} from "@/lib/utils/audio-announcer";

export default function TvDisplayPage() {
  const [queues, setQueues] = React.useState<LiveQueueTicket[]>([]);
  const [activeCall, setActiveCall] = React.useState<LiveQueueTicket | null>(null);
  const [currentTime, setCurrentTime] = React.useState<string>("");
  const [currentDate, setCurrentDate] = React.useState<string>("");
  const [isMuted, setIsMuted] = React.useState(false);
  const [lastSpeechText, setLastSpeechText] = React.useState<string>("");

  // Live Clock
  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setCurrentDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Speech API Voice Announcement in Indonesian with Airport Chime
  const speakCallout = React.useCallback(
    (ticket: LiveQueueTicket) => {
      if (isMuted || typeof window === "undefined") {
        return;
      }

      const spokenTicket = formatTicketNumberForSpeech(ticket.ticketNumber);
      const spokenRoom = formatRoomNameForSpeech(ticket.roomName ?? "Ruang Terapi");
      setLastSpeechText(`Nomor antrean ${spokenTicket}, silakan menuju ke ${spokenRoom}.`);

      announceQueueCallout(ticket.ticketNumber, ticket.roomName ?? "Ruang Terapi");
    },
    [isMuted]
  );

  // Live Queue Fetching & Real-time Auto-Announcement on TV Display
  const lastAnnouncedRef = React.useRef<string | null>(null);

  const fetchQueues = React.useCallback(async () => {
    try {
      const res = await fetch("/api/queues", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      if (!json.data?.queues) return;

      const liveQueues: LiveQueueTicket[] = json.data.queues;
      setQueues(liveQueues);

      // Find currently called ticket
      const calledTicket = liveQueues.find((q) => q.status === "CALLED");
      if (calledTicket) {
        setActiveCall(calledTicket);
        // If it's a new call or newly called ticket, trigger automatic voice announcement
        const callKey = `${calledTicket.ticketNumber}_${calledTicket.calledTime || ""}`;
        if (lastAnnouncedRef.current && lastAnnouncedRef.current !== callKey) {
          speakCallout(calledTicket);
        }
        lastAnnouncedRef.current = callKey;
      }
    } catch {
      // Ignore network errors
    }
  }, [speakCallout]);

  React.useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 3000);
    return () => clearInterval(interval);
  }, [fetchQueues]);

  const handleManualCall = (ticket: LiveQueueTicket) => {
    setActiveCall(ticket);
    speakCallout(ticket);
  };

  // Fullscreen trigger
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const maleQueues = queues.filter((q) => q.lane === "MALE");
  const femaleQueues = queues.filter((q) => q.lane === "FEMALE");

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-teal-500 selection:text-white font-sans antialiased overflow-hidden">
      {/* Top Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Keluar dari TV Display"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-black shadow-md shadow-teal-500/20">
              <Activity className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                BEKAM BINTAN THERAPY
                <span className="rounded-md bg-teal-500/20 px-2 py-0.5 text-xs font-bold text-teal-400 border border-teal-500/30">
                  TV DISPLAY SISTEM
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Pusat Terapi Bekam Steril, Al Fashdu, Lintah & Gurah • Kab. Bintan
              </p>
            </div>
          </div>
        </div>

        {/* Live Date, Time & Controls */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-2xl font-black tracking-tight text-teal-400 font-mono">
              {currentTime || "00:00:00"}
            </p>
            <p className="text-xs font-semibold text-slate-400">
              {currentDate || "Memuat Tanggal..."}
            </p>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-800 pl-6">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                isMuted
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                  : "bg-slate-800 text-teal-400 hover:bg-slate-700"
              }`}
              title={isMuted ? "Suara Dimatikan" : "Suara Aktif"}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              title="Fullscreen Mode"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Display Body */}
      <main className="flex-1 p-6 grid grid-cols-12 gap-6 items-stretch">
        {/* Left Big Focus: Currently Called Patient (7 Cols) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-between rounded-3xl border-2 border-teal-500/40 bg-gradient-to-b from-slate-900 to-slate-900/95 p-8 shadow-2xl relative overflow-hidden">
          {/* Glowing Aura Background */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-600/10 blur-3xl pointer-events-none" />

          {/* Callout Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-black uppercase tracking-widest text-teal-400">
                PANGGILAN AKTIF SEKARANG
              </span>
            </div>
            {activeCall && (
              <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-300 border border-sky-500/30">
                {activeCall.lane === "MALE"
                  ? "Jalur Ikhwan (Pria)"
                  : "Jalur Akhwat (Wanita)"}
              </span>
            )}
          </div>

          {/* Big Number & Room */}
          {activeCall ? (
            <div className="text-center py-6 space-y-4">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block">
                NOMOR ANTREAN
              </span>
              <div className="text-8xl sm:text-9xl font-black tracking-tight text-white font-mono drop-shadow-[0_10px_25px_rgba(20,184,166,0.25)] animate-in zoom-in-90 duration-300">
                {activeCall.ticketNumber}
              </div>

              <div className="inline-block rounded-2xl bg-gradient-to-r from-teal-950 to-emerald-950 border border-teal-500/40 px-8 py-4 shadow-xl">
                <span className="text-xs uppercase tracking-widest text-teal-300 font-bold block">
                  SILAKAN MENUJU KE
                </span>
                <span className="text-3xl sm:text-4xl font-black text-white mt-1 block">
                  {activeCall.roomName ?? "Ruang Terapi"}
                </span>
              </div>

              <p className="text-sm text-slate-400 font-medium">
                Paket: {activeCall.serviceName}
                {activeCall.therapistName && ` • Terapis: ${activeCall.therapistName}`}
              </p>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <p className="text-lg font-bold">Belum ada panggilan antrean</p>
              <p className="text-xs mt-1">Panggilan berikutnya akan tampil otomatis di sini</p>
            </div>
          )}

          {activeCall && (
            <div className="border-t border-slate-800 pt-4 flex items-center justify-end">
              <button
                onClick={() => speakCallout(activeCall)}
                className="rounded-lg bg-sky-900/60 px-3.5 py-1.5 text-xs font-bold text-sky-300 hover:bg-sky-800 border border-sky-700/50 transition-colors flex items-center gap-1.5"
              >
                <Volume2 className="h-3.5 w-3.5" />
                Panggil Ulang Suara
              </button>
            </div>
          )}
        </div>

        {/* Right Split: Lane Lists (5 Cols) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
          {/* Lane Pria Box */}
          <div className="flex-1 rounded-3xl border border-teal-800/60 bg-slate-900/80 p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-600 font-black text-xs">
                    P
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-teal-300">
                    Jalur Ikhwan (Pria)
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {maleQueues.filter((q) => q.status === "WAITING").length} Menunggu
                </span>
              </div>

              <div className="space-y-2">
                {maleQueues.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleManualCall(item)}
                    className="flex items-center justify-between rounded-xl bg-slate-800/80 px-3.5 py-2.5 hover:bg-slate-700/80 cursor-pointer transition-colors border border-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-black text-white">
                        {item.ticketNumber}
                      </span>
                      <span className="text-xs text-slate-400 truncate max-w-[150px]">
                        {item.serviceName}
                      </span>
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        item.status === "CALLED"
                          ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                          : item.status === "IN_THERAPY"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              Klik salah satu nomor untuk memanggil ulang
            </p>
          </div>

          {/* Lane Wanita Box */}
          <div className="flex-1 rounded-3xl border border-emerald-800/60 bg-slate-900/80 p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 font-black text-xs">
                    W
                  </span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
                    Jalur Akhwat (Wanita)
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  {femaleQueues.filter((q) => q.status === "WAITING").length} Menunggu
                </span>
              </div>

              <div className="space-y-2">
                {femaleQueues.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleManualCall(item)}
                    className="flex items-center justify-between rounded-xl bg-slate-800/80 px-3.5 py-2.5 hover:bg-slate-700/80 cursor-pointer transition-colors border border-slate-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xl font-black text-white">
                        {item.ticketNumber}
                      </span>
                      <span className="text-xs text-slate-400 truncate max-w-[150px]">
                        {item.serviceName}
                      </span>
                    </div>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        item.status === "CALLED"
                          ? "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                          : item.status === "IN_THERAPY"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              Klik salah satu nomor untuk memanggil ulang
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Running News Ticker */}
      <footer className="border-t border-slate-800 bg-slate-900 px-6 py-3 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2 text-teal-400 font-bold shrink-0 uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-amber-400" />
          Info Klinik:
        </div>
        <div className="overflow-hidden whitespace-nowrap text-slate-300 flex-1">
          <div className="inline-block animate-marquee pl-full">
            Rasulullah SAW bersabda: &quot;Sebaik-baik pengobatan yang kalian lakukan adalah dengan berbekam (hijamah).&quot; (HR. Bukhari & Muslim) • Mohon persiapkan diri dan perhatikan panggilan layar TV • Jaga ketenangan di area ruang tunggu • Konsultasi dan air mineral hangat tersedia di meja resepsionis.
          </div>
        </div>
      </footer>
    </div>
  );
}
