import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sectionSchema } from "@/lib/validation";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    await prisma.section.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
  );
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = sectionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Data section tidak valid." }, { status: 400 });
  }

  const section = await prisma.section.create({ data: parsed.data });
  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json(section);
}
