import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database Bekam Bintan Therapy...");

  // 1. Seed Clinic Profile
  const clinic = await prisma.clinic.upsert({
    where: { id: "clinic-bintan-01" },
    update: {},
    create: {
      id: "clinic-bintan-01",
      name: "Bekam Bintan Therapy",
      tagline:
        "Pusat Pengobatan Sunnah Thibbun Nabawi & Bekam Steril Higienis Berizin Dinkes Bintan",
      phone: "+62 812-6832-0072",
      address:
        "Jl. Indunsuri No. 116C, Taman Kota, Desa Teluk Sasah, Kec. Seri Kuala Lobam, Kab. Bintan",
      openingHour: "09:00",
      closingHour: "22:00",
      isRegistrationOpen: true,
      maleQueuePrefix: "P",
      femaleQueuePrefix: "W",
    },
  });
  console.log("✓ Profil Klinik:", clinic.name);

  // 2. Seed Rooms (Dual-lane terpisah Ikhwan & Akhwat)
  const roomsData = [
    {
      id: "rm-1",
      roomNumber: 1,
      name: "Ruang Terapi 1 (Ikhwan)",
      laneType: "MALE",
      status: "AVAILABLE",
      therapistName: "Ustadz Hasan (Terapis ITBI)",
    },
    {
      id: "rm-2",
      roomNumber: 2,
      name: "Ruang Terapi 2 (Ikhwan)",
      laneType: "MALE",
      status: "AVAILABLE",
      therapistName: "Ustadz Hasan (Terapis ITBI)",
    },
    {
      id: "rm-3",
      roomNumber: 3,
      name: "Ruang Terapi 3 (Akhwat)",
      laneType: "FEMALE",
      status: "AVAILABLE",
      therapistName: "Ummu Aisyah (Terapis Akhwat)",
    },
    {
      id: "rm-4",
      roomNumber: 4,
      name: "Ruang Terapi 4 (Akhwat)",
      laneType: "FEMALE",
      status: "AVAILABLE",
      therapistName: "Terapis Akhwat Asisten",
    },
  ];

  for (const r of roomsData) {
    await prisma.room.upsert({
      where: { roomNumber: r.roomNumber },
      update: {
        name: r.name,
        laneType: r.laneType,
        status: r.status,
        therapistName: r.therapistName,
      },
      create: r,
    });
  }
  console.log(`✓ 4 Bilik Terapi (2 Ikhwan, 2 Akhwat) berhasil disinkronkan.`);

  // 3. Seed Services & Pricing (bekambintan.blogspot.com)
  // 3. Seed Services & Pricing (bekam basah, bekam kering, alfasdhu, gurah, lintah)
  const servicesData = [
    {
      id: "srv-01",
      name: "Bekam Basah",
      slug: "bekam-basah",
      category: "Terapi Bekam",
      description: "Terapi bekam basah titik sunnah dan keluhan dengan kop & jarum steril.",
      durationMinutes: 40,
      cupQuantity: 10,
      price: 100000,
      isPopular: true,
    },
    {
      id: "srv-02",
      name: "Bekam Kering",
      slug: "bekam-kering",
      category: "Terapi Bekam",
      description: "Terapi pelepasan angin dan relaksasi otot tanpa sayatan jarum.",
      durationMinutes: 40,
      cupQuantity: 10,
      price: 50000,
      isPopular: false,
    },
    {
      id: "srv-03",
      name: "Al-Fashdu",
      slug: "al-fashdu",
      category: "Al Fashdu",
      description: "Pengeluaran darah vena untuk melancarkan sirkulasi pembuluh darah besar.",
      durationMinutes: 60,
      cupQuantity: 0,
      price: 100000,
      isPopular: true,
    },
    {
      id: "srv-04",
      name: "Gurah Hidung",
      slug: "gurah-hidung",
      category: "Gurah Hidung",
      description: "Terapi tetes herbal alami pembersih lendir saluran pernapasan.",
      durationMinutes: 120,
      cupQuantity: 0,
      price: 100000,
      isPopular: false,
    },
    {
      id: "srv-05",
      name: "Terapi Lintah Medis",
      slug: "terapi-lintah-medis",
      category: "Terapi Lintah",
      description: "Aplikasi lintah medis steril kaya enzim Hirudin alami (Rp 25.000 / ekor).",
      durationMinutes: 60,
      cupQuantity: 1,
      price: 25000,
      isPopular: false,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        slug: s.slug,
        category: s.category,
        description: s.description,
        durationMinutes: s.durationMinutes,
        cupQuantity: s.cupQuantity,
        price: s.price,
        isPopular: s.isPopular,
      },
      create: s,
    });
  }
  console.log(`✓ 5 Layanan Terapi Klinik berhasil disinkronkan.`);

  // 4. Seed Staff Users
  const staffUsers = [
    {
      id: "usr-admin",
      name: "Admin Bekam Bintan",
      email: "admin@bekambintan.com",
      passwordHash: "demo123",
      role: "ADMIN",
      gender: "MALE",
      phone: "+62 812-6832-0072",
    },
    {
      id: "usr-hasan",
      name: "Ustadz Hasan (Terapis Ikhwan)",
      email: "terapis.ikhwan@bekamsmart.com",
      passwordHash: "demo123",
      role: "THERAPIST",
      gender: "MALE",
      phone: "+62 812-6832-0072",
    },
    {
      id: "usr-aisyah",
      name: "Ummu Aisyah (Terapis Akhwat)",
      email: "terapis.akhwat@bekamsmart.com",
      passwordHash: "demo123",
      role: "THERAPIST",
      gender: "FEMALE",
      phone: "+62 813-7221-5099",
    },
  ];

  for (const u of staffUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        gender: u.gender,
        phone: u.phone,
      },
      create: u,
    });
  }
  console.log(`✓ 3 Akun Staf (Admin, Terapis Ikhwan, Terapis Akhwat) berhasil disinkronkan.`);

  console.log("✨ Seed database selesai dengan sukses! Antrean tetap 0 (bersih).");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
