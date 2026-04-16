"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { buildProductCta, formatPrice } from "@/lib/format";
import type { PublicBannerRecord } from "@/lib/types";

type HeroBannerCarouselProps = {
  banners: PublicBannerRecord[];
};

export function HeroBannerCarousel({ banners }: HeroBannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners[activeIndex];

  function goTo(index: number) {
    setActiveIndex(index);
  }

  function goPrev() {
    setActiveIndex((current) => (current - 1 + banners.length) % banners.length);
  }

  function goNext() {
    setActiveIndex((current) => (current + 1) % banners.length);
  }

  return (
    <div className="relative motion-soft-float">
      <div className="absolute inset-x-10 top-0 h-20 rounded-full bg-[#D4AF37]/20 blur-3xl" />
      <div className="relative rounded-[2.2rem] border border-[#E7DFC9] bg-white/80 p-4 shadow-[0_28px_90px_rgba(20,60,50,0.18)]">
        <div className="relative overflow-hidden rounded-[1.8rem] bg-[#F7F3E8] p-4">
          <div className="relative aspect-[4/4] overflow-hidden rounded-[1.5rem]">
            <Image
              key={activeBanner.id}
              src={activeBanner.image ?? "/uploads/feed-nb.png"}
              alt={activeBanner.name}
              fill
              priority
              className="object-cover transition duration-500"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1F7A63]">
                {activeBanner.label ?? "Paket utama"}
              </p>
              <h2 className="mt-2 font-serif text-3xl text-[#143C32]">
                {activeBanner.headline ?? "Paket Aqiqah Mulai dari 1,8 Juta"}
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-[#5F665E]">
                {activeBanner.subheadline ??
                  "Menu nasi box lengkap, proses amanah, dan pilihan paket yang mudah disesuaikan."}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[#1F7A63] px-5 py-4 text-white shadow-lg">
              <p className="text-xs uppercase tracking-[0.25em] text-white/75">Harga Mulai</p>
              <p className="mt-1 font-serif text-4xl">{formatPrice(activeBanner.price ?? 1800000)}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {banners.length > 1 ? (
                <>
                  <button type="button" onClick={goPrev} className="btn-icon" aria-label="Banner sebelumnya">
                    <ChevronLeft className="size-4" />
                  </button>
                  <button type="button" onClick={goNext} className="btn-icon" aria-label="Banner berikutnya">
                    <ChevronRight className="size-4" />
                  </button>
                </>
              ) : null}
            </div>

            <Link href={buildProductCta(activeBanner.name, activeBanner.externalUrl)} target="_blank" className="btn-primary">
              Tanya banner ini
            </Link>
          </div>

          {banners.length > 1 ? (
            <div className="mt-4 flex items-center justify-center gap-2">
              {banners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-8 bg-[#1F7A63]" : "w-2.5 bg-[#D8C79C] hover:bg-[#bfa965]"}`}
                  aria-label={`Pilih banner ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
