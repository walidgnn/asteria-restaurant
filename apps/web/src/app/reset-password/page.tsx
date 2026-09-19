"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const newPassword = form.get("newPassword") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to reset password.");
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-8 text-center">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Invalid Link</h1>
          <p className="mt-3 text-stone">This password reset link is missing or malformed.</p>
          <Link href="/forgot-password" className="mt-6 inline-block text-sm font-medium tracking-wide text-charcoal">
            ← Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 py-16">
      <Link href="/" className="mb-10 font-serif text-2xl text-charcoal">
        ASTERIA
      </Link>

      <div className="w-full max-w-md text-center">
        {success ? (
          <>
            <h1 className="font-serif text-4xl text-charcoal">Password Reset</h1>
            <p className="mt-4 text-stone">
              Your password has been updated. Redirecting you to sign in...
            </p>
          </>
        ) : (
          <>
            <h1 className="font-serif text-4xl text-charcoal">Set a New Password</h1>
            {error && (
              <p className="mt-4 border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5 text-left">
              <input
                name="newPassword"
                type="password"
                required
                minLength={8}
                placeholder="New Password"
                className="w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
              />
              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm New Password"
                className="w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-olive px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark disabled:opacity-60"
              >
                {loading ? "SAVING..." : "RESET PASSWORD →"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}