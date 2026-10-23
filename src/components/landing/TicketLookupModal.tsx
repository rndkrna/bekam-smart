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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cari Tiket Antrean Saya"
      description="Masukkan nomor antrean atau token rahasia tiket Anda."
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
            placeholder="Masukkan nomor antrean atau token tiket"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            icon={<Search className="h-4 w-4" />}
            autoFocus
          />
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
