"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  Users,
  Clock,
  Tv,
  DollarSign,
  ShieldCheck,
  CheckCircle,
  Play,
  RotateCcw,
  LogOut,
  Bed,
  Sparkles,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, getStatusBadgeVariant, getStatusLabelIndonesian } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INITIAL_QUEUES, LiveQueueTicket } from "@/lib/data/mock-data";
import { formatIDR } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [queues, setQueues] = React.useState<LiveQueueTicket[]>(INITIAL_QUEUES);
  const [selectedQueue, setSelectedQueue] = React.useState<LiveQueueTicket | null>(null);
  const [paymentSuccess, setPaymentSuccess] = React.useState<string | null>(null);

  // Status transitions
  const updateStatus = (
    queueId: string,
    newStatus: LiveQueueTicket["status"],
    roomName?: string
  ) => {
    setQueues((prev) =>
      prev.map((q) =>
        q.id === queueId
          ? {
              ...q,
              status: newStatus,
              roomName: roomName ?? q.roomName,
              calledTime:
                newStatus === "CALLED"
                  ? new Date().toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : q.calledTime,
            }
          : q
      )
    );
  };

  const waitingCount = queues.filter((q) => q.status === "WAITING").length;
  const inTherapyCount = queues.filter((q) => q.status === "IN_THERAPY").length;
  const completedCount = queues.filter((q) => q.status === "COMPLETED").length;
  const totalRevenue = completedCount * 95000 + inTherapyCount * 85000;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Admin Top Navigation */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white font-bold">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  BEKAM SMART QUEUE
                </span>
                <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  ADMIN & KASIR
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ustadz Hasan (Pemilik & Terapis) • Bekam Bintan Therapy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/tv-display" target="_blank">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Tv className="h-4 w-4 text-amber-500" />
                Display TV
              </Button>
            </Link>
            <Link href="/queue-board" target="_blank">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                Papan Antrean
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40">
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Antrean Menunggu</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {waitingCount} <span className="text-xs font-normal text-slate-500">Pasien</span>
            </p>
          </Card>

          <Card className="border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Sedang Terapi / Dipanggil</span>
              <Activity className="h-4 w-4 text-teal-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {inTherapyCount}{" "}
              <span className="text-xs font-normal text-slate-500">Bilik</span>
            </p>
          </Card>

          <Card className="border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Terapi Selesai Hari Ini</span>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
              {completedCount}{" "}
              <span className="text-xs font-normal text-slate-500">Sesi</span>
            </p>
          </Card>

          <Card className="border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Omset Transaksi Kasir</span>
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
              {formatIDR(totalRevenue)}
            </p>
          </Card>
        </div>

        {/* Room Status Modular Cards */}
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Bed className="h-5 w-5 text-teal-600" />
            Status Bilik Ruang Terapi (Dual-Lane)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border-2 border-teal-500/40 bg-white p-4 shadow-xs dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Ruang 1 (Ikhwan)
                </span>
                <Badge variant="in_therapy">OCCUPIED</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-2">Pasien Aktif: P-001</p>
              <p className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                Terapis Dani Pratama • 45m
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Ruang 2 (Ikhwan)
                </span>
                <Badge variant="called">CALLED</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-2">Menunggu Pasien: P-002</p>
              <p className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">
                Panggilan Ke-1
              </p>
            </div>

            <div className="rounded-2xl border-2 border-emerald-500/40 bg-white p-4 shadow-xs dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Ruang 3 (Akhwat)
                </span>
                <Badge variant="in_therapy">OCCUPIED</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-2">Pasien Aktif: W-001</p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                Terapis Siti Nurhaliza • 45m
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Ruang 4 (Akhwat)
                </span>
                <Badge variant="cleaning">STERILISASI</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-2">Ganti Linen & Sanitasi</p>
              <p className="text-[11px] text-purple-700 dark:text-purple-400 font-medium">
                Siap Dalam ± 5 Menit
              </p>
            </div>
          </div>
        </div>

        {/* Live Queue Operations Table */}
        <Card className="border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Kelola Antrean Pasien
              </h3>
              <p className="text-xs text-slate-500">
                Panggil antrean, alokasikan ke bilik terapi, atau selesaikan sesi
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">No. Tiket</th>
                  <th className="px-6 py-3.5">Pasien</th>
                  <th className="px-6 py-3.5">Jalur</th>
                  <th className="px-6 py-3.5">Layanan</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {queues.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-4 font-mono font-bold text-base text-slate-900 dark:text-white">
                      {item.ticketNumber}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {item.maskedPatientName}
                      </p>
                      <p className="text-[11px] text-slate-400">Masuk: {item.checkInTime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-teal-700 dark:text-teal-400">
                        {item.lane === "MALE" ? "Ikhwan (P)" : "Akhwat (W)"}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[220px]">
                      <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                        {item.serviceName}
                      </p>
                      <p className="text-[11px] text-slate-400">{item.serviceDuration} Menit</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusBadgeVariant(item.status)}>
                        {getStatusLabelIndonesian(item.status)}
                      </Badge>
                      {item.roomName && (
                        <p className="text-[10px] text-slate-400 mt-0.5">{item.roomName}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {item.status === "WAITING" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatus(
                              item.id,
                              "CALLED",
                              item.lane === "MALE"
                                ? "Ruang Terapi 2 (Ikhwan)"
                                : "Ruang Terapi 3 (Akhwat)"
                            )
                          }
                          className="text-xs bg-sky-600 hover:bg-sky-700"
                        >
                          Panggil
                        </Button>
                      )}

                      {item.status === "CALLED" && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(item.id, "IN_THERAPY")}
                          className="text-xs bg-emerald-600 hover:bg-emerald-700"
                        >
                          Mulai Terapi
                        </Button>
                      )}

                      {item.status === "IN_THERAPY" && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(item.id, "COMPLETED")}
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-white"
                        >
                          Selesai
                        </Button>
                      )}

                      {item.status === "COMPLETED" && (
                        <span className="text-[11px] font-bold text-emerald-600">
                          Siap Bayar Kasir
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}
