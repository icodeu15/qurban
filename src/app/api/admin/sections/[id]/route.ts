import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sectionSchema } from "@/lib/validation";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = sectionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Data section tidak valid." }, { status: 400 });
  }

  const { id } = await params;
  const section = await prisma.section.update({ where: { id }, data: parsed.data });
  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json(section);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.section.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json({ success: true });
}
