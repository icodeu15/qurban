import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ADMIN_COOKIE_NAME, getAdminCredentials, isValidAdminLogin } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = (await request.json()) as { username?: string; password?: string };

  if (!username || !password || !isValidAdminLogin(username, password)) {
    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_COOKIE_NAME,
    value: getAdminCredentials().sessionSecret,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return NextResponse.json({ success: true });
}
