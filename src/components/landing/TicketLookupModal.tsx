"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, AlertCircle, Ticket, ArrowRight } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TicketLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TicketLookupModal({ isOpen, onClose }: TicketLookupModalProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSearch = async (targetQuery?: string) => {
    const q = (targetQuery ?? query).trim();
    if (!q) {
      setError("Silakan masukkan nomor tiket antrean atau kode token Anda.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Nomor tiket atau token tidak ditemukan.");
        setIsLoading(false);
        return;
      }

      onClose();
      // Redirect to digital ticket page using secretToken
      router.push(`/ticket/${data.data.secretToken}`);
    } catch {
      setError("Gagal menghubungi server. Periksa jaringan Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLookup = (code: string) => {
    setQuery(code);
    handleSearch(code);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cari Tiket Antrean Saya"
      description="Masukkan nomor antrean (misal: P-003, W-004) atau token rahasia tiket Anda."
    >
      <div className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Contoh: P-003 atau tk_p003_demo"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            icon={<Search className="h-4 w-4" />}
            autoFocus
          />
        </div>

        {/* Demo Quick Chips */}
        <div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            Coba contoh nomor antrean aktif:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickLookup("P-003")}
              className="rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-300 transition-colors"
            >
              P-003 (Ikhwan)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLookup("W-004")}
              className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 transition-colors"
            >
              W-004 (Akhwat)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLookup("P-002")}
              className="rounded-lg bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800 hover:bg-sky-100 dark:bg-sky-950 dark:text-sky-300 transition-colors"
            >
              P-002 (Dipanggil)
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            size="sm"
            onClick={() => handleSearch()}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            Buka Tiket
          </Button>
        </div>
      </div>
    </Modal>
  );
}
