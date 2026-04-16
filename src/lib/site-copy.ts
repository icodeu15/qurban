import type { SectionRecord } from "@/lib/types";

export const siteCopyFields = [
  { key: "hero_badge", label: "Badge hero", group: "Hero", type: "textarea", defaultValue: "Qurban & aqiqah amanah, cepat, dan siap closing via WhatsApp" },
  { key: "hero_title", label: "Judul hero", group: "Hero", type: "textarea", defaultValue: "Jasa qurban dan aqiqah yang tampil profesional, terasa amanah, dan siap langsung closing lewat WhatsApp." },
  { key: "hero_description", label: "Deskripsi hero", group: "Hero", type: "textarea", defaultValue: "Kami bantu keluarga, komunitas, dan panitia mendapatkan pilihan kambing, sapi, kerbau, serta paket aqiqah yang jelas harganya, rapi pelayanannya, dan nyaman dikonsultasikan tanpa ribet." },
  { key: "hero_highlight_1_title", label: "Hero card 1 judul", group: "Hero", type: "text", defaultValue: "Sesuai Syariat" },
  { key: "hero_highlight_1_text", label: "Hero card 1 deskripsi", group: "Hero", type: "textarea", defaultValue: "Seleksi hewan, proses, dan penyaluran dirancang untuk menjaga kepercayaan pelanggan." },
  { key: "hero_highlight_2_title", label: "Hero card 2 judul", group: "Hero", type: "text", defaultValue: "Harga Masuk Akal" },
  { key: "hero_highlight_2_text", label: "Hero card 2 deskripsi", group: "Hero", type: "textarea", defaultValue: "Pilihan paket dibuat realistis untuk keluarga, kolektif, hingga acara komunitas besar." },
  { key: "hero_highlight_3_title", label: "Hero card 3 judul", group: "Hero", type: "text", defaultValue: "Pelayanan Amanah" },
  { key: "hero_highlight_3_text", label: "Hero card 3 deskripsi", group: "Hero", type: "textarea", defaultValue: "Komunikasi cepat, update jelas, dan semua arahan pembelian langsung diarahkan ke WhatsApp." },
  { key: "keunggulan_title", label: "Judul section keunggulan", group: "Keunggulan", type: "textarea", defaultValue: "Website ini tampil seperti brand yang siap menerima order." },
  { key: "keunggulan_description", label: "Deskripsi section keunggulan", group: "Keunggulan", type: "textarea", defaultValue: "Setiap section dibuat untuk membangun rasa percaya, menjelaskan value, lalu mengarahkan pengunjung ke percakapan WhatsApp secepat mungkin." },
  { key: "category_title", label: "Judul section kategori", group: "Kategori", type: "textarea", defaultValue: "Produk yang paling sering dicari pelanggan" },
  { key: "category_description", label: "Deskripsi section kategori", group: "Kategori", type: "textarea", defaultValue: "Dibuat untuk pengunjung yang ingin cepat paham pilihan paket, kisaran harga, dan langsung lanjut chat tanpa harus bingung cari informasi ke banyak tempat." },
] as const;

export type SiteCopyKey = (typeof siteCopyFields)[number]["key"];

export const siteCopyDefaults: Record<SiteCopyKey, string> = Object.fromEntries(
  siteCopyFields.map((field) => [field.key, field.defaultValue]),
) as Record<SiteCopyKey, string>;

export function buildSiteCopyMap(sections: SectionRecord[]) {
  const copySections = sections.filter((section) => section.kind === "copy");
  const values = copySections.reduce<Record<string, string>>((accumulator, section) => {
    accumulator[section.name] = section.content ?? "";
    return accumulator;
  }, {});

  return { ...siteCopyDefaults, ...values } as Record<SiteCopyKey, string>;
}
