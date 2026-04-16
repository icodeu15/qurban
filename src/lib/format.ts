import { CategoryOption } from "@/lib/types";

export function formatPrice(value: number | null | undefined) {
  if (value == null) {
    return "Hubungi kami";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCategoryLabel(category: CategoryOption) {
  switch (category) {
    case "KAMBING":
      return "Kambing";
    case "SAPI":
      return "Sapi";
    case "KERBAU":
      return "Kerbau";
    case "AQIQAH":
      return "Aqiqah";
    default:
      return category;
  }
}

export function buildProductCta(name: string, externalUrl?: string | null) {
  if (externalUrl) {
    return externalUrl;
  }

  const message = `Halo, saya tertarik dengan ${name}`;
  const encoded = encodeURIComponent(message);
  const targetNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6285190607229";
  return `https://wa.me/${targetNumber}?text=${encoded}`;
}

export function buildWhatsAppLink(message: string) {
  const targetNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "6285190607229";
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
}
