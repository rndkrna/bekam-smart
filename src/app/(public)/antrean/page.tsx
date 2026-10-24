"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Users,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Tv,
  LogIn,
  Ticket,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Layers,
  ChevronRight,
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { INITIAL_SERVICES, INITIAL_QUEUES, LiveQueueTicket } from "@/lib/data/mock-data";
import { formatIDR } from "@/lib/utils";
import { calculateEstimatedWait, formatWaitDuration } from "@/lib/utils/queue-estimator";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function AntreanOnlinePage() {
  const router = useRouter();

  // Queues state
  const [queues, setQueues] = React.useState<LiveQueueTicket[]>(INITIAL_QUEUES);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState("Baru saja");

  // Registration state
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gender, setGender] = React.useState<"MALE" | "FEMALE">("MALE");
  const [serviceId, setServiceId] = React.useState(INITIAL_SERVICES[0].id);
  const [complaints, setComplaints] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = React.useState<{
    ticketNumber: string;
    secretToken: string;
    ticketUrl: string;
    estimatedWaitMinutes: number;
    peopleAhead: number;
    serviceName: string;
    price: number;
  } | null>(null);

  // Quick lookup state
  const [lookupQuery, setLookupQuery] = React.useState("");
  const [lookupLoading, setLookupLoading] = React.useState(false);
  const [lookupError, setLookupError] = React.useState<string | null>(null);

  const handleRefresh = React.useCallback(async (silent: boolean = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetch("/api/queues", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.data?.queues) {
          setQueues(json.data.queues);
        }
      }
    } catch {
      // Fallback
    } finally {
      if (!silent) {
        setTimeout(() => setIsRefreshing(false), 300);
      }
      setLastUpdated(
        new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  }, []);

  // Real-time auto-refresh on mount and every 3 seconds
  React.useEffect(() => {
    handleRefresh(true);
    const interval = setInterval(() => handleRefresh(true), 3000);
    return () => clearInterval(interval);
  }, [handleRefresh]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/queues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          gender,
          serviceId,
          complaints,
          hasEatenMeal: true,
          contraindicationConfirmed: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Gagal mendaftar antrean.");
        setIsSubmitting(false);
        return;
      }

      setCreatedTicket(data.data);
      handleRefresh();
    } catch {
      setErrorMessage("Koneksi gagal. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery ?? lookupQuery).trim();
    if (!query) return;

    setLookupLoading(true);
    setLookupError(null);

    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) {
        setLookupError(data.error || "Nomor tiket atau token tidak ditemukan.");
        setLookupLoading(false);
        return;
      }
      router.push(`/ticket/${data.data.secretToken}`);
    } catch {
      setLookupError("Gagal menghubungi server.");
    } finally {
      setLookupLoading(false);
    }
  };

  const selectServiceAndScroll = (id: string) => {
    setServiceId(id);
    const formElement = document.getElementById("form-antrean");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Lane calculations - pick the most recently called or active ticket
  const maleWaiting = queues.filter((q) => q.lane === "MALE" && q.status === "WAITING");
  const maleCalled = queues.filter((q) => q.lane === "MALE" && q.status === "CALLED");
  const maleInTherapy = queues.filter((q) => q.lane === "MALE" && q.status === "IN_THERAPY");
  const maleActive = maleCalled[maleCalled.length - 1] ?? maleInTherapy[maleInTherapy.length - 1];
  const maleWait = calculateEstimatedWait(maleWaiting.length, { lane: "MALE" });

  const femaleWaiting = queues.filter((q) => q.lane === "FEMALE" && q.status === "WAITING");
  const femaleCalled = queues.filter((q) => q.lane === "FEMALE" && q.status === "CALLED");
  const femaleInTherapy = queues.filter((q) => q.lane === "FEMALE" && q.status === "IN_THERAPY");
  const femaleActive = femaleCalled[femaleCalled.length - 1] ?? femaleInTherapy[femaleInTherapy.length - 1];
  const femaleWait = calculateEstimatedWait(femaleWaiting.length, { lane: "FEMALE" });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Shared Unified Navbar */}
      <Navbar />

      {/* 2. Hero Ringkas & Jelas */}
      <section className="bg-white border-b border-slate-200 py-10 px-4">
        <div className="max-w-6xl mx-auto text-center max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs px-3.5 py-1.5 rounded-full font-semibold mb-3">
            <ShieldCheck className="h-4 w-4 text-teal-700" />
            STPT Dinkes Bintan No. 001/Yankes/Batra/VII/2013 • Anggota ITBI No. 000341
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Antrean Terapi Bekam Bintan Online
          </h1>
          <p className="mt-1 text-xs font-bold text-teal-700">
            Balai Pengobatan Alami Thibbun Nabawi — Berdiri Sejak Tahun 2011 di Kab. Bintan
          </p>
          <div className="my-3 p-3 bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 rounded-xl border border-teal-200/80">
            <p className="text-xs sm:text-sm font-bold text-slate-800 italic">
              &ldquo;Biaya Terapi Pengobatan Kami Murah, Mujarab, Halal, dan Insya Allah Barokah.&rdquo;
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Melayani Pria & Wanita (Jalur Terpisah) • Muslim & Non-Muslim • Buka Setiap Hari: 09:00 – 22:00 WIB
            </p>
          </div>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Daftar antrean terapi bekam steril, al fashdu, lintah medis, gurah hidung, dan home care dari mana saja tanpa ribet buat akun. Tersedia terapis khusus <strong>Ikhwan (Pria)</strong> dan <strong>Akhwat (Wanita)</strong>.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
            <a
              href="#form-antrean"
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
            >
              Ambil Nomor Antrean Sekarang
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://share.google/eaQgQIzNPtGp7UVtq"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 font-semibold text-slate-700 rounded-md transition-colors flex items-center gap-1.5"
            >
              <MapPin className="h-3.5 w-3.5 text-teal-700" />
              Lokasi Google Maps
            </a>
            <a
              href="https://wa.me/6281268320072?text=Asslkm%20pak,%20saya%20mau%20daftar%20terapi"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-md transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Chat WhatsApp Terapis
            </a>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 space-y-10">
        {/* 3. Status Antrean Real-Time Dual-Lane */}
        <section id="antrean" className="scroll-mt-16">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Status Antrean Saat Ini (Dual-Lane)
              </h2>
              <p className="text-xs text-slate-500">
                Pembaruan terakhir: {lastUpdated}
              </p>
            </div>
            <button
              onClick={() => handleRefresh(false)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-teal-700" : ""}`} />
              Segarkan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Jalur Pria (Ikhwan) */}
            <div className="border-2 border-teal-600/30 rounded-xl bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-8 w-8 rounded-lg bg-teal-700 text-white font-black text-sm flex items-center justify-center">
                    P
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Jalur Pria (Ikhwan)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Terapis Pria • 2 Ruang Aktif
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  Kode: P
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg mb-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Sedang Dilayani:</span>
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    {maleActive ? maleActive.ticketNumber : "-"}
                  </span>
                  {maleActive && (
                    <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                      {maleActive.roomName}
                    </p>
                  )}
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Antrean Menunggu:</span>
                  <span className="text-xl font-bold text-slate-900">
                    {maleWaiting.length} Orang
                  </span>
                  <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                    Est. {formatWaitDuration(maleWait.minEstimatedMinutes, maleWait.maxEstimatedMinutes)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500 mb-1.5">
                  Antrean Berikutnya:
                </p>
                <div className="space-y-1.5">
                  {maleWaiting.slice(0, 2).map((item, i) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-slate-50 border border-slate-200"
                    >
                      <span className="font-bold font-mono text-slate-900">
                        {i + 1}. {item.ticketNumber}
                      </span>
                      <span className="text-slate-500 text-[11px] truncate max-w-[150px]">
                        {item.serviceName}
                      </span>
                    </div>
                  ))}
                  {maleWaiting.length === 0 && (
                    <p className="text-xs text-slate-400 italic">
                      Tidak ada antrean menunggu untuk jalur pria saat ini.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Jalur Wanita (Akhwat) */}
            <div className="border-2 border-emerald-600/30 rounded-xl bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="h-8 w-8 rounded-lg bg-emerald-700 text-white font-black text-sm flex items-center justify-center">
                    W
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Jalur Wanita (Akhwat)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Terapis Wanita • 2 Ruang Aktif
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Kode: W
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg mb-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px]">Sedang Dilayani:</span>
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    {femaleActive ? femaleActive.ticketNumber : "-"}
                  </span>
                  {femaleActive && (
                    <p className="text-[11px] text-slate-600 font-medium truncate mt-0.5">
                      {femaleActive.roomName}
                    </p>
                  )}
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Antrean Menunggu:</span>
                  <span className="text-xl font-bold text-slate-900">
                    {femaleWaiting.length} Orang
                  </span>
                  <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                    Est. {formatWaitDuration(femaleWait.minEstimatedMinutes, femaleWait.maxEstimatedMinutes)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500 mb-1.5">
                  Antrean Berikutnya:
                </p>
                <div className="space-y-1.5">
                  {femaleWaiting.slice(0, 2).map((item, i) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-slate-50 border border-slate-200"
                    >
                      <span className="font-bold font-mono text-slate-900">
                        {i + 1}. {item.ticketNumber}
                      </span>
                      <span className="text-slate-500 text-[11px] truncate max-w-[150px]">
                        {item.serviceName}
                      </span>
                    </div>
                  ))}
                  {femaleWaiting.length === 0 && (
                    <p className="text-xs text-slate-400 italic">
                      Tidak ada antrean menunggu untuk jalur wanita saat ini.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Katalog Paket Terapi & Tarif */}
        <section id="layanan" className="scroll-mt-16">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Jenis Terapi dan Biaya
            </h2>
            <p className="text-xs text-slate-500">
              Biaya sudah termasuk konsultasi tensi darah, minyak zaitun murni, dan jarum/kop steril baru.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_SERVICES.map((s) => (
              <div
                key={s.id}
                className="border border-slate-200 rounded-xl bg-white p-4 flex flex-col justify-between hover:border-teal-500 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-teal-700 font-bold mb-1">
                    <span>{s.category}</span>
                    {s.isPopular && (
                      <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px]">
                        Favorit
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {s.name}
                  </h3>
                  <div className="mt-3 flex items-center text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-teal-600" />
                      {s.durationLabel || `${s.durationMinutes} Menit`}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-base font-extrabold text-slate-900">
                    {formatIDR(s.price)}{s.priceUnit ? ` ${s.priceUnit}` : ""}
                  </span>
                  <button
                    type="button"
                    onClick={() => selectServiceAndScroll(s.id)}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                  >
                    Pilih Terapi
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Dua Kolom: Form Pendaftaran (Kiri) & Cek Tiket Cepat (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Pendaftaran Online */}
          <section
            id="form-antrean"
            className="lg:col-span-7 border border-slate-200 rounded-xl bg-white p-6 shadow-xs scroll-mt-16"
          >
            <h2 className="text-base font-bold text-slate-900">
              Formulir Pendaftaran Antrean Online
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Silakan lengkapi data pasien. Tiket nomor antrean akan langsung terbit.
            </p>

            {createdTicket ? (
              <div className="border-2 border-emerald-500 bg-emerald-50/50 rounded-xl p-5 text-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-emerald-900">
                    Pendaftaran Berhasil!
                  </h3>
                  <p className="text-xs text-emerald-700">
                    Nomor antrean resmi Anda:
                  </p>
                  <div className="text-5xl font-black font-mono text-slate-900 my-2">
                    {createdTicket.ticketNumber}
                  </div>
                  <p className="text-xs text-slate-600">
                    {createdTicket.serviceName} • {createdTicket.peopleAhead} orang di depan Anda
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <Link
                    href={createdTicket.ticketUrl}
                    className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-md flex items-center justify-center gap-1.5"
                  >
                    <Ticket className="h-4 w-4" />
                    Buka Tiket Digital Saya
                  </Link>
                  <button
                    onClick={() => {
                      setCreatedTicket(null);
                      setFullName("");
                      setPhone("");
                    }}
                    className="px-4 py-2 border border-slate-300 text-xs font-semibold rounded-md hover:bg-slate-50"
                  >
                    Daftar Antrean Lain
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4 text-xs">
                {errorMessage && (
                  <div className="border border-rose-200 bg-rose-50 text-rose-800 p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Pilih Jalur Gender */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    1. Jalur Terapi (Wajib Sesuai Gender) *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGender("MALE")}
                      className={`p-3 rounded-lg border-2 text-left flex items-center justify-between transition-colors ${
                        gender === "MALE"
                          ? "border-teal-700 bg-teal-50 text-teal-900 font-bold"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">Pria (Ikhwan)</p>
                        <p className="text-[11px] text-slate-500 font-normal">Terapis Pria • Kode P</p>
                      </div>
                      {gender === "MALE" && <CheckCircle2 className="h-4 w-4 text-teal-700" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender("FEMALE")}
                      className={`p-3 rounded-lg border-2 text-left flex items-center justify-between transition-colors ${
                        gender === "FEMALE"
                          ? "border-emerald-700 bg-emerald-50 text-emerald-900 font-bold"
                          : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">Wanita (Akhwat)</p>
                        <p className="text-[11px] text-slate-500 font-normal">Terapis Wanita • Kode W</p>
                      </div>
                      {gender === "FEMALE" && <CheckCircle2 className="h-4 w-4 text-emerald-700" />}
                    </button>
                  </div>
                </div>

                {/* Nama Lengkap & No WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nama Lengkap Pasien *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Santoso"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border border-slate-300 rounded-md p-2.5 text-xs focus:outline-none focus:border-teal-700 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nomor WhatsApp / HP Aktif *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 08123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-slate-300 rounded-md p-2.5 text-xs focus:outline-none focus:border-teal-700 bg-white"
                    />
                  </div>
                </div>

                {/* Paket Layanan */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pilihan Jenis Terapi *
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full border border-slate-300 rounded-md p-2.5 text-xs focus:outline-none focus:border-teal-700 bg-white"
                  >
                    {INITIAL_SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {formatIDR(s.price)}{s.priceUnit ? ` ${s.priceUnit}` : ""} ({s.durationLabel || `${s.durationMinutes} Menit`})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Keluhan / Catatan */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Keluhan / Bagian yang Sakit (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Pegal leher belakang, migrain sejak 2 hari..."
                    value={complaints}
                    onChange={(e) => setComplaints(e.target.value)}
                    className="w-full border border-slate-300 rounded-md p-2.5 text-xs focus:outline-none focus:border-teal-700 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-md transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menerbitkan Nomor Antrean..." : "Daftar & Ambil Nomor Antrean"}
                </button>
              </form>
            )}
          </section>

          {/* Kolom Kanan: Cek Tiket Cepat & Petunjuk Praktis */}
          <div className="lg:col-span-5 space-y-5">
            {/* Cek Tiket Sederhana */}
            <section
              id="cek-tiket"
              className="border border-slate-200 rounded-xl bg-white p-5 shadow-xs scroll-mt-16"
            >
              <h3 className="font-bold text-sm text-slate-900 mb-1">
                Cek Nomor Antrean Saya
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Sudah pernah mendaftar? Masukkan nomor tiket antrean atau kode token Anda.
              </p>

              <form onSubmit={(e) => handleLookup(e)} className="space-y-2 text-xs">
                {lookupError && (
                  <p className="text-rose-600 font-medium text-xs">{lookupError}</p>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: P-001 atau token..."
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    className="flex-1 border border-slate-300 rounded-md p-2 text-xs uppercase focus:outline-none focus:border-teal-700"
                  />
                  <button
                    type="submit"
                    disabled={lookupLoading}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-md transition-colors"
                  >
                    {lookupLoading ? "..." : "Cek"}
                  </button>
                </div>
              </form>
            </section>

            {/* Hubungi WhatsApp Terapis Langsung */}
            <section className="border border-emerald-200 rounded-xl bg-emerald-50/60 p-5 text-xs text-emerald-950 space-y-3">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <MessageCircle className="h-4 w-4 text-emerald-700" />
                Konsultasi & Konfirmasi WhatsApp:
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Anda juga dapat datang langsung ke klinik atau konfirmasi terlebih dahulu dengan terapis:
              </p>
              <div className="space-y-2">
                <a
                  href="https://api.whatsapp.com/send?phone=6281268320072&text=Asslkm%20pak,%20saya%20mau%20daftar%20terapi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-900">Terapis Pria (Ikhwan)</p>
                    <p className="text-[11px] text-slate-500 font-mono">0812-6832-0072</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    Chat WA
                  </span>
                </a>

                <a
                  href="https://api.whatsapp.com/send?phone=6281275302567&text=Asslkm%20ibu,%20saya%20mau%20daftar%20terapi%20akhwat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-emerald-300 hover:bg-emerald-100 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-900">Terapis Wanita (Akhwat)</p>
                    <p className="text-[11px] text-slate-500 font-mono">0812-7530-2567</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    Chat WA
                  </span>
                </a>
              </div>
              <div className="flex items-center justify-between pt-1 text-[11px] text-emerald-800 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-emerald-700" />
                  Praktek: 09:00 - 22:00 WIB
                </span>
                <a
                  href="https://share.google/eaQgQIzNPtGp7UVtq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-800 hover:text-teal-950 underline"
                >
                  <MapPin className="h-3 w-3 text-teal-700" />
                  Rute Google Maps ↗
                </a>
              </div>
            </section>

            {/* Info Petunjuk Pra-Bekam */}
            <section className="border border-teal-200 rounded-xl bg-teal-50/60 p-5 text-xs text-teal-900 space-y-2.5">
              <h4 className="font-bold text-teal-950 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-700" />
                Ketentuan Pra-Bekam:
              </h4>
              <ul className="space-y-1.5 text-[11px] text-teal-800 leading-relaxed">
                <li>• Dianjurkan sudah makan ringan 1-2 jam sebelum terapi.</li>
                <li>• Gunakan pakaian longgar yang nyaman.</li>
                <li>• Terapis ikhwan khusus melayani pasien ikhwan (Pria).</li>
                <li>• Terapis akhwat khusus melayani pasien akhwat (Wanita).</li>
                <li>• Panggilan antrean diumumkan melalui display TV dan pengeras suara.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      {/* Shared Unified Footer */}
      <Footer />
    </div>
  );
}
