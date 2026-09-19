"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { API_URL } from "@/lib/config";

type Reservation = {
  id: string;
  partySize: number;
  reservationDate: string;
  status: string;
};

export default function ReservationsPage() {
  const { token } = useAuth();
  const [reservations, setReservations] = useState<Reservation[] | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/reservations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setReservations);
  }, [token]);

  if (!reservations) {
    return <p className="text-stone">Loading...</p>;
  }

  const now = new Date();
  const upcoming = reservations.filter(
    (r) => new Date(r.reservationDate) >= now && r.status !== "CANCELLED"
  );
  const past = reservations.filter(
    (r) => new Date(r.reservationDate) < now || r.status === "CANCELLED"
  );

  return (
    <div>
      <h1 className="font-serif text-4xl text-charcoal">Your Reservations</h1>
      <p className="mt-3 text-stone">
        Keep track of your upcoming visits and past evenings at Asteria.
      </p>

      <h2 className="mt-10 font-serif text-2xl text-charcoal">
        Upcoming Reservation
      </h2>
      {upcoming.length === 0 ? (
        <div className="mt-4 flex flex-col items-start gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-stone">You have no upcoming reservations.</p>
          <Link href="/reservations" className="text-sm font-medium tracking-wide text-charcoal">
            RESERVE A TABLE →
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {upcoming.map((r) => {
            const date = new Date(r.reservationDate);
            return (
              <div key={r.id} className="bg-mist px-6 py-6">
                <span className="inline-block bg-charcoal px-3 py-1 text-xs font-medium tracking-wide text-white">
                  {r.status}
                </span>
                <p className="mt-3 font-serif text-2xl text-charcoal">
                  {date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </p>
                <p className="mt-1 text-sm text-stone">
                  {date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })} · Table for {r.partySize}
                </p>
                <Link
                  href={`/account/reservations/${r.id}`}
                  className="mt-4 inline-block bg-olive px-6 py-2.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark"
                >
                  VIEW RESERVATION
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <h2 className="mt-12 font-serif text-2xl text-charcoal">
        Past Reservations
      </h2>
      {past.length === 0 ? (
        <p className="mt-4 text-stone">No past reservations yet.</p>
      ) : (
        <div className="mt-4">
          {past.map((r) => {
            const date = new Date(r.reservationDate);
            return (
              <Link
                key={r.id}
                href={`/account/reservations/${r.id}`}
                className="flex items-center justify-between border-b border-border py-4 hover:text-terracotta"
              >
                <div>
                  <p className="text-charcoal">
                    {date.toLocaleDateString()} · {r.partySize} Guests
                  </p>
                </div>
                <span className="text-xs tracking-wide text-stone capitalize">
                  {r.status.toLowerCase()}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}