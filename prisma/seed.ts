import { Category, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.section.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.product.deleteMany();

  await prisma.banner.createMany({
    data: [
      {
        name: "Banner Utama Aqiqah",
        category: Category.AQIQAH,
        price: 1800000,
        label: "Paket Favorit",
        image: "/uploads/feed-nb.png",
        externalUrl: "https://wa.me/6281234567890",
        isActive: true,
        headline: "Qurban & Aqiqah Sesuai Syariat",
        subheadline:
          "Pilihan kambing, sapi, kerbau, dan paket aqiqah siap saji dengan pelayanan amanah.",
      },
      {
        name: "Promo Aqiqah",
        category: Category.AQIQAH,
        price: 2200000,
        label: "Bonus Berlimpah",
        image: "/uploads/feed-nb-2.png",
        externalUrl: "https://wa.me/6281234567890",
        isActive: true,
        headline: "Mulai Dari 1,8 Juta",
        subheadline:
          "Paket hemat sampai eksklusif dengan nasi box dan bonus untuk acara keluarga.",
      },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Kambing Jantan Premium",
        category: Category.KAMBING,
        price: 3200000,
        label: "Best Seller",
        image: "/illustrations/goat.svg",
        externalUrl: "https://wa.me/6281234567890",
        isActive: true,
        description: "Kambing sehat, cukup umur, dan siap qurban.",
        sortOrder: 1,
      },
      {
        name: "Kambing Betina Hemat",
        category: Category.KAMBING,
        price: 2750000,
        label: "Hemat",
        image: "/illustrations/goat-soft.svg",
        externalUrl: "https://wa.me/6281234567890",
        isActive: true,
        description: "Pilihan ekonomis dengan pemeriksaan kesehatan rutin.",
        sortOrder: 2,
      },
      {
        name: "Sapi Kolektif 1/7",
        category: Category.SAPI,
        price: 2850000,
        label: "Patungan",
        image: "/illustrations/cow.svg",
        externalUrl: "https://wa.me/6281234567890",
        isActive: true,
        description: "Sapi berkualitas untuk qurban kolektif tujuh orang.",
        sortOrder: 3,
      },
      {
        name: "Sapi Utuh Keluarga",
        category: Category.SAPI,
        price: 19800000,
        label: "Pilihan Keluarga",
        image: "/illustrations/cow-gold.svg",
        externalUrl: "https://wa.me/6281234567890",
        isActive: true,
        description: "Bobot ideal, pemeliharaan amanah, dan dokumentasi lengkap.",
        sortOrder: 4,
      },
      {
        name: "Kerbau Super",
        category: Category.KERBAU,
        price: 24500000,
        label: "Eksklusif",
        image: "/illustrations/buffalo.svg",
        externalUrl: "https://wa.me/6281234567890",
        isActive: true,
        description: "Kerbau kuat dan cocok untuk kebutuhan qurban skala besar.",
        sortOrder: 5,
      },
      {
        name: "Paket Aqiqah Hemat 40 Box",
        category: Category.AQIQAH,
        price: 1800000,
        label: "Paket Hemat",
        image: "/uploads/feed-nb.png",
        externalUrl: "https://wa.me/6281234567890",
        isActive: true,
        description: "Menu nasi box lengkap untuk keluarga kecil dan acara sederhana.",
        sortOrder: 6,
      },
      {
        name: "Paket Aqiqah Spesial 80 Box",
        category: Category.AQIQAH,
        price: 3500000,
        label: "Favorit Keluarga",
        image: "/uploads/feed-nb-2.png",
        externalUrl: "https://wa.me/6281234567890",
        isActive: true,
        description: "Menu lengkap dengan bonus sambal, kerupuk, dan sayur tumisan.",
        sortOrder: 7,
      },
    ],
  });

  await prisma.section.createMany({
    data: [
      {
        name: "Sesuai Syariat",
        title: "Sesuai Syariat",
        content: "Proses pemeliharaan, pemotongan, dan distribusi mengikuti kaidah syariat.",
        label: "Trusted",
        kind: "feature",
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Amanah",
        title: "Amanah",
        content: "Dokumentasi pelaksanaan dan update proses diberikan secara transparan.",
        label: "Terpercaya",
        kind: "feature",
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "Harga Terjangkau",
        title: "Harga Terjangkau",
        content: "Pilihan paket fleksibel dari hemat hingga premium tanpa biaya tersembunyi.",
        label: "Value",
        kind: "feature",
        isActive: true,
        sortOrder: 3,
      },
      {
        name: "Kategori Kambing",
        category: Category.KAMBING,
        title: "Kambing",
        content: "Pilihan kambing jantan dan betina dengan kualitas terjaga.",
        label: "Qurban",
        kind: "category",
        isActive: true,
        sortOrder: 4,
      },
      {
        name: "Kategori Sapi",
        category: Category.SAPI,
        title: "Sapi",
        content: "Tersedia paket patungan 1/7 hingga sapi utuh untuk keluarga.",
        label: "Kolektif",
        kind: "category",
        isActive: true,
        sortOrder: 5,
      },
      {
        name: "Kategori Kerbau",
        category: Category.KERBAU,
        title: "Kerbau",
        content: "Pilihan eksklusif untuk kebutuhan qurban skala besar dan komunitas.",
        label: "Premium",
        kind: "category",
        isActive: true,
        sortOrder: 6,
      },
      {
        name: "Kategori Aqiqah",
        category: Category.AQIQAH,
        title: "Aqiqah",
        content: "Paket siap saji dengan nasi box lengkap untuk acara aqiqah keluarga.",
        label: "Siap Saji",
        kind: "category",
        isActive: true,
        sortOrder: 7,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
