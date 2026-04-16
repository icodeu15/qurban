import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { HeroBannerCarousel } from "@/components/hero-banner-carousel";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { buildProductCta, buildWhatsAppLink, formatCategoryLabel, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { CategoryOption, PublicBannerRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

const whatsappNumberDisplay = "085190607229";

const categoryMeta: Record<CategoryOption, { title: string; description: string }> = {
  KAMBING: {
    title: "Kambing",
    description: "Pilihan kambing qurban sehat, cukup umur, dan cocok untuk keluarga yang ingin proses cepat serta amanah.",
  },
  SAPI: {
    title: "Sapi",
    description: "Tersedia paket sapi patungan maupun utuh dengan pendampingan pemesanan yang jelas dari awal sampai selesai.",
  },
  KERBAU: {
    title: "Kerbau",
    description: "Opsi kerbau premium untuk kebutuhan qurban skala besar, masjid, komunitas, dan program distribusi.",
  },
  AQIQAH: {
    title: "Aqiqah",
    description: "Paket aqiqah siap saji dengan menu nasi box lengkap, cocok untuk acara keluarga tanpa ribet urus dapur.",
  },
};

const socialMedia = [
  {
    label: "Instagram",
    handle: "niatberqurban",
    href: "https://instagram.com/niatberqurban",
    icon: CheckCircle2,
  },
  {
    label: "Shopee",
    handle: "niatberqurban",
    href: "https://shopee.co.id/niatberqurban",
    icon: CheckCircle2,
  },
  {
    label: "TikTok",
    handle: "niat.berqurban",
    href: "https://www.tiktok.com/@niat.berqurban",
    icon: CheckCircle2,
  },
];

export default async function HomePage() {
  const [banners, products, sections] = await Promise.all([
    prisma.banner.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
    prisma.product.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.section.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
  ]);

  const banner = (banners[0] ?? null) as PublicBannerRecord | null;
  const heroBanners: PublicBannerRecord[] = banners.length
    ? (banners as PublicBannerRecord[])
    : [
        {
          id: "fallback-banner",
          name: "Banner Aqiqah",
          category: "AQIQAH",
          price: 1800000,
          label: "Paket utama",
          image: "/uploads/feed-nb.png",
          externalUrl: null,
          isActive: true,
          headline: "Paket Aqiqah Mulai dari 1,8 Juta",
          subheadline: "Menu nasi box lengkap, proses amanah, dan pilihan paket yang mudah disesuaikan.",
        },
      ];

  const groupedProducts = Object.entries(
    products.reduce<Record<string, typeof products>>((accumulator, product) => {
      accumulator[product.category] ??= [];
      accumulator[product.category].push(product);
      return accumulator;
    }, {}),
  ) as [CategoryOption, typeof products][];

  const featureSections = sections.filter((section) => section.kind === "feature");
  const categorySections = sections.filter((section) => section.kind === "category");

  return (
    <main className="pattern-bg">
      <header className="sticky top-0 z-40 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/88 px-4 py-3 shadow-[0_12px_40px_rgba(20,60,50,0.08)] backdrop-blur md:px-6">
          <Link href="/" className="flex items-center">
            <BrandLogo className="h-9 w-auto sm:h-10" priority />
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold text-[#35594E] md:flex">
            <Link href="#kategori" className="hover:text-[#1F7A63]">Kategori</Link>
            <Link href="#produk" className="hover:text-[#1F7A63]">Produk</Link>
            <Link href="#keunggulan" className="hover:text-[#1F7A63]">Keunggulan</Link>
            <Link href="#kontak" className="hover:text-[#1F7A63]">Kontak</Link>
          </nav>
          <Link href={buildWhatsAppLink("Halo, saya ingin konsultasi paket qurban dan aqiqah.")} target="_blank" className="btn-primary px-4 py-2">
            Hubungi WA
          </Link>
        </div>
      </header>

      <section className="hero-pattern px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="section-shell gold-ring overflow-hidden rounded-[2.5rem] border border-white/60 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
              <RevealOnScroll className="space-y-7">
                <div className="inline-flex items-center gap-3 rounded-full border border-[#D8C79C] bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#1F7A63]">
                  <BrandLogo className="h-8 w-auto" priority />
                </div>
                <div className="space-y-5">
                  <h1 className="max-w-4xl font-serif text-5xl leading-none text-[#143C32] text-balance sm:text-6xl lg:text-7xl">
                    Jasa qurban dan aqiqah yang tampil profesional, terasa amanah, dan siap langsung closing lewat WhatsApp.
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-[#5F665E]">
                    Kami bantu keluarga, komunitas, dan panitia mendapatkan pilihan kambing, sapi, kerbau, serta paket
                    aqiqah yang jelas harganya, rapi pelayanannya, dan nyaman dikonsultasikan tanpa ribet.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="#produk" className="btn-primary">
                    Lihat katalog pilihan
                    <ArrowUpRight className="size-4" />
                  </Link>
                  <Link href={buildWhatsAppLink("Halo, saya mau tanya rekomendasi paket qurban atau aqiqah.")} target="_blank" className="btn-secondary">
                    Konsultasi gratis via WhatsApp
                  </Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: ShieldCheck,
                      title: "Sesuai Syariat",
                      text: "Seleksi hewan, proses, dan penyaluran dirancang untuk menjaga kepercayaan pelanggan.",
                    },
                    {
                      icon: Wallet,
                      title: "Harga Masuk Akal",
                      text: "Pilihan paket dibuat realistis untuk keluarga, kolektif, hingga acara komunitas besar.",
                    },
                    {
                      icon: CheckCircle2,
                      title: "Pelayanan Amanah",
                      text: "Komunikasi cepat, update jelas, dan semua arahan pembelian langsung diarahkan ke WhatsApp.",
                    },
                  ].map((item, index) => (
                    <RevealOnScroll key={item.title} delay={index * 120}>
                      <div className="lift-card rounded-[1.5rem] border border-white/70 bg-white/75 p-4">
                        <item.icon className="size-5 text-[#1F7A63]" />
                        <h2 className="mt-4 font-semibold text-[#143C32]">{item.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-[#5F665E]">{item.text}</p>
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={120}>
                <HeroBannerCarousel banners={heroBanners} />
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      <section id="kategori" className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1F7A63]">Kategori</p>
              <h2 className="mt-2 font-serif text-4xl text-[#143C32]">Produk yang paling sering dicari pelanggan</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[#5F665E]">
              Dibuat untuk pengunjung yang ingin cepat paham pilihan paket, kisaran harga, dan langsung lanjut chat
              tanpa harus bingung cari informasi ke banyak tempat.
            </p>
          </RevealOnScroll>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {(Object.keys(categoryMeta) as CategoryOption[]).map((category, index) => {
              const section = categorySections.find((item) => item.category === category);
              return (
                <RevealOnScroll key={category} delay={index * 90}>
                  <article className="category-card lift-card rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_20px_70px_rgba(20,60,50,0.08)]">
                    <p className="inline-flex rounded-full bg-[#ECF6F1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#1F7A63]">
                      {section?.label ?? formatCategoryLabel(category)}
                    </p>
                    <h3 className="mt-5 font-serif text-3xl text-[#143C32]">{categoryMeta[category].title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#5F665E]">
                      {section?.content ?? categoryMeta[category].description}
                    </p>
                  </article>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <section id="produk" className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          {groupedProducts.map(([category, items]) => (
            <RevealOnScroll key={category} className="space-y-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1F7A63]">
                    {formatCategoryLabel(category)}
                  </p>
                  <h2 className="mt-2 font-serif text-4xl text-[#143C32]">
                    Rekomendasi {formatCategoryLabel(category)} siap ditawarkan hari ini
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-[#5F665E]">
                  {categoryMeta[category].description}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {items.map((product, index) => (
                  <RevealOnScroll key={product.id} delay={index * 100}>
                    <article className="lift-card overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_70px_rgba(20,60,50,0.08)]">
                      <div className="relative aspect-[4/3] bg-[#F2EBDC]">
                        <Image src={product.image ?? "/uploads/feed-nb.png"} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="space-y-4 p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1F7A63]">
                              {formatCategoryLabel(product.category)}
                            </p>
                            <h3 className="mt-2 text-2xl font-semibold text-[#143C32]">{product.name}</h3>
                          </div>
                          <span className="rounded-full bg-[#143C32] px-3 py-1 text-xs font-semibold text-white">
                            {product.label ?? "Pilihan utama"}
                          </span>
                        </div>
                        <p className="text-sm leading-7 text-[#5F665E]">
                          {product.description ??
                            "Cocok untuk calon pembeli yang ingin proses praktis, harga jelas, dan respon cepat via WhatsApp."}
                        </p>
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-[#6B705C]">Mulai dari</p>
                            <p className="mt-1 font-serif text-4xl text-[#143C32]">{formatPrice(product.price)}</p>
                          </div>
                          <Link href={buildProductCta(product.name, product.externalUrl)} target="_blank" className="btn-primary">
                            Tanya sekarang
                            <ArrowUpRight className="size-4" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  </RevealOnScroll>
                ))}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section id="keunggulan" className="px-4 py-10 sm:px-6 lg:px-8">
        <RevealOnScroll className="mx-auto max-w-7xl rounded-[2.5rem] border border-[#D8C79C] bg-[#143C32] px-6 py-8 text-white shadow-[0_28px_80px_rgba(20,60,50,0.22)] sm:px-8 lg:px-10">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[0.85fr,1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D8C79C]">Keunggulan</p>
              <h2 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
                Website ini tampil seperti brand yang siap menerima order.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/75">
                Setiap section dibuat untuk membangun rasa percaya, menjelaskan value, lalu mengarahkan pengunjung ke
                percakapan WhatsApp secepat mungkin.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {featureSections.map((feature, index) => (
                <RevealOnScroll key={feature.id} delay={index * 120}>
                  <article className="lift-card rounded-[1.75rem] border border-white/10 bg-white/8 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D8C79C]">
                      {feature.label ?? "Feature"}
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-white">{feature.title ?? feature.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/75">
                      {feature.content ?? "Informasi fitur."}
                    </p>
                  </article>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </section>

      <footer id="kontak" className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <RevealOnScroll className="mx-auto max-w-7xl rounded-[2.2rem] border border-white/70 bg-white/85 px-6 py-8 shadow-[0_18px_60px_rgba(20,60,50,0.08)] sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr,0.9fr,1fr]">
            <div>
              <BrandLogo className="h-11 w-auto" />
              <p className="mt-4 max-w-md text-sm leading-7 text-[#5F665E]">
                Katalog digital untuk bisnis qurban dan aqiqah yang serius terlihat profesional, mudah dipercaya, dan
                siap dipakai untuk menerima pertanyaan calon pelanggan setiap hari.
              </p>
              <div className="mt-5">
                <Link href={buildWhatsAppLink("Halo, saya ingin konsultasi pemesanan qurban atau aqiqah.")} target="_blank" className="btn-primary">
                  Chat WhatsApp
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1F7A63]">Navigasi</p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-[#5F665E]">
                <Link href="#kategori" className="hover:text-[#1F7A63]">Kategori Produk</Link>
                <Link href="#produk" className="hover:text-[#1F7A63]">Katalog Pilihan</Link>
                <Link href="#keunggulan" className="hover:text-[#1F7A63]">Keunggulan Layanan</Link>
                <Link href="/admin" className="hover:text-[#1F7A63]">Admin CMS</Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1F7A63]">Kontak</p>
              <div className="mt-4 space-y-3 text-sm text-[#5F665E]">
                <p className="font-semibold text-[#143C32]">WhatsApp utama</p>
                <p>{whatsappNumberDisplay}</p>
                <p className="text-xs leading-6 text-[#6E746C]">
                  Semua tombol konsultasi, pemesanan, dan follow up diarahkan langsung ke nomor ini.
                </p>
                <Link href={buildWhatsAppLink("Halo, saya mau konsultasi paket yang paling cocok.")} target="_blank" className="btn-outline w-fit">
                  Konsultasi sekarang
                </Link>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1F7A63]">Sosial Media</p>
              <div className="mt-4 space-y-3">
                {socialMedia.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-[#EFE6CF] bg-[#FCFAF5] px-4 py-3 text-sm text-[#5F665E] hover:border-[#D8C79C] hover:bg-white"
                  >
                    <item.icon className="size-4 text-[#1F7A63]" />
                    <span className="font-semibold text-[#143C32]">{item.label}</span>
                    <span className="text-[#6E746C]">@{item.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-[#E9E1CB] pt-5 text-xs text-[#6E746C] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Niat Berqurban. Siap dipakai sebagai landing page bisnis qurban & aqiqah.</p>
            <p>Semua arahan penjualan utama melalui WhatsApp {whatsappNumberDisplay}.</p>
          </div>
        </RevealOnScroll>
      </footer>
    </main>
  );
}
