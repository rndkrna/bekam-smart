import Link from "next/link";
import {
  Activity,
  ShieldCheck,
  Heart,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 dark:border-slate-800">
      {/* Top Banner Standards */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-6 px-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-500/10 p-2 text-teal-400 border border-teal-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Terdaftar Resmi Dinkes Kab. Bintan & Ikatan Terapis Bekam Indonesia (ITBI)
              </p>
              <p className="text-xs text-slate-400">
                STPT No. 001/Yankes/Batra/VII/2013 • Anggota ITBI No. 000341.00014.0003293 • 100% Jarum & Kop Steril Sekali Pakai
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Sesuai Tuntunan As-Sunnah Ash-Shahihah</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Clinic Bio */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                BEKAM<span className="text-teal-400">BINTAN</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Bekam Bintan Therapy — Balai Pengobatan Alami Thibbun Nabawi (Berdiri Sejak 2011). Pusat terapi bekam steril, al fashdu, lintah medis, gurah hidung, dan home care berizin resmi di Bintan, Kepri.
            </p>
            <p className="text-[11px] italic text-teal-300">
              &ldquo;Biaya Terapi Pengobatan Kami Murah, Mujarab, Halal, dan Insya Allah Barokah.&rdquo;
            </p>
          </div>

          {/* Kontak & Lokasi */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Lokasi & Jam Buka
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-teal-400 mt-0.5" />
                <span>Jl. Indunsuri No. 116C, Taman Kota, Desa Teluk Sasah, Kec. Seri Kuala Lobam, Kab. Bintan (Tanjung Uban & sekitarnya)</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-teal-400" />
                <span>Praktek Setiap Hari: 09:00 - 22:00 WIB</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 shrink-0 text-teal-400 mt-0.5" />
                <div>
                  <p>Terapis Pria: 0812-6832-0072</p>
                  <p>Terapis Wanita: 0812-7530-2567</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Akses Cepat
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/profil" className="hover:text-teal-400 transition-colors">
                  Profil Klinik & Tim Terapis
                </Link>
              </li>
              <li>
                <Link href="/#antrean-live" className="hover:text-teal-400 transition-colors">
                  Pantau Antrean Live
                </Link>
              </li>
              <li>
                <Link href="/#layanan" className="hover:text-teal-400 transition-colors">
                  Katalog Paket Bekam & Harga
                </Link>
              </li>
              <li>
                <Link href="/queue-board" className="hover:text-teal-400 transition-colors">
                  Papan Panggilan Pasien
                </Link>
              </li>
              <li>
                <Link href="/tv-display" target="_blank" className="hover:text-teal-400 transition-colors flex items-center gap-1">
                  Layar TV Ruang Tunggu
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-teal-400 transition-colors">
                  Login Admin & Terapis
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontraindikasi Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Peringatan Medis
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Pasien dengan kondisi khusus seperti hemofilia berat, kehamilan trimester pertama, sedang mengonsumsi antikoagulan dosis tinggi, atau tekanan darah sangat rendah wajib memberitahukan kepada petugas skrining sebelum tindakan.
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Bekam Bintan Therapy • Pusat Terapi Thibbun Nabawi & Antrean Cerdas Bintan.</p>
          <p className="flex items-center gap-1">
            Dibangun dengan cinta untuk kesehatan umat <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
