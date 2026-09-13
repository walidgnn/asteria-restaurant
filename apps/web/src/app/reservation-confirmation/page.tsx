"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";

type Reservation = {
  id: string;
  partySize: number;
  reservationDate: string;
  notes: string | null;
};

export default function ReservationConfirmationPage() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservation");
  const { token } = useAuth();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reservationId || !token) {
      setLoading(false);
      return;
    }
    fetch(`http://192.168.100.10:3001/reservations/${reservationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(setReservation)
      .finally(() => setLoading(false));
  }, [reservationId, token]);

  if (loading) {
    return (
      <>
        <Header solid />
        <div className="py-24 text-center text-stone">Loading...</div>
        <Footer />
      </>
    );
  }

  if (!reservation) {
    return (
      <>
        <Header solid />
        <div className="mx-auto max-w-3xl px-8 py-24 text-center">
          <h1 className="font-serif text-3xl text-charcoal">
            No reservation found.
          </h1>
        </div>
        <Footer />
      </>
    );
  }

  const date = new Date(reservation.reservationDate);
  const dateStr = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <>
      <Header solid />

      <section className="mx-auto max-w-2xl px-8 py-20 text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-olive text-white">
          <Check size={18} />
        </div>
        <p className="mb-3 text-sm font-medium tracking-[0.2em] text-terracotta">
          RESERVATION CONFIRMED
        </p>
        <h1 className="font-serif text-5xl text-charcoal">
          Your Table Is Reserved.
        </h1>
        <p className="mt-4 text-stone">
          We look forward to welcoming you to Asteria.
        </p>

        <div className="mt-10 bg-mist px-8 py-8 text-left">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs tracking-wide text-stone">DATE</p>
              <p className="mt-1 text-sm text-charcoal">{dateStr}</p>
            </div>
            <div className="border-x border-border">
              <p className="text-xs tracking-wide text-stone">TIME</p>
              <p className="mt-1 text-sm text-charcoal">{timeStr}</p>
            </div>
            <div>
              <p className="text-xs tracking-wide text-stone">GUESTS</p>
              <p className="mt-1 text-sm text-charcoal">{reservation.partySize}</p>
            </div>
          </div>
          <p className="mt-6 border-t border-border pt-4 text-center text-xs text-stone">
            Reservation #R{reservation.id.slice(-4).toUpperCase()}
          </p>
        </div>

        <p className="mt-8 text-sm text-stone">
          <strong className="text-charcoal">Asteria</strong>
          <br />
          123 Mediterranean Avenue, Santa Monica, CA
          <br />
          Please arrive within 15 minutes of your reservation time.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href={`/account/reservations/${reservation.id}`}
            className="bg-olive px-8 py-3.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark"
          >
            VIEW MY RESERVATION →
          </Link>
          <Link
            href="/menu"
            className="border border-border px-8 py-3.5 text-sm font-medium tracking-wide text-charcoal hover:border-charcoal"
          >
            VIEW MENU
          </Link>
          <Link
            href="/"
            className="border border-border px-8 py-3.5 text-sm font-medium tracking-wide text-charcoal hover:border-charcoal"
          >
            BACK TO HOME
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}