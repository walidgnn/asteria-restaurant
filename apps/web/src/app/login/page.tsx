"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
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
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden md:block">
        <Image
          src="/images/dining-room.jpg"
          alt="Asteria's dining room bathed in morning light"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-center px-8 py-16 sm:px-16">
        <Link
          href="/"
          className="mb-12 text-center font-serif text-2xl text-charcoal"
        >
          ASTERIA
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-serif text-4xl text-charcoal">Welcome Back</h1>
          <p className="mt-3 text-stone">
            Sign in to continue your Asteria experience.
          </p>

          {error && (
            <p className="mt-6 border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="text-xs font-medium tracking-wide text-stone">
                EMAIL ADDRESS
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium tracking-wide text-stone">
                  PASSWORD
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-terracotta hover:text-charcoal"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
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

          <p className="mt-8 text-center text-sm text-stone">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-terracotta hover:text-charcoal">
              CREATE AN ACCOUNT →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}