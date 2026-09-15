"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth-context";

const TIME_SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

export default function NewReservationPage() {
  const router = useRouter();
  const { token } = useAdminAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [time, setTime] = useState("19:00");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;
    const email = form.get("email") as string;
    const phone = form.get("phone") as string;
    const date = form.get("date") as string;
    const partySize = parseInt(form.get("partySize") as string);
    const notes = form.get("notes") as string;

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3001admin/reservations/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ firstName, lastName, email, phone, date, time, partySize, notes }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to create reservation.");
      }
      const reservation = await res.json();
      router.push(`/admin/reservations/${reservation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Link href="/admin/reservations" className="text-sm font-medium tracking-wide text-charcoal">
        ← BACK TO RESERVATIONS
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-charcoal">New Reservation</h1>
      <p className="mt-2 text-stone">Create a reservation on behalf of a guest (e.g. phone booking).</p>

      {error && (
        <p className="mt-6 max-w-lg border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 max-w-lg space-y-6">
        <div className="grid grid-cols-2 gap-5">
          <input name="firstName" required placeholder="First Name" className="border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
          <input name="lastName" required placeholder="Last Name" className="border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
        </div>
        <input name="email" type="email" required placeholder="Email" className="w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
        <input name="phone" placeholder="Phone" className="w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />

        <div className="grid grid-cols-2 gap-5">
          <input name="date" type="date" required className="border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
          <select name="partySize" required defaultValue="2" className="border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>{n} Guests</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium tracking-wide text-stone">TIME</label>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={`border px-4 py-3 text-sm transition-colors ${
                  time === slot ? "border-charcoal bg-charcoal text-white" : "border-border text-charcoal hover:border-charcoal"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <textarea name="notes" rows={2} placeholder="Special requests (optional)" className="w-full border border-border bg-transparent px-4 py-3 text-sm text-charcoal focus:border-charcoal focus:outline-none" />

        <button
          type="submit"
          disabled={submitting}
          className="bg-olive px-8 py-3.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark disabled:opacity-60"
        >
          {submitting ? "CREATING..." : "CREATE RESERVATION"}
        </button>
      </form>
    </div>
  );
}