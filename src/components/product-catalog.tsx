"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";

import { buildProductCta, formatCategoryLabel, formatPrice } from "@/lib/format";
import type { CategoryOption, ProductRecord } from "@/lib/types";

type ProductCatalogProps = {
  category: CategoryOption;
  items: ProductRecord[];
};

export function ProductCatalog({ category, items }: ProductCatalogProps) {
  const [activeProduct, setActiveProduct] = useState<ProductRecord | null>(null);

  useEffect(() => {
    if (!activeProduct) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveProduct(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeProduct]);

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((product) => (
          <article
            key={product.id}
            className="lift-card overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_70px_rgba(20,60,50,0.08)]"
          >
            <button
              type="button"
              onClick={() => setActiveProduct(product)}
              className="block w-full cursor-pointer text-left"
            >
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
                <p className="line-clamp-3 text-sm leading-7 text-[#5F665E]">
                  {product.description ??
                    "Cocok untuk calon pembeli yang ingin proses praktis, harga jelas, dan respon cepat via WhatsApp."}
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1F7A63]">
                  Klik kartu untuk lihat detail
                </p>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#6B705C]">Mulai dari</p>
                    <p className="mt-1 font-serif text-4xl text-[#143C32]">{formatPrice(product.price)}</p>
                  </div>
                  <span className="btn-outline">Lihat detail</span>
                </div>
              </div>
            </button>
            <div className="px-6 pb-6">
              <Link href={buildProductCta(product.name, product.externalUrl)} target="_blank" className="btn-primary w-full">
                Tanya sekarang
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {typeof document !== "undefined" && activeProduct
        ? createPortal(
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center bg-[#143C32]/55 p-3 sm:p-6"
              onClick={() => setActiveProduct(null)}
            >
              <div
                className="w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/60 bg-[#FCFAF5] shadow-[0_24px_80px_rgba(20,60,50,0.28)]"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 border-b border-[#E7DFC9] px-4 py-4 sm:px-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1F7A63]">
                      {formatCategoryLabel(category)}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-[#143C32] sm:text-2xl">{activeProduct.name}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveProduct(null)}
                    className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-[#D8C79C] text-[#143C32] transition hover:bg-white"
                    aria-label="Tutup detail produk"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="space-y-5 p-4 sm:p-5">
                  <div className="relative aspect-[4/2.65] overflow-hidden rounded-[1.35rem] bg-[#F2EBDC]">
                    <Image src={activeProduct.image ?? "/uploads/feed-nb.png"} alt={activeProduct.name} fill className="object-cover" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[#143C32] px-3 py-1 text-xs font-semibold text-white">
                        {activeProduct.label ?? "Pilihan utama"}
                      </span>
                      <span className="text-sm font-semibold text-[#1F7A63]">{formatPrice(activeProduct.price)}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1F7A63]">Deskripsi lengkap</p>
                      <p className="mt-2 text-sm leading-7 text-[#5F665E] sm:text-base">
                        {activeProduct.description ??
                          "Cocok untuk calon pembeli yang ingin proses praktis, harga jelas, dan respon cepat via WhatsApp."}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link href={buildProductCta(activeProduct.name, activeProduct.externalUrl)} target="_blank" className="btn-primary">
                        Tanya sekarang
                        <ArrowUpRight className="size-4" />
                      </Link>
                      <button type="button" onClick={() => setActiveProduct(null)} className="btn-secondary">
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
