"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const result = await signIn("credentials", {
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/admin");
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0c0a] flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <p className="text-[10px] tracking-[0.55em] text-champagne uppercase mb-4 text-center">
          Admin Access
        </p>
        <h1 className="font-display text-4xl text-ivory mb-10 text-center">
          Nguyệt Minh
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Mật khẩu"
              autoFocus
              className={`w-full bg-white/[0.04] border rounded px-4 py-3.5 text-sm text-ivory placeholder-ivory/20 outline-none transition-colors ${
                error ? "border-red-400/40" : "border-white/[0.08] focus:border-champagne/50"
              }`}
            />
            {error && (
              <p className="text-[10px] text-red-400/70 mt-2 tracking-wide">
                Mật khẩu không đúng
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="py-3.5 bg-champagne text-espresso text-xs tracking-[0.35em] uppercase hover:bg-champagne/80 transition-colors disabled:opacity-40"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
