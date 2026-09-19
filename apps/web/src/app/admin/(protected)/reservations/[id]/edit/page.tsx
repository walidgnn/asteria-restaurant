"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth-context";

const TIME_SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

export default function EditReservationPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAdminAuth();
  const [loaded, setLoaded] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [partySize, setPartySize] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/admin/reservations/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const d = new Date(data.reservationDate);
        setDate(d.toISOString().slice(0, 10));
        setTime(d.toTimeString().slice(0, 5));
        setPartySize(data.partySize);
        setLoaded(true);
      });
  }, [token, params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/admin/reservations/${params.id}/details`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ date, time, partySize }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to update reservation.");
      }
      router.push(`/admin/reservations/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!loaded) return <p className="text-stone">Loading...</p>;

  return (
    <div>
      <Link href={`/admin/reservations/${params.id}`} className="text-sm font-medium tracking-wide text-charcoal">
        ← BACK TO RESERVATION
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-charcoal">Edit Reservation</h1>
      <p className="mt-2 text-stone">Update the date, time, or party size. Table assignment will adjust automatically if needed.</p>

      {error && (
        <p className="mt-6 max-w-lg border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 max-w-lg">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium tracking-wide text-stone">DATE</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium tracking-wide text-stone">PARTY SIZE</label>
            <input
              type="number"
              min={1}
              required
              value={partySize}
              onChange={(e) => setPartySize(parseInt(e.target.value))}
              className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-8">
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

        <button
          type="submit"
          disabled={submitting}
          className="mt-10 bg-olive px-8 py-3.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark disabled:opacity-60"
        >
          {submitting ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </form>
    </div>
  );
}