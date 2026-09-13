"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const { token } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const currentPassword = form.get("currentPassword") as string;
    const newPassword = form.get("newPassword") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://192.168.100.10:3001/auth/me/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to change password.");
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-cream px-8 py-8">
        <button onClick={onClose} aria-label="Close" className="absolute right-6 top-6">
          <X size={20} className="text-charcoal" />
        </button>

        {success ? (
          <>
            <h2 className="font-serif text-2xl text-charcoal">Password Updated</h2>
            <p className="mt-3 text-sm text-stone">
              Your password has been changed successfully.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark"
            >
              CLOSE
            </button>
          </>
        ) : (
          <>
            <h2 className="font-serif text-2xl text-charcoal">Change Password</h2>
            {error && (
              <p className="mt-4 border border-terracotta/40 bg-terracotta/10 px-4 py-2.5 text-sm text-terracotta">
                {error}
              </p>
            )}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <input
                name="currentPassword"
                type="password"
                required
                placeholder="Current Password"
                className="w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
              />
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
                className="w-full bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark disabled:opacity-60"
              >
                {loading ? "SAVING..." : "SAVE NEW PASSWORD"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}