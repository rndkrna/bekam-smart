export interface TherapyServiceItem {
  id: string;
  name: string;
  slug: string;
  category: "Terapi Bekam" | "Al Fashdu" | "Terapi Lintah" | "Gurah Hidung" | "Home Care" | "Sunnah Medis" | "Spesialis Kepala" | "Relaksasi" | "Estetika";
  description: string;
  durationMinutes: number;
  cupQuantity: number;
  price: number;
  isPopular: boolean;
  benefits: string[];
  recommendedDays: string;
}

export const INITIAL_SERVICES: TherapyServiceItem[] = [
  {
    id: "srv-01",
    name: "Terapi Bekam Steril (Titik Sunnah & Keluhan)",
    slug: "terapi-bekam-steril",
    category: "Terapi Bekam",
    description:
      "Tindakan hijamah basah higienis titik sunnah Al-Kahil, Al-Akhda'ain, dan belikat/pinggang. 100% menggunakan jarum & kop steril sekali pakai berstandar medis.",
    durationMinutes: 45,
    cupQuantity: 12,
    price: 85000,
    isPopular: true,
    benefits: [
      "Mengeluarkan darah kotor / statis & asam laktat",
      "Meringankan pegal pundak, migrain & leher kaku",
      "Menormalkan tensi darah & kolesterol tinggi",
      "Termasuk konsultasi tensi & minyak zaitun murni",
    ],
    recommendedDays: "17, 19, 21 Bulan Hijriyah / Setiap Hari Buka",
  },
  {
    id: "srv-02",
    name: "Terapi AL Fashdu (Pengeluaran Darah Vena)",
    slug: "terapi-al-fashdu",
    category: "Al Fashdu",
    description:
      "Pengobatan sunnah Nabawi dengan metode pengeluaran darah melalui pembuluh vena tertentu untuk membersihkan penyumbatan dan racun tubuh.",
    durationMinutes: 30,
    cupQuantity: 0,
    price: 100000,
    isPopular: true,
    benefits: [
      "Melancarkan sirkulasi pembuluh darah besar",
      "Membantu menurunkan kolesterol & asam urat tinggi",
      "Meringankan pusing berat, kebas, & kesemutan",
      "Mengurangi kekentalan darah berlebih",
    ],
    recommendedDays: "Sesuai anjuran skrining terapis",
  },
  {
    id: "srv-03",
    name: "Terapi Lintah Medis (Hirudo Medicinalis)",
    slug: "terapi-lintah-medis",
    category: "Terapi Lintah",
    description:
      "Terapi lintah medis bersertifikat yang kaya enzim Hirudin alami untuk melancarkan sirkulasi darah mikro, mengatasi benjolan, dan peradangan sendi.",
    durationMinutes: 45,
    cupQuantity: 4,
    price: 95000,
    isPopular: false,
    benefits: [
      "Enzim Hirudin alami mengencerkan bekuan darah",
      "Terapi pendamping tumor jinak, kelenjar, & ambeien",
      "Meredakan radang sendi, asam urat, & varises",
      "Bantu mengatasi jerawat meradang & flek kulit",
    ],
    recommendedDays: "Setiap hari buka",
  },
  {
    id: "srv-04",
    name: "Terapi Gurah Hidung Tetes Herbal",
    slug: "terapi-gurah-hidung",
    category: "Gurah Hidung",
    description:
      "Terapi tradisional tetes ramuan herbal alami ke hidung untuk menguras lendir kotor, dahak pekat, dan kotoran pada saluran pernapasan.",
    durationMinutes: 30,
    cupQuantity: 0,
    price: 75000,
    isPopular: false,
    benefits: [
      "Mengeluarkan lendir kotor sinusitis & alergi debu",
      "Melegakan pernapasan sesak, asma, & flu menahun",
      "Membuat rongga hidung plong & kepala terasa ringan",
      "Membantu menjernihkan vokal & suara nafas",
    ],
    recommendedDays: "Pagi / Siang hari",
  },
  {
    id: "srv-05",
    name: "Layanan Home Care (Kunjung ke Rumah)",
    slug: "layanan-home-care",
    category: "Home Care",
    description:
      "Layanan terapis profesional datang langsung ke rumah pasien untuk wilayah Tanjung Uban, Seri Kuala Lobam, dan sekitarnya dengan perjanjian terlebih dahulu.",
    durationMinutes: 60,
    cupQuantity: 12,
    price: 135000,
    isPopular: false,
    benefits: [
      "Sangat nyaman untuk lansia / pasien pasca-stroke",
      "Peralatan lengkap dan steril dibawa ke rumah",
      "Terapis ikhwan untuk pria, terapis akhwat untuk wanita",
      "Melayani area Tanjung Uban, Lobam, & Bintan Utara",
    ],
    recommendedDays: "Dengan perjanjian jadwal terlebih dahulu",
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
