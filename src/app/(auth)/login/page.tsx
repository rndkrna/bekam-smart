"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("admin@bekamsmart.com");
  const [password, setPassword] = React.useState("password123");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleLogin = (e?: React.FormEvent, targetEmail?: string) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const checkEmail = (targetEmail ?? email).toLowerCase().trim();

    setTimeout(() => {
      setIsLoading(false);
      if (checkEmail.includes("admin")) {
        router.push("/admin");
      } else if (checkEmail.includes("terapis")) {
        router.push("/therapist");
      } else {
        setErrorMessage("Email atau kata sandi tidak terdaftar.");
      }
    }, 600);
  };

  const handleQuickDemo = (roleEmail: string) => {
    setEmail(roleEmail);
    handleLogin(undefined, roleEmail);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#F8FAFC] dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-700 dark:text-slate-400 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda Pasien
        </Link>

        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white shadow-xl shadow-teal-700/20">
            <Activity className="h-8 w-8" />
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Portal Staf Medis & Terapi
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
          Masuk untuk mengelola ruang antrean, anamnesis skrining, dan kasir
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Akun Staf
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@bekamsmart.com"
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kata Sandi
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  icon={<Lock className="h-4 w-4" />}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-bold gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    Masuk ke Sistem
                  </>
                )}
              </Button>
            </form>

            {/* Quick Demo Staff Logins */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Pilih Akses Cepat Simulasi:
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("admin@bekamsmart.com")}
                  className="w-full flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/60 p-3 text-left hover:bg-teal-100/80 transition-colors text-xs dark:border-teal-900 dark:bg-teal-950/30"
                >
                  <div>
                    <p className="font-bold text-teal-900 dark:text-teal-200">
                      1. Akses Admin & Kasir
                    </p>
                    <p className="text-[11px] text-teal-700 dark:text-teal-400">
                      Ustadz H. Ahmad Ridwan (Klinik Head)
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-teal-600" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo("terapis.ikhwan@bekamsmart.com")}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-left hover:bg-slate-100 transition-colors text-xs dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      2. Akses Terapis Ikhwan (P)
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Ustadz Hasan (Praktisi ITBI Bintan)
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemo("terapis.akhwat@bekamsmart.com")}
                  className="w-full flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-left hover:bg-emerald-100/80 transition-colors text-xs dark:border-emerald-900 dark:bg-emerald-950/30"
                >
                  <div>
                    <p className="font-bold text-emerald-900 dark:text-emerald-200">
                      3. Akses Terapis Akhwat (W)
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Ummu Aisyah (Kepala Terapis Akhwat)
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-emerald-600" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
