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

export const INITIAL_QUEUES: LiveQueueTicket[] = [
  // --- JALUR PRIA (P) ---
  {
    id: "q-p001",
    ticketNumber: "P-001",
    lane: "MALE",
    status: "IN_THERAPY",
    serviceName: "Terapi Bekam Steril (Titik Sunnah & Keluhan)",
    serviceDuration: 45,
    roomName: "Ruang Terapi 1 (Ikhwan)",
    roomNumber: 1,
    therapistName: "Ustadz Hasan (Terapis ITBI Bintan)",
    secretToken: "tk_p001_secret",
    checkInTime: "08:15",
    calledTime: "08:25",
    estimatedWaitMinutes: 0,
    peopleAhead: 0,
    maskedPatientName: "Ahmad R*** (0812***)",
  },
  {
    id: "q-p002",
    ticketNumber: "P-002",
    lane: "MALE",
    status: "CALLED",
    serviceName: "Terapi AL Fashdu (Pengeluaran Darah Vena)",
    serviceDuration: 30,
    roomName: "Ruang Terapi 2 (Ikhwan)",
    roomNumber: 2,
    therapistName: "Ustadz Hasan (Terapis ITBI Bintan)",
    secretToken: "tk_p002_secret",
    checkInTime: "08:40",
    calledTime: "09:05",
    estimatedWaitMinutes: 0,
    peopleAhead: 0,
    maskedPatientName: "Fajar S*** (0857***)",
  },
  {
    id: "q-p003",
    ticketNumber: "P-003",
    lane: "MALE",
    status: "WAITING",
    serviceName: "Terapi Bekam Steril (Titik Sunnah & Keluhan)",
    serviceDuration: 45,
    secretToken: "tk_p003_demo",
    checkInTime: "09:10",
    estimatedWaitMinutes: 15,
    peopleAhead: 0,
    maskedPatientName: "Budi H*** (0813***)",
  },
  {
    id: "q-p004",
    ticketNumber: "P-004",
    lane: "MALE",
    status: "WAITING",
    serviceName: "Terapi Lintah Medis (Hirudo Medicinalis)",
    serviceDuration: 45,
    secretToken: "tk_p004_secret",
    checkInTime: "09:25",
    estimatedWaitMinutes: 35,
    peopleAhead: 1,
    maskedPatientName: "Zulkifli M*** (0821***)",
  },
  {
    id: "q-p005",
    ticketNumber: "P-005",
    lane: "MALE",
    status: "WAITING",
    serviceName: "Terapi Gurah Hidung Tetes Herbal",
    serviceDuration: 30,
    secretToken: "tk_p005_secret",
    checkInTime: "09:40",
    estimatedWaitMinutes: 55,
    peopleAhead: 2,
    maskedPatientName: "Irfan W*** (0819***)",
  },

  // --- JALUR WANITA (W) ---
  {
    id: "q-w001",
    ticketNumber: "W-001",
    lane: "FEMALE",
    status: "IN_THERAPY",
    serviceName: "Terapi Bekam Steril (Titik Sunnah & Keluhan)",
    serviceDuration: 45,
    roomName: "Ruang Terapi 3 (Akhwat)",
    roomNumber: 3,
    therapistName: "Terapis Ummu Aisyah (Akhwat)",
    secretToken: "tk_w001_secret",
    checkInTime: "08:10",
    calledTime: "08:20",
    estimatedWaitMinutes: 0,
    peopleAhead: 0,
    maskedPatientName: "Fatimah A*** (0811***)",
  },
  {
    id: "q-w002",
    ticketNumber: "W-002",
    lane: "FEMALE",
    status: "IN_THERAPY",
    serviceName: "Terapi Gurah Hidung Tetes Herbal",
    serviceDuration: 30,
    roomName: "Ruang Terapi 4 (Akhwat)",
    roomNumber: 4,
    therapistName: "Terapis Ummu Fatimah (Akhwat)",
    secretToken: "tk_w002_secret",
    checkInTime: "08:35",
    calledTime: "08:45",
    estimatedWaitMinutes: 0,
    peopleAhead: 0,
    maskedPatientName: "Khadijah U*** (0813***)",
  },
  {
    id: "q-w003",
    ticketNumber: "W-003",
    lane: "FEMALE",
    status: "CALLED",
    serviceName: "Terapi Bekam Steril (Titik Sunnah & Keluhan)",
    serviceDuration: 45,
    roomName: "Ruang Terapi 3 (Akhwat)",
    roomNumber: 3,
    therapistName: "Terapis Ummu Aisyah (Akhwat)",
    secretToken: "tk_w003_secret",
    checkInTime: "08:50",
    calledTime: "09:12",
    estimatedWaitMinutes: 0,
    peopleAhead: 0,
    maskedPatientName: "Nurul H*** (0878***)",
  },
  {
    id: "q-w004",
    ticketNumber: "W-004",
    lane: "FEMALE",
    status: "WAITING",
    serviceName: "Terapi Lintah Medis (Hirudo Medicinalis)",
    serviceDuration: 45,
    secretToken: "tk_w004_demo",
    checkInTime: "09:15",
    estimatedWaitMinutes: 20,
    peopleAhead: 0,
    maskedPatientName: "Dewi Lestari (0812***)",
  },
  {
    id: "q-w005",
    ticketNumber: "W-005",
    lane: "FEMALE",
    status: "WAITING",
    serviceName: "Terapi AL Fashdu (Pengeluaran Darah Vena)",
    serviceDuration: 30,
    secretToken: "tk_w005_secret",
    checkInTime: "09:30",
    estimatedWaitMinutes: 45,
    peopleAhead: 1,
    maskedPatientName: "Salma K*** (0852***)",
  },
];
