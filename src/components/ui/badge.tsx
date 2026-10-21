import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "waiting"
    | "called"
    | "in_therapy"
    | "completed"
    | "cancelled"
    | "available"
    | "cleaning"
    | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default:
      "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800",
    waiting:
      "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    called:
      "bg-sky-100 text-sky-800 border-sky-300 animate-pulse dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-700",
    in_therapy:
      "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700",
    completed:
      "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    cancelled:
      "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
    available:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
    cleaning:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
    outline:
      "border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function getStatusBadgeVariant(status: string): BadgeProps["variant"] {
  switch (status) {
    case "WAITING":
      return "waiting";
    case "CALLED":
      return "called";
    case "IN_THERAPY":
      return "in_therapy";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
    case "NO_SHOW":
      return "cancelled";
    case "AVAILABLE":
      return "available";
    case "CLEANING":
      return "cleaning";
    default:
      return "default";
  }
}

export function getStatusLabelIndonesian(status: string): string {
  switch (status) {
    case "WAITING":
      return "Menunggu";
    case "CALLED":
      return "Dipanggil Masuk";
    case "IN_THERAPY":
      return "Dalam Terapi";
    case "COMPLETED":
      return "Selesai";
    case "CANCELLED":
      return "Dibatalkan";
    case "NO_SHOW":
      return "Lewat / No-Show";
    default:
      return status;
  }
}
