import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bekam Bintan Therapy • Sistem Antrean & Terapi Thibbun Nabawi Bintan",
  description:
    "Sistem antrean cerdas dual-lane (Ikhwan & Akhwat) Bekam Bintan Therapy. Pusat terapi bekam steril, al fashdu, terapi lintah medis, gurah hidung, dan home care untuk wilayah Bintan.",
  keywords: [
    "bekam bintan",
    "terapi bekam tanjung uban",
    "bekam bintan therapy",
    "al fashdu bintan",
    "terapi lintah bintan",
    "gurah hidung bintan",
    "thibbun nabawi bintan",
    "antrean bekam online",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-teal-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
