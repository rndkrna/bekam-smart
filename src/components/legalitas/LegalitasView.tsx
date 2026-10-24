"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  BadgeCheck,
  Building2,
  FileText,
  Search,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  Maximize2,
  Minimize2,
  Download,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Stethoscope,
  Sparkles,
  Phone,
  MapPin,
  Calendar,
  Lock,
  UserCheck,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*                                Types & Data                                */
/* -------------------------------------------------------------------------- */

export type DocumentCategory = "all" | "pemerintah" | "asosiasi" | "terapis";

export interface LegalDocument {
  id: string;
  title: string;
  shortTitle: string;
  category: "pemerintah" | "asosiasi" | "terapis";
  categoryLabel: string;
  regNumber: string;
  issuer: string;
  issueDate: string;
  signatory: string;
  legalBasis: string;
  imageSrc: string;
  aspect: "portrait" | "landscape";
  badge: string;
  badgeTone: string;
  status: "Aktif & Terdaftar" | "Terverifikasi Resmi" | "Kompeten";
  summary: string;
  description: string;
  highlights: string[];
  keyData: { label: string; value: string }[];
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: "stpt-dinkes",
    title: "Surat Terdaftar Pengobat Tradisional (STPT) Dinas Kesehatan Kabupaten Bintan",
    shortTitle: "STPT Dinkes Kab. Bintan",
    category: "pemerintah",
    categoryLabel: "Izin Operasional Daerah",
    regNumber: "001/Yankes/Batra/VII/2013",
    issuer: "Pemerintah Kabupaten Bintan — Dinas Kesehatan",
    issueDate: "04 Juli 2013 (Bandar Seri Bentan)",
    signatory: "Muhammad Roem (Kepala Dinas Kesehatan Kab. Bintan, Pembina Utama Muda — NIP. 19580516198012 1 002)",
    legalBasis: "Keputusan Menteri Kesehatan RI No. 1076/Menkes/SK/VII/2003 tentang Penyelenggaraan Pengobatan Tradisional",
    imageSrc: "/images/legalitas/dinkes-stpt.jpg",
    aspect: "portrait",
    badge: "Izin Pertama No. 001",
    badgeTone: "bg-teal-50 text-teal-800 border-teal-200",
    status: "Terverifikasi Resmi",
    summary: "Surat izin registrasi resmi pengobat tradisional (BATRA) pertama di Kabupaten Bintan untuk klasifikasi Pendekatan Agama / Bekam.",
    description:
      "Surat Terdaftar Pengobat Tradisional (STPT) yang diterbitkan secara resmi oleh Dinas Kesehatan Pemerintah Kabupaten Bintan kepada Bpk. Sabarrudin sebagai praktisi pengobatan tradisional bekam. Dokumen ini merupakan bukti legalitas fundamental operasional klinik di wilayah Bintan.",
    highlights: [
      "Izin STPT resmi No. Urut 001 di Kabupaten Bintan sejak Juli 2013",
      "Klasifikasi: Batra Pendekatan Agama / Terapi Bekam Medis Steril",
      "Diterbitkan resmi oleh Kepala Dinas Kesehatan Kab. Bintan",
      "Tembusan resmi: Dinkes Prov. Kepri, UPT Puskesmas Teluk Sasah, dan DPP ITBI",
    ],
    keyData: [
      { label: "Nomor Registrasi", value: "001/Yankes/Batra/VII/2013" },
      { label: "Nama Terdaftar", value: "SABARRUDIN" },
      { label: "Klasifikasi Batra", value: "Pendekatan Agama / Bekam" },
      { label: "Wilayah Registrasi", value: "Kabupaten Bintan, Kepulauan Riau" },
      { label: "Instansi Penerbit", value: "Dinas Kesehatan Kabupaten Bintan" },
    ],
  },
  {
    id: "nib-bkpm",
    title: "Nomor Induk Berusaha (NIB) Berbasis Risiko — OSS Kemeninves/BKPM",
    shortTitle: "NIB OSS BKPM Republik Indonesia",
    category: "pemerintah",
    categoryLabel: "Legalitas Usaha Nasional",
    regNumber: "2310230115406",
    issuer: "Pemerintah Republik Indonesia — Lembaga OSS / Kementerian Investasi (BKPM)",
    issueDate: "23 Oktober 2023 (Perubahan ke-7)",
    signatory: "Menteri Investasi / Kepala BKPM (Sertifikasi Elektronik BSrE-BSSN)",
    legalBasis: "Undang-Undang No. 6 Tahun 2023 tentang Penetapan Perppu No. 2 Tahun 2022 tentang Cipta Kerja",
    imageSrc: "/images/legalitas/nib-bekam.jpg",
    aspect: "portrait",
    badge: "Sistem OSS Nasional",
    badgeTone: "bg-emerald-50 text-emerald-800 border-emerald-200",
    status: "Aktif & Terdaftar",
    summary: "Identitas perizinan berusaha tunggal tingkat nasional berbasis risiko untuk pelaku usaha mikro pelayanan kesehatan tradisional.",
    description:
      "Nomor Induk Berusaha (NIB) yang diterbitkan secara elektronik oleh Pemerintah Republik Indonesia melalui Lembaga OSS Kementerian Investasi/BKPM. NIB berlaku di seluruh wilayah Indonesia dan terintegrasi dengan tanda daftar kepatuhan hukum, ketenagakerjaan, dan perlindungan berusaha resmi.",
    highlights: [
      "NIB Berbasis Risiko terverifikasi resmi oleh Kementerian Investasi / BKPM",
      "Skala Usaha: Usaha Mikro Terdaftar di Desa Teluk Sasah, Bintan",
      "Otentikasi digital resmi terakreditasi Balai Sertifikasi Elektronik (BSrE - BSSN)",
      "Berlaku di seluruh wilayah Republik Indonesia",
    ],
    keyData: [
      { label: "Nomor NIB", value: "2310230115406" },
      { label: "Nama Pelaku Usaha", value: "SABARRUDIN" },
      { label: "Skala Usaha", value: "Usaha Mikro" },
      { label: "Otoritas Penerbit", value: "Kementerian Investasi / BKPM RI" },
      { label: "Sistem Pengesahan", value: "Tanda Tangan Elektronik BSrE-BSSN" },
    ],
  },
  {
    id: "sertifikat-standar",
    title: "Sertifikat Standar Perizinan Berusaha KBLI 86902 — DPMPTSP Kab. Bintan",
    shortTitle: "Sertifikat Standar DPMPTSP Bintan",
    category: "pemerintah",
    categoryLabel: "Standar Usaha Pelayanan",
    regNumber: "23102301154060001",
    issuer: "Pemerintah Kabupaten Bintan — DPMPTSP (a.n. Bupati Bintan)",
    issueDate: "23 Oktober 2023",
    signatory: "Kepala DPMPTSP Kabupaten Bintan (Tanda Tangan Elektronik Resmi)",
    legalBasis: "KBLI 86902 — Aktivitas Pelayanan Kesehatan Tradisional",
    imageSrc: "/images/legalitas/sertifikat-standar.jpg",
    aspect: "portrait",
    badge: "KBLI 86902",
    badgeTone: "bg-sky-50 text-sky-800 border-sky-200",
    status: "Aktif & Terdaftar",
    summary: "Pengesahan standar sarana, higienitas, dan prosedur operasional klinik Bekam Bintan Therapy di Jl. Indunsuri, Teluk Sasah.",
    description:
      "Sertifikat Standar Perizinan Berusaha Berbasis Risiko untuk Klasifikasi Baku Lapangan Usaha Indonesia (KBLI) 86902 (Aktivitas Pelayanan Kesehatan Tradisional). Dokumen ini diterbitkan atas nama Bupati Bintan melalui Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu (DPMPTSP).",
    highlights: [
      "Standarisasi resmi KBLI 86902 (Aktivitas Pelayanan Kesehatan Tradisional)",
      "Lokasi praktik resmi: Jl. Indunsuri No. 116C RT 001/RW 001, Teluk Sasah, Seri Kuala Lobam",
      "Kepatuhan standar mutu sarana, sterilitas, dan lingkungan praktik",
      "Diterbitkan secara sah atas nama Bupati Bintan",
    ],
    keyData: [
      { label: "Nomor Sertifikat", value: "23102301154060001" },
      { label: "Kode KBLI", value: "86902 (Pelayanan Kesehatan Tradisional)" },
      { label: "Alamat Usaha", value: "Jl. Indunsuri No. 116C, Teluk Sasah, Bintan" },
      { label: "Otoritas Penerbit", value: "DPMPTSP Kabupaten Bintan" },
    ],
  },
  {
    id: "itbi-kta",
    title: "Sertifikat Keanggotaan Dewan Pimpinan Pusat Ikatan Terapis Bekam Indonesia (ITBI)",
    shortTitle: "KTA DPP Asosiasi ITBI",
    category: "asosiasi",
    categoryLabel: "Asosiasi Profesi Nasional",
    regNumber: "000341.00014.0003293",
    issuer: "Dewan Pimpinan Pusat Ikatan Terapis Bekam Indonesia (ITBI)",
    issueDate: "11 April 2013 (Tangerang)",
    signatory: "Dewan Pengurus Pusat Ikatan Terapis Bekam Indonesia (ITBI)",
    legalBasis: "Anggaran Dasar & Kode Etik Profesi Terapis Bekam Indonesia • UU No. 11/2008 ITE",
    imageSrc: "/images/legalitas/itbi-kta.jpg",
    aspect: "landscape",
    badge: "Anggota Resmi DPP ITBI",
    badgeTone: "bg-amber-50 text-amber-800 border-amber-200",
    status: "Terverifikasi Resmi",
    summary: "Bukti keanggotaan profesi resmi terapis bekam nasional dan komitmen kepatuhan terhadap kode etik terapi bekam Indonesia.",
    description:
      "Sertifikat Anggota Resmi yang diberikan oleh Dewan Pimpinan Pusat Ikatan Terapis Bekam Indonesia (ITBI) kepada Bpk. Sabarrudin. Sebagai anggota resmi, terapis terikat pada standar operasional prosedur higienitas bekam, teknik pengeluaran darah yang steril, dan etika thibbun nabawi yang lurus.",
    highlights: [
      "Anggota Terdaftar DPP ITBI Pusat No. 000341.00014.0003293 sejak April 2013",
      "Kepatuhan penuh pada Kode Etik Profesi Pengobat Bekam Indonesia",
      "Standarisasi titik bekam medis, sterilisasi alat, dan keamanan anatomis tubuh",
      "Tercatat di data registrasi nasional asosiasi terapis bekam",
    ],
    keyData: [
      { label: "Nomor Anggota", value: "000341.00014.0003293" },
      { label: "Nama Anggota", value: "SABARRUDIN" },
      { label: "Organisasi Profesi", value: "Ikatan Terapis Bekam Indonesia (ITBI)" },
      { label: "Status Anggota", value: "Anggota Biasa Resmi Nasional" },
      { label: "Domisili Cabang", value: "Bintan, Kepulauan Riau" },
    ],
  },
  {
    id: "sertifikat-sabarrudin",
    title: "Sertifikat Pelatihan Bekam Tiksar — Sabarrudin (Kepala Terapis Ikhwan)",
    shortTitle: "Sertifikat Terapis: Sabarrudin",
    category: "terapis",
    categoryLabel: "Kompetensi Terapis Ikhwan",
    regNumber: "010/BKM/TSR/LKP-ELPIKHI PST/V/23",
    issuer: "Lembaga Pendidikan Ilmu Kesehatan Holistik Indonesia (ELPIKHI)",
    issueDate: "22 Mei 2023 (Cirebon)",
    signatory: "Ners Ado Sadroi, AMK., S.Kep. (Pimpinan Pusat) & Beni Suprapto, Ch., Cht., Cmth. (Kepala Cabang)",
    legalBasis: "NILEK Nasional No: 02104.1.0060 • Kemendikbud RI NPSN: K9989761 • Kemnaker RI VIN: 2203320101 • LSK-PLKP 239/S/LSK-PLKP/IX/15",
    imageSrc: "/images/legalitas/sertifikat-sabarrudin.jpg",
    aspect: "landscape",
    badge: "Terapis Utama Ikhwan",
    badgeTone: "bg-teal-50 text-teal-800 border-teal-200",
    status: "Kompeten",
    summary: "Sertifikasi keahlian profesional Bekam Titik Dasar (Tiksar) dari lembaga pendidikan kesehatan holistik nasional terakreditasi.",
    description:
      "Sertifikat kelulusan uji kompetensi pelatihan Bekam Tiksar yang diselenggarakan oleh ELPIKHI di bawah binaan Kemendikbud RI dan Kemnaker RI. Membuktikan kompetensi teknis, pemahaman anatomi, fisiologi meridian, dan keselamatan tindakan bekam.",
    highlights: [
      "Praktisi Bekam Utama dengan pengalaman klinis lebih dari 15 tahun",
      "Terakreditasi resmi Kemendikbud NPSN K9989761 & Kemnaker VIN 2203320101",
      "Penanggung jawab medis & operasional terapi ikhwan (pasien pria)",
      "Penguasaan teknik bekam steril, al fashdu vena, dan terapi herbal",
    ],
    keyData: [
      { label: "Nomor Sertifikat", value: "010/BKM/TSR/LKP-ELPIKHI PST/V/23" },
      { label: "Nama Terapis", value: "SABARRUDIN" },
      { label: "Program Pelatihan", value: "BEKAM TIKSAR (Titik Dasar & Anatomi)" },
      { label: "Lembaga Penguji", value: "LKP ELPIKHI (Kemendikbud & Kemnaker)" },
      { label: "Peran di Klinik", value: "Kepala Terapis Ikhwan & Penanggung Jawab" },
    ],
  },
  {
    id: "sertifikat-ildawati",
    title: "Sertifikat Pelatihan Bekam Tiksar — Ildawati (Kepala Terapis Akhwat)",
    shortTitle: "Sertifikat Terapis: Ildawati",
    category: "terapis",
    categoryLabel: "Kompetensi Terapis Akhwat",
    regNumber: "012/BKM/TSR/LKP-ELPIKHI PST/V/23",
    issuer: "Lembaga Pendidikan Ilmu Kesehatan Holistik Indonesia (ELPIKHI)",
    issueDate: "22 Mei 2023 (Cirebon)",
    signatory: "Ners Ado Sadroi, AMK., S.Kep. (Pimpinan Pusat) & Beni Suprapto, Ch., Cht., Cmth. (Kepala Cabang)",
    legalBasis: "NILEK Nasional No: 02104.1.0060 • Kemendikbud RI NPSN: K9989761 • Kemnaker RI VIN: 2203320101",
    imageSrc: "/images/legalitas/sertifikat-ildawati.jpg",
    aspect: "landscape",
    badge: "Terapis Utama Akhwat",
    badgeTone: "bg-emerald-50 text-emerald-800 border-emerald-200",
    status: "Kompeten",
    summary: "Sertifikasi keahlian terapis bekam muslimah untuk menjamin keamanan, kenyamanan syar'i, dan privasi penuh pasien wanita.",
    description:
      "Sertifikat kompetensi keahlian bekam yang diraih oleh Ildawati dari ELPIKHI. Menjadi jaminan bahwa pasien wanita (akhwat) dilayani langsung oleh sesama wanita yang berkompeten, bersertifikat, dan memahami adab syariah dalam pengobatan.",
    highlights: [
      "Kepala Terapis Jalur Akhwat (Wanita) bersertifikat resmi",
      "Menjamin ruang tertutup, privasi aman, dan bebas pandangan bukan mahram",
      "Kompetensi bekam higienis, gurah hidung wanita, dan kesehatan muslimah",
      "Lulus pelatihan standar ELPIKHI binaan Kemendikbud RI",
    ],
    keyData: [
      { label: "Nomor Sertifikat", value: "012/BKM/TSR/LKP-ELPIKHI PST/V/23" },
      { label: "Nama Terapis", value: "ILDAWATI" },
      { label: "Program Pelatihan", value: "BEKAM TIKSAR (Titik Dasar & Muslimah)" },
      { label: "Lembaga Penguji", value: "LKP ELPIKHI (Kemendikbud & Kemnaker)" },
      { label: "Peran di Klinik", value: "Kepala Terapis Akhwat (Pasien Wanita)" },
    ],
  },
  {
    id: "sertifikat-tira",
    title: "Sertifikat Pelatihan Bekam Tiksar — Yudistira Pradana (Terapis Ikhwan)",
    shortTitle: "Sertifikat Terapis: Yudistira Pradana",
    category: "terapis",
    categoryLabel: "Kompetensi Terapis Ikhwan",
    regNumber: "011/BKM/TSR/LKP-ELPIKHI PST/V/23",
    issuer: "Lembaga Pendidikan Ilmu Kesehatan Holistik Indonesia (ELPIKHI)",
    issueDate: "22 Mei 2023 (Cirebon)",
    signatory: "Ners Ado Sadroi, AMK., S.Kep. (Pimpinan Pusat) & Beni Suprapto, Ch., Cht., Cmth. (Kepala Cabang)",
    legalBasis: "NILEK Nasional No: 02104.1.0060 • Kemendikbud RI NPSN: K9989761 • Kemnaker RI VIN: 2203320101",
    imageSrc: "/images/legalitas/sertifikat-tira.jpg",
    aspect: "landscape",
    badge: "Terapis Ikhwan Bersertifikat",
    badgeTone: "bg-blue-50 text-blue-800 border-blue-200",
    status: "Kompeten",
    summary: "Sertifikasi keahlian terapis ikhwan muda untuk mendukung operasional layanan bekam cepat, steril, dan tertib antrean.",
    description:
      "Sertifikat kompetensi keahlian bekam dari ELPIKHI yang diberikan kepada Yudistira Pradana. Mendukung kelancaran layanan antrean dual-lane di klinik Bekam Bintan Therapy dengan standar higienitas single-use lancet.",
    highlights: [
      "Terapis Ikhwan muda kompeten dan energik",
      "Terlatih dalam protokol sanitasi bilik, penanganan jarum sekali pakai, dan skrining tensi",
      "Mendukung layanan antrean cepat dual-lane tanpa menunggu lama",
      "Lulus pelatihan standar ELPIKHI binaan Kemendikbud & Kemnaker",
    ],
    keyData: [
      { label: "Nomor Sertifikat", value: "011/BKM/TSR/LKP-ELPIKHI PST/V/23" },
      { label: "Nama Terapis", value: "YUDISTIRA PRADANA" },
      { label: "Program Pelatihan", value: "BEKAM TIKSAR (Titik Dasar)" },
      { label: "Lembaga Penguji", value: "LKP ELPIKHI (Kemendikbud & Kemnaker)" },
      { label: "Peran di Klinik", value: "Terapis Ikhwan & Asisten Pelayanan" },
    ],
  },
];

const COMPLIANCE_PILLARS = [
  {
    icon: Stethoscope,
    title: "Izin Dinas Kesehatan (STPT)",
    basis: "Permenkes No. 1076/Menkes/SK/VII/2003",
    desc: "Praktik terdaftar resmi dengan Surat Terdaftar Pengobat Tradisional (STPT) No. 001/Yankes/Batra/VII/2013 di bawah pembinaan Dinkes Pemkab Bintan dan tembusan ke Dinkes Provinsi Kepri serta Puskesmas Teluk Sasah.",
    tone: "from-teal-600 to-teal-800",
  },
  {
    icon: Building2,
    title: "Legalitas Usaha Nasional (OSS BKPM)",
    basis: "UU Cipta Kerja No. 6/2023 & KBLI 86902",
    desc: "Memiliki Nomor Induk Berusaha (NIB 2310230115406) dan Sertifikat Standar DPMPTSP Kab. Bintan untuk klasifikasi resmi Aktivitas Pelayanan Kesehatan Tradisional.",
    tone: "from-emerald-600 to-emerald-800",
  },
  {
    icon: Award,
    title: "Anggota Asosiasi Profesi ITBI",
    basis: "Keanggotaan Nasional No. 000341.00014.0003293",
    desc: "Tergabung secara sah dalam Ikatan Terapis Bekam Indonesia (ITBI) Pusat, tunduk pada kode etik profesi, standarisasi titik anatomis bekam, serta prosedur penanganan aman.",
    tone: "from-sky-600 to-sky-800",
  },
  {
    icon: ShieldCheck,
    title: "100% Jarum & Kop Steril Sekali Pakai",
    basis: "Protokol Pencegahan Infeksi Silang",
    desc: "Setiap tindakan menggunakan jarum lancet steril sekali pakai (single-use) dan kop steril yang dibuka baru di depan pasien. Limbah medis tajam dibuang pada safety box khusus.",
    tone: "from-amber-600 to-amber-800",
  },
];

const LEGAL_FAQS = [
  {
    q: "Apakah Bekam Bintan Therapy memiliki izin resmi dari pemerintah?",
    a: "Ya, sangat resmi. Klinik Bekam Bintan Therapy mengantongi izin Surat Terdaftar Pengobat Tradisional (STPT No. 001/Yankes/Batra/VII/2013) dari Dinas Kesehatan Kabupaten Bintan, Nomor Induk Berusaha (NIB 2310230115406) dari Pemerintah RI via Lembaga OSS BKPM, serta Sertifikat Standar KBLI 86902 dari DPMPTSP Kabupaten Bintan.",
  },
  {
    q: "Bagaimana cara memverifikasi keaslian dokumen legalitas ini?",
    a: "Salinan asli seluruh surat izin dan sertifikat terpajang secara transparan di ruang resepsionis klinik (Jl. Indunsuri No. 116C, Teluk Sasah). Selain itu, NIB dan Sertifikat Standar dapat diverifikasi melalui sistem OSS resmi Pemerintah RI menggunakan barcode tanda tangan elektronik Balai Sertifikasi Elektronik (BSrE - BSSN).",
  },
  {
    q: "Apakah seluruh terapis memiliki sertifikat keahlian resmi?",
    a: "Ya. Praktisi utama (Sabarrudin), kepala terapis akhwat (Ildawati), dan terapis ikhwan (Yudistira Pradana) seluruhnya mengantongi sertifikat pelatihan kompetensi Bekam Tiksar dari ELPIKHI yang terakreditasi Kemendikbud RI dan Kemnaker RI, serta keanggotaan Ikatan Terapis Bekam Indonesia (ITBI).",
  },
  {
    q: "Apakah jarum dan kop bekam benar-benar sekali pakai?",
    a: "Pasti 100%. Kami memegang prinsip syar'i dan higienitas mutlak: jarum lancet steril dan kop dibuka segel barunya langsung di hadapan pasien saat tindakan dimulai. Kami tidak pernah menggunakan kembali jarum atau alat invasif untuk pasien yang berbeda guna mencegah penularan penyakit.",
  },
  {
    q: "Bagaimana perlindungan privasi dan kenyamanan bagi pasien wanita?",
    a: "Kami menerapkan sistem pemisahan syar'i penuh: jalur pendaftaran terpisah, bilik terapi tertutup rapat yang terpisah antara ikhwan dan akhwat, serta terapis wanita (akhwat) bersertifikat yang khusus melayani pasien wanita.",
  },
];

/* -------------------------------------------------------------------------- */
/*                               Main Component                               */
/* -------------------------------------------------------------------------- */

export function LegalitasView() {
  const [activeTab, setActiveTab] = React.useState<DocumentCategory>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDoc, setSelectedDoc] = React.useState<LegalDocument | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [isZoomed, setIsZoomed] = React.useState(false);

  // Filter documents
  const filteredDocs = React.useMemo(() => {
    return LEGAL_DOCUMENTS.filter((doc) => {
      const matchCategory = activeTab === "all" || doc.category === activeTab;
      const query = searchQuery.trim().toLowerCase();
      if (!query) return matchCategory;

      const matchQuery =
        doc.title.toLowerCase().includes(query) ||
        doc.regNumber.toLowerCase().includes(query) ||
        doc.issuer.toLowerCase().includes(query) ||
        doc.signatory.toLowerCase().includes(query) ||
        doc.summary.toLowerCase().includes(query);

      return matchCategory && matchQuery;
    });
  }, [activeTab, searchQuery]);

  // Copy handler
  const handleCopy = (id: string, text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Keyboard navigation for modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedDoc) return;
      if (e.key === "Escape") {
        setSelectedDoc(null);
        setIsZoomed(false);
      } else if (e.key === "ArrowRight") {
        navigateModal("next");
      } else if (e.key === "ArrowLeft") {
        navigateModal("prev");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDoc]);

  const navigateModal = (direction: "next" | "prev") => {
    if (!selectedDoc) return;
    const currentIndex = LEGAL_DOCUMENTS.findIndex((d) => d.id === selectedDoc.id);
    if (currentIndex === -1) return;

    let nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= LEGAL_DOCUMENTS.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = LEGAL_DOCUMENTS.length - 1;

    setSelectedDoc(LEGAL_DOCUMENTS[nextIndex]);
    setIsZoomed(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Background Effects */}
        <div className="bg-islamic-pattern absolute inset-0 opacity-50" />
        <div className="animate-glow-pulse pointer-events-none absolute -left-28 -top-28 h-96 w-96 rounded-full bg-teal-500/25 blur-3xl" />
        <div className="animate-glow-pulse pointer-events-none absolute -bottom-36 right-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl [animation-delay:2.5s]" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-18 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="animate-fade-up mb-6 flex items-center gap-2 text-xs text-slate-400"
            style={{ animationDelay: "0ms" }}
          >
            <Link href="/" className="hover:text-teal-300 transition-colors">
              Beranda
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <Link href="/profil" className="hover:text-teal-300 transition-colors">
              Profil Klinik
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <span className="font-semibold text-teal-300">Legalitas & Sertifikasi Resmi</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left Hero Content */}
            <div className="space-y-5 lg:col-span-7">
              <div
                className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs font-semibold text-teal-200 backdrop-blur"
                style={{ animationDelay: "100ms" }}
              >
                <ShieldCheck className="h-4 w-4 text-amber-300" />
                Dokumen Legalitas & Perizinan Praktik Terdaftar Resmi
              </div>

              <h1
                className="animate-fade-up text-3xl font-black leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl"
                style={{ animationDelay: "200ms" }}
              >
                Transparansi Legalitas &amp;{" "}
                <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-amber-200 bg-clip-text text-transparent">
                  Sertifikasi Resmi
                </span>
              </h1>

              <p
                className="animate-fade-up max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base"
                style={{ animationDelay: "300ms" }}
              >
                Kepercayaan pasien adalah amanah syariat tertinggi bagi kami. Pelayanan{" "}
                <strong className="text-white">Bekam Bintan Therapy</strong> dinaungi izin sah{" "}
                <strong className="text-teal-200">Dinas Kesehatan Kabupaten Bintan (STPT No. 001)</strong>,{" "}
                Nomor Induk Berusaha nasional <strong className="text-teal-200">OSS BKPM</strong>, keanggotaan resmi{" "}
                <strong className="text-teal-200">Ikatan Terapis Bekam Indonesia (ITBI)</strong>, serta sertifikat kompetensi
                seluruh tenaga terapis.
              </p>

              {/* Action Buttons */}
              <div
                className="animate-fade-up flex flex-wrap items-center gap-3 pt-2"
                style={{ animationDelay: "400ms" }}
              >
                <a
                  href="#galeri-dokumen"
                  id="hero-lihat-dokumen"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/40"
                >
                  <FileText className="h-4 w-4" />
                  Lihat 7 Salinan Dokumen Asli
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>

                <Link
                  href="/antrean#form-antrean"
                  id="hero-daftar-antrean"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
                >
                  Daftar Antrean Online
                </Link>
              </div>
            </div>

            {/* Right Hero Highlights Box */}
            <div
              className="animate-fade-up lg:col-span-5"
              style={{ animationDelay: "250ms" }}
            >
              <div className="relative rounded-3xl border border-teal-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 ring-1 ring-teal-500/30">
                      <BadgeCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white">Status Legalitas Praktik</h2>
                      <p className="text-[11px] text-teal-300">Terdaftar &amp; Aktif Beroperasi</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300 ring-1 ring-emerald-500/30">
                    Aktif 2026
                  </span>
                </div>

                <div className="mt-5 space-y-3.5 text-xs">
                  <div className="flex items-start justify-between gap-3 rounded-xl bg-white/[0.04] p-3 border border-white/5">
                    <div>
                      <p className="text-[11px] text-slate-400">Surat Terdaftar Dinkes Bintan</p>
                      <p className="font-mono font-bold text-white text-xs mt-0.5">
                        001/Yankes/Batra/VII/2013
                      </p>
                    </div>
                    <span className="shrink-0 rounded bg-teal-500/20 px-2 py-0.5 text-[10px] font-semibold text-teal-200">
                      Izin No. 001
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-xl bg-white/[0.04] p-3 border border-white/5">
                    <div>
                      <p className="text-[11px] text-slate-400">Nomor Induk Berusaha (OSS)</p>
                      <p className="font-mono font-bold text-white text-xs mt-0.5">
                        2310230115406
                      </p>
                    </div>
                    <span className="shrink-0 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                      BKPM RI
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-xl bg-white/[0.04] p-3 border border-white/5">
                    <div>
                      <p className="text-[11px] text-slate-400">Keanggotaan Nasional ITBI</p>
                      <p className="font-mono font-bold text-white text-xs mt-0.5">
                        000341.00014.0003293
                      </p>
                    </div>
                    <span className="shrink-0 rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                      DPP ITBI
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3 rounded-xl bg-white/[0.04] p-3 border border-white/5">
                    <div>
                      <p className="text-[11px] text-slate-400">Sertifikat Standar DPMPTSP Bintan</p>
                      <p className="font-mono font-bold text-white text-xs mt-0.5">
                        KBLI 86902 (Pelayanan Tradisional)
                      </p>
                    </div>
                    <span className="shrink-0 rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-semibold text-sky-200">
                      Terstandar
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-white/10 pt-4 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-teal-300">
                    <Lock className="h-3.5 w-3.5" />
                    Dokumen Otentik Terverifikasi
                  </span>
                  <span>100% Jarum &amp; Kop Steril</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="relative border-t border-white/10 bg-white/[0.03] backdrop-blur">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-white/10 px-4 sm:px-6 md:grid-cols-4 md:divide-x lg:px-8">
            <div className="flex items-center gap-3 px-2 py-5 md:justify-center">
              <Calendar className="h-5 w-5 text-teal-300 shrink-0" />
              <div>
                <p className="text-xl font-black text-white">2013 - 2026</p>
                <p className="text-[11px] text-slate-400">Izin Terdaftar Sejak 2013</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 py-5 md:justify-center">
              <Building2 className="h-5 w-5 text-teal-300 shrink-0" />
              <div>
                <p className="text-xl font-black text-white">3 Instansi</p>
                <p className="text-[11px] text-slate-400">Dinkes, BKPM &amp; DPMPTSP</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 py-5 md:justify-center">
              <Award className="h-5 w-5 text-teal-300 shrink-0" />
              <div>
                <p className="text-xl font-black text-white">ITBI Pusat</p>
                <p className="text-[11px] text-slate-400">Ikatan Terapis Bekam Indonesia</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 py-5 md:justify-center">
              <UserCheck className="h-5 w-5 text-teal-300 shrink-0" />
              <div>
                <p className="text-xl font-black text-white">3 Terapis</p>
                <p className="text-[11px] text-slate-400">Bersertifikasi ELPIKHI Resmi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PILAR KEPASTIAN HUKUM ===================== */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-800">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
              Kepastian &amp; Keamanan Pasien
            </span>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              4 Pilar Kepatuhan Hukum &amp; Standar Klinis
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Setiap prosedur tindakan bekam dan thibbun nabawi diselenggarakan dengan memenuhi kaidah
              regulasi nasional serta protokol sterilitas bebas infeksi silang.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {COMPLIANCE_PILLARS.map((p, idx) => (
              <div
                key={p.title}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:bg-white hover:shadow-xl hover:shadow-teal-900/5"
              >
                <div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.tone} text-white shadow-md shadow-teal-900/10 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <p.icon className="h-6 w-6" />
                  </div>
                  <span className="mt-4 inline-block text-[10px] font-bold uppercase tracking-wide text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Pilar 0{idx + 1}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-slate-900">{p.title}</h3>
                  <p className="mt-1 text-[11px] font-medium text-teal-800">{p.basis}</p>
                  <p className="mt-3 text-xs leading-relaxed text-slate-600">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== GALERI & KATALOG DOKUMEN ===================== */}
      <section id="galeri-dokumen" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-slate-200">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-800">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                Arsip Sertifikat &amp; Izin Resmi
              </span>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Dokumen Bukti Otentik (Salinan Asli)
              </h2>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl">
                Klik pada dokumen untuk melihat salinan resolusi tinggi, rincian nomor surat, pejabat
                penandatangan, serta dasar hukum legalitas.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama dokumen, nomor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white py-2 pl-9 pr-4 text-xs font-medium placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            {[
              { id: "all" as const, label: "Semua Dokumen", count: 7 },
              { id: "pemerintah" as const, label: "Izin Pemerintah & Pemda", count: 3 },
              { id: "asosiasi" as const, label: "Asosiasi Profesi ITBI", count: 1 },
              { id: "terapis" as const, label: "Sertifikasi Terapis", count: 3 },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-teal-700 text-white shadow-md shadow-teal-800/20"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Documents Grid */}
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => {
              const isCopied = copiedId === doc.id;
              return (
                <article
                  key={doc.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-400 hover:shadow-xl hover:shadow-slate-900/10"
                >
                  {/* Top Image Preview with Overlay */}
                  <div
                    onClick={() => setSelectedDoc(doc)}
                    className="relative cursor-pointer overflow-hidden bg-slate-100 border-b border-slate-100"
                    style={{
                      height: doc.aspect === "portrait" ? "280px" : "220px",
                    }}
                  >
                    <Image
                      src={doc.imageSrc}
                      alt={doc.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Hover Inspect Overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-slate-900 shadow-xl backdrop-blur">
                        <Maximize2 className="h-3.5 w-3.5 text-teal-600" />
                        Klik untuk Perbesar
                      </span>
                    </div>

                    {/* Top Status Badge */}
                    <div className="absolute left-3 top-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold shadow-xs backdrop-blur-md ${doc.badgeTone}`}
                      >
                        <ShieldCheck className="h-3 w-3" />
                        {doc.badge}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3">
                      <span className="inline-block rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                        {doc.status}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                          {doc.categoryLabel}
                        </span>
                        <h3 className="mt-1 text-base font-bold leading-snug text-slate-900 group-hover:text-teal-700 transition-colors">
                          {doc.title}
                        </h3>
                      </div>

                      {/* Reg Number with Copy */}
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                        <div className="min-w-0 pr-2">
                          <p className="text-[10px] uppercase font-semibold text-slate-400">
                            No. Registrasi / SK
                          </p>
                          <p className="truncate font-mono text-xs font-bold text-slate-800">
                            {doc.regNumber}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(doc.id, doc.regNumber);
                          }}
                          title="Salin Nomor Registrasi"
                          className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-white hover:text-teal-700 border border-transparent hover:border-slate-200 transition-colors"
                        >
                          {isCopied ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                              <Check className="h-3.5 w-3.5" />
                              Tersalin
                            </span>
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Meta List */}
                      <dl className="space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-1.5">
                          <dt className="text-slate-400">Penerbit:</dt>
                          <dd className="font-medium text-slate-800 text-right">{doc.issuer}</dd>
                        </div>
                        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-1.5">
                          <dt className="text-slate-400">Tanggal:</dt>
                          <dd className="font-medium text-slate-800 text-right">{doc.issueDate}</dd>
                        </div>
                        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-1.5">
                          <dt className="text-slate-400">Pejabat:</dt>
                          <dd className="font-medium text-slate-800 text-right truncate max-w-[180px]" title={doc.signatory}>
                            {doc.signatory}
                          </dd>
                        </div>
                      </dl>

                      {/* Highlights */}
                      <ul className="space-y-1.5 pt-1">
                        {doc.highlights.slice(0, 2).map((h) => (
                          <li key={h} className="flex items-start gap-2 text-[11px] text-slate-600">
                            <span className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDoc(doc)}
                        className="w-full gap-1.5 text-xs font-semibold border-slate-200 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800"
                      >
                        <Maximize2 className="h-3.5 w-3.5 text-teal-600" />
                        Perbesar Salinan
                      </Button>

                      <a
                        href={doc.imageSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-teal-500 hover:text-teal-700 hover:bg-slate-50 transition-colors"
                        title="Buka File Asli di Tab Baru"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredDocs.length === 0 && (
            <div className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-slate-400" />
              <h3 className="mt-4 text-base font-bold text-slate-800">
                Tidak ada dokumen yang cocok
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Pencarian &quot;{searchQuery}&quot; tidak menghasilkan berkas. Silakan coba kata kunci lain.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
                className="mt-4"
              >
                Reset Pencarian
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ===================== TABEL MATRIKS VERIFIKASI ===================== */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                Data Ringkasan Terpusat
              </span>
              <h2 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
                Matriks Dokumen Perizinan &amp; Akreditasi
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Data terdaftar resmi pada database instansi berwenang Republik Indonesia
            </p>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">
                      No
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Nama Dokumen
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Nomor Registrasi / SK
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Instansi Pengesah
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Tanggal Penetapan
                    </th>
                    <th scope="col" className="px-5 py-3.5">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {LEGAL_DOCUMENTS.map((doc, index) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-teal-50/40 transition-colors cursor-pointer"
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <td className="px-5 py-3.5 font-bold text-slate-400">{index + 1}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900">{doc.shortTitle}</div>
                        <div className="text-[10px] text-teal-700">{doc.categoryLabel}</div>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-semibold text-slate-800">
                        {doc.regNumber}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{doc.issuer}</td>
                      <td className="px-5 py-3.5 text-slate-500">{doc.issueDate}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                          <Check className="h-3 w-3" />
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDoc(doc);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
                        >
                          Lihat
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PROTOKOL HIGIENITAS & MEDIS ===================== */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-300">
                <Sparkles className="h-3.5 w-3.5" />
                Standar Mutu Klinis &amp; Sterilitas
              </span>

              <h2 className="text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
                Jaminan Perlindungan Pasien:{" "}
                <span className="text-teal-300">100% Bebas Kontaminasi Silang</span>
              </h2>

              <p className="text-sm leading-relaxed text-slate-300">
                Kepatuhan hukum tidak hanya sebatas selembar kertas perizinan, namun terejawantahkan
                dalam praktek kebersihan nyata setiap harinya. Kami menerapkan standar ketat untuk menjamin
                keselamatan dan ketenangan setiap pasien:
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-4 border border-white/10">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Jarum Lancet &amp; Kop Sekali Pakai (Single-Use)
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      Seluruh jarum lancet steril dan kop dibuka baru di depan pasien saat terapi dimulai.
                      Tidak ada alat tindakan luka yang dipakai ulang.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-4 border border-white/10">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Terapis Bersertifikat Sesama Jenis (Syar&apos;i Penuh)
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      Pasien pria ditangani terapis ikhwan bersertifikat; pasien wanita ditangani terapis
                      akhwat bersertifikat di dalam bilik terpisah yang tertutup rapat.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-4 border border-white/10">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Skrining Tensi &amp; Riwayat Keluhan Gratis
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      Sebelum tindakan, tekanan darah pasien diperiksa untuk memastikan keamanan kondisi fisik
                      dan menentukan titik-titik terapi yang paling sesuai sunnah dan anatomi.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Alamat & Kontak Resmi */}
            <div className="rounded-3xl border border-white/10 bg-slate-950 p-8 shadow-2xl">
              <h3 className="text-lg font-bold text-white">Pusat Pelayanan &amp; Tempat Praktik</h3>
              <p className="mt-1 text-xs text-slate-400">
                Sesuai penetapan izin DPMPTSP Bintan &amp; STPT Dinkes
              </p>

              <div className="mt-6 space-y-4 text-xs">
                <div className="flex items-start gap-3 rounded-2xl bg-white/[0.04] p-4 border border-white/5">
                  <MapPin className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Alamat Resmi Klinik:</p>
                    <p className="mt-1 text-slate-300 leading-relaxed">
                      Jl. Indunsuri No. 116C RT 001 / RW 001, Taman Kota, Desa Teluk Sasah,
                      Kecamatan Seri Kuala Lobam, Kabupaten Bintan, Kepulauan Riau — Kode Pos: 29152
                    </p>
                    <p className="mt-1 text-[11px] text-teal-300 font-medium">
                      (Melayani wilayah Tanjung Uban, Kawasan Industri Lobam &amp; sekitarnya)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-white/[0.04] p-4 border border-white/5">
                  <Phone className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-white">Kontak WhatsApp Resmi:</p>
                    <p className="text-slate-300">
                      Terapis Ikhwan (Pria):{" "}
                      <a href="https://wa.me/6281268320072" className="text-teal-300 font-mono font-bold hover:underline">
                        0812-6832-0072
                      </a>
                    </p>
                    <p className="text-slate-300">
                      Terapis Akhwat (Wanita):{" "}
                      <a href="https://wa.me/6281275302567" className="text-teal-300 font-mono font-bold hover:underline">
                        0812-7530-2567
                      </a>
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-teal-900/60 to-emerald-900/60 p-4 border border-teal-500/30">
                  <p className="text-xs font-bold text-amber-200">Semboyan Pelayanan Kami:</p>
                  <p className="text-xs italic text-slate-200 mt-1">
                    &ldquo;Biaya Terapi Pengobatan Kami Murah, Mujarab, Halal, dan Insya Allah Barokah.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAQ SEPUTAR LEGALITAS ===================== */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-teal-800">
              <HelpCircle className="h-3.5 w-3.5 text-teal-600" />
              Tanya Jawab Pasien
            </span>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Pertanyaan Seputar Legalitas &amp; Keamanan Praktik
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Pertanyaan umum yang sering ditanyakan oleh calon pasien mengenai izin dan standar operasional kami.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {LEGAL_FAQS.map((faq, index) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-teal-300 open:bg-teal-50/20"
              >
                <summary className="flex cursor-pointer items-center justify-between font-bold text-slate-900 text-sm">
                  <span className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-black text-teal-800">
                      {index + 1}
                    </span>
                    {faq.q}
                  </span>
                  <span className="ml-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-teal-700">
                    ▼
                  </span>
                </summary>
                <div className="mt-3 pl-9 text-xs leading-relaxed text-slate-600 border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CALL TO ACTION ===================== */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-teal-900 via-teal-800 to-slate-950 p-8 text-white shadow-2xl sm:p-12 lg:p-16">
            <div className="bg-islamic-pattern absolute inset-0 opacity-30" />
            <div className="relative mx-auto max-w-3xl text-center space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/20 px-4 py-1 text-xs font-bold text-teal-200">
                <ShieldCheck className="h-4 w-4 text-amber-300" />
                Terapi Bekam Aman, Resmi, &amp; Syar&apos;i
              </span>

              <h2 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl leading-tight">
                Ikhtiar Kesembuhan Alami dengan Tenang &amp; Percaya Diri
              </h2>

              <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                Daftarkan antrean terapi Anda secara online lewat sistem <strong>Bekam Smart Queue</strong>{" "}
                atau konsultasikan langsung keluhan Anda bersama tim terapis berizin resmi kami.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/antrean#form-antrean"
                  id="cta-daftar-antrean"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/40 hover:scale-[1.02]"
                >
                  Ambil Antrean Terapi Sekarang
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <a
                  href="https://wa.me/6281268320072?text=Assalamu%27alaikum%20Bekam%20Bintan%20Therapy,%20saya%20ingin%20konsultasi%20mengenai%20layanan%20bekam%20steril."
                  target="_blank"
                  rel="noopener noreferrer"
                  id="cta-wa-konsultasi"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  <Phone className="h-4 w-4 text-teal-300" />
                  Konsultasi via WhatsApp
                </a>

                <Link
                  href="/profil"
                  id="cta-ke-profil"
                  className="inline-flex items-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-teal-200 hover:text-white transition-colors"
                >
                  Lihat Profil Lengkap Klinik
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== INTERACTIVE LIGHTBOX MODAL ===================== */}
      {selectedDoc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => {
            setSelectedDoc(null);
            setIsZoomed(false);
          }}
        >
          <div
            className="relative flex flex-col lg:flex-row max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Image View Area */}
            <div className="relative flex flex-1 items-center justify-center bg-slate-950/95 p-4 overflow-auto min-h-[350px] lg:min-h-[550px]">
              {/* Floating Toolbar on top of Image */}
              <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                <span className="rounded-full bg-slate-900/90 border border-white/10 px-3 py-1 text-[11px] font-bold text-teal-300 backdrop-blur">
                  {selectedDoc.badge}
                </span>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                  {selectedDoc.status}
                </span>
              </div>

              {/* Prev / Next buttons inside viewer */}
              <button
                type="button"
                onClick={() => navigateModal("prev")}
                title="Dokumen Sebelumnya (Panah Kiri)"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                type="button"
                onClick={() => navigateModal("next")}
                title="Dokumen Berikutnya (Panah Kanan)"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image Preview Container */}
              <div
                className={`relative transition-all duration-300 ${
                  isZoomed
                    ? "cursor-zoom-out scale-125 md:scale-150"
                    : "cursor-zoom-in max-h-[80vh] w-full h-[380px] lg:h-[520px]"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <Image
                  src={selectedDoc.imageSrc}
                  alt={selectedDoc.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 90vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Bottom image control bar */}
              <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-slate-300">
                <span className="hidden sm:inline">
                  Klik gambar untuk {isZoomed ? "perkecil" : "perbesar (zoom)"}
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs text-white hover:bg-white/20"
                  >
                    {isZoomed ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    {isZoomed ? "Reset Zoom" : "Perbesar"}
                  </button>
                  <a
                    href={selectedDoc.imageSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-teal-500"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Resolusi Penuh
                  </a>
                </div>
              </div>
            </div>

            {/* Right Information Dossier */}
            <div className="flex w-full lg:w-96 flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 bg-white p-6 overflow-y-auto max-h-[50vh] lg:max-h-[92vh]">
              <div>
                {/* Header with Close */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                      {selectedDoc.categoryLabel}
                    </span>
                    <h3 className="mt-0.5 text-base font-black text-slate-900 leading-tight">
                      {selectedDoc.shortTitle}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDoc(null);
                      setIsZoomed(false);
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Reg Number Box */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-teal-50/70 p-3 border border-teal-200">
                  <div className="min-w-0 pr-2">
                    <p className="text-[10px] uppercase font-bold text-teal-800">
                      Nomor Registrasi Resmi
                    </p>
                    <p className="font-mono text-xs font-black text-teal-900 break-all">
                      {selectedDoc.regNumber}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedDoc.id, selectedDoc.regNumber)}
                    className="shrink-0 rounded-lg bg-white p-2 text-teal-700 shadow-xs border border-teal-200 hover:bg-teal-100/50"
                    title="Salin Nomor"
                  >
                    {copiedId === selectedDoc.id ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {selectedDoc.description}
                </p>

                {/* Key Details List */}
                <div className="mt-4 space-y-2 text-xs">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Informasi Verifikasi
                  </p>
                  <dl className="space-y-1.5">
                    {selectedDoc.keyData.map((kd) => (
                      <div
                        key={kd.label}
                        className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 border-b border-slate-100 pb-1.5"
                      >
                        <dt className="text-slate-500 text-[11px]">{kd.label}:</dt>
                        <dd className="font-semibold text-slate-900 text-right sm:max-w-[200px] break-words">
                          {kd.value}
                        </dd>
                      </div>
                    ))}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 border-b border-slate-100 pb-1.5">
                      <dt className="text-slate-500 text-[11px]">Pejabat Pengesah:</dt>
                      <dd className="font-semibold text-slate-900 text-right sm:max-w-[200px] break-words">
                        {selectedDoc.signatory}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Legal Basis Notice */}
                <div className="mt-4 rounded-xl bg-slate-50 p-3 border border-slate-200 text-[11px] text-slate-600">
                  <p className="font-bold text-slate-800">Landasan Hukum:</p>
                  <p className="mt-0.5 leading-relaxed text-slate-500">{selectedDoc.legalBasis}</p>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col gap-2">
                <Link
                  href="/antrean#form-antrean"
                  className="w-full text-center rounded-xl bg-teal-700 py-2.5 text-xs font-bold text-white hover:bg-teal-800 transition-colors"
                >
                  Daftar Antrean dengan Terapis Ini
                </Link>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <button
                    type="button"
                    onClick={() => navigateModal("prev")}
                    className="hover:text-teal-700 font-semibold"
                  >
                    &larr; Sebelumnya
                  </button>
                  <span className="text-[11px]">
                    {LEGAL_DOCUMENTS.findIndex((d) => d.id === selectedDoc.id) + 1} dari{" "}
                    {LEGAL_DOCUMENTS.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigateModal("next")}
                    className="hover:text-teal-700 font-semibold"
                  >
                    Berikutnya &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
