import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const sections = await prisma.section.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(sections);
}
