"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";

const TIME_SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

export default function ReservationsPage() {
  const router = useRouter();
  const { customer, token } = useAuth();
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [time, setTime] = useState("19:30");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!customer || !token) {
      router.push("/login?redirect=/reservations");
      return;
    }
    if (!date) {
      setError("Please choose a date.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const notes = form.get("notes") as string;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date,
          time,
          partySize: guests,
          notes: notes || undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to create reservation.");
      const reservation = await res.json();
      router.push(`/reservation-confirmation?reservation=${reservation.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <>
      <Header solid />

      <section className="mx-auto max-w-7xl px-8 py-16">
        <p className="mb-3 flex items-center gap-3 text-sm font-medium tracking-[0.2em] text-terracotta">
          <span className="h-px w-6 bg-terracotta" />
          BOOKING
        </p>
        <h1 className="font-serif text-4xl text-charcoal md:text-5xl">
          Reserve Your Table
        </h1>
        <p className="mt-4 max-w-xl text-stone">
          Join us for a Mediterranean dining experience shaped by seasonal
          ingredients, warm hospitality, and time spent around the table.
        </p>

        {error && (
          <p className="mt-6 max-w-2xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-12 grid gap-16 lg:grid-cols-[1fr_400px]">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">
              Reservation Details
            </h2>
            <div className="mt-5 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium tracking-wide text-stone">
                  DATE
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium tracking-wide text-stone">
                  GUESTS
                </label>
                <div className="mt-2 flex items-center justify-between border-b border-border py-2">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    aria-label="Decrease guests"
                  >
                    <Minus size={16} className="text-charcoal" />
                  </button>
                  <span className="text-sm text-charcoal">
                    {guests} {guests === 1 ? "Person" : "People"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(6, g + 1))}
                    aria-label="Increase guests"
                  >
                    <Plus size={16} className="text-charcoal" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label className="text-xs font-medium tracking-wide text-stone">
                TIME
              </label>
              <div className="mt-3 grid grid-cols-3 gap-3 sm:max-w-md">
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

            <h2 className="mt-10 font-serif text-2xl text-charcoal">
              Guest Information
            </h2>
            <p className="mt-2 text-sm text-stone">
              {customer
                ? `Booking as ${customer.firstName} ${customer.lastName} (${customer.email})`
                : "You'll be asked to sign in before confirming."}
            </p>

            <div className="mt-5">
              <label className="text-xs font-medium tracking-wide text-stone">
                SPECIAL REQUESTS (OPTIONAL)
              </label>
              <input
                name="notes"
                placeholder="Dietary requirements, occasions..."
                className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="/images/dining-room.jpg"
                alt="Asteria's arched dining room set for service"
                fill
                className="object-cover"
              />
            </div>

            <div className="mt-6 bg-mist px-6 py-6">
              <h3 className="font-serif text-xl text-charcoal">Asteria</h3>
              <p className="mt-3 text-sm text-stone">
                123 Mediterranean Avenue
                <br />
                Santa Monica, CA 90401
              </p>
              <p className="mt-3 text-sm text-stone">
                Wed – Sun: 12:00 PM – 11:00 PM
              </p>
              <p className="mt-4 text-xs italic text-stone">
                For parties larger than 6, please contact the restaurant
                directly.
              </p>
            </div>

            <div className="mt-6 bg-mist px-6 py-6">
              <p className="text-xs font-medium tracking-wide text-terracotta">
                YOUR RESERVATION
              </p>
              <p className="mt-2 text-sm text-charcoal">
                {formattedDate} | {time} | {guests} {guests === 1 ? "Guest" : "Guests"}
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full bg-olive px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark disabled:opacity-60"
              >
                {submitting ? "BOOKING..." : "CONFIRM RESERVATION →"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <Footer />
    </>
  );
}