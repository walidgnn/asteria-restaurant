"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const TIME_SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

type Reservation = {
  id: string;
  partySize: number;
  reservationDate: string;
  notes: string | null;
  status: string;
};

export default function ModifyReservationPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:30");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`http://192.168.100.10:3001/reservations/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data: Reservation) => {
        setReservation(data);
        const d = new Date(data.reservationDate);
        setDate(d.toISOString().slice(0, 10));
        setTime(d.toTimeString().slice(0, 5));
        setGuests(data.partySize);
        setNotes(data.notes ?? "");
      });
  }, [token, params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`http://192.168.100.10:3001/reservations/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date, time, partySize: guests, notes: notes || undefined }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to update reservation.");
      }
      router.push(`/account/reservations/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!reservation) return <p className="text-stone">Loading...</p>;

  return (
    <div>
      <Link
        href={`/account/reservations/${params.id}`}
        className="text-sm font-medium tracking-wide text-charcoal"
      >
        ← BACK TO RESERVATION
      </Link>

      <h1 className="mt-6 font-serif text-4xl text-charcoal">Modify Reservation</h1>
      <p className="mt-3 text-stone">Update your date, time, or party size.</p>

      {error && (
        <p className="mt-6 max-w-lg border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 max-w-lg">
        <div className="grid gap-6 sm:grid-cols-2">
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
            <label className="text-xs font-medium tracking-wide text-stone">GUESTS</label>
            <div className="mt-2 flex items-center justify-between border-b border-border py-2">
              <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="Decrease guests">
                <Minus size={16} className="text-charcoal" />
              </button>
              <span className="text-sm text-charcoal">{guests} {guests === 1 ? "Person" : "People"}</span>
              <button type="button" onClick={() => setGuests((g) => Math.min(6, g + 1))} aria-label="Increase guests">
                <Plus size={16} className="text-charcoal" />
              </button>
            </div>
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
                  time === slot
                    ? "border-charcoal bg-charcoal text-white"
                    : "border-border text-charcoal hover:border-charcoal"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <label className="text-xs font-medium tracking-wide text-stone">
            SPECIAL REQUESTS (OPTIONAL)
          </label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Dietary requirements, occasions..."
            className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-10 bg-olive px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark disabled:opacity-60"
        >
          {submitting ? "SAVING..." : "SAVE CHANGES"}
        </button>
      </form>
    </div>
  );
}