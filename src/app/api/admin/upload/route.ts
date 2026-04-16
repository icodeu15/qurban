import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";

export const runtime = "nodejs";

function sanitizeFileName(fileName: string) {
  const extension = path.extname(fileName);
  const name = path.basename(fileName, extension).replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
  return `${Date.now()}-${name}${extension.toLowerCase()}`;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File gambar tidak valid." }, { status: 400 });
  }

  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDirectory, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = sanitizeFileName(file.name);
  await writeFile(path.join(uploadDirectory, fileName), buffer);

  return NextResponse.json({ path: `/uploads/${fileName}` });
}
