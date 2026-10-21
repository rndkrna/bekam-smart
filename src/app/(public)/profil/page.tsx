import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  HeartHandshake,
  Leaf,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  Tv,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { INITIAL_SERVICES } from "@/lib/data/mock-data";
import { formatIDR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Profil Praktik • Bekam Bintan Therapy",
  description:
    "Mengenal Bekam Bintan Therapy: Pusat terapi bekam steril, al fashdu, terapi lintah medis, gurah hidung, dan home care terdaftar resmi Dinkes Kab. Bintan STPT No. 001/Yankes/Batra/VII/2013 & anggota ITBI.",
};

/* -------------------------------------------------------------------------- */
/*                                Profile Data                                */
/* -------------------------------------------------------------------------- */

const STATS = [
  { value: "15+", label: "Tahun Melayani (Sejak 2011)", icon: Calendar },
  { value: "15.000+", label: "Tindakan Terapi Selesai", icon: Users },
  { value: "STPT 001", label: "Dinkes Kab. Bintan", icon: Stethoscope },
  { value: "ITBI", label: "Anggota Resmi Nasional", icon: Award },
];

const MISSIONS = [
  "Menghadirkan layanan pengobatan Thibbun Nabawi yang aman, halal, dan sesuai tuntunan syariat Islam.",
  "Menjamin keamanan pasien melalui penggunaan jarum lancet & kop bekam 100% steril sekali pakai (single-use).",
  "Menjaga adab syar'i dengan jalur antrean, bilik terapi, dan terapis yang terpisah penuh antara Ikhwan (Pria) dan Akhwat (Wanita).",
  "Memudahkan pasien berobat tanpa menunggu berdesakan melalui sistem antrean digital Bekam Smart Queue.",
  "Memberikan biaya terapi yang terjangkau (murah), mujarab, halal, dan insya Allah penuh barokah bagi seluruh lapisan masyarakat.",
];

const VALUES = [
  {
    title: "Amanah",
    desc: "Jujur dalam diagnosa awal, transparan dalam tarif, dan menjaga kerahasiaan rekam medis pasien.",
    icon: HeartHandshake,
    tone: "from-teal-500 to-teal-700",
  },
  {
    title: "Syar'i",
    desc: "Terapis Ikhwan khusus pasien pria dan terapis Akhwat khusus pasien wanita, menjamin kenyamanan dan adab.",
    icon: Leaf,
    tone: "from-emerald-500 to-emerald-700",
  },
  {
    title: "Higienis",
    desc: "Jarum lancet, kop, dan sarung tangan steril sekali pakai dibuka baru di depan pasien. Ruang terapi disanitasi berkala.",
    icon: ShieldCheck,
    tone: "from-sky-500 to-sky-700",
  },
  {
    title: "Barokah",
    desc: "Mengutamakan niat ibadah dan kesembuhan pasien dengan tarif terjangkau, ramah, dan penuh kepedulian.",
    icon: Sparkles,
    tone: "from-amber-500 to-amber-600",
  },
];

const PRINSIP_THIBBUN_NABAWI = [
  {
    no: 1,
    title: "Keyakinan Kepada Allah SWT",
    dalil: "QS. Asy-Syu'ara [26]: 80 & HR. Muslim",
    desc: "Meyakini bahwa setiap penyakit berasal dari Allah dan hanya Allah yang menyembuhkannya. Setiap penyakit pasti ada obatnya.",
  },
  {
    no: 2,
    title: "Obat yang Halal & Thoyyib",
    dalil: "HR. Abu Dawud",
    desc: "Allah melarang berobat dengan perkara yang haram. Kesembuhan sejati diraih melalui perantara yang suci dan halal.",
  },
  {
    no: 3,
    title: "Tidak Membawa Kemudharatan",
    dalil: "HR. Muslim",
    desc: "Prosedur terapi tidak boleh merusak atau mencacatkan tubuh pasien, melainkan merestorasi kesehatan secara alami.",
  },
  {
    no: 4,
    title: "Bebas Takhayul, Bid'ah & Khurafat",
    dalil: "Prinsip Akidah Islamiah",
    desc: "Terapi murni berbasis metode thibbun nabawi yang shahih tanpa jampi-jampi terlarang atau media mistis.",
  },
  {
    no: 5,
    title: "Ikhtiar yang Syar'i & Beradab",
    dalil: "Sunnah Mu'akkadah",
    desc: "Terus berikhtiar mencari kesembuhan terbaik dengan menjaga adab pemisahan aurat antara pria dan wanita.",
  },
  {
    no: 6,
    title: "Terapis Berilmu & Bertanggung Jawab",
    dalil: "HR. Daruquthni & Al-Hakim",
    desc: "Terapis wajib menguasai ilmu anatomi tubuh, kontraindikasi medis, serta teknik tindakan yang aman dan bersertifikat.",
  },
];

const MILESTONES = [
  {
    year: "2011",
    title: "Awal Berdiri di Bintan",
    desc: "Berdiri sebagai Balai Pengobatan Alami Thibbun Nabawi 'Bekam Bintan Therapy' di Desa Teluk Sasah, Seri Kuala Lobam.",
  },
  {
    year: "2013",
    title: "Izin Resmi Dinkes Bintan",
    desc: "Memperoleh Surat Terdaftar Pengobat Tradisional (STPT No. 001/Yankes/Batra/VII/2013) dari Dinas Kesehatan Kabupaten Bintan.",
  },
  {
    year: "2015",
    title: "Keanggotaan ITBI",
    desc: "Resmi tergabung dalam Ikatan Terapis Bekam Indonesia (ITBI) dengan nomor anggota 000341.00014.0003293.",
  },
  {
    year: "2018",
    title: "Layanan Komprehensif",
    desc: "Memperluas layanan pengobatan alami: Terapi AL Fashdu, Terapi Lintah Medis (Hirudo), Gurah Hidung, serta Home Care.",
  },
  {
    year: "2026",
    title: "Bekam Smart Queue",
    desc: "Modernisasi layanan antrean online dual-lane, display TV otomatis, dan tiket digital tanpa perlu download aplikasi.",
  },
];

const THERAPISTS = [
  {
    name: "Ustadz Hasan",
    role: "Kepala Terapis Ikhwan & Pengobat Utama",
    exp: "15 tahun",
    lane: "MALE" as const,
    credential: "ITBI No. 000341 • Sertifikat Thibbun Nabawi",
  },
  {
    name: "Ummu Aisyah",
    role: "Kepala Terapis Akhwat",
    exp: "12 tahun",
    lane: "FEMALE" as const,
    credential: "Praktisi Bekam & Gurah Muslimah Bersertifikat",
  },
  {
    name: "Terapis Ikhwan Asisten",
    role: "Terapis Bekam Steril & Al Fashdu",
    exp: "7 tahun",
    lane: "MALE" as const,
    credential: "Pelatihan Higienitas & Pengeluaran Darah Vena",
  },
  {
    name: "Terapis Akhwat Asisten",
    role: "Terapis Bekam & Gurah Hidung Wanita",
    exp: "6 tahun",
    lane: "FEMALE" as const,
    credential: "Pelatihan Terapi Gurah Tradisional Herbal",
  },
];

const FACILITIES = [
  { title: "Bilik Terapi Pria & Wanita Terpisah", desc: "Ruangan bersih, tertutup, dan menjaga privasi penuh pasien." },
  { title: "Ruang Tunggu Terpisah", desc: "Area tunggu yang nyaman dan santun bagi ikhwan dan akhwat." },
  { title: "Display TV Antrean & Panggilan Suara", desc: "Panggilan nomor otomatis sehingga pasien tahu giliran tanpa cemas." },
  { title: "Pemeriksaan Tensi Darah Gratis", desc: "Skrining tekanan darah dan anamnesa keluhan sebelum setiap tindakan." },
  { title: "Layanan Home Care", desc: "Terapis siap datang ke rumah pasien di area Bintan dengan perjanjian." },
  { title: "Parkir & Lokasi Strategis", desc: "Terletak di Jl. Indunsuri Taman Kota, Teluk Sasah, mudah diakses." },
];

const CERTIFICATIONS = [
  {
    title: "STPT Dinas Kesehatan Bintan",
    detail: "STPT No: 001/Yankes/Batra/VII/2013",
    icon: BadgeCheck,
  },
  {
    title: "Anggota Resmi ITBI",
    detail: "Ikatan Terapis Bekam Indonesia (No. 000341.00014.0003293)",
    icon: Award,
  },
  {
    title: "Sertifikasi Pelatihan Medis",
    detail: "Pelatihan Bekam Steril & Pengobatan Alami Thibbun Nabawi",
    icon: ShieldCheck,
  },
  {
    title: "Standar Jarum & Kop Steril",
    detail: "100% Jarum Lancet & Kop Sekali Pakai (Single-use)",
    icon: Building2,
  },
];

const TESTIMONIALS = [
  {
    name: "Bapak Hendra S.",
    city: "Tanjung Uban, Bintan",
    text: "Alhamdulillah setelah rutin bekam di Bekam Bintan Therapy leher kaku dan kolesterol saya jauh membaik. Jarum dan kopnya selalu baru dibuka di depan saya. Terapisnya sangat ramah.",
  },
  {
    name: "Ibu Fatimah R.",
    city: "Teluk Sasah, Seri Kuala Lobam",
    text: "Sebagai muslimah saya merasa sangat tenang dan nyaman karena ada terapis wanita dan ruangannya terpisah rapat. Terapi gurah hidungnya sangat melegakan pernapasan saya.",
  },
  {
    name: "Mas Dimas A.",
    city: "Kawasan Industri Lobam, Bintan",
    text: "Saya sering lembur shift pabrik sehingga badan sering pegal linu. Sekarang ada antrean online, jadi bisa daftar dulu dari mess lalu datang pas giliran. Biayanya sangat murah dan terjangkau.",
  },
];

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-800">
        <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
        {eyebrow}
      </span>
      <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h2>
      {desc && <p className="mt-3 text-sm leading-relaxed text-slate-600">{desc}</p>}
    </div>
  );
}

export default function CompanyProfilePage() {
  const featuredServices = INITIAL_SERVICES.slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* ============================ HERO ============================ */}
        <section className="relative overflow-hidden bg-slate-950 text-white">
          <div className="bg-islamic-pattern absolute inset-0 opacity-60" />
          <div className="animate-glow-pulse pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-teal-500/30 blur-3xl" />
          <div className="animate-glow-pulse pointer-events-none absolute -bottom-40 right-0 h-[30rem] w-[30rem] rounded-full bg-emerald-500/20 blur-3xl [animation-delay:2s]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
            {/* Left copy */}
            <div className="space-y-6">
              <div
                className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs font-semibold text-teal-200 backdrop-blur"
                style={{ animationDelay: "0ms" }}
              >
                <Building2 className="h-4 w-4 text-amber-300" />
                Balai Pengobatan Alami Thibbun Nabawi • Berdiri Sejak 2011
              </div>

              <h1
                className="animate-fade-up text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
                style={{ animationDelay: "100ms" }}
              >
                Bekam Bintan{" "}
                <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-200 bg-clip-text text-transparent">
                  Therapy
                </span>
              </h1>

              <p
                className="animate-fade-up max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
                style={{ animationDelay: "200ms" }}
              >
                Pusat terapi bekam steril, al fashdu, terapi lintah medis, dan gurah hidung di Kabupaten Bintan yang memadukan{" "}
                <strong className="text-white">tuntunan As-Sunnah</strong>, standar alat steril sekali pakai, dan{" "}
                <strong className="text-white">sistem antrean cerdas</strong> untuk wilayah Tanjung Uban & Seri Kuala Lobam.
              </p>

              <div
                className="animate-fade-up flex flex-col gap-3 pt-2 sm:flex-row"
                style={{ animationDelay: "300ms" }}
              >
                <Link
                  href="/#form-antrean"
                  id="profil-hero-daftar"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/40"
                >
                  Daftar Antrean Online
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#tentang"
                  id="profil-hero-tentang"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                >
                  Kenali Kami Lebih Dekat
                </a>
              </div>
            </div>

            {/* Right image */}
            <div className="animate-fade-up relative" style={{ animationDelay: "250ms" }}>
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-teal-400/40 via-emerald-400/10 to-amber-300/30 blur-xl" />
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                <Image
                  src="/images/profil/lobby-klinik.jpg"
                  alt="Lobi resepsionis Bekam Bintan Therapy dengan display TV antrean"
                  fill
                  preload
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              </div>

              {/* Floating card: rating */}
              <div className="animate-float-soft absolute -bottom-6 -left-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/95 p-3.5 text-slate-900 shadow-xl backdrop-blur sm:-left-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Star className="h-5 w-5 fill-amber-400" />
                </div>
                <div>
                  <p className="text-lg font-black leading-none">4.9</p>
                  <p className="text-[11px] text-slate-500">2.100+ ulasan pasien</p>
                </div>
              </div>

              {/* Floating card: certified */}
              <div className="animate-float-soft absolute -right-3 -top-5 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur [animation-delay:1.5s] sm:-right-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Anggota Resmi ITBI</p>
                  <p className="text-[10px] text-slate-400">STPT Dinkes Bintan 001</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative border-t border-white/10 bg-white/[0.03] backdrop-blur">
            <div className="mx-auto grid max-w-7xl grid-cols-2 divide-white/10 px-4 sm:px-6 md:grid-cols-4 md:divide-x lg:px-8">
              {STATS.map((s) => (
                <div key={s.label} className="flex items-center gap-3 px-2 py-6 md:justify-center">
                  <s.icon className="h-6 w-6 shrink-0 text-teal-300" />
                  <div>
                    <p className="text-2xl font-black tracking-tight text-white">{s.value}</p>
                    <p className="text-xs text-slate-400">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================= TENTANG KAMI ========================= */}
        <section id="tentang" className="scroll-mt-20 py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl shadow-slate-900/10">
                <Image
                  src="/images/profil/ruang-terapi.jpg"
                  alt="Ruang terapi bekam privat dengan kop dan jarum steril sekali pakai"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-8 right-6 max-w-[16rem] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-700">
                  <ShieldCheck className="h-4 w-4" />
                  Protokol Higienis
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Kop, lancet, dan sarung tangan dibuka baru di hadapan pasien.
                </p>
              </div>
            </div>

            <div className="order-1 space-y-5 lg:order-2">
              <SectionHeading
                eyebrow="Tentang Kami"
                title="Merawat Kesehatan Umat dengan Sunnah & Ilmu"
                align="left"
              />
              <p className="text-sm leading-relaxed text-slate-600">
                <strong className="text-slate-900">Bekam Bintan Therapy</strong> berawal dari ikhtiar
                pelayanan thibbun nabawi yang telah terdaftar resmi pada Dinas Kesehatan Kabupaten Bintan
                (STPT No. 001/Yankes/Batra/VII/2013) serta tergabung dalam Ikatan Terapis Bekam Indonesia (ITBI).
                Kami melayani masyarakat Tanjung Uban, Seri Kuala Lobam, dan sekitarnya dengan standar kebersihan tinggi.
              </p>
              <p className="text-sm leading-relaxed text-slate-600">
                Kami percaya bahwa terapi bekam harus dilakukan oleh tenaga yang kompeten,
                dengan alat steril, serta adab yang terjaga. Karena itu setiap pasien melalui
                skrining kesehatan, dilayani oleh terapis sesama jenis, dan mendapatkan
                penjelasan yang jujur sebelum tindakan.
              </p>

              <ul className="grid gap-3 pt-2 sm:grid-cols-2">
                {[
                  "Terapis Ikhwan & Akhwat terpisah",
                  "Alat 100% sekali pakai",
                  "Skrining tensi gratis",
                  "Antrean online tanpa akun",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ========================== VISI & MISI ========================== */}
        <section id="visi-misi" className="scroll-mt-20 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Visi & Misi"
              title="Arah dan Komitmen Kami"
              desc="Landasan yang menuntun setiap layanan di Bekam Bintan Therapy."
            />

            <div className="mt-12 grid gap-6 lg:grid-cols-5">
              {/* Visi */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-emerald-900 p-8 text-white shadow-xl lg:col-span-2">
                <div className="bg-islamic-pattern absolute inset-0 opacity-40" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-xs font-bold uppercase tracking-widest text-teal-200">
                    Visi
                  </h3>
                  <p className="mt-3 text-xl font-bold leading-snug">
                    &ldquo;Menjadi klinik bekam sunnah terpercaya di Indonesia yang aman,
                    syar&apos;i, dan berbasis teknologi.&rdquo;
                  </p>
                </div>
              </div>

              {/* Misi */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 lg:col-span-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Target className="h-6 w-6" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                    Misi
                  </h3>
                </div>
                <ol className="mt-5 space-y-3">
                  {MISSIONS.map((m, i) => (
                    <li key={m} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-teal-700 shadow-sm ring-1 ring-slate-200">
                        {i + 1}
                      </span>
                      {m}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* ========================== NILAI ========================== */}
        <section id="nilai" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Nilai Utama"
              title="Empat Pilar Pelayanan Kami"
              desc="Nilai yang kami pegang teguh dalam setiap interaksi dengan pasien."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v) => (
                <div
                  key={v.title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-900/5"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${v.tone} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-black text-slate-900">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.desc}</p>
                </div>
              ))}
            </div>

            {/* Slogan Banner */}
            <div className="mt-12 rounded-2xl bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 border border-teal-200 p-6 text-center">
              <p className="text-xs font-bold text-teal-800 uppercase tracking-widest">Semboyan Pelayanan Kami</p>
              <blockquote className="text-lg sm:text-xl font-black text-slate-900 mt-1 italic">
                &ldquo;Biaya Terapi Pengobatan Kami Murah, Mujarab, Halal, dan Insya Allah Barokah.&rdquo;
              </blockquote>
              <p className="text-xs text-slate-500 mt-2">
                Melayani Pria dan Wanita • Melayani Muslim dan Non-Muslim dengan Penuh Ketulusan
              </p>
            </div>
          </div>
        </section>

        {/* ===================== 6 PRINSIP PENGOBATAN ===================== */}
        <section id="prinsip" className="scroll-mt-20 bg-slate-50 py-20 border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Tuntunan As-Sunnah"
              title="6 Prinsip Pengobatan Thibbun Nabawi"
              desc="Setiap tindakan di Bekam Bintan Therapy berlandaskan kaidah pengobatan Islami yang lurus dan dapat dipertanggungjawabkan."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PRINSIP_THIBBUN_NABAWI.map((p) => (
                <div
                  key={p.no}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-teal-400 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-white font-black text-xs">
                        0{p.no}
                      </span>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {p.dalil}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================== PERJALANAN ========================== */}
        <section id="perjalanan" className="scroll-mt-20 bg-slate-900 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                Perjalanan Kami
              </span>
              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                Satu Dekade Menebar Manfaat
              </h2>
            </div>

            <div className="relative mt-14">
              <div className="absolute left-0 right-0 top-[1.4rem] hidden h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent md:block" />
              <ol className="grid gap-8 md:grid-cols-5">
                {MILESTONES.map((m, i) => (
                  <li key={m.year} className="relative flex gap-4 md:flex-col md:gap-0">
                    <div
                      className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-4 border-slate-900 text-xs font-black ${
                        i === MILESTONES.length - 1
                          ? "bg-gradient-to-br from-amber-300 to-amber-500 text-slate-900"
                          : "bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-900"
                      }`}
                    >
                      {i === MILESTONES.length - 1 ? <Sparkles className="h-4 w-4" /> : i + 1}
                    </div>
                    <div className="md:mt-5">
                      <p className="text-2xl font-black text-teal-300">{m.year}</p>
                      <h3 className="mt-1 text-sm font-bold text-white">{m.title}</h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{m.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ========================== TIM TERAPIS ========================== */}
        <section id="tim" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Tim Kami"
              title="Terapis Bersertifikat & Berpengalaman"
              desc="Seluruh terapis tergabung dalam Ikatan Terapis Bekam Indonesia (ITBI) dan mengantongi izin resmi STPT Dinkes Bintan."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {THERAPISTS.map((t) => {
                const initials = t.name
                  .replace(/^(Ust\.|Ustzh\.)\s*/, "")
                  .split(" ")
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("");
                const isMale = t.lane === "MALE";
                return (
                  <div
                    key={t.name}
                    className="group rounded-3xl border border-slate-200 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
                  >
                    <div
                      className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-black text-white shadow-lg ring-4 ring-white transition-transform duration-300 group-hover:scale-105 ${
                        isMale
                          ? "from-teal-500 to-teal-800 shadow-teal-700/30"
                          : "from-emerald-500 to-emerald-800 shadow-emerald-700/30"
                      }`}
                    >
                      {initials}
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-slate-900">{t.name}</h3>
                    <p className="text-xs text-slate-500">{t.role}</p>
                    <div className="mt-4 flex items-center justify-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                          isMale
                            ? "bg-teal-50 text-teal-800 ring-1 ring-teal-200"
                            : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
                        }`}
                      >
                        {isMale ? "Jalur Ikhwan (P)" : "Jalur Akhwat (W)"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                        {t.exp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================== LAYANAN & FASILITAS ===================== */}
        <section id="layanan-fasilitas" className="scroll-mt-20 bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            {/* Layanan unggulan */}
            <div>
              <SectionHeading eyebrow="Layanan Unggulan" title="Paket Terapi Favorit" align="left" />
              <div className="mt-8 space-y-3">
                {featuredServices.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:border-teal-400 hover:bg-teal-50/40"
                  >
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-teal-700">{s.category}</p>
                      <h3 className="truncate text-sm font-bold text-slate-900">{s.name}</h3>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {s.durationMinutes} menit • {s.cupQuantity} kop
                      </p>
                    </div>
                    <p className="shrink-0 text-base font-black text-slate-900">
                      {formatIDR(s.price)}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/#layanan"
                id="profil-lihat-layanan"
                className="group mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-900"
              >
                Lihat semua paket & harga
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Fasilitas */}
            <div>
              <SectionHeading eyebrow="Fasilitas" title="Nyaman, Bersih & Privat" align="left" />
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {FACILITIES.map((f) => (
                  <div key={f.title} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
                    </div>
                    <p className="mt-1 pl-6 text-xs leading-relaxed text-slate-500">{f.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 p-4 ring-1 ring-amber-200">
                <Tv className="h-8 w-8 shrink-0 text-amber-600" />
                <p className="text-xs leading-relaxed text-amber-900">
                  <strong>Didukung Bekam Smart Queue</strong> — pantau antrean dari rumah dan
                  datang tepat waktu tanpa menunggu lama.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================== LEGALITAS ========================== */}
        <section id="legalitas" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Legalitas"
              title="Terdaftar & Tersertifikasi Resmi"
              desc="Kami beroperasi sesuai regulasi pelayanan kesehatan tradisional di Indonesia."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {CERTIFICATIONS.map((c) => (
                <div
                  key={c.title}
                  className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                    <c.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================== TESTIMONI ========================== */}
        <section id="testimoni" className="scroll-mt-20 bg-gradient-to-b from-teal-50/60 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Testimoni"
              title="Apa Kata Pasien Kami"
              desc="Kepercayaan pasien adalah amanah terbesar bagi kami."
            />
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="relative flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-900/5"
                >
                  <Quote className="absolute right-5 top-5 h-8 w-8 text-teal-100" />
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.city}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ========================== KONTAK & CTA ========================== */}
        <section id="kontak" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl lg:grid-cols-2">
              <div className="relative p-8 text-white sm:p-12">
                <div className="bg-islamic-pattern absolute inset-0 opacity-40" />
                <div className="animate-glow-pulse pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-teal-500/30 blur-3xl" />
                <div className="relative space-y-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                    Siap Merasakan Manfaat Bekam Sunnah?
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Ambil nomor antrean secara online atau hubungi kami untuk konsultasi
                    gratis sebelum terapi.
                  </p>

                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" />
                      Jl. Indunsuri No. 116C, Taman Kota, Desa Teluk Sasah, Kec. Seri Kuala Lobam, Kab. Bintan (Tanjung Uban & sekitarnya)
                    </li>
                    <li className="flex items-center gap-3">
                      <Clock className="h-5 w-5 shrink-0 text-teal-400" />
                      Praktek Setiap Hari: 09:00 – 22:00 WIB
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone className="h-5 w-5 shrink-0 text-teal-400" />
                      Terapis Pria: 0812-6832-0072 (WhatsApp / Call)
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone className="h-5 w-5 shrink-0 text-emerald-400" />
                      Terapis Wanita: 0812-7530-2567 (WhatsApp / Call)
                    </li>
                  </ul>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <Link
                      href="/#form-antrean"
                      id="profil-cta-daftar"
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/40"
                    >
                      Ambil Nomor Antrean
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <a
                      href="https://wa.me/6281268320072"
                      target="_blank"
                      rel="noopener noreferrer"
                      id="profil-cta-whatsapp"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      <MessageCircle className="h-4 w-4 text-emerald-400" />
                      Chat WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[320px] bg-slate-800">
                <iframe
                  title="Lokasi Bekam Bintan Therapy"
                  src="https://www.google.com/maps?q=Teluk+Sasah,+Seri+Kuala+Lobam,+Bintan&output=embed"
                  className="absolute inset-0 h-full w-full border-0 grayscale-[30%]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
