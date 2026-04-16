import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validation";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    await prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
  );
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Data produk tidak valid." }, { status: 400 });
  }

  const product = await prisma.product.create({ data: parsed.data });
  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json(product);
}
