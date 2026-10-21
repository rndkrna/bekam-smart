import { z } from "zod";

// Phone validation pattern for Indonesia (08... or +628... or 628...)
const indonesianPhoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;

export const queueRegistrationSchema = z.object({
  fullName: z
    .string()
    .min(3, "Nama lengkap minimal 3 karakter")
    .max(80, "Nama lengkap maksimal 80 karakter")
    .trim(),
  phone: z
    .string()
    .trim()
    .regex(
      indonesianPhoneRegex,
      "Format nomor WhatsApp / HP tidak valid (contoh: 08123456789 atau +628123456789)"
    ),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Pilih jalur gender antrean (Pria / Wanita)",
  }),
  serviceId: z.string().min(1, "Silakan pilih paket terapi bekam"),
  complaints: z
    .string()
    .max(500, "Keluhan maksimal 500 karakter")
    .optional()
    .or(z.literal("")),
  isFirstVisit: z.boolean().default(false),
  hasEatenMeal: z.boolean().refine((val) => val === true, {
    message: "Pasien disarankan sudah makan ringan 1-2 jam sebelum berbekam",
  }),
  contraindicationConfirmed: z.boolean().refine((val) => val === true, {
    message: "Konfirmasi kesediaan skrining kontraindikasi sebelum terapi",
  }),
});

export type QueueRegistrationInput = z.infer<typeof queueRegistrationSchema>;

export const ticketLookupSchema = z.object({
  query: z
    .string()
    .min(3, "Masukkan minimal 3 karakter kode tiket atau token rahasia")
    .trim(),
});

export type TicketLookupInput = z.infer<typeof ticketLookupSchema>;

export const statusTransitionSchema = z.object({
  queueId: z.string().uuid("ID antrean tidak valid"),
  status: z.enum([
    "WAITING",
    "CALLED",
    "IN_THERAPY",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
  ]),
  roomId: z.string().uuid().optional().nullable(),
  therapistId: z.string().uuid().optional().nullable(),
  reason: z.string().max(250).optional(),
});

export type StatusTransitionInput = z.infer<typeof statusTransitionSchema>;

export const medicalScreeningInputSchema = z.object({
  queueTicketId: z.string().uuid(),
  systolicBP: z
    .number()
    .min(60, "Sistolik minimal 60 mmHg")
    .max(240, "Sistolik maksimal 240 mmHg"),
  diastolicBP: z
    .number()
    .min(40, "Diastolik minimal 40 mmHg")
    .max(140, "Diastolik maksimal 140 mmHg"),
  bloodSugarMgDl: z.number().min(30).max(600).optional().nullable(),
  pulseRateBpm: z.number().min(40).max(180).optional().nullable(),
  hasHemophilia: z.boolean().default(false),
  hasSevereAnemia: z.boolean().default(false),
  isTakingBloodThinner: z.boolean().default(false),
  isPregnant: z.boolean().default(false),
  hasAcuteInfection: z.boolean().default(false),
  hasLowBloodPressure: z.boolean().default(false),
  complaints: z.string().optional(),
  isEligibleForCupping: z.boolean().default(true),
  screeningNotes: z.string().optional(),
});

export type MedicalScreeningInput = z.infer<typeof medicalScreeningInputSchema>;
