"use client";

import * as React from "react";
import {
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { INITIAL_SERVICES } from "@/lib/data/mock-data";
import { formatIDR } from "@/lib/utils";

interface ServiceCatalogProps {
  onSelectService?: (serviceId: string) => void;
}

export function ServiceCatalog({ onSelectService }: ServiceCatalogProps) {
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
            Tarif Resmi Pelayanan
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Jenis Layanan & Tarif Terapi
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Pelayanan terapi thibbun nabawi higienis, steril, dan berizin resmi Dinkes Kabupaten Bintan.
          </p>
        </div>

        {/* Services Grid (Clean: Only Jenis Terapi, Harga, dan Waktu) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INITIAL_SERVICES.map((service) => (
            <Card
              key={service.id}
              className={`flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-teal-400 dark:hover:border-teal-700 bg-white dark:bg-slate-900 ${
                service.isPopular
                  ? "border-2 border-teal-600 shadow-md ring-1 ring-teal-500/20"
                  : "border border-slate-200 dark:border-slate-800"
              }`}
            >
              <CardContent className="p-6 flex flex-col justify-between h-full space-y-6">
                {/* Header: Jenis Terapi */}
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
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-snug">
                    {service.name}
                  </h3>
                </div>

                {/* Waktu / Durasi */}
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                  <Clock className="h-4 w-4 text-teal-600 shrink-0" />
                  <span className="text-xs font-semibold">
                    Waktu: {service.durationLabel || `${service.durationMinutes} Menit`}
                  </span>
                </div>

                {/* Harga & Tombol Aksi */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                      Harga
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {formatIDR(service.price)}
                      </span>
                      {service.priceUnit && (
                        <span className="text-xs font-bold text-slate-500">
                          {service.priceUnit}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleChoose(service.id)}
                    className="gap-1.5 text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white shrink-0 shadow-sm"
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
