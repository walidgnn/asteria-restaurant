"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

type Reservation = {
  id: string;
  partySize: number;
  reservationDate: string;
  status: string;
  notes: string | null;
};

export default function ReservationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`http://192.168.100.10:3001/reservations/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setReservation);
  }, [token, params.id]);

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;
    setCancelling(true);
    await fetch(`http://192.168.100.10:3001/reservations/${params.id}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    router.refresh();
    setCancelling(false);
    setReservation((r) => (r ? { ...r, status: "CANCELLED" } : r));
  }

  if (!reservation) return <p className="text-stone">Loading...</p>;

  const date = new Date(reservation.reservationDate);

  return (
    <div>
      <Link href="/account/reservations" className="text-sm font-medium tracking-wide text-charcoal">
        ← BACK TO RESERVATIONS
      </Link>

      <p className="mt-6 text-sm font-medium tracking-[0.2em] text-terracotta">
        RESERVATION #R{reservation.id.slice(-4).toUpperCase()}
      </p>
      <h1 className="mt-2 font-serif text-5xl text-charcoal">Your Reservation</h1>

      <p className="mt-4 flex items-center gap-2 text-charcoal">
        <span className="h-2 w-2 rounded-full bg-olive" />
        {reservation.status} —{" "}
        {reservation.status === "CANCELLED"
          ? "This reservation has been cancelled."
          : "We look forward to welcoming you to Asteria."}
      </p>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="grid grid-cols-2 gap-6 border-y border-border py-6">
            <div>
              <p className="text-xs tracking-wide text-stone">DATE</p>
              <p className="mt-1 text-charcoal">
                {date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-wide text-stone">TIME</p>
              <p className="mt-1 text-charcoal">
                {date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
              </p>
            </div>
            <div>
              <p className="text-xs tracking-wide text-stone">GUESTS</p>
              <p className="mt-1 text-charcoal">{reservation.partySize} Guests</p>
            </div>
            <div>
              <p className="text-xs tracking-wide text-stone">LOCATION</p>
              <p className="mt-1 text-charcoal">Main Dining Room</p>
            </div>
          </div>

          <h2 className="mt-8 font-serif text-2xl text-charcoal">Details</h2>
          <p className="mt-4 text-sm text-stone">
            ASTERIA
            <br />
            123 Mediterranean Avenue, Santa Monica, CA
            <br />
            +1 (310) 555-0123
            <br />
            hello@asteria-restaurant.com
          </p>

          {reservation.notes && (
            <>
              <p className="mt-6 text-xs tracking-wide text-stone">
                SPECIAL REQUESTS
              </p>
              <p className="mt-2 bg-mist px-4 py-3 text-sm italic text-charcoal">
                &quot;{reservation.notes}&quot;
              </p>
            </>
          )}

          {reservation.status !== "CANCELLED" && (
            <div className="mt-8 flex items-center gap-6">
                            <Link
                href={`/account/reservations/${reservation.id}/modify`}
                className="bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark"
              >
                MODIFY RESERVATION →
              </Link>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="text-sm font-medium tracking-wide text-terracotta hover:text-charcoal"
              >
                {cancelling ? "CANCELLING..." : "CANCEL RESERVATION"}
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="relative aspect-[4/3] w-full">
            <Image
              src="/images/dining-room.jpg"
              alt="Asteria's dining room"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-6 bg-mist px-6 py-6">
            <h3 className="font-serif text-xl text-charcoal">Visit Asteria</h3>
            <p className="mt-3 text-sm text-stone">
              123 Mediterranean Avenue
              <br />
              Santa Monica, CA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}