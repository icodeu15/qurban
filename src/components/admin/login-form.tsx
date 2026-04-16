"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, UserRound } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      setError("");
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({ error: "Login gagal." }));
        setError(payload.error ?? "Login gagal.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[2rem] border border-white/55 bg-white/90 p-8 shadow-[0_24px_80px_rgba(31,122,99,0.18)] backdrop-blur"
    >
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1F7A63]">Admin CMS</p>
        <h1 className="font-serif text-4xl font-semibold text-[#143C32]">Masuk ke dashboard</h1>
        <p className="text-sm leading-6 text-[#5F665E]">
          Kelola banner, produk, dan konten landing page dari satu tempat.
        </p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#143C32]">Username</span>
        <div className="flex items-center gap-3 rounded-2xl border border-[#D8C79C] bg-[#FCFAF5] px-4 py-3">
          <UserRound className="size-4 text-[#1F7A63]" />
          <input name="username" type="text" placeholder="Masukkan username" className="w-full bg-transparent text-sm outline-none" required />
        </div>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#143C32]">Password</span>
        <div className="flex items-center gap-3 rounded-2xl border border-[#D8C79C] bg-[#FCFAF5] px-4 py-3">
          <LockKeyhole className="size-4 text-[#1F7A63]" />
          <input name="password" type="password" placeholder="Masukkan password" className="w-full bg-transparent text-sm outline-none" required />
        </div>
      </label>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-[#1F7A63] px-5 py-3 text-sm font-semibold text-white hover:bg-[#17614f] disabled:opacity-70"
      >
        {pending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
}
