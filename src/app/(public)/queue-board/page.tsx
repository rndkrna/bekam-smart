"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  Users,
  Clock,
  RefreshCw,
  Search,
  ExternalLink,
  Tv,
  Filter,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, getStatusBadgeVariant, getStatusLabelIndonesian } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INITIAL_QUEUES, LiveQueueTicket } from "@/lib/data/mock-data";

export default function PublicQueueBoardPage() {
  const [queues, setQueues] = React.useState<LiveQueueTicket[]>(INITIAL_QUEUES);
  const [laneFilter, setLaneFilter] = React.useState<"ALL" | "MALE" | "FEMALE">("ALL");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

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
        setTimeout(() => setIsRefreshing(false), 400);
      }
    }
  }, []);

  React.useEffect(() => {
    handleRefresh(true);
    const interval = setInterval(() => handleRefresh(true), 3000);
    return () => clearInterval(interval);
  }, [handleRefresh]);

  const filtered = queues.filter((q) => {
    if (laneFilter !== "ALL" && q.lane !== laneFilter) return false;
    if (statusFilter !== "ALL" && q.status !== statusFilter) return false;
    if (
      searchQuery &&
      !q.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !q.maskedPatientName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const maleQueues = filtered.filter((q) => q.lane === "MALE");
  const femaleQueues = filtered.filter((q) => q.lane === "FEMALE");

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Top Board Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                <Activity className="h-4 w-4" />
                Papan Pemanggilan Publik
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Papan Antrean Terbuka
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Informasi status panggilan seluruh pasien secara real-time. Identitas nama disamarkan untuk privasi medis.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRefresh(false)}
                disabled={isRefreshing}
                className="gap-1.5"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin text-teal-600" : ""}`}
                />
                Perbarui Data
              </Button>

              <Link href="/tv-display" target="_blank">
                <Button size="sm" className="gap-1.5 bg-slate-900 hover:bg-slate-800 text-white">
                  <Tv className="h-4 w-4 text-amber-400" />
                  Buka Display TV
                </Button>
              </Link>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs dark:bg-slate-900 dark:border-slate-800">
            <div className="w-full sm:w-72">
              <Input
                type="text"
                placeholder="Cari kode tiket (P-001, W-002)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-4 w-4" />}
                className="h-10 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" />
                Jalur:
              </span>
              <button
                onClick={() => setLaneFilter("ALL")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  laneFilter === "ALL"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setLaneFilter("MALE")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  laneFilter === "MALE"
                    ? "bg-teal-700 text-white"
                    : "bg-teal-50 text-teal-800 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300"
                }`}
              >
                Pria (P)
              </button>
              <button
                onClick={() => setLaneFilter("FEMALE")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  laneFilter === "FEMALE"
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                }`}
              >
                Wanita (W)
              </button>
            </div>
          </div>

          {/* Dual Lane Board Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lane Pria Column */}
            {(laneFilter === "ALL" || laneFilter === "MALE") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-teal-800 text-white px-5 py-3 rounded-xl shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 font-black text-sm">
                      P
                    </span>
                    <h2 className="text-sm font-bold uppercase tracking-wider">
                      Jalur Pria (Ikhwan)
                    </h2>
                  </div>
                  <span className="text-xs text-teal-200">
                    {maleQueues.length} Antrean Terdaftar
                  </span>
                </div>

                <div className="space-y-3">
                  {maleQueues.map((item) => (
                    <Card
                      key={item.id}
                      className={`transition-all hover:shadow-md ${
                        item.status === "CALLED"
                          ? "border-2 border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 ring-2 ring-sky-400/20"
                          : item.status === "IN_THERAPY"
                          ? "border-emerald-300 bg-emerald-50/20 dark:border-emerald-800"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">
                              {item.ticketNumber}
                            </span>
                            <Badge variant={getStatusBadgeVariant(item.status)}>
                              {getStatusLabelIndonesian(item.status)}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            {item.serviceName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {item.maskedPatientName} • Masuk: {item.checkInTime}
                            {item.roomName && ` • ${item.roomName}`}
                          </p>
                        </div>

                        <Link href={`/ticket/${item.secretToken}`}>
                          <Button variant="outline" size="sm" className="text-xs gap-1">
                            Lihat
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                  {maleQueues.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
                      Tidak ada antrean yang cocok dengan filter.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Lane Wanita Column */}
            {(laneFilter === "ALL" || laneFilter === "FEMALE") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-emerald-800 text-white px-5 py-3 rounded-xl shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20 font-black text-sm">
                      W
                    </span>
                    <h2 className="text-sm font-bold uppercase tracking-wider">
                      Jalur Wanita (Akhwat)
                    </h2>
                  </div>
                  <span className="text-xs text-emerald-200">
                    {femaleQueues.length} Antrean Terdaftar
                  </span>
                </div>

                <div className="space-y-3">
                  {femaleQueues.map((item) => (
                    <Card
                      key={item.id}
                      className={`transition-all hover:shadow-md ${
                        item.status === "CALLED"
                          ? "border-2 border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 ring-2 ring-sky-400/20"
                          : item.status === "IN_THERAPY"
                          ? "border-emerald-300 bg-emerald-50/20 dark:border-emerald-800"
                          : "border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-slate-900 dark:text-white">
                              {item.ticketNumber}
                            </span>
                            <Badge variant={getStatusBadgeVariant(item.status)}>
                              {getStatusLabelIndonesian(item.status)}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            {item.serviceName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {item.maskedPatientName} • Masuk: {item.checkInTime}
                            {item.roomName && ` • ${item.roomName}`}
                          </p>
                        </div>

                        <Link href={`/ticket/${item.secretToken}`}>
                          <Button variant="outline" size="sm" className="text-xs gap-1">
                            Lihat
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                  {femaleQueues.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
                      Tidak ada antrean yang cocok dengan filter.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
