import { AdminDashboard } from "@/components/admin/dashboard";
import { BrandLogo } from "@/components/brand-logo";
import { AdminLoginForm } from "@/components/admin/login-form";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <main className="pattern-bg min-h-screen px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
          <section className="space-y-6">
            <BrandLogo className="h-12 w-auto" priority />
            <h1 className="font-serif text-5xl leading-tight text-[#143C32] sm:text-6xl">
              Kelola landing page dengan cepat dan aman.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#5F665E]">
              Login admin untuk memperbarui katalog hewan qurban, banner promo, dan paket aqiqah tanpa perlu deploy ulang.
            </p>
          </section>
          <AdminLoginForm />
        </div>
      </main>
    );
  }

  const [products, banners, sections] = await Promise.all([
    prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    prisma.banner.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.section.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
  ]);

  return (
    <main className="pattern-bg min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminDashboard initialProducts={products} initialBanners={banners} initialSections={sections} />
      </div>
    </main>
  );
}
