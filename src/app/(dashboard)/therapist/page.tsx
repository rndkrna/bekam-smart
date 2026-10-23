"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  HeartPulse,
  ShieldAlert,
  CheckCircle,
  Clock,
  User,
  Save,
  LogOut,
  Sparkles,
  Layers,
  FileText,
  AlertCircle,
  Thermometer,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  Info,
  Droplet,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, getStatusBadgeVariant, getStatusLabelIndonesian } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LiveQueueTicket, INITIAL_SERVICES } from "@/lib/data/mock-data";

interface PointDefinition {
  id: string;
  name: string;
  arabic: string;
  location: string;
  indication: string;
  defaultCups: number;
  bodyRegion: "HEAD" | "BACK" | "LOWER";
}

const CUPPING_POINTS: PointDefinition[] = [
  {
    id: "kahil",
    name: "Al-Kahil",
    arabic: "الكاهل",
    location: "Punggung Atas (C7 - T1)",
    indication: "Titik utama sunnah, detoksifikasi racun, imunitas, pegal leher & flu",
    defaultCups: 1,
    bodyRegion: "BACK",
  },
  {
    id: "akhdaain",
    name: "Al-Akhda'ain",
    arabic: "الأخدعان",
    location: "Kiri & Kanan Leher Belakang (V. Jugularis)",
    indication: "Migrain, vertigo, pusing, hipertensi, ketegangan otot leher",
    defaultCups: 2,
    bodyRegion: "BACK",
  },
  {
    id: "katifain",
    name: "Al-Katifain",
    arabic: "الكتفين",
    location: "Kedua Bahu & Belikat (Scapula)",
    indication: "Kelelahan fisik, nyeri belikat, pundak kaku, stres kerja",
    defaultCups: 2,
    bodyRegion: "BACK",
  },
  {
    id: "warik",
    name: "Al-Warik",
    arabic: "الورك",
    location: "Pinggang Belakang (Lumbal L4 - L5)",
    indication: "Sakit pinggang, ginjal, saluran kencing, asam urat",
    defaultCups: 2,
    bodyRegion: "LOWER",
  },
  {
    id: "umumughits",
    name: "Ummu Mughits",
    arabic: "أم مغيث",
    location: "Puncak Kepala (Vertex)",
    indication: "Vertigo berat, sinusitis, daya ingat, keluhan stroke",
    defaultCups: 1,
    bodyRegion: "HEAD",
  },
  {
    id: "fakhdz",
    name: "Al-Fakhdz",
    arabic: "الفخذ",
    location: "Paha Belakang / Betis",
    indication: "Sciatica, pegal linu kaki, asam urat tungkai bawah",
    defaultCups: 2,
    bodyRegion: "LOWER",
  },
  {
    id: "qodam",
    name: "Az-Zhohrul Qodam",
    arabic: "ظهر القدم",
    location: "Punggung Kaki",
    indication: "Asam urat kaki, kesemutan ekstremitas bawah",
    defaultCups: 2,
    bodyRegion: "LOWER",
  },
];

export default function TherapistDashboardPage() {
  // Active Therapist & Lane Switcher
  const [activeLane, setActiveLane] = React.useState<"MALE" | "FEMALE">("MALE");
  const therapistName =
    activeLane === "MALE"
      ? "Ustadz Hasan (Terapis Ikhwan • Praktisi ITBI)"
      : "Ummu Aisyah (Terapis Akhwat • Praktisi Muslimah)";

  const [queues, setQueues] = React.useState<LiveQueueTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = React.useState<LiveQueueTicket | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Vital Signs State
  const [systolicBP, setSystolicBP] = React.useState<number>(120);
  const [diastolicBP, setDiastolicBP] = React.useState<number>(80);
  const [pulseRate, setPulseRate] = React.useState<number>(76);
  const [bodyTemp, setBodyTemp] = React.useState<number>(36.5);
  const [bloodSugar, setBloodSugar] = React.useState<string>("");

  // Contraindications Checklist
  const [hasHemophilia, setHasHemophilia] = React.useState(false);
  const [hasSevereAnemia, setHasSevereAnemia] = React.useState(false);
  const [isTakingBloodThinner, setIsTakingBloodThinner] = React.useState(false);
  const [isPregnant, setIsPregnant] = React.useState(false);
  const [hasAcuteInfection, setHasAcuteInfection] = React.useState(false);

  // Cupping Points Selection
  const [selectedPoints, setSelectedPoints] = React.useState<string[]>([
    "Al-Kahil",
    "Al-Akhda'ain",
    "Al-Katifain",
  ]);
  const [cupQuantity, setCupQuantity] = React.useState<number>(10);

  // Blood Characteristics & Clinical Notes
  const [bloodCharacteristics, setBloodCharacteristics] =
    React.useState<string>("Merah kehitaman kental (Darah statis sedang)");
  const [therapistNotes, setTherapistNotes] = React.useState<string>(
    "Pasien mengeluhkan ketegangan leher dan belikat akibat kelelahan fisik. Titik sunnah Al-Kahil & Al-Katifain merespons sangat baik."
  );

  // Feedback State
  const [savedSuccess, setSavedSuccess] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch queues from API
  const fetchQueues = async () => {
    try {
      const res = await fetch(`/api/queues?lane=${activeLane}`);
      const json = await res.json();
      if (json.success && json.data) {
        const laneQueues: LiveQueueTicket[] = json.data.queues || [];
        setQueues(laneQueues);

        // Auto-select current active or called patient if no selection
        if (!selectedTicket || selectedTicket.lane !== activeLane) {
          const active =
            laneQueues.find((q) => q.status === "IN_THERAPY") ||
            laneQueues.find((q) => q.status === "CALLED") ||
            laneQueues[0] ||
            null;
          setSelectedTicket(active);
        }
      }
    } catch (e) {
      console.error("Failed to fetch therapist queues:", e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchQueues();
    const interval = setInterval(fetchQueues, 5000);
    return () => clearInterval(interval);
  }, [activeLane]);

  // Load existing screening when selected ticket changes
  React.useEffect(() => {
    if (!selectedTicket) return;

    const loadScreening = async () => {
      try {
        const res = await fetch(`/api/screenings?ticket=${selectedTicket.ticketNumber}`);
        const json = await res.json();
        if (json.success && json.data) {
          const scr = json.data;
          setSystolicBP(scr.systolicBP || 120);
          setDiastolicBP(scr.diastolicBP || 80);
          setPulseRate(scr.pulseRateBpm || 76);
          setHasHemophilia(Boolean(scr.hasHemophilia));
          setHasSevereAnemia(Boolean(scr.hasSevereAnemia));
          setIsTakingBloodThinner(Boolean(scr.isTakingBloodThinner));
          setIsPregnant(Boolean(scr.isPregnant));
          setHasAcuteInfection(Boolean(scr.hasAcuteInfection));
          if (Array.isArray(scr.selectedCuppingPoints) && scr.selectedCuppingPoints.length > 0) {
            setSelectedPoints(scr.selectedCuppingPoints);
          }
          if (scr.cupQuantity) setCupQuantity(scr.cupQuantity);
          if (scr.therapistNotes) setTherapistNotes(scr.therapistNotes);
        }
      } catch (e) {
        console.error("Failed to load patient screening:", e);
      }
    };

    loadScreening();
  }, [selectedTicket?.ticketNumber]);

  // Dynamic Blood Pressure Category
  const getBPCategory = () => {
    if (systolicBP < 90 || diastolicBP < 60) {
      return {
        label: "Hipotensi (Tekanan Darah Rendah)",
        variant: "warning",
        advice: "Perlu kehati-hatian. Disarankan bekam kering atau makan kurma/madu sebelum tindakan.",
      };
    }
    if (systolicBP >= 140 || diastolicBP >= 90) {
      return {
        label: "Hipertensi Derajat 2",
        variant: "destructive",
        advice: "Sangat dianjurkan bekam sunnah pada titik Al-Kahil & Al-Akhda'ain dengan sayatan ringan.",
      };
    }
    if ((systolicBP >= 130 && systolicBP <= 139) || (diastolicBP >= 80 && diastolicBP <= 89)) {
      return {
        label: "Hipertensi Derajat 1",
        variant: "warning",
        advice: "Aman dan bermanfaat menurunkan resistensi pembuluh darah perifer.",
      };
    }
    if (systolicBP >= 120 && systolicBP <= 129 && diastolicBP < 80) {
      return {
        label: "Pra-Hipertensi",
        variant: "default",
        advice: "Kondisi ideal untuk terapi preventif bekam sunnah thibbun nabawi.",
      };
    }
    return {
      label: "Tekanan Darah Normal",
      variant: "default",
      advice: "Kondisi sangat baik. Memenuhi seluruh syarat medis tindakan bekam basah.",
    };
  };

  const bpStatus = getBPCategory();

  // Safety Eligibility Check
  const hasCriticalContraindication = hasHemophilia || hasSevereAnemia || isTakingBloodThinner;

  // Toggle Point
  const togglePoint = (pointName: string, defaultCups: number) => {
    setSelectedPoints((prev) => {
      const exists = prev.includes(pointName);
      if (exists) {
        const next = prev.filter((p) => p !== pointName);
        setCupQuantity((c) => Math.max(1, c - defaultCups));
        return next;
      } else {
        setCupQuantity((c) => c + defaultCups);
        return [...prev, pointName];
      }
    });
  };

  // Save Screening Record
  const handleSaveScreening = async (advanceToInTherapy = false) => {
    if (!selectedTicket) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/screenings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          ticketNumber: selectedTicket.ticketNumber,
          patientName: selectedTicket.maskedPatientName,
          systolicBP,
          diastolicBP,
          pulseRateBpm: pulseRate,
          bloodSugarMgDl: bloodSugar ? Number(bloodSugar) : undefined,
          hasHemophilia,
          hasSevereAnemia,
          isTakingBloodThinner,
          isPregnant,
          hasAcuteInfection,
          selectedCuppingPoints: selectedPoints,
          cupQuantity,
          therapistNotes: `[Karakter Darah: ${bloodCharacteristics}] ${therapistNotes}`,
          therapistName,
          advanceQueueStatus: advanceToInTherapy,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSavedSuccess(json.message);
        setTimeout(() => setSavedSuccess(null), 4000);
        fetchQueues();
      } else {
        alert(json.error || "Gagal menyimpan rekam skrining");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan koneksi saat menyimpan");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Complete Therapy & Forward to Cashier
  const handleCompleteTherapy = async () => {
    if (!selectedTicket) return;

    if (!confirm(`Selesaikan sesi terapi untuk tiket ${selectedTicket.ticketNumber} dan teruskan ke meja kasir?`)) {
      return;
    }

    try {
      // First save screening
      await handleSaveScreening(false);

      // Transition status to COMPLETED
      const res = await fetch("/api/queues", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          queueId: selectedTicket.id,
          status: "COMPLETED",
          actor: therapistName,
          reason: "Tindakan bekam selesai, bilik disterilisasi, pasien diarahkan ke kasir",
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSavedSuccess(`Terapi ${selectedTicket.ticketNumber} selesai! Pasien diteruskan ke kasir.`);
        setTimeout(() => setSavedSuccess(null), 4000);
        fetchQueues();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Toast Feedback */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-800 text-white px-5 py-3 shadow-xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-300">
          <CheckCircle className="h-4 w-4 text-emerald-300" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-white font-bold shadow-xs">
              <Stethoscope className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  WORKSPACE TERAPIS
                </span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  REKAM MEDIS & ANAMNESIS
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {therapistName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Lane Switcher */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800 text-xs font-semibold">
              <button
                onClick={() => setActiveLane("MALE")}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeLane === "MALE"
                    ? "bg-teal-800 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Ustadz Hasan (Ikhwan)</span>
              </button>
              <button
                onClick={() => setActiveLane("FEMALE")}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeLane === "FEMALE"
                    ? "bg-rose-800 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Ummu Aisyah (Akhwat)</span>
              </button>
            </div>

            <Link href="/admin">
              <Button variant="outline" size="sm" className="text-xs">
                Admin & Kasir
              </Button>
            </Link>

            <Link href="/">
              <Button variant="ghost" size="sm" className="text-xs text-rose-600 gap-1">
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ======================================================== */}
        {/* LEFT PANEL: Queue Lane List (4 Cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-teal-700" />
                  Antrean Jalur {activeLane === "MALE" ? "Ikhwan (P)" : "Akhwat (W)"}
                </h3>
                <p className="text-[11px] text-slate-500">Pilih pasien untuk mengisi rekam medis</p>
              </div>
              <button
                onClick={fetchQueues}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-800"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="p-3 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto">
              {queues.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Belum ada antrean terdaftar di jalur ini.
                </div>
              ) : (
                queues.map((item) => {
                  const isSelected = selectedTicket?.id === item.id;
                  const isInTherapy = item.status === "IN_THERAPY";
                  const isCalled = item.status === "CALLED";

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedTicket(item)}
                      className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-xs ring-1 ring-emerald-500"
                          : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-black text-base text-slate-900 dark:text-white">
                          {item.ticketNumber}
                        </span>
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {getStatusLabelIndonesian(item.status)}
                        </Badge>
                      </div>

                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.maskedPatientName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {item.serviceName} ({item.serviceDuration}m)
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>Check-in: {item.checkInTime}</span>
                        {item.roomName && (
                          <span className="font-semibold text-teal-700 dark:text-teal-400">
                            {item.roomName}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* SOP Dinkes Checklist Reminder Card */}
          <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-4.5 dark:border-teal-900 dark:bg-teal-950/30 text-xs text-teal-900 dark:text-teal-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-950 dark:text-teal-100">
              <ShieldCheck className="h-4 w-4 text-teal-700" />
              SOP Sterilisasi ITBI & Dinkes Bintan
            </div>
            <ul className="space-y-1.5 text-[11px] text-teal-800 dark:text-teal-300">
              <li>• Disinfeksi kulit 3 kali dengan antiseptik povidone/alkohol</li>
              <li>• Kedalaman sayatan jarum mikro steril: 0.1 - 0.5 mm</li>
              <li>• Kop bekam disposable (1 pasien 1 set kop steril baru)</li>
              <li>• Waktu pengekopan maksimal 3 - 5 menit per rotasi</li>
            </ul>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANEL: Medical Screening & Cupping Records (8 Cols) */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          {selectedTicket ? (
            <Card className="border-2 border-emerald-600/60 bg-white dark:bg-slate-900 shadow-md overflow-hidden">
              {/* Active Header Banner */}
              <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                    Pasien Sedang Diperiksa di Bilik
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-0.5">
                    {selectedTicket.ticketNumber} • {selectedTicket.maskedPatientName}
                  </h2>
                  <p className="text-xs text-emerald-100 mt-1">
                    Paket: {selectedTicket.serviceName} ({selectedTicket.serviceDuration} Menit)
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-1.5">
                  <Badge variant={getStatusBadgeVariant(selectedTicket.status)} className="text-xs">
                    {getStatusLabelIndonesian(selectedTicket.status)}
                  </Badge>
                  <span className="text-[11px] text-slate-300">
                    Bilik: {selectedTicket.roomName || "Ruang Terapi 1"}
                  </span>
                </div>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* 1. Vital Signs Form */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <HeartPulse className="h-4 w-4 text-rose-600" />
                      1. Pemeriksaan Tanda Vital Pra-Tindakan (Wajib)
                    </h3>
                    <span className="text-[11px] text-slate-400">Standar Medis & PBI</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Sistolik (mmHg) *
                      </label>
                      <Input
                        type="number"
                        min={60}
                        max={240}
                        value={systolicBP}
                        onChange={(e) => setSystolicBP(Number(e.target.value))}
                        className="font-bold text-slate-900 dark:text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Diastolik (mmHg) *
                      </label>
                      <Input
                        type="number"
                        min={40}
                        max={140}
                        value={diastolicBP}
                        onChange={(e) => setDiastolicBP(Number(e.target.value))}
                        className="font-bold text-slate-900 dark:text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Denyut Nadi (bpm)
                      </label>
                      <Input
                        type="number"
                        value={pulseRate}
                        onChange={(e) => setPulseRate(Number(e.target.value))}
                        className="font-bold text-slate-900 dark:text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Suhu Tubuh (°C)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={bodyTemp}
                        onChange={(e) => setBodyTemp(Number(e.target.value))}
                        className="font-bold text-slate-900 dark:text-white text-sm"
                      />
                    </div>
                  </div>

                  {/* BP Evaluation Banner */}
                  <div
                    className={`rounded-xl p-3 border text-xs flex items-start gap-2.5 ${
                      systolicBP < 90
                        ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
                        : systolicBP >= 140
                        ? "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200"
                        : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                    }`}
                  >
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">
                        {systolicBP}/{diastolicBP} mmHg — {bpStatus.label}
                      </p>
                      <p className="text-[11px] mt-0.5 opacity-90">{bpStatus.advice}</p>
                    </div>
                  </div>
                </div>

                {/* 2. Contraindications Checklist */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4 text-amber-600" />
                      2. Skrining Kontraindikasi (Keamanan Pasien)
                    </h3>
                    {hasCriticalContraindication ? (
                      <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Kontraindikasi Terdeteksi!
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Aman Dibekam
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasHemophilia}
                        onChange={(e) => setHasHemophilia(e.target.checked)}
                        className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span>Riwayat Hemofilia / Gangguan Beku Darah</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasSevereAnemia}
                        onChange={(e) => setHasSevereAnemia(e.target.checked)}
                        className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span>Anemia Berat (Hb &lt; 8 g/dL)</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isTakingBloodThinner}
                        onChange={(e) => setIsTakingBloodThinner(e.target.checked)}
                        className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span>Obat Pengencer Darah (Aspilet/Warfarin)</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPregnant}
                        onChange={(e) => setIsPregnant(e.target.checked)}
                        className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span>Sedang Hamil (Hindari area pinggang & perut)</span>
                    </label>
                  </div>
                </div>

                {/* 3. Cupping Points & Cups Selector */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-teal-700" />
                      3. Peta Titik Sunnah & Anatomi Yang Diaplikasikan
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Total Kop:</span>
                      <span className="font-mono font-black text-sm text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-2.5 py-0.5 rounded-md border border-teal-200 dark:border-teal-900">
                        {cupQuantity} Kop Steril
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CUPPING_POINTS.map((pt) => {
                      const isSelected = selectedPoints.includes(pt.name);
                      return (
                        <div
                          key={pt.id}
                          onClick={() => togglePoint(pt.name, pt.defaultCups)}
                          className={`p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                            isSelected
                              ? "border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 ring-1 ring-teal-500"
                              : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{pt.name}</span>
                              <span className="text-[11px] font-serif text-teal-700 dark:text-teal-400">
                                ({pt.arabic})
                              </span>
                            </div>
                            <span className="text-[10px] font-semibold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                              {pt.defaultCups} Kop
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            Lokasi: {pt.location}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                            Indikasi: {pt.indication}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Blood Characteristics & Anamnesis Notes */}
                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Droplet className="h-4 w-4 text-rose-600" />
                    4. Karakteristik Darah Statis & Catatan Klinis Terapis
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Evaluasi Visual Darah Statis
                      </label>
                      <select
                        value={bloodCharacteristics}
                        onChange={(e) => setBloodCharacteristics(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 font-medium"
                      >
                        <option value="Merah segar normal (Oksigenasi baik)">
                          Merah segar normal (Oksigenasi baik)
                        </option>
                        <option value="Merah kehitaman kental (Darah statis sedang)">
                          Merah kehitaman kental (Darah statis sedang)
                        </option>
                        <option value="Hitam pekat berbuih (Statis berat / Toksin tinggi)">
                          Hitam pekat berbuih (Statis berat / Toksin tinggi)
                        </option>
                        <option value="Encer kecokelatan (Kadar hemoglobin rendah)">
                          Encer kecokelatan (Kadar hemoglobin rendah)
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Saran Herbal Paska-Bekam
                      </label>
                      <select className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 font-medium">
                        <option>Madu Hutan Liar Murni + Air Hangat</option>
                        <option>Minyak Habbatussauda Habasyi (2x sehari)</option>
                        <option>Minyak Zaitun Ruqyah Extra Virgin</option>
                        <option>Air Nabeez Kurma Ajwa</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Catatan Tindakan & Respons Pasien
                    </label>
                    <textarea
                      rows={3}
                      value={therapistNotes}
                      onChange={(e) => setTherapistNotes(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSaveScreening(false)}
                      disabled={isSubmitting}
                      className="gap-1.5 text-xs w-full sm:w-auto"
                    >
                      <Save className="h-4 w-4" />
                      Simpan Catatan Saja
                    </Button>

                    {selectedTicket.status === "CALLED" && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleSaveScreening(true)}
                        disabled={isSubmitting}
                        className="gap-1.5 text-xs bg-teal-700 hover:bg-teal-800 text-white w-full sm:w-auto"
                      >
                        Mulai Tindakan Terapi
                      </Button>
                    )}
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCompleteTherapy}
                    disabled={isSubmitting}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1.5 w-full sm:w-auto font-bold shadow-xs"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Selesaikan Terapi & Teruskan ke Kasir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 space-y-3">
              <Stethoscope className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">Tidak ada pasien aktif yang dipilih</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Silakan pilih nomor antrean pada panel sebelah kiri untuk memulai pemeriksaan tanda vital dan catatan terapi bekam.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
