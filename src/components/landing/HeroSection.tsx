"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  Clock,
  HeartPulse,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onOpenLookup: () => void;
}

export function HeroSection({ onOpenLookup }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-slate-50 pt-8 pb-16 md:pt-14 md:pb-24 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 blur-3xl">
        <div className="absolute -top-12 left-1/4 h-72 w-72 rounded-full bg-teal-300 dark:bg-teal-900/40" />
        <div className="absolute top-10 right-1/4 h-80 w-80 rounded-full bg-emerald-200 dark:bg-emerald-900/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/90 px-4 py-1.5 text-xs font-semibold text-teal-800 shadow-sm backdrop-blur-sm dark:border-teal-800 dark:bg-slate-900/90 dark:text-teal-300">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Sistem Antrean Digital Dual-Lane (Pria & Wanita)</span>
            <span className="hidden sm:inline text-teal-300 dark:text-teal-700">•</span>
            <span className="hidden sm:inline font-normal text-slate-600 dark:text-slate-400">
              Bekam Bintan Therapy • Bintan
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white leading-[1.15]">
            Terapi Bekam Sunnah Nyaman,{" "}
            <span className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-400">
              Bebas Antre Berdesakan
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Daftar antrean dari mana saja tanpa perlu membuat akun. Dapatkan{" "}
            <strong>tiket digital instan</strong> dengan estimasi waktu tunggu
            real-time per jalur khusus Ikhwan (P) & Akhwat (W) yang terpisah dan
            privat.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="#registrasi" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-8 py-3.5 shadow-lg shadow-teal-700/20">
                Ambil Nomor Antrean Sekarang
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="#antrean-live" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto gap-2 text-base border-slate-300 dark:border-slate-700 hover:border-teal-500"
              >
                <Clock className="h-5 w-5 text-teal-600" />
                Pantau Antrean Live
              </Button>
            </Link>

            <Button
              variant="secondary"
              size="lg"
              onClick={onOpenLookup}
              className="w-full sm:w-auto gap-2 text-base"
            >
              <Search className="h-5 w-5 text-slate-500" />
              Cek Tiket Saya
            </Button>
          </div>

          {/* Trust Value Badges */}
          <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3 shadow-xs border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
              <div className="rounded-lg bg-teal-50 p-2 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Jalur Terpisah
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Ikhwan (P) & Akhwat (W)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3 shadow-xs border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  100% Steril
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Jarum & Kop Sekali Pakai
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3 shadow-xs border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
              <div className="rounded-lg bg-amber-50 p-2 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Live Estimasi
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Waktu Tunggu Dinamis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/70 p-3 shadow-xs border border-slate-100 dark:bg-slate-900/60 dark:border-slate-800">
              <div className="rounded-lg bg-sky-50 p-2 text-sky-700 dark:bg-sky-950 dark:text-sky-400">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Terapis Ahli
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Anggota Resmi ITBI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
