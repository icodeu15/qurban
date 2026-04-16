import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bannerSchema } from "@/lib/validation";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(await prisma.banner.findMany({ orderBy: { createdAt: "desc" } }));
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bannerSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Data banner tidak valid." }, { status: 400 });
  }

  const banner = await prisma.banner.create({ data: parsed.data });
  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json(banner);
}
