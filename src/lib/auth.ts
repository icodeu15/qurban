import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "qurban_admin_session";

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "admin123",
    sessionSecret: process.env.ADMIN_SESSION_SECRET ?? "qurban-admin-session",
  };
}

export function isValidAdminLogin(username: string, password: string) {
  const admin = getAdminCredentials();
  return username === admin.username && password === admin.password;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === getAdminCredentials().sessionSecret;
}
