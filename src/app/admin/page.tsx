import { AdminDashboard } from "@/components/admin/dashboard";
import { BrandLogo } from "@/components/brand-logo";
import { AdminLoginForm } from "@/components/admin/login-form";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BannerRecord, ProductRecord, SectionRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

async function loadAdminData(): Promise<{
  products: ProductRecord[];
  banners: BannerRecord[];
  sections: SectionRecord[];
}> {
  try {
    const [products, banners, sections] = await Promise.all([
      prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
      prisma.banner.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.section.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    ]);

    return { products, banners, sections };
  } catch (error) {
    console.error("Failed to load admin data from Prisma.", error);
    return {
      products: [],
      banners: [],
      sections: [],
    };
  }
}

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return (
      <main className="pattern-bg min-h-screen px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:items-center">
          <section className="flex flex-col items-center justify-center space-y-6">
            <BrandLogo className="h-20 w-auto sm:h-24" priority />
          </section>
          <AdminLoginForm />
        </div>
      </main>
    );
  }

  const { products, banners, sections } = await loadAdminData();

  return (
    <main className="pattern-bg min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminDashboard initialProducts={products} initialBanners={banners} initialSections={sections} />
      </div>
    </main>
  );
}
