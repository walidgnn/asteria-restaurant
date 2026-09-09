"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    setLoading(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <h1 className="font-serif text-3xl tracking-wide text-charcoal">
            ASTERIA ADMIN
          </h1>
          <p className="mt-1 text-sm text-stone">Management Suite</p>
        </div>

        {error && (
          <p className="mt-6 border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="text-xs font-medium tracking-wide text-stone">
              EMAIL
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium tracking-wide text-stone">
              PASSWORD
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-olive px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark disabled:opacity-60"
          >
            {loading ? "SIGNING IN..." : "SIGN IN →"}
          </button>
        </form>
      </div>
    </div>
  );
}