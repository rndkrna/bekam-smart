"use client";

import * as React from "react";
import {
  Clock,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INITIAL_SERVICES, TherapyServiceItem } from "@/lib/data/mock-data";
import { formatIDR } from "@/lib/utils";

interface ServiceCatalogProps {
  onSelectService?: (serviceId: string) => void;
}

export function ServiceCatalog({ onSelectService }: ServiceCatalogProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Semua");

  const categories = [
    "Semua",
    "Sunnah Medis",
    "Spesialis Kepala",
    "Relaksasi",
    "Estetika",
  ];

  const filteredServices =
    selectedCategory === "Semua"
      ? INITIAL_SERVICES
      : INITIAL_SERVICES.filter((s) => s.category === selectedCategory);

  const handleChoose = (serviceId: string) => {
    if (onSelectService) {
      onSelectService(serviceId);
    }
    const regSection = document.getElementById("registrasi");
    if (regSection) {
      regSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="layanan" className="py-16 md:py-24 bg-white dark:bg-slate-950 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-bold text-teal-800 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Katalog Layanan & Tarif Resmi
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Pilihan Paket Terapi Bekam
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Setiap paket sudah mencakup konsultasi pra-bekam, cek tekanan darah,
            minyak relaksasi zaitun murni, serta set jarum dan kop steril berstandar ITBI & Dinkes Bintan.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-teal-700 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className={`flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-teal-400 dark:hover:border-teal-700 ${
                service.isPopular
                  ? "border-2 border-teal-600 shadow-md ring-1 ring-teal-500/20"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <CardContent className="p-6 space-y-5">
                {/* Header Tag & Title */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      {service.category}
                    </span>
                    {service.isPopular && (
                      <Badge variant="in_therapy" className="text-[10px] uppercase font-bold tracking-wider">
                        Paling Dipilih
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {service.name}
                  </h3>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-4 py-2 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-4 w-4 text-teal-600" />
                    <span>{service.durationMinutes} Menit</span>
                  </div>
                </div>

                {/* Benefits Bullet List */}
                <div className="space-y-2 pt-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-200">
                    Manfaat & Fasilitas:
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Days */}
                <div className="flex items-center gap-2 rounded-lg bg-amber-50/80 px-3 py-2 text-[11px] text-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                  <Calendar className="h-3.5 w-3.5 text-amber-700 shrink-0" />
                  <span>Waktu Utama: {service.recommendedDays}</span>
                </div>

                {/* Pricing & Selection CTA */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      Biaya Terapi
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {formatIDR(service.price)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleChoose(service.id)}
                    className="gap-1.5 text-xs font-semibold"
                  >
                    Pilih Layanan
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
