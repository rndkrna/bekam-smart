"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Ticket,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INITIAL_SERVICES } from "@/lib/data/mock-data";
import { formatIDR } from "@/lib/utils";

interface RegistrationFormProps {
  initialServiceId?: string;
}

export function RegistrationForm({ initialServiceId }: RegistrationFormProps) {
  const router = useRouter();

  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gender, setGender] = React.useState<"MALE" | "FEMALE">("MALE");
  const [serviceId, setServiceId] = React.useState(
    initialServiceId ?? INITIAL_SERVICES[0].id
  );
  const [complaints, setComplaints] = React.useState("");
  const [hasEatenMeal, setHasEatenMeal] = React.useState(true);
  const [contraindicationConfirmed, setContraindicationConfirmed] =
    React.useState(true);

  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = React.useState<{
    ticketNumber: string;
    secretToken: string;
    lane: string;
    serviceName: string;
    price: number;
    estimatedWaitMinutes: number;
    minEstimatedMinutes: number;
    maxEstimatedMinutes: number;
    peopleAhead: number;
    ticketUrl: string;
  } | null>(null);

  // Sync when initialServiceId prop changes
  React.useEffect(() => {
    if (initialServiceId) {
      setServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

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
          hasEatenMeal,
          contraindicationConfirmed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data.error || "Gagal mendaftarkan antrean. Periksa kembali isian formulir."
        );
        setIsLoading(false);
        return;
      }

      setCreatedTicket(data.data);
    } catch {
      setErrorMessage(
        "Gagal terhubung ke server antrean. Silakan periksa koneksi internet Anda."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedServiceObj = INITIAL_SERVICES.find((s) => s.id === serviceId);

  return (
    <section
      id="registrasi"
      className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-teal-50/50 dark:from-slate-900 dark:to-slate-950 scroll-mt-20"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3.5 py-1 text-xs font-bold text-teal-800 dark:border-teal-800 dark:bg-slate-900 dark:text-teal-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Pendaftaran Mandiri Pasien (Tanpa Buat Akun)
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Ambil Tiket Antrean Online
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Isi data singkat berikut untuk menerima tiket digital interaktif langsung di peramban Anda.
          </p>
        </div>

        {/* Success Ticket Created State */}
        {createdTicket ? (
          <Card className="border-2 border-emerald-500 bg-white dark:bg-slate-900 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-teal-800 to-emerald-800 p-6 text-white text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 border border-white/30">
                <CheckCircle className="h-8 w-8 text-emerald-300" />
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white">
                Pendaftaran Antrean Berhasil!
              </h3>
              <p className="text-xs text-teal-200 mt-1">
                Simpan nomor antrean Anda atau klik tombol di bawah untuk melihat tiket digital
              </p>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Ticket Hero Number */}
              <div className="text-center rounded-2xl bg-teal-50/60 p-6 border border-teal-100 dark:bg-teal-950/40 dark:border-teal-900">
                <span className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
                  Nomor Antrean Anda
                </span>
                <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white my-2 tracking-tight">
                  {createdTicket.ticketNumber}
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {createdTicket.lane === "MALE"
                    ? "Jalur Ikhwan (Pria) • Ruang Terapi Pria"
                    : "Jalur Akhwat (Wanita) • Ruang Terapi Wanita"}
                </p>
              </div>

              {/* Detail Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <span className="text-slate-500 block">Layanan Terapi</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {createdTicket.serviceName}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <span className="text-slate-500 block">Biaya Estimasi</span>
                  <span className="font-bold text-teal-700 dark:text-teal-400 mt-0.5 block">
                    {formatIDR(createdTicket.price)}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <span className="text-slate-500 block">Antrean Di Depan Anda</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                    {createdTicket.peopleAhead} Orang
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <span className="text-slate-500 block">Estimasi Waktu Tunggu</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                    ± {createdTicket.minEstimatedMinutes} - {createdTicket.maxEstimatedMinutes} Menit
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href={createdTicket.ticketUrl} className="flex-1">
                  <Button size="lg" className="w-full gap-2 text-sm font-bold">
                    <Ticket className="h-5 w-5" />
                    Buka Tiket Digital Saya
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setCreatedTicket(null);
                    setFullName("");
                    setPhone("");
                  }}
                  className="sm:w-auto text-xs"
                >
                  Daftar Antrean Lain
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Main Input Form */
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
                    <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* 1. Pilih Jalur Gender (Pria 'P' vs Wanita 'W') */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    1. Pilih Jalur Terapi (Wajib Sesuai Gender) *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setGender("MALE")}
                      className={`flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                        gender === "MALE"
                          ? "border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 dark:border-teal-500"
                          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg font-black text-sm ${
                            gender === "MALE"
                              ? "bg-teal-700 text-white"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          P
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            Jalur Pria (Ikhwan)
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Terapis Pria • Kode P
                          </p>
                        </div>
                      </div>
                      {gender === "MALE" && (
                        <CheckCircle className="h-5 w-5 text-teal-600" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender("FEMALE")}
                      className={`flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                        gender === "FEMALE"
                          ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 dark:border-emerald-500"
                          : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg font-black text-sm ${
                            gender === "FEMALE"
                              ? "bg-emerald-700 text-white"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          W
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            Jalur Wanita (Akhwat)
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Terapis Wanita • Kode W
                          </p>
                        </div>
                      </div>
                      {gender === "FEMALE" && (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Nama Lengkap & No WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Nama Lengkap Pasien *
                    </label>
                    <Input
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      icon={<User className="h-4 w-4" />}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Nomor WhatsApp / HP Aktif *
                    </label>
                    <Input
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      icon={<Phone className="h-4 w-4" />}
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Digunakan untuk konfirmasi dan panggilan giliran antrean
                    </p>
                  </div>
                </div>

                {/* 3. Paket Layanan Bekam */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Pilihan Paket Layanan Bekam *
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 transition-colors focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  >
                    {INITIAL_SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {formatIDR(s.price)} ({s.durationMinutes} Menit)
                      </option>
                    ))}
                  </select>
                  {selectedServiceObj && (
                    <div className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-400 flex items-center justify-between">
                      <span>{selectedServiceObj.description}</span>
                      <span className="font-bold text-teal-700 dark:text-teal-400 whitespace-nowrap ml-2">
                        {formatIDR(selectedServiceObj.price)}
                      </span>
                    </div>
                  )}
                </div>

                {/* 4. Keluhan / Anamnesis Awal */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Keluhan Utama / Area yang Dirasa Sakit (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={complaints}
                    onChange={(e) => setComplaints(e.target.value)}
                    placeholder="Contoh: Leher belakang kaku, migrain sejak 2 hari, pegal pinggang bawah..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 transition-colors focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* 5. Pre-cupping health checklist */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    Persetujuan Skrining Kesehatan Pra-Bekam (SOP ITBI & Dinkes Bintan)
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasEatenMeal}
                      onChange={(e) => setHasEatenMeal(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>
                      Saya sudah makan ringan (tidak dalam kondisi perut kosong total atau kenyang berat 1 jam terakhir).
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={contraindicationConfirmed}
                      onChange={(e) => setContraindicationConfirmed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>
                      Saya menyatakan tidak menderita gangguan pembekuan darah (hemofilia) berat atau sedang mengonsumsi antikoagulan dosis tinggi tanpa rekomendasi dokter.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full text-base font-bold gap-2 py-3.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Menerbitkan Nomor Antrean...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Dapatkan Nomor Antrean Sekarang
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
