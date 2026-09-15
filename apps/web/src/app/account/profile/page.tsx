"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { customer, token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const form = new FormData(e.currentTarget);
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;
    const phone = form.get("phone") as string;

    try {
      const res = await fetch("http://localhost:3001auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, phone }),
      });
      if (!res.ok) throw new Error("Failed to update profile.");
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <p className="text-xs font-medium tracking-[0.15em] text-terracotta">
        MY ACCOUNT
      </p>
      <h1 className="mt-2 font-serif text-4xl text-charcoal">Your Profile</h1>
      <p className="mt-3 text-stone">Keep your personal details up to date.</p>

      <form onSubmit={handleSubmit} className="mt-10 max-w-xl">
        <h2 className="font-serif text-2xl text-charcoal">
          Personal Information
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium tracking-wide text-stone">
              FIRST NAME
            </label>
            <input
              name="firstName"
              defaultValue={customer?.firstName}
              className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium tracking-wide text-stone">
              LAST NAME
            </label>
            <input
              name="lastName"
              defaultValue={customer?.lastName}
              className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-xs font-medium tracking-wide text-stone">
            EMAIL ADDRESS
          </label>
          <input
            disabled
            value={customer?.email}
            className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-stone"
          />
        </div>

        <div className="mt-6">
          <label className="text-xs font-medium tracking-wide text-stone">
            PHONE NUMBER
          </label>
          <input
            name="phone"
            placeholder="+1 (___) ___-____"
            className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
          />
        </div>

        {error && <p className="mt-4 text-sm text-terracotta">{error}</p>}
        {saved && (
          <p className="mt-4 text-sm text-olive">Profile updated successfully.</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="mt-8 bg-olive px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark disabled:opacity-60"
        >
          {saving ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </form>

      <div className="mt-12 max-w-xl bg-mist px-8 py-8">
        <h3 className="font-serif text-xl text-charcoal">
          Password &amp; Security
        </h3>
        <p className="mt-2 text-sm text-stone">
          Keep your account secure with a strong password. We recommend
          updating it regularly.
        </p>
        <button
          disabled
          className="mt-4 border border-border px-6 py-2.5 text-sm font-medium tracking-wide text-stone opacity-60"
        >
          CHANGE PASSWORD
        </button>
      </div>
    </div>
  );
}