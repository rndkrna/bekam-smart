"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, getStatusBadgeVariant, getStatusLabelIndonesian } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INITIAL_QUEUES, LiveQueueTicket } from "@/lib/data/mock-data";
import { calculateEstimatedWait, formatWaitDuration } from "@/lib/utils/queue-estimator";

export function LiveQueueWidget() {
  const [queues, setQueues] = React.useState<LiveQueueTicket[]>(INITIAL_QUEUES);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState<string>("Baru saja");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/queues");
      if (res.ok) {
        const json = await res.json();
        if (json.data?.queues) {
          setQueues(json.data.queues);
        }
      }
    } catch {
      // Fallback
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
        setLastUpdated(
          new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      }, 500);
    }
  };

  // Lane Pria (P)
  const maleWaiting = queues.filter((q) => q.lane === "MALE" && q.status === "WAITING");
  const maleActive =
    queues.find((q) => q.lane === "MALE" && q.status === "CALLED") ??
    queues.find((q) => q.lane === "MALE" && q.status === "IN_THERAPY");
  const maleWaitEst = calculateEstimatedWait(maleWaiting.length, {
    lane: "MALE",
    activeRooms: 2,
    averageServiceDurationMinutes: 45,
  });

  // Lane Wanita (W)
  const femaleWaiting = queues.filter((q) => q.lane === "FEMALE" && q.status === "WAITING");
  const femaleActive =
    queues.find((q) => q.lane === "FEMALE" && q.status === "CALLED") ??
    queues.find((q) => q.lane === "FEMALE" && q.status === "IN_THERAPY");
  const femaleWaitEst = calculateEstimatedWait(femaleWaiting.length, {
    lane: "FEMALE",
    activeRooms: 2,
    averageServiceDurationMinutes: 45,
  });

  return (
    <section id="antrean-live" className="py-12 md:py-16 bg-slate-50 dark:bg-slate-900/60 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title with Refresh */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-1.5">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Queue Status
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Monitor Antrean Real-Time Dual-Lane
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Pemisahan jalur fisik & antrean Ikhwan dan Akhwat untuk kenyamanan dan privasi penuh.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              Update: {lastUpdated}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-1.5 border-slate-300 dark:border-slate-700 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-teal-600" : ""}`} />
              Segarkan
            </Button>
            <Link href="/queue-board">
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                Papan Penuh
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Dual Lane Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ======================================================== */}
          {/* JALUR PRIA (P) */}
          {/* ======================================================== */}
          <Card className="overflow-hidden border-2 border-teal-600/30 dark:border-teal-700/40 shadow-md">
            {/* Card Header Banner */}
            <div className="bg-gradient-to-r from-teal-800 to-teal-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white font-black text-lg border border-white/20">
                  P
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Jalur Pria (Ikhwan)
                  </h3>
                  <p className="text-xs text-teal-200">
                    Ditangani Terapis Pria Bersertifikat ITBI
                  </p>
                </div>
              </div>
              <Badge variant="in_therapy" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/40">
                2 Ruang Aktif
              </Badge>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Serving Highlight Box */}
              <div className="rounded-2xl bg-teal-50/70 p-5 border border-teal-100 dark:bg-teal-950/30 dark:border-teal-900/40">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                  Sedang Dilayani / Dipanggil
                </p>
                <div className="mt-2 flex items-baseline justify-between">
                  <div>
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                      {maleActive ? maleActive.ticketNumber : "Belum Ada"}
                    </span>
                    {maleActive && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                        {maleActive.roomName} • {maleActive.serviceName}
                      </p>
                    )}
                  </div>
                  {maleActive && (
                    <Badge variant={getStatusBadgeVariant(maleActive.status)} className="text-sm px-3 py-1">
                      {getStatusLabelIndonesian(maleActive.status)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Waiting Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                    <Users className="h-4 w-4 text-teal-600" />
                    <span>Dalam Antrean</span>
                  </div>
                  <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                    {maleWaiting.length} <span className="text-xs font-normal text-slate-500">Orang</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span>Estimasi Tunggu</span>
                  </div>
                  <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                    {formatWaitDuration(maleWaitEst.minEstimatedMinutes, maleWaitEst.maxEstimatedMinutes)}
                  </p>
                </div>
              </div>

              {/* Next In Line List */}
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Nomor Berikutnya Dalam Antrean:
                </p>
                <div className="space-y-2">
                  {maleWaiting.slice(0, 3).map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900/60"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.ticketNumber}
                        </span>
                        <span className="text-slate-500 truncate max-w-[140px] sm:max-w-[200px]">
                          {item.serviceName}
                        </span>
                      </div>
                      <Badge variant="waiting">Menunggu</Badge>
                    </div>
                  ))}
                  {maleWaiting.length === 0 && (
                    <p className="text-xs text-slate-400 italic py-2">
                      Tidak ada antrean tunggu untuk jalur Ikhwan saat ini.
                    </p>
                  )}
                </div>
              </div>

              {/* Register CTA for this lane */}
              <Link href="/#registrasi" className="block">
                <Button variant="outline" className="w-full text-xs gap-1.5 border-teal-300 text-teal-800 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-300">
                  <UserCheck className="h-4 w-4" />
                  Daftar Jalur Pria (Ikhwan)
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* ======================================================== */}
          {/* JALUR WANITA (W) */}
          {/* ======================================================== */}
          <Card className="overflow-hidden border-2 border-emerald-600/30 dark:border-emerald-700/40 shadow-md">
            {/* Card Header Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white font-black text-lg border border-white/20">
                  W
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Jalur Wanita (Akhwat)
                  </h3>
                  <p className="text-xs text-emerald-200">
                    Ditangani Terapis Wanita Bersertifikat ITBI
                  </p>
                </div>
              </div>
              <Badge variant="in_therapy" className="bg-emerald-500/20 text-emerald-300 border-emerald-400/40">
                2 Ruang Aktif
              </Badge>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Serving Highlight Box */}
              <div className="rounded-2xl bg-emerald-50/70 p-5 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/40">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Sedang Dilayani / Dipanggil
                </p>
                <div className="mt-2 flex items-baseline justify-between">
                  <div>
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                      {femaleActive ? femaleActive.ticketNumber : "Belum Ada"}
                    </span>
                    {femaleActive && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                        {femaleActive.roomName} • {femaleActive.serviceName}
                      </p>
                    )}
                  </div>
                  {femaleActive && (
                    <Badge variant={getStatusBadgeVariant(femaleActive.status)} className="text-sm px-3 py-1">
                      {getStatusLabelIndonesian(femaleActive.status)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Waiting Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                    <Users className="h-4 w-4 text-emerald-600" />
                    <span>Dalam Antrean</span>
                  </div>
                  <p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
                    {femaleWaiting.length} <span className="text-xs font-normal text-slate-500">Orang</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span>Estimasi Tunggu</span>
                  </div>
                  <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                    {formatWaitDuration(femaleWaitEst.minEstimatedMinutes, femaleWaitEst.maxEstimatedMinutes)}
                  </p>
                </div>
              </div>

              {/* Next In Line List */}
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Nomor Berikutnya Dalam Antrean:
                </p>
                <div className="space-y-2">
                  {femaleWaiting.slice(0, 3).map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-3.5 py-2.5 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900/60"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.ticketNumber}
                        </span>
                        <span className="text-slate-500 truncate max-w-[140px] sm:max-w-[200px]">
                          {item.serviceName}
                        </span>
                      </div>
                      <Badge variant="waiting">Menunggu</Badge>
                    </div>
                  ))}
                  {femaleWaiting.length === 0 && (
                    <p className="text-xs text-slate-400 italic py-2">
                      Tidak ada antrean tunggu untuk jalur Akhwat saat ini.
                    </p>
                  )}
                </div>
              </div>

              {/* Register CTA for this lane */}
              <Link href="/#registrasi" className="block">
                <Button variant="outline" className="w-full text-xs gap-1.5 border-emerald-300 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300">
                  <UserCheck className="h-4 w-4" />
                  Daftar Jalur Wanita (Akhwat)
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
