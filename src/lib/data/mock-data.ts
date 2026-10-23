export interface TherapyServiceItem {
  id: string;
  name: string;
  slug: string;
  category: "Terapi Bekam" | "Al Fashdu" | "Terapi Lintah" | "Gurah Hidung" | "Home Care" | "Sunnah Medis" | "Spesialis Kepala" | "Relaksasi" | "Estetika";
  description: string;
  durationMinutes: number;
  durationLabel?: string;
  cupQuantity: number;
  price: number;
  priceUnit?: string;
  isPopular: boolean;
  benefits: string[];
  recommendedDays: string;
}

export const INITIAL_SERVICES: TherapyServiceItem[] = [
  {
    id: "srv-01",
    name: "Bekam Basah",
    slug: "bekam-basah",
    category: "Terapi Bekam",
    description: "Titik sunnah & keluhan dengan jarum dan kop steril.",
    durationMinutes: 40,
    durationLabel: "40 Menit",
    cupQuantity: 10,
    price: 100000,
    isPopular: true,
    benefits: [
      "Mengeluarkan darah kotor & statis",
      "Meringankan leher kaku, migrain & hipertensi",
      "Set kop & jarum steril sekali pakai",
    ],
    recommendedDays: "17, 19, 21 Bulan Hijriyah",
  },
  {
    id: "srv-02",
    name: "Bekam Kering",
    slug: "bekam-kering",
    category: "Terapi Bekam",
    description: "Pelepasan angin dan relaksasi otot tanpa sayatan jarum.",
    durationMinutes: 40,
    durationLabel: "40 Menit",
    cupQuantity: 10,
    price: 50000,
    isPopular: false,
    benefits: [
      "Mengatasi masuk angin berat & perut kembung",
      "Meredakan pegal linu & ketegangan otot",
      "Aman untuk pasien yang takut jarum",
    ],
    recommendedDays: "Setiap hari buka",
  },
  {
    id: "srv-03",
    name: "Al-Fashdu",
    slug: "al-fashdu",
    category: "Al Fashdu",
    description: "Pengeluaran darah vena untuk melancarkan sirkulasi pembuluh darah besar.",
    durationMinutes: 60,
    durationLabel: "1 Jam (Sejam)",
    cupQuantity: 0,
    price: 100000,
    isPopular: true,
    benefits: [
      "Melancarkan sirkulasi pembuluh darah besar",
      "Membantu menurunkan kolesterol & asam urat",
      "Meringankan pusing berat & kebas kesemutan",
    ],
    recommendedDays: "Sesuai anjuran skrining",
  },
  {
    id: "srv-04",
    name: "Gurah Hidung",
    slug: "gurah-hidung",
    category: "Gurah Hidung",
    description: "Terapi tetes herbal pembersih lendir saluran pernapasan.",
    durationMinutes: 120,
    durationLabel: "2 Jam (Kondisional)",
    cupQuantity: 0,
    price: 100000,
    isPopular: false,
    benefits: [
      "Membersihkan lendir kotor sinusitis & flu",
      "Melegakan pernapasan & rongga hidung",
      "Durasi kondisional hingga tuntas",
    ],
    recommendedDays: "Pagi / Siang hari",
  },
  {
    id: "srv-05",
    name: "Terapi Lintah Medis",
    slug: "terapi-lintah-medis",
    category: "Terapi Lintah",
    description: "Aplikasi lintah medis steril kaya enzim Hirudin alami.",
    durationMinutes: 60,
    durationLabel: "1 Jam (Kondisional)",
    cupQuantity: 1,
    price: 25000,
    priceUnit: "/ ekor",
    isPopular: false,
    benefits: [
      "Enzim Hirudin mengencerkan bekuan darah",
      "Terapi pendamping ambeien & radang sendi",
      "Tarif Rp 25.000 per ekor (durasi kondisional)",
    ],
    recommendedDays: "Setiap hari buka",
  },
];

export interface LiveQueueTicket {
  id: string;
  ticketNumber: string;
  lane: "MALE" | "FEMALE";
  status: "WAITING" | "CALLED" | "IN_THERAPY" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  serviceName: string;
  serviceDuration: number;
  roomName?: string;
  roomNumber?: number;
  therapistName?: string;
  secretToken: string;
  checkInTime: string;
  calledTime?: string;
  estimatedWaitMinutes: number;
  peopleAhead: number;
  // Patient masked name for board display
  maskedPatientName: string;
}

export const INITIAL_QUEUES: LiveQueueTicket[] = [];
