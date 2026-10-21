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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TherapistDashboardPage() {
  const [systolicBP, setSystolicBP] = React.useState<number>(120);
  const [diastolicBP, setDiastolicBP] = React.useState<number>(80);
  const [pulseRate, setPulseRate] = React.useState<number>(75);
  const [cupQuantity, setCupQuantity] = React.useState<number>(12);
  const [selectedPoints, setSelectedPoints] = React.useState<string[]>([
    "Al-Kahil (Punggung Atas)",
    "Al-Akhda'ain (Leher Kiri & Kanan)",
    "Al-Katifain (Belikat / Bahu)",
  ]);
  const [therapistNotes, setTherapistNotes] = React.useState<string>(
    "Darah statis pekat di area belikat dan leher. Pasien mengeluhkan ketegangan akibat stres kerja."
  );
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const pointsList = [
    "Al-Kahil (Punggung Atas)",
    "Al-Akhda'ain (Leher Kiri & Kanan)",
    "Al-Katifain (Belikat / Bahu)",
    "Al-Warak (Pinggang)",
    "Ummu Mughits (Puncak Kepala)",
    "Az-Zhohrul Qodam (Punggung Kaki)",
  ];

  const togglePoint = (point: string) => {
    setSelectedPoints((prev) =>
      prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]
    );
  };

  const handleSaveScreening = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900 sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white font-bold">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  WORKSPACE TERAPIS
                </span>
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  RUANG TERAPI 1 (IKHWAN)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ustadz Hasan (Praktisi ITBI Bintan • STPT No. 001/Yankes/Batra/VII/2013)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/queue-board" target="_blank">
              <Button variant="outline" size="sm" className="text-xs">
                Papan Antrean
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs text-rose-600 gap-1">
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Active Patient & Screening Form (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Patient Card */}
          <Card className="border-2 border-emerald-600 bg-white dark:bg-slate-900 shadow-md">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
                  Pasien Aktif di Bed Terapi
                </span>
                <h2 className="text-3xl font-black text-white mt-1">
                  P-001 • Ahmad R***
                </h2>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Paket: Bekam Sunnah Standar (10-12 Titik) • Check-in: 08:15 WIB
                </p>
              </div>
              <Badge variant="in_therapy" className="text-xs px-3 py-1">
                Sedang Tindakan (32 Menit Berjalan)
              </Badge>
            </div>

            <CardContent className="p-6">
              {savedSuccess && (
                <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>
                    Rekam medis & vital signs berhasil disimpan ke sistem klinik!
                  </span>
                </div>
              )}

              <form onSubmit={handleSaveScreening} className="space-y-6">
                {/* Vital Signs Grid */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-rose-600" />
                    Pemeriksaan Tanda Vital Pra-Bekam (Wajib)
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Sistolik (mmHg)
                      </label>
                      <Input
                        type="number"
                        value={systolicBP}
                        onChange={(e) => setSystolicBP(Number(e.target.value))}
                        required
                        className="font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Diastolik (mmHg)
                      </label>
                      <Input
                        type="number"
                        value={diastolicBP}
                        onChange={(e) => setDiastolicBP(Number(e.target.value))}
                        required
                        className="font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Denyut Nadi (bpm)
                      </label>
                      <Input
                        type="number"
                        value={pulseRate}
                        onChange={(e) => setPulseRate(Number(e.target.value))}
                        className="font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-2 font-medium flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Tekanan darah normal (120/80 mmHg) — Pasien memenuhi syarat tindakan bekam basah.
                  </p>
                </div>

                {/* Titik Bekam Yang Dipilih */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-teal-600" />
                    Titik Sunnah / Anatomi Yang Diaplikasikan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {pointsList.map((point) => {
                      const isSelected = selectedPoints.includes(point);
                      return (
                        <button
                          key={point}
                          type="button"
                          onClick={() => togglePoint(point)}
                          className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs font-medium transition-colors ${
                            isSelected
                              ? "border-teal-600 bg-teal-50 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                          }`}
                        >
                          <span>{point}</span>
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-teal-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Jumlah Kop Digunakan */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah Kop Steril Digunakan (Sekali Pakai)
                  </label>
                  <Input
                    type="number"
                    value={cupQuantity}
                    onChange={(e) => setCupQuantity(Number(e.target.value))}
                    className="max-w-[140px]"
                  />
                </div>

                {/* Catatan Tindakan / Anamnesis */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Catatan Klinis Terapis (Respons Pasien & Darah Statis)
                  </label>
                  <textarea
                    rows={3}
                    value={therapistNotes}
                    onChange={(e) => setTherapistNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                {/* Save CTA */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button type="submit" size="sm" className="gap-2">
                    <Save className="h-4 w-4" />
                    Simpan Catatan Skrining
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    className="bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    Selesaikan Sesi & Kirim ke Kasir
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Next Assigned Queue & Protocols (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600" />
                Antrean Jalur Ikhwan Berikutnya
              </h3>
            </div>
            <CardContent className="p-5 space-y-3">
              <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-black text-slate-900 dark:text-white">
                    P-002
                  </span>
                  <Badge variant="called">DIPANGGIL</Badge>
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Fajar S*** (0857***)
                </p>
                <p className="text-[11px] text-slate-500">
                  Bekam Komprehensif + Ruqyah • 60m
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3.5 dark:border-slate-800 space-y-1 opacity-70">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-black text-slate-900 dark:text-white">
                    P-003
                  </span>
                  <Badge variant="waiting">MENUNGGU</Badge>
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Budi H*** (0813***)
                </p>
                <p className="text-[11px] text-slate-500">
                  Bekam Sunnah Standar • 45m
                </p>
              </div>
            </CardContent>
          </Card>

          {/* SOP ITBI Checklist reminder */}
          <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-5 dark:border-teal-900 dark:bg-teal-950/30 space-y-2.5 text-xs text-teal-900 dark:text-teal-200">
            <div className="flex items-center gap-2 font-bold text-teal-950 dark:text-teal-100">
              <ShieldAlert className="h-4 w-4 text-teal-700" />
              Protokol Sterilisasi SOP ITBI & Dinkes Bintan
            </div>
            <ul className="space-y-1.5 text-[11px] text-teal-800 dark:text-teal-300">
              <li>• Selalu gunakan sarung tangan nitril medis baru</li>
              <li>• Disinfeksi kulit dengan povidone iodine / alkohol 70%</li>
              <li>• Sayatan jarum dangkal (kedalaman 0.1 - 0.5 mm)</li>
              <li>• Buang bisturi/jarum ke sharp waste container</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
