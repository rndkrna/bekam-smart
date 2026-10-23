"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Ticket,
  Clock,
  Users,
  MapPin,
  RefreshCw,
  Share2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Volume2,
  Calendar,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, getStatusBadgeVariant, getStatusLabelIndonesian } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TicketData {
  ticketNumber: string;
  secretToken: string;
  lane: "MALE" | "FEMALE";
  laneCode: "P" | "W";
  laneLabel: string;
  status: "WAITING" | "CALLED" | "IN_THERAPY" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  serviceName: string;
  serviceDuration: number;
  roomName: string | null;
  roomNumber: number | null;
  therapistName: string | null;
  checkInTime: string;
  calledTime: string | null;
  peopleAhead: number;
  estimatedWaitMinutes: number;
  minEstimatedMinutes: number;
  maxEstimatedMinutes: number;
  statusLabel: string;
  clinic: {
    name: string;
    address: string;
    phone: string;
    hours: string;
  };
  preCuppingGuidelines: string[];
}

function TicketContent() {
  const params = useParams();
  const token = params?.token as string;

  const [ticket, setTicket] = React.useState<TicketData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const fetchTicket = React.useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(token)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Tiket tidak ditemukan.");
        setTicket(null);
      } else {
        setTicket(data.data);
        setError(null);
      }
    } catch {
      setError("Gagal memuat informasi tiket.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [token]);

  React.useEffect(() => {
    fetchTicket();
    // Auto-refresh every 12 seconds to track live queue progression
    const interval = setInterval(fetchTicket, 12000);
    return () => clearInterval(interval);
  }, [fetchTicket]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchTicket();
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          {/* Back link */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600 transition-colors"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-teal-600" : ""}`}
              />
              <span>Segarkan Status</span>
            </button>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin text-teal-600" />
              <p className="text-sm font-semibold text-slate-500">
                Memuat data tiket digital Anda...
              </p>
            </div>
          ) : error || !ticket ? (
            <Card className="border-rose-200 bg-white p-8 text-center dark:border-rose-900 dark:bg-slate-900">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Tiket Tidak Ditemukan
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                {error || "Nomor tiket atau token rahasia ini sudah tidak aktif atau salah ketik."}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/">
                  <Button size="sm">Kembali ke Beranda</Button>
                </Link>
                <Link href="/#registrasi">
                  <Button variant="outline" size="sm">
                    Daftar Antrean Baru
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            /* Digital Boarding Pass Ticket */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Callout alert when called */}
              {ticket.status === "CALLED" && (
                <div className="rounded-2xl border-2 border-sky-400 bg-sky-50 p-4 dark:border-sky-700 dark:bg-sky-950/60 flex items-center gap-3 animate-bounce">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white">
                    <Volume2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-sky-900 dark:text-sky-200">
                      GILIRAN ANDA TELAH DIPANGGIL!
                    </h4>
                    <p className="text-xs text-sky-700 dark:text-sky-300 font-medium">
                      Silakan langsung menuju ke{" "}
                      <strong>{ticket.roomName ?? "Ruang Terapi"}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Main Ticket Card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                {/* Ticket Top Header */}
                <div
                  className={`px-6 py-5 text-white ${
                    ticket.lane === "MALE"
                      ? "bg-gradient-to-r from-teal-800 to-teal-950"
                      : "bg-gradient-to-r from-emerald-800 to-emerald-950"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-teal-200">
                        Tiket Antrean Digital Klinik
                      </span>
                      <h2 className="text-base font-bold text-white">
                        {ticket.clinic.name}
                      </h2>
                    </div>
                    <Badge
                      variant={getStatusBadgeVariant(ticket.status)}
                      className="px-3 py-1 text-xs font-bold"
                    >
                      {getStatusLabelIndonesian(ticket.status)}
                    </Badge>
                  </div>
                </div>

                {/* Ticket Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Hero Queue Number */}
                  <div className="text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {ticket.laneLabel}
                    </p>
                    <div className="text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tight my-2">
                      {ticket.ticketNumber}
                    </div>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Check-in: {ticket.checkInTime} WIB
                    </p>
                  </div>

                  {/* Dynamic Wait Estimator Alert */}
                  {ticket.status === "WAITING" && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/60 dark:bg-amber-950/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                          <Clock className="h-4 w-4 text-amber-600" />
                          Estimasi Waktu Panggilan
                        </span>
                        <span className="text-sm font-black text-amber-900 dark:text-amber-200">
                          ± {ticket.minEstimatedMinutes} - {ticket.maxEstimatedMinutes} Menit
                        </span>
                      </div>
                      <p className="text-xs text-amber-800 dark:text-amber-300/80 leading-relaxed">
                        {ticket.statusLabel}
                      </p>
                    </div>
                  )}

                  {/* People Ahead & Room Info Grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                        <Users className="h-3.5 w-3.5 text-teal-600" />
                        <span>Antrean Di Depan</span>
                      </div>
                      <p className="text-lg font-black text-slate-900 dark:text-white">
                        {ticket.peopleAhead}{" "}
                        <span className="text-xs font-normal text-slate-500">
                          Orang
                        </span>
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Ruang Terapi</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {ticket.roomName ?? "Menunggu Alokasi"}
                      </p>
                    </div>
                  </div>

                  {/* Therapy Service Detail */}
                  <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Paket Terapi Terpilih
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {ticket.serviceName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Estimasi Durasi: {ticket.serviceDuration} Menit
                    </p>
                  </div>

                  {/* Pre-Cupping Guidelines */}
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/40 space-y-2.5">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-teal-600" />
                      Hal yang Perlu Disiapkan Sebelum Masuk:
                    </p>
                    <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {ticket.preCuppingGuidelines.map((guide, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{guide}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Sharing & Navigation Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                    <Button
                      variant="secondary"
                      onClick={handleShare}
                      className="flex-1 gap-2 text-xs"
                    >
                      <Share2 className="h-4 w-4 text-teal-600" />
                      {copied ? "Link Tersalin ke Clipboard!" : "Salin Link Tiket"}
                    </Button>
                    <a
                      href="https://share.google/eaQgQIzNPtGp7UVtq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-teal-300 dark:border-teal-800 bg-teal-50/60 dark:bg-teal-950/40 px-3.5 py-2 text-xs font-semibold text-teal-800 dark:text-teal-300 hover:bg-teal-100 transition-colors"
                    >
                      <MapPin className="h-3.5 w-3.5 text-teal-600" />
                      Rute Maps
                    </a>
                    <Button
                      variant="outline"
                      onClick={handleManualRefresh}
                      disabled={isRefreshing}
                      className="sm:w-auto text-xs gap-1.5"
                    >
                      <RefreshCw
                        className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                      />
                      Segarkan
                    </Button>
                  </div>
                </div>

                {/* Perforated Divider Visual Effect */}
                <div className="relative border-t-2 border-dashed border-slate-200 dark:border-slate-800">
                  <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800" />
                  <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800" />
                </div>

                {/* Ticket Bottom Security Stamp */}
                <div className="bg-slate-50 px-6 py-4 dark:bg-slate-900/80 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono text-[11px] truncate max-w-[200px]">
                    Token: {ticket.secretToken}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-teal-700 dark:text-teal-400 font-semibold">
                    <Sparkles className="h-3 w-3" />
                    Terverifikasi Aman
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function DigitalTicketPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] dark:bg-slate-950">
          <RefreshCw className="h-8 w-8 animate-spin text-teal-600" />
          <p className="mt-3 text-xs font-semibold text-slate-500">
            Menyiapkan tiket digital...
          </p>
        </div>
      }
    >
      <TicketContent />
    </React.Suspense>
  );
}

