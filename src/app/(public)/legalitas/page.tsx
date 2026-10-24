import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalitasView } from "@/components/legalitas/LegalitasView";

export const metadata: Metadata = {
  title: "Legalitas & Perizinan Resmi • Bekam Bintan Therapy",
  description:
    "Transparansi dokumen legalitas resmi Bekam Bintan Therapy: STPT Dinas Kesehatan Kab. Bintan No. 001/Yankes/Batra/VII/2013, NIB OSS Kemeninves/BKPM, Sertifikat Standar KBLI 86902, KTA DPP ITBI, dan sertifikasi kompetensi terapis.",
  keywords: [
    "legalitas bekam bintan",
    "STPT dinkes bintan",
    "STPT 001/Yankes/Batra/VII/2013",
    "terapis bekam bintan resmi",
    "izin bekam tanjung uban",
    "ITBI bintan",
    "bekam steril kepri",
    "pengobat tradisional bintan",
    "NIB bekam bintan",
  ],
  openGraph: {
    title: "Legalitas & Perizinan Resmi • Bekam Bintan Therapy",
    description:
      "Bukti otentik izin Dinkes Kab. Bintan STPT No. 001/Yankes/Batra/VII/2013, NIB OSS BKPM, keanggotaan ITBI, dan sertifikat kompetensi seluruh terapis.",
    url: "https://bekambintan.com/legalitas",
    siteName: "Bekam Bintan Therapy",
    locale: "id_ID",
    type: "website",
  },
};

export default function LegalitasPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <LegalitasView />
      </main>
      <Footer />
    </>
  );
}
