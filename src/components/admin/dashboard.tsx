"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, LogOut, Pencil, RefreshCcw, Trash2 } from "lucide-react";

import { siteCopyDefaults, siteCopyFields, type SiteCopyField, type SiteCopyGroup, type SiteCopyKey } from "@/lib/site-copy";
import type { BannerRecord, ProductRecord, SectionRecord } from "@/lib/types";
import { categoryOptions } from "@/lib/types";

type Props = {
  initialProducts: ProductRecord[];
  initialBanners: BannerRecord[];
  initialSections: SectionRecord[];
};

type ProductForm = {
  name: string;
  category: ProductRecord["category"];
  price: string;
  label: string;
  image: string;
  externalUrl: string;
  isActive: boolean;
  description: string;
  sortOrder: string;
};

type BannerForm = {
  name: string;
  category: "" | ProductRecord["category"];
  price: string;
  label: string;
  image: string;
  externalUrl: string;
  isActive: boolean;
  headline: string;
  subheadline: string;
};

type ManagedSectionKind = "keunggulan" | "feature" | "category";

type SectionForm = {
  name: string;
  price: string;
  label: string;
  image: string;
  externalUrl: string;
  isActive: boolean;
  title: string;
  content: string;
  kind: ManagedSectionKind;
  sortOrder: string;
};

type SiteCopyForm = Record<SiteCopyKey, string>;

const emptyProduct: ProductForm = {
  name: "",
  category: "KAMBING",
  price: "",
  label: "",
  image: "",
  externalUrl: "https://wa.me/6285190607229",
  isActive: true,
  description: "",
  sortOrder: "0",
};

const emptyBanner: BannerForm = {
  name: "",
  category: "",
  price: "",
  label: "",
  image: "",
  externalUrl: "https://wa.me/6285190607229",
  isActive: true,
  headline: "",
  subheadline: "",
};

const emptySection: SectionForm = {
  name: "",
  price: "",
  label: "",
  image: "",
  externalUrl: "",
  isActive: true,
  title: "",
  content: "",
  kind: "feature",
  sortOrder: "0",
};

const sectionKindMeta: Record<ManagedSectionKind, { eyebrow: string; title: string; listTitle: string; buttonLabel: string }> = {
  keunggulan: {
    eyebrow: "Keunggulan",
    title: "Header section keunggulan",
    listTitle: "Konten section keunggulan",
    buttonLabel: "Tambah keunggulan",
  },
  feature: {
    eyebrow: "Feature",
    title: "Kartu di dalam section keunggulan",
    listTitle: "Daftar kartu feature",
    buttonLabel: "Tambah feature",
  },
  category: {
    eyebrow: "Kategori",
    title: "Konten kartu kategori",
    listTitle: "Daftar kategori",
    buttonLabel: "Tambah kategori",
  },
};

function numberOrNull(value: string) {
  return value ? Number(value) : null;
}

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
  if (!response.ok) throw new Error("Upload gambar gagal.");
  return (await response.json()) as { path: string };
}

async function submitJson<T>(url: string, method: string, body?: unknown) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: "Terjadi kesalahan." }));
    throw new Error(typeof payload.error === "string" ? payload.error : "Terjadi kesalahan.");
  }

  return (await response.json()) as T;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1F7A63]">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-2xl text-[#143C32] sm:text-3xl">{title}</h2>
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`min-w-0 w-full rounded-2xl border border-[#D8C79C] bg-[#FCFAF5] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#1F7A63] focus:bg-white focus:ring-2 focus:ring-[#1F7A63]/10 sm:text-base ${props.className ?? ""}`} />;
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`min-h-32 w-full resize-y rounded-2xl border border-[#D8C79C] bg-[#FCFAF5] px-4 py-3 text-sm leading-7 outline-none transition focus:border-[#1F7A63] focus:bg-white focus:ring-2 focus:ring-[#1F7A63]/10 sm:text-base ${props.className ?? ""}`} />;
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`min-w-0 w-full rounded-2xl border border-[#D8C79C] bg-[#FCFAF5] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#1F7A63] focus:bg-white focus:ring-2 focus:ring-[#1F7A63]/10 sm:text-base ${props.className ?? ""}`} />;
}

const adminGhostButtonClass =
  "rounded-full border border-[#D8C79C] px-4 py-2 text-sm font-semibold text-[#143C32] transition hover:-translate-y-0.5 hover:border-[#1F7A63] hover:bg-[#ECF6F1]";

const adminPrimaryButtonClass =
  "rounded-2xl bg-[#1F7A63] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#17614f] hover:shadow-[0_16px_30px_rgba(31,122,99,0.22)] disabled:opacity-70";

const adminDangerButtonClass =
  "inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50";

export function AdminDashboard({ initialProducts, initialBanners, initialSections }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [banners, setBanners] = useState(initialBanners);
  const [sections, setSections] = useState(initialSections);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [bannerForm, setBannerForm] = useState<BannerForm>(emptyBanner);
  const [sectionForms, setSectionForms] = useState<Record<ManagedSectionKind, SectionForm>>({
    keunggulan: { ...emptySection, kind: "keunggulan" },
    feature: { ...emptySection, kind: "feature" },
    category: { ...emptySection, kind: "category" },
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [editingSectionIds, setEditingSectionIds] = useState<Record<ManagedSectionKind, string | null>>({
    keunggulan: null,
    feature: null,
    category: null,
  });
  const [siteCopyForm, setSiteCopyForm] = useState<SiteCopyForm>(() => {
    const copySections = initialSections.filter((item) => item.kind === "copy");
    const keunggulanSection = initialSections.find((item) => item.kind === "keunggulan") ?? null;
    const values = copySections.reduce<Record<string, string>>((accumulator, item) => {
      accumulator[item.name] = item.content ?? "";
      return accumulator;
    }, {});
    return {
      ...siteCopyDefaults,
      keunggulan_title: keunggulanSection?.title ?? siteCopyDefaults.keunggulan_title,
      keunggulan_description: keunggulanSection?.content ?? siteCopyDefaults.keunggulan_description,
      ...values,
    } as SiteCopyForm;
  });
  const [status, setStatus] = useState("CMS siap digunakan.");
  const [uploading, setUploading] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const stats = useMemo(
    () => ({
      products: products.filter((item) => item.isActive).length,
      banners: banners.filter((item) => item.isActive).length,
      sections: sections.filter((item) => item.isActive).length,
    }),
    [banners, products, sections],
  );

  const featureSections = useMemo(
    () => sections.filter((item) => item.kind === "feature").sort((a, b) => a.sortOrder - b.sortOrder),
    [sections],
  );
  const categorySections = useMemo(
    () => sections.filter((item) => item.kind === "category").sort((a, b) => a.sortOrder - b.sortOrder),
    [sections],
  );
  const copySections = useMemo(
    () => sections.filter((item) => item.kind === "copy"),
    [sections],
  );
  const siteCopyGroups = useMemo(() => {
    return siteCopyFields.reduce<Record<SiteCopyGroup, SiteCopyField[]>>((accumulator, field) => {
      accumulator[field.group].push(field);
      return accumulator;
    }, {
      Hero: [],
      Keunggulan: [],
      Kategori: [],
    });
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function onUpload(file: File | null, target: "product" | "banner" | ManagedSectionKind) {
    if (!file) return;
    setUploading(target);
    try {
      const result = await uploadImage(file);
      if (target === "product") setProductForm((current) => ({ ...current, image: result.path }));
      if (target === "banner") setBannerForm((current) => ({ ...current, image: result.path }));
      if (target !== "product" && target !== "banner") {
        setSectionForms((current) => ({
          ...current,
          [target]: { ...current[target], image: result.path },
        }));
      }
      setStatus("Upload gambar berhasil.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload gagal.");
    } finally {
      setUploading(null);
    }
  }

  function resetProduct() {
    setProductForm(emptyProduct);
    setEditingProductId(null);
  }

  function resetBanner() {
    setBannerForm(emptyBanner);
    setEditingBannerId(null);
  }

  function updateSectionForm(kind: ManagedSectionKind, patch: Partial<SectionForm>) {
    setSectionForms((current) => ({
      ...current,
      [kind]: {
        ...current[kind],
        ...patch,
        kind,
      },
    }));
  }

  function resetSection(kind: ManagedSectionKind) {
    updateSectionForm(kind, { ...emptySection, kind });
    setEditingSectionIds((current) => ({ ...current, [kind]: null }));
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const payload = {
          name: productForm.name,
          category: productForm.category,
          price: numberOrNull(productForm.price),
          label: productForm.label || null,
          image: productForm.image || null,
          externalUrl: productForm.externalUrl || null,
          isActive: productForm.isActive,
          description: productForm.description || null,
          sortOrder: Number(productForm.sortOrder || 0),
        };
        const result = editingProductId
          ? await submitJson<ProductRecord>(`/api/admin/products/${editingProductId}`, "PUT", payload)
          : await submitJson<ProductRecord>("/api/admin/products", "POST", payload);
        setProducts((current) => (editingProductId ? current.map((item) => (item.id === result.id ? result : item)) : [result, ...current]));
        resetProduct();
        setStatus("Data produk berhasil disimpan.");
        router.refresh();
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Gagal menyimpan produk.");
      }
    });
  }

  async function saveBanner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const payload = {
          name: bannerForm.name,
          category: bannerForm.category || null,
          price: numberOrNull(bannerForm.price),
          label: bannerForm.label || null,
          image: bannerForm.image || null,
          externalUrl: bannerForm.externalUrl || null,
          isActive: bannerForm.isActive,
          headline: bannerForm.headline || null,
          subheadline: bannerForm.subheadline || null,
        };
        const result = editingBannerId
          ? await submitJson<BannerRecord>(`/api/admin/banners/${editingBannerId}`, "PUT", payload)
          : await submitJson<BannerRecord>("/api/admin/banners", "POST", payload);
        setBanners((current) => (editingBannerId ? current.map((item) => (item.id === result.id ? result : item)) : [result, ...current]));
        resetBanner();
        setStatus("Banner berhasil disimpan.");
        router.refresh();
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Gagal menyimpan banner.");
      }
    });
  }

  async function saveSection(kind: ManagedSectionKind, nextSortOrder: number, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const sectionForm = sectionForms[kind];
        const editingSectionId = editingSectionIds[kind];
        const isSimpleContent = kind === "feature" || kind === "category";
        const payload = {
          name: (isSimpleContent ? sectionForm.title : sectionForm.name) || sectionForm.name,
          category: null,
          price: isSimpleContent ? null : numberOrNull(sectionForm.price),
          label: sectionForm.label || null,
          image: isSimpleContent ? null : sectionForm.image || null,
          externalUrl: isSimpleContent ? null : sectionForm.externalUrl || null,
          isActive: sectionForm.isActive,
          title: sectionForm.title || null,
          content: sectionForm.content || null,
          kind,
          sortOrder: editingSectionId ? Number(sectionForm.sortOrder || nextSortOrder) : nextSortOrder,
        };
        const result = editingSectionId
          ? await submitJson<SectionRecord>(`/api/admin/sections/${editingSectionId}`, "PUT", payload)
          : await submitJson<SectionRecord>("/api/admin/sections", "POST", payload);
        setSections((current) => (editingSectionId ? current.map((item) => (item.id === result.id ? result : item)) : [result, ...current]));
        resetSection(kind);
        setStatus("Section berhasil disimpan.");
        router.refresh();
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Gagal menyimpan section.");
      }
    });
  }

  async function remove(type: "products" | "banners" | "sections", id: string) {
    startTransition(async () => {
      try {
        await submitJson(`/api/admin/${type}/${id}`, "DELETE");
        if (type === "products") setProducts((current) => current.filter((item) => item.id !== id));
        if (type === "banners") setBanners((current) => current.filter((item) => item.id !== id));
        if (type === "sections") setSections((current) => current.filter((item) => item.id !== id));
        setStatus("Data berhasil dihapus.");
        router.refresh();
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Gagal menghapus data.");
      }
    });
  }

  async function saveSiteCopy(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const nextRecords: SectionRecord[] = [];
        for (const field of siteCopyFields) {
          const existing = copySections.find((item) => item.name === field.key) ?? null;
          const payload = {
            name: field.key,
            category: null,
            price: null,
            label: field.group,
            image: null,
            externalUrl: null,
            isActive: true,
            title: field.label,
            content: siteCopyForm[field.key] || null,
            kind: "copy",
            sortOrder: 0,
          };
          const result = existing
            ? await submitJson<SectionRecord>(`/api/admin/sections/${existing.id}`, "PUT", payload)
            : await submitJson<SectionRecord>("/api/admin/sections", "POST", payload);
          nextRecords.push(result);
        }

        setSections((current) => {
          const nonCopySections = current.filter((item) => item.kind !== "copy");
          return [...nonCopySections, ...nextRecords];
        });
        setStatus("Konten website berhasil disimpan.");
        router.refresh();
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Gagal menyimpan konten website.");
      }
    });
  }

  function startEditingSection(item: SectionRecord) {
    if (item.kind !== "keunggulan" && item.kind !== "feature" && item.kind !== "category") {
      setStatus("Jenis section ini belum didukung editor baru.");
      return;
    }

    const kind = item.kind;
    const isSimpleContent = kind === "feature" || kind === "category";
    updateSectionForm(kind, {
      name: isSimpleContent ? item.title ?? item.name : item.name,
      price: isSimpleContent ? "" : item.price?.toString() ?? "",
      label: item.label ?? "",
      image: isSimpleContent ? "" : item.image ?? "",
      externalUrl: isSimpleContent ? "" : item.externalUrl ?? "",
      isActive: item.isActive,
      title: item.title ?? "",
      content: item.content ?? "",
      sortOrder: item.sortOrder.toString(),
    });
    setEditingSectionIds((current) => ({ ...current, [kind]: item.id }));
  }

  function renderSectionCrud(kind: ManagedSectionKind, items: SectionRecord[]) {
    const form = sectionForms[kind];
    const editingId = editingSectionIds[kind];
    const meta = sectionKindMeta[kind];
    const isSimpleContent = kind === "feature" || kind === "category";

    return (
      <section key={kind} className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-[#E7DFC9] bg-white/85 p-6">
          <div className="flex items-center justify-between">
            <SectionTitle eyebrow={meta.eyebrow} title={meta.title} />
            <button type="button" onClick={() => resetSection(kind)} className={adminGhostButtonClass}>Baru</button>
          </div>
          <form onSubmit={(event) => saveSection(kind, items.length + 1, event)} className="mt-6 grid gap-4">
            {isSimpleContent ? null : (
              <TextInput value={form.name} onChange={(event) => updateSectionForm(kind, { name: event.target.value })} placeholder="Nama section" required />
            )}
            <div className={isSimpleContent ? "" : "grid gap-4 md:grid-cols-2"}>
              <TextInput
                value={form.title}
                onChange={(event) => updateSectionForm(kind, { title: event.target.value, ...(isSimpleContent ? { name: event.target.value } : {}) })}
                placeholder={kind === "feature" ? "Judul feature" : "Judul kategori"}
                required
              />
              {isSimpleContent ? null : (
                <TextInput value={form.label} onChange={(event) => updateSectionForm(kind, { label: event.target.value })} placeholder="Label" />
              )}
            </div>
            <TextArea value={form.content} onChange={(event) => updateSectionForm(kind, { content: event.target.value })} placeholder="Isi konten" />
            {isSimpleContent ? (
              <TextInput value={form.label} onChange={(event) => updateSectionForm(kind, { label: event.target.value })} placeholder="Label kecil di atas judul" />
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-3">
                  <TextInput value={form.label} onChange={(event) => updateSectionForm(kind, { label: event.target.value })} placeholder="Label" />
                  <TextInput value={form.price} onChange={(event) => updateSectionForm(kind, { price: event.target.value })} placeholder="Harga opsional" type="number" />
                  <TextInput value={form.sortOrder} onChange={(event) => updateSectionForm(kind, { sortOrder: event.target.value })} placeholder="Urutan" type="number" />
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr,auto]">
                  <TextInput value={form.image} onChange={(event) => updateSectionForm(kind, { image: event.target.value })} placeholder="/uploads/section.png" />
                  <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#1F7A63] px-4 py-3 text-sm font-semibold text-[#1F7A63]">
                    <ImagePlus className="size-4" />
                    {uploading === kind ? "Uploading..." : "Upload gambar"}
                    <input type="file" accept="image/*" className="hidden" onChange={(event) => onUpload(event.target.files?.[0] ?? null, kind)} />
                  </label>
                </div>
                <TextInput value={form.externalUrl} onChange={(event) => updateSectionForm(kind, { externalUrl: event.target.value })} placeholder="Link opsional" />
              </>
            )}
            <label className="inline-flex items-center gap-3 text-sm text-[#35594E]">
              <input type="checkbox" checked={form.isActive} onChange={(event) => updateSectionForm(kind, { isActive: event.target.checked })} className="size-4" />
              Aktif ditampilkan
            </label>
            <button type="submit" disabled={pending} className={adminPrimaryButtonClass}>
              {editingId ? `Simpan perubahan ${meta.eyebrow.toLowerCase()}` : meta.buttonLabel}
            </button>
          </form>
          <p className="mt-4 text-sm leading-6 text-[#6B705C]">
            {kind === "keunggulan"
              ? "Bagian ini mengatur eyebrow, judul besar, dan paragraf pembuka untuk section hijau tua 'Keunggulan'."
              : kind === "feature"
                ? "Bagian ini mengatur kartu-kartu kecil di dalam section keunggulan."
                : "Bagian ini mengatur kartu kategori pada landing page tanpa field teknis yang tidak dipakai."}
          </p>
        </div>
        <div className="rounded-[2rem] border border-[#E7DFC9] bg-white/85 p-6">
          <SectionTitle eyebrow={`Daftar ${meta.eyebrow}`} title={meta.listTitle} />
          <div className="mt-6 space-y-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-[1.5rem] border border-[#E7DFC9] bg-[#FCFAF5] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1F7A63]">{item.kind}</p>
                    <h3 className="mt-1 text-lg font-semibold text-[#143C32]">{item.name}</h3>
                    <p className="mt-1 text-sm text-[#6B705C]">{item.title ?? "Tanpa title"}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`}>{item.isActive ? "Aktif" : "Nonaktif"}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => startEditingSection(item)} className={`${adminGhostButtonClass} inline-flex items-center gap-2`}>
                    <Pencil className="size-4" />
                    Edit
                  </button>
                  <button type="button" onClick={() => remove("sections", item.id)} className={adminDangerButtonClass}>
                    <Trash2 className="size-4" />
                    Hapus
                  </button>
                </div>
              </article>
            ))}
            {items.length === 0 ? <p className="text-sm text-[#6B705C]">Belum ada data.</p> : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.8fr,1fr]">
        <div className="rounded-[2rem] border border-[#D8C79C] bg-[#143C32] p-8 text-white shadow-[0_24px_80px_rgba(20,60,50,0.22)]">
          <p className="text-sm uppercase tracking-[0.35em] text-[#D8C79C]">Dashboard Admin</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold">Qurban & Aqiqah CMS</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80">
            Kelola katalog produk, banner utama, dan section landing page tanpa perlu mengubah kode.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => router.refresh()} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15">
              <RefreshCcw className="size-4" />
              Refresh data
            </button>
            <button type="button" onClick={handleLogout} className="inline-flex items-center gap-2 rounded-full border border-[#D8C79C] bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-[#143C32] hover:bg-[#e0bf58]">
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[
            { label: "Produk aktif", value: stats.products },
            { label: "Banner aktif", value: stats.banners },
            { label: "Section aktif", value: stats.sections },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.75rem] border border-[#E7DFC9] bg-white/85 p-5 shadow-sm">
              <p className="text-sm text-[#6B705C]">{item.label}</p>
              <p className="mt-2 font-serif text-4xl font-semibold text-[#143C32]">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="rounded-2xl border border-[#D8C79C] bg-[#FCFAF5] px-5 py-4 text-sm text-[#35594E]">{status}</p>

      <section className="rounded-[2rem] border border-[#E7DFC9] bg-white/85 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SectionTitle eyebrow="Konten Website" title="Edit semua teks utama homepage" />
          <p className="max-w-2xl text-sm leading-6 text-[#6B705C]">
            Bagian ini dipakai untuk mengubah kata-kata di hero, section kategori, dan kartu highlight tanpa perlu edit item satu-satu.
          </p>
        </div>
        <form onSubmit={saveSiteCopy} className="mt-6 space-y-6">
          {Object.entries(siteCopyGroups).map(([group, fields]) => (
            <div key={group} className="rounded-[1.5rem] border border-[#E7DFC9] bg-[#FCFAF5] p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1F7A63]">{group}</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {fields.map((field) => (
                  <label key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                    <span className="mb-2 block text-sm font-semibold text-[#143C32]">{field.label}</span>
                    {field.type === "textarea" ? (
                      <TextArea
                        value={siteCopyForm[field.key]}
                        onChange={(event) => setSiteCopyForm((current) => ({ ...current, [field.key]: event.target.value }))}
                        placeholder={field.defaultValue}
                      />
                    ) : (
                      <TextInput
                        value={siteCopyForm[field.key]}
                        onChange={(event) => setSiteCopyForm((current) => ({ ...current, [field.key]: event.target.value }))}
                        placeholder={field.defaultValue}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}
            <button type="submit" disabled={pending} className={adminPrimaryButtonClass}>
              Simpan konten website
            </button>
        </form>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-[#E7DFC9] bg-white/85 p-6">
          <div className="flex items-center justify-between">
            <SectionTitle eyebrow="Produk" title="CRUD katalog" />
            <button type="button" onClick={resetProduct} className={adminGhostButtonClass}>Baru</button>
          </div>
          <form onSubmit={saveProduct} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput value={productForm.name} onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))} placeholder="Nama produk" required />
              <Select value={productForm.category} onChange={(event) => setProductForm((current) => ({ ...current, category: event.target.value as ProductRecord["category"] }))}>
                {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput value={productForm.price} onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))} placeholder="Harga" type="number" />
              <TextInput value={productForm.label} onChange={(event) => setProductForm((current) => ({ ...current, label: event.target.value }))} placeholder="Label" />
            </div>
            <TextArea value={productForm.description} onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))} placeholder="Deskripsi singkat" />
            <div className="grid gap-4 md:grid-cols-[1fr,auto]">
              <TextInput value={productForm.image} onChange={(event) => setProductForm((current) => ({ ...current, image: event.target.value }))} placeholder="/uploads/nama-file.png" />
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#1F7A63] px-4 py-3 text-sm font-semibold text-[#1F7A63]">
                <ImagePlus className="size-4" />
                {uploading === "product" ? "Uploading..." : "Upload gambar"}
                <input type="file" accept="image/*" className="hidden" onChange={(event) => onUpload(event.target.files?.[0] ?? null, "product")} />
              </label>
            </div>
            <TextInput value={productForm.externalUrl} onChange={(event) => setProductForm((current) => ({ ...current, externalUrl: event.target.value }))} placeholder="https://wa.me/628..." />
            <label className="inline-flex items-center gap-3 text-sm text-[#35594E]">
              <input type="checkbox" checked={productForm.isActive} onChange={(event) => setProductForm((current) => ({ ...current, isActive: event.target.checked }))} className="size-4" />
              Aktif ditampilkan
            </label>
            <button type="submit" disabled={pending} className={adminPrimaryButtonClass}>
              {editingProductId ? "Simpan perubahan produk" : "Tambah produk"}
            </button>
          </form>
        </div>
        <div className="rounded-[2rem] border border-[#E7DFC9] bg-white/85 p-6">
          <SectionTitle eyebrow="Daftar produk" title="Produk tersimpan" />
          <div className="mt-6 space-y-3">
            {products.map((item) => (
              <article key={item.id} className="rounded-[1.5rem] border border-[#E7DFC9] bg-[#FCFAF5] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1F7A63]">{item.category}</p>
                    <h3 className="mt-1 text-lg font-semibold text-[#143C32]">{item.name}</h3>
                    <p className="mt-1 text-sm text-[#6B705C]">{item.label ?? "Tanpa label"}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`}>{item.isActive ? "Aktif" : "Nonaktif"}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => { setEditingProductId(item.id); setProductForm({ name: item.name, category: item.category, price: item.price?.toString() ?? "", label: item.label ?? "", image: item.image ?? "", externalUrl: item.externalUrl ?? "", isActive: item.isActive, description: item.description ?? "", sortOrder: item.sortOrder.toString() }); }} className={`${adminGhostButtonClass} inline-flex items-center gap-2`}>
                    <Pencil className="size-4" />
                    Edit
                  </button>
                  <button type="button" onClick={() => remove("products", item.id)} className={adminDangerButtonClass}>
                    <Trash2 className="size-4" />
                    Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-[#E7DFC9] bg-white/85 p-6">
          <div className="flex items-center justify-between">
            <SectionTitle eyebrow="Banner" title="Hero & promo" />
            <button type="button" onClick={resetBanner} className={adminGhostButtonClass}>Baru</button>
          </div>
          <form onSubmit={saveBanner} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput value={bannerForm.name} onChange={(event) => setBannerForm((current) => ({ ...current, name: event.target.value }))} placeholder="Nama banner" required />
              <Select value={bannerForm.category} onChange={(event) => setBannerForm((current) => ({ ...current, category: event.target.value as BannerForm["category"] }))}>
                <option value="">Tanpa kategori</option>
                {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput value={bannerForm.headline} onChange={(event) => setBannerForm((current) => ({ ...current, headline: event.target.value }))} placeholder="Headline" />
              <TextInput value={bannerForm.label} onChange={(event) => setBannerForm((current) => ({ ...current, label: event.target.value }))} placeholder="Label" />
            </div>
            <TextArea value={bannerForm.subheadline} onChange={(event) => setBannerForm((current) => ({ ...current, subheadline: event.target.value }))} placeholder="Subheadline" />
            <div className="grid gap-4 md:grid-cols-[1fr,auto]">
              <TextInput value={bannerForm.image} onChange={(event) => setBannerForm((current) => ({ ...current, image: event.target.value }))} placeholder="/uploads/banner.png" />
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#1F7A63] px-4 py-3 text-sm font-semibold text-[#1F7A63]">
                <ImagePlus className="size-4" />
                {uploading === "banner" ? "Uploading..." : "Upload gambar"}
                <input type="file" accept="image/*" className="hidden" onChange={(event) => onUpload(event.target.files?.[0] ?? null, "banner")} />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput value={bannerForm.price} onChange={(event) => setBannerForm((current) => ({ ...current, price: event.target.value }))} placeholder="Harga mulai" type="number" />
              <TextInput value={bannerForm.externalUrl} onChange={(event) => setBannerForm((current) => ({ ...current, externalUrl: event.target.value }))} placeholder="CTA URL" />
            </div>
            <label className="inline-flex items-center gap-3 text-sm text-[#35594E]">
              <input type="checkbox" checked={bannerForm.isActive} onChange={(event) => setBannerForm((current) => ({ ...current, isActive: event.target.checked }))} className="size-4" />
              Aktif ditampilkan
            </label>
            <button type="submit" disabled={pending} className={adminPrimaryButtonClass}>
              {editingBannerId ? "Simpan perubahan banner" : "Tambah banner"}
            </button>
          </form>
        </div>
        <div className="rounded-[2rem] border border-[#E7DFC9] bg-white/85 p-6">
          <SectionTitle eyebrow="Daftar banner" title="Banner aktif & arsip" />
          <div className="mt-6 space-y-3">
            {banners.map((item) => (
              <article key={item.id} className="rounded-[1.5rem] border border-[#E7DFC9] bg-[#FCFAF5] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1F7A63]">{item.category ?? "GENERAL"}</p>
                    <h3 className="mt-1 text-lg font-semibold text-[#143C32]">{item.name}</h3>
                    <p className="mt-1 text-sm text-[#6B705C]">{item.headline ?? "Tanpa headline"}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`}>{item.isActive ? "Aktif" : "Nonaktif"}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => { setEditingBannerId(item.id); setBannerForm({ name: item.name, category: item.category ?? "", price: item.price?.toString() ?? "", label: item.label ?? "", image: item.image ?? "", externalUrl: item.externalUrl ?? "", isActive: item.isActive, headline: item.headline ?? "", subheadline: item.subheadline ?? "" }); }} className={`${adminGhostButtonClass} inline-flex items-center gap-2`}>
                    <Pencil className="size-4" />
                    Edit
                  </button>
                  <button type="button" onClick={() => remove("banners", item.id)} className={adminDangerButtonClass}>
                    <Trash2 className="size-4" />
                    Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {renderSectionCrud("feature", featureSections)}
      {renderSectionCrud("category", categorySections)}
    </div>
  );
}
