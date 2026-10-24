"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  Tv,
  Search,
  LogIn,
  Clock,
  Sparkles,
  Menu,
  X,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketLookupModal } from "@/components/landing/TicketLookupModal";

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isLookupOpen, setIsLookupOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/95"
            : "bg-white/80 backdrop-blur-sm dark:bg-slate-950/80"
        }`}
      >
        {/* Top Info Bar */}
        <div className="hidden border-b border-teal-800/10 bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 px-4 py-1.5 text-xs text-teal-100 sm:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-teal-300" />
                Praktek Setiap Hari: 09:00 - 22:00 WIB
              </span>
              <span className="text-teal-400">•</span>
              <Link
                href="/legalitas"
                className="flex items-center gap-1.5 text-teal-200 hover:text-white transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                STPT Dinkes Bintan No. 001/Yankes/Batra/VII/2013 • Anggota ITBI
              </Link>
            </div>
            <div className="flex items-center gap-4 text-teal-200">
              <span>WA Pria: 0812-6832-0072 • WA Wanita: 0812-7530-2567</span>
              <Link
                href="/login"
                className="hover:text-white transition-colors flex items-center gap-1 text-teal-300 font-medium"
              >
                <LogIn className="h-3 w-3" />
                Portal Tenaga Medis
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  BEKAM<span className="text-teal-600 dark:text-teal-400">SMART</span>
                </span>
                <span className="rounded-md bg-teal-100 px-1.5 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  BINTAN
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Bekam Bintan Therapy • Tanjung Uban & Seri Kuala Lobam
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/profil"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Profil Klinik
            </Link>
            <Link
              href="/legalitas"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              Legalitas
            </Link>
            <Link
              href="/antrean#antrean"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Antrean Live
            </Link>
            <Link
              href="/antrean#layanan"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Paket Layanan
            </Link>
            <Link
              href="/queue-board"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Activity className="h-4 w-4 text-teal-600" />
              Papan Antrean
            </Link>
            <Link
              href="/tv-display"
              target="_blank"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Tv className="h-4 w-4 text-amber-600" />
              Display TV
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLookupOpen(true)}
              className="gap-1.5 border-slate-300 text-slate-700 hover:border-teal-500 hover:text-teal-700"
            >
              <Search className="h-4 w-4 text-teal-600" />
              Cek Tiket Saya
            </Button>

            <Link href="/antrean#form-antrean">
              <Button size="sm" className="gap-1.5 font-semibold bg-teal-700 hover:bg-teal-800 text-white">
                <PlusCircle className="h-4 w-4" />
                Daftar Antrean
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsLookupOpen(true)}
              aria-label="Cari Tiket"
            >
              <Search className="h-4 w-4 text-teal-600" />
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900 space-y-2 animate-in slide-in-from-top-4 duration-200">
            <Link
              href="/profil"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Profil Klinik
            </Link>
            <Link
              href="/legalitas"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ShieldCheck className="h-4 w-4 text-teal-600" />
              Legalitas &amp; Izin Resmi
            </Link>
            <Link
              href="/antrean#antrean"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Antrean Live
            </Link>
            <Link
              href="/antrean#layanan"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Paket Layanan
            </Link>
            <Link
              href="/queue-board"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Activity className="h-4 w-4 text-teal-600" />
              Papan Antrean Publik
            </Link>
            <Link
              href="/tv-display"
              target="_blank"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Tv className="h-4 w-4 text-amber-600" />
              Layar Display TV (Panggilan Suara)
            </Link>
            <Link
              href="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-teal-700 hover:bg-teal-50 dark:text-teal-400 dark:hover:bg-slate-800"
            >
              <LogIn className="h-4 w-4" />
              Login Staf & Terapis
            </Link>
            <div className="pt-2">
              <Link
                href="/antrean#form-antrean"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full"
              >
                <Button className="w-full gap-2 bg-teal-700 hover:bg-teal-800 text-white">
                  <PlusCircle className="h-4 w-4" />
                  Daftar Antrean Online
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Ticket Lookup Dialog */}
      <TicketLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />
    </>
  );
}
