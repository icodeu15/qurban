"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, LogOut, Pencil, RefreshCcw, Trash2 } from "lucide-react";

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

type SectionForm = {
  name: string;
  category: "" | ProductRecord["category"];
  price: string;
  label: string;
  image: string;
  externalUrl: string;
  isActive: boolean;
  title: string;
  content: string;
  kind: string;
  sortOrder: string;
};

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
  category: "",
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
      <h2 className="mt-2 font-serif text-3xl text-[#143C32]">{title}</h2>
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`rounded-2xl border border-[#D8C79C] bg-[#FCFAF5] px-4 py-3 outline-none ${props.className ?? ""}`} />;
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`min-h-28 rounded-2xl border border-[#D8C79C] bg-[#FCFAF5] px-4 py-3 outline-none ${props.className ?? ""}`} />;
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`rounded-2xl border border-[#D8C79C] bg-[#FCFAF5] px-4 py-3 outline-none ${props.className ?? ""}`} />;
}

export function AdminDashboard({ initialProducts, initialBanners, initialSections }: Props) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [banners, setBanners] = useState(initialBanners);
  const [sections, setSections] = useState(initialSections);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProduct);
  const [bannerForm, setBannerForm] = useState<BannerForm>(emptyBanner);
  const [sectionForm, setSectionForm] = useState<SectionForm>(emptySection);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
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

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  async function onUpload(file: File | null, target: "product" | "banner" | "section") {
    if (!file) return;
    setUploading(target);
    try {
      const result = await uploadImage(file);
      if (target === "product") setProductForm((current) => ({ ...current, image: result.path }));
      if (target === "banner") setBannerForm((current) => ({ ...current, image: result.path }));
      if (target === "section") setSectionForm((current) => ({ ...current, image: result.path }));
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

  function resetSection() {
    setSectionForm(emptySection);
    setEditingSectionId(null);
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

  async function saveSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      try {
        const payload = {
          name: sectionForm.name,
          category: sectionForm.category || null,
          price: numberOrNull(sectionForm.price),
          label: sectionForm.label || null,
          image: sectionForm.image || null,
          externalUrl: sectionForm.externalUrl || null,
          isActive: sectionForm.isActive,
          title: sectionForm.title || null,
          content: sectionForm.content || null,
          kind: sectionForm.kind,
          sortOrder: Number(sectionForm.sortOrder || 0),
        };
        const result = editingSectionId
          ? await submitJson<SectionRecord>(`/api/admin/sections/${editingSectionId}`, "PUT", payload)
          : await submitJson<SectionRecord>("/api/admin/sections", "POST", payload);
        setSections((current) => (editingSectionId ? current.map((item) => (item.id === result.id ? result : item)) : [result, ...current]));
        resetSection();
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

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-[#E7DFC9] bg-white/85 p-6">
          <div className="flex items-center justify-between">
            <SectionTitle eyebrow="Produk" title="CRUD katalog" />
            <button type="button" onClick={resetProduct} className="rounded-full border border-[#D8C79C] px-4 py-2 text-sm font-semibold text-[#143C32]">Baru</button>
          </div>
          <form onSubmit={saveProduct} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput value={productForm.name} onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))} placeholder="Nama produk" required />
              <Select value={productForm.category} onChange={(event) => setProductForm((current) => ({ ...current, category: event.target.value as ProductRecord["category"] }))}>
                {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </Select>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <TextInput value={productForm.price} onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))} placeholder="Harga" type="number" />
              <TextInput value={productForm.label} onChange={(event) => setProductForm((current) => ({ ...current, label: event.target.value }))} placeholder="Label" />
              <TextInput value={productForm.sortOrder} onChange={(event) => setProductForm((current) => ({ ...current, sortOrder: event.target.value }))} placeholder="Urutan" type="number" />
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
            <button type="submit" disabled={pending} className="rounded-2xl bg-[#1F7A63] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">
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
                  <button type="button" onClick={() => { setEditingProductId(item.id); setProductForm({ name: item.name, category: item.category, price: item.price?.toString() ?? "", label: item.label ?? "", image: item.image ?? "", externalUrl: item.externalUrl ?? "", isActive: item.isActive, description: item.description ?? "", sortOrder: item.sortOrder.toString() }); }} className="inline-flex items-center gap-2 rounded-full border border-[#D8C79C] px-4 py-2 text-sm font-semibold text-[#143C32]">
                    <Pencil className="size-4" />
                    Edit
                  </button>
                  <button type="button" onClick={() => remove("products", item.id)} className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">
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
            <button type="button" onClick={resetBanner} className="rounded-full border border-[#D8C79C] px-4 py-2 text-sm font-semibold text-[#143C32]">Baru</button>
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
            <button type="submit" disabled={pending} className="rounded-2xl bg-[#1F7A63] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">
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
                  <button type="button" onClick={() => { setEditingBannerId(item.id); setBannerForm({ name: item.name, category: item.category ?? "", price: item.price?.toString() ?? "", label: item.label ?? "", image: item.image ?? "", externalUrl: item.externalUrl ?? "", isActive: item.isActive, headline: item.headline ?? "", subheadline: item.subheadline ?? "" }); }} className="inline-flex items-center gap-2 rounded-full border border-[#D8C79C] px-4 py-2 text-sm font-semibold text-[#143C32]">
                    <Pencil className="size-4" />
                    Edit
                  </button>
                  <button type="button" onClick={() => remove("banners", item.id)} className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">
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
            <SectionTitle eyebrow="Section" title="Feature & category content" />
            <button type="button" onClick={resetSection} className="rounded-full border border-[#D8C79C] px-4 py-2 text-sm font-semibold text-[#143C32]">Baru</button>
          </div>
          <form onSubmit={saveSection} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput value={sectionForm.name} onChange={(event) => setSectionForm((current) => ({ ...current, name: event.target.value }))} placeholder="Nama section" required />
              <TextInput value={sectionForm.kind} onChange={(event) => setSectionForm((current) => ({ ...current, kind: event.target.value }))} placeholder="feature / category / promo" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput value={sectionForm.title} onChange={(event) => setSectionForm((current) => ({ ...current, title: event.target.value }))} placeholder="Title" />
              <Select value={sectionForm.category} onChange={(event) => setSectionForm((current) => ({ ...current, category: event.target.value as SectionForm["category"] }))}>
                <option value="">Tanpa kategori</option>
                {categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </Select>
            </div>
            <TextArea value={sectionForm.content} onChange={(event) => setSectionForm((current) => ({ ...current, content: event.target.value }))} placeholder="Isi konten" />
            <div className="grid gap-4 md:grid-cols-3">
              <TextInput value={sectionForm.label} onChange={(event) => setSectionForm((current) => ({ ...current, label: event.target.value }))} placeholder="Label" />
              <TextInput value={sectionForm.price} onChange={(event) => setSectionForm((current) => ({ ...current, price: event.target.value }))} placeholder="Harga opsional" type="number" />
              <TextInput value={sectionForm.sortOrder} onChange={(event) => setSectionForm((current) => ({ ...current, sortOrder: event.target.value }))} placeholder="Urutan" type="number" />
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr,auto]">
              <TextInput value={sectionForm.image} onChange={(event) => setSectionForm((current) => ({ ...current, image: event.target.value }))} placeholder="/uploads/section.png" />
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-[#1F7A63] px-4 py-3 text-sm font-semibold text-[#1F7A63]">
                <ImagePlus className="size-4" />
                {uploading === "section" ? "Uploading..." : "Upload gambar"}
                <input type="file" accept="image/*" className="hidden" onChange={(event) => onUpload(event.target.files?.[0] ?? null, "section")} />
              </label>
            </div>
            <TextInput value={sectionForm.externalUrl} onChange={(event) => setSectionForm((current) => ({ ...current, externalUrl: event.target.value }))} placeholder="Link opsional" />
            <label className="inline-flex items-center gap-3 text-sm text-[#35594E]">
              <input type="checkbox" checked={sectionForm.isActive} onChange={(event) => setSectionForm((current) => ({ ...current, isActive: event.target.checked }))} className="size-4" />
              Aktif ditampilkan
            </label>
            <button type="submit" disabled={pending} className="rounded-2xl bg-[#1F7A63] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70">
              {editingSectionId ? "Simpan perubahan section" : "Tambah section"}
            </button>
          </form>
        </div>
        <div className="rounded-[2rem] border border-[#E7DFC9] bg-white/85 p-6">
          <SectionTitle eyebrow="Daftar section" title="Konten tambahan" />
          <div className="mt-6 space-y-3">
            {sections.map((item) => (
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
                  <button type="button" onClick={() => { setEditingSectionId(item.id); setSectionForm({ name: item.name, category: item.category ?? "", price: item.price?.toString() ?? "", label: item.label ?? "", image: item.image ?? "", externalUrl: item.externalUrl ?? "", isActive: item.isActive, title: item.title ?? "", content: item.content ?? "", kind: item.kind, sortOrder: item.sortOrder.toString() }); }} className="inline-flex items-center gap-2 rounded-full border border-[#D8C79C] px-4 py-2 text-sm font-semibold text-[#143C32]">
                    <Pencil className="size-4" />
                    Edit
                  </button>
                  <button type="button" onClick={() => remove("sections", item.id)} className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">
                    <Trash2 className="size-4" />
                    Hapus
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
