import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Wallet,
} from "lucide-react";

import { BrandLogo } from "@/components/brand-logo";
import { HeroBannerCarousel } from "@/components/hero-banner-carousel";
import { ProductCatalog } from "@/components/product-catalog";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { buildWhatsAppLink, formatCategoryLabel } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { buildSiteCopyMap } from "@/lib/site-copy";
import { BannerRecord, CategoryOption, ProductRecord, PublicBannerRecord, SectionRecord } from "@/lib/types";

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

function InstagramBrandIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.25" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.3" cy="6.7" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ShopeeBrandIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M8.3 6.2a3.7 3.7 0 1 1 7.4 0h1.7c1.1 0 2 .9 2 2v9.2a2 2 0 0 1-2 2H6.6a2 2 0 0 1-2-2V8.2c0-1.1.9-2 2-2h1.7Zm1.8 0h3.8a1.9 1.9 0 1 0-3.8 0ZM12 10c-2.4 0-4 .9-4 2.6 0 1.6 1.2 2.2 3.6 2.6 1.7.3 2.1.6 2.1 1.1 0 .6-.7 1-1.8 1-1.2 0-2.2-.4-3.1-1.2l-1.2 1.5c1 .9 2.3 1.5 4.3 1.5 2.5 0 4.1-1.1 4.1-2.9 0-1.7-1.1-2.3-3.5-2.7-1.8-.3-2.2-.5-2.2-1.1 0-.5.6-.9 1.6-.9 1 0 1.8.3 2.7 1l1.1-1.6c-1-.8-2.1-1.2-3.7-1.2Z" />
    </svg>
  );
}

function TikTokBrandIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M14.6 3c.4 2 1.6 3.5 3.7 4v2.7a7 7 0 0 1-3.3-1v5.2a5.8 5.8 0 1 1-5.7-5.8c.4 0 .8 0 1.2.1v2.9a2.8 2.8 0 1 0 1.7 2.6V3h2.4Z" />
    </svg>
  );
}

const socialMedia = [
  {
    label: "Instagram",
    href: "https://instagram.com/niatberqurban",
    icon: InstagramBrandIcon,
  },
  {
    label: "Shopee",
    href: "https://shopee.co.id/niatberqurban",
    icon: ShopeeBrandIcon,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@niat.berqurban",
    icon: TikTokBrandIcon,
  },
];

async function loadHomepageData(): Promise<{
  banners: BannerRecord[];
  products: ProductRecord[];
  sections: SectionRecord[];
}> {
  try {
    const [banners, products, sections] = await Promise.all([
      prisma.banner.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } }),
      prisma.product.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
      prisma.section.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    ]);

    return { banners, products, sections };
  } catch (error) {
    console.error("Failed to load homepage data from Prisma.", error);
    return {
      banners: [],
      products: [],
      sections: [],
    };
  }
}

export default async function HomePage() {
  const { banners, products, sections } = await loadHomepageData();

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

  const keunggulanSection = sections
    .filter((section) => section.kind === "keunggulan")
    .sort((first, second) => first.sortOrder - second.sortOrder)[0] ?? null;
  const featureSections = sections
    .filter((section) => section.kind === "feature")
    .sort((first, second) => first.sortOrder - second.sortOrder);
  const categorySections = sections
    .filter((section) => section.kind === "category")
    .sort((first, second) => first.sortOrder - second.sortOrder);
  const siteCopy = buildSiteCopyMap(sections);
  const categorySectionMap = (Object.keys(categoryMeta) as CategoryOption[]).reduce<Record<CategoryOption, (typeof categorySections)[number] | null>>(
    (accumulator, category, index) => {
      accumulator[category] = categorySections[index] ?? null;
      return accumulator;
    },
    {
      KAMBING: null,
      SAPI: null,
      KERBAU: null,
      AQIQAH: null,
    },
  );
  const heroHighlights = [
    {
      icon: ShieldCheck,
      title: siteCopy.hero_highlight_1_title,
      text: siteCopy.hero_highlight_1_text,
    },
    {
      icon: Wallet,
      title: siteCopy.hero_highlight_2_title,
      text: siteCopy.hero_highlight_2_text,
    },
    {
      icon: CheckCircle2,
      title: siteCopy.hero_highlight_3_title,
      text: siteCopy.hero_highlight_3_text,
    },
  ];

  return (
    <main className="pattern-bg">
      <header className="sticky top-0 z-40 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-[2rem] border border-white/70 bg-white/88 px-4 py-3 shadow-[0_12px_40px_rgba(20,60,50,0.08)] backdrop-blur sm:rounded-full md:px-5">
          <Link href="/" className="flex items-center">
            <BrandLogo className="h-11 w-auto sm:h-14 lg:h-16" priority />
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-semibold text-[#35594E] md:flex">
            <Link href="#kategori" className="hover:text-[#1F7A63]">Kategori</Link>
            <Link href="#produk" className="hover:text-[#1F7A63]">Produk</Link>
            <Link href="#keunggulan" className="hover:text-[#1F7A63]">Keunggulan</Link>
            <Link href="#kontak" className="hover:text-[#1F7A63]">Kontak</Link>
          </nav>
          <Link href={buildWhatsAppLink("Halo, saya ingin konsultasi paket qurban dan aqiqah.")} target="_blank" className="btn-primary shrink-0 px-4 py-2 text-sm sm:px-4">
            Hubungi WA
          </Link>
        </div>
      </header>

      <section className="hero-pattern px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="section-shell gold-ring overflow-hidden rounded-[2.5rem] border border-white/60 p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
              <RevealOnScroll className="space-y-7">
                <div className="inline-flex w-fit max-w-full items-center gap-3 rounded-full border border-[#D8C79C]/70 bg-[#FCFAF5] px-4 py-2 text-xs font-semibold text-[#1F7A63] shadow-[0_10px_30px_rgba(20,60,50,0.08)] sm:text-sm">
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#143C32] text-white">
                    <CheckCircle2 className="size-4" />
                  </span>
                  <span className="leading-5">{siteCopy.hero_badge}</span>
                </div>
                <div className="space-y-5">
                  <h1 className="max-w-4xl font-serif text-4xl leading-none text-[#143C32] text-balance sm:text-6xl lg:text-7xl">
                    {siteCopy.hero_title}
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-[#5F665E] sm:text-lg sm:leading-8">
                    {siteCopy.hero_description}
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
                  {heroHighlights.map((item, index) => (
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
          <RevealOnScroll className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1F7A63]">Kategori</p>
              <h2 className="mt-2 font-serif text-4xl text-[#143C32]">{siteCopy.category_title}</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#5F665E] lg:justify-self-end lg:pt-3">
              {siteCopy.category_description}
            </p>
          </RevealOnScroll>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {(Object.keys(categoryMeta) as CategoryOption[]).map((category, index) => {
              const section = categorySectionMap[category];
              return (
                <RevealOnScroll key={category} delay={index * 90}>
                  <article className="category-card lift-card flex h-full flex-col rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_20px_70px_rgba(20,60,50,0.08)]">
                    <p className="inline-flex rounded-full bg-[#ECF6F1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#1F7A63]">
                      {section?.label ?? formatCategoryLabel(category)}
                    </p>
                    <h3 className="mt-5 min-h-[3.5rem] font-serif text-3xl leading-tight text-[#143C32]">
                      {section?.title ?? categoryMeta[category].title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-[#5F665E]">
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
                    {categorySectionMap[category]?.label ?? formatCategoryLabel(category)}
                  </p>
                  <h2 className="mt-2 font-serif text-4xl text-[#143C32]">
                    Rekomendasi {formatCategoryLabel(category)} siap ditawarkan hari ini
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-[#5F665E]">
                  {categorySectionMap[category]?.content ?? categoryMeta[category].description}
                </p>
              </div>
              <RevealOnScroll delay={120}>
                <ProductCatalog category={category} items={items} />
              </RevealOnScroll>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section id="keunggulan" className="px-4 py-10 sm:px-6 lg:px-8">
        <RevealOnScroll className="mx-auto max-w-7xl rounded-[2.5rem] border border-[#D8C79C] bg-[#143C32] px-6 py-8 text-white shadow-[0_28px_80px_rgba(20,60,50,0.22)] sm:px-8 lg:px-10">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[0.85fr,1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D8C79C]">
                {keunggulanSection?.label || "Keunggulan"}
              </p>
              <h2 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
                {siteCopy.keunggulan_title || keunggulanSection?.title || "Website ini tampil seperti brand yang siap menerima order."}
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/75">
                {siteCopy.keunggulan_description ||
                  keunggulanSection?.content ||
                  "Setiap section dibuat untuk membangun rasa percaya, menjelaskan value, lalu mengarahkan pengunjung ke percakapan WhatsApp secepat mungkin."}
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
          <div className="grid gap-8 xl:grid-cols-[1.25fr,1fr] xl:items-start xl:gap-12">
            <div>
              <div>
                <Link href={buildWhatsAppLink("Halo, saya ingin konsultasi pemesanan qurban atau aqiqah.")} target="_blank" className="btn-primary">
                  Chat WhatsApp
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-6">
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
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {socialMedia.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-12 min-w-12 items-center justify-center rounded-2xl border border-[#EFE6CF] bg-[#FCFAF5] px-3 text-[#143C32] transition hover:-translate-y-0.5 hover:border-[#D8C79C] hover:bg-white"
                      aria-label={item.label}
                      title={item.label}
                    >
                      <item.icon className="size-5 text-[#1F7A63]" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-[#E9E1CB] pt-5 text-xs text-[#6E746C] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Niat Berqurban.</p>
            <p className="sm:text-right">Semua arahan penjualan utama melalui WhatsApp {whatsappNumberDisplay}.</p>
          </div>
        </RevealOnScroll>
      </footer>
    </main>
  );
}


