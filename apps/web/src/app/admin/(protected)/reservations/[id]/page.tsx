"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth-context";

const NEXT_LABEL: Record<string, string> = {
  PENDING: "MARK AS CONFIRMED",
  CONFIRMED: "MARK AS SEATED",
  SEATED: "MARK AS COMPLETED",
};

type Table = { id: string; number: string; capacity: number };

type ReservationDetail = {
  id: string;
  partySize: number;
  reservationDate: string;
  status: string;
  notes: string | null;
  staffNotes: string | null;
  customer: { firstName: string; lastName: string; email: string; phone: string | null };
  table: Table | null;
  statusHistory: { status: string; changedAt: string; note: string | null }[];
  previousReservationsCount: number;
};

export default function AdminReservationDetailPage() {
  const params = useParams();
  const { token, hasPermission } = useAdminAuth();
  const [reservation, setReservation] = useState<ReservationDetail | null>(null);
  const [staffNotes, setStaffNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [changingTable, setChangingTable] = useState(false);
  const [availableTables, setAvailableTables] = useState<Table[]>([]);

  async function load() {
    const res = await fetch(`http://localhost:3001/admin/reservations/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setReservation(data);
    setStaffNotes(data.staffNotes ?? "");
  }

  useEffect(() => {
    if (!token) return;
    load();
  }, [token, params.id]);

  async function handleAdvance() {
    setBusy(true);
    await fetch(`http://localhost:3001/admin/reservations/${params.id}/advance`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    await load();
    setBusy(false);
  }

  async function handleNoShow() {
    if (!confirm("Mark this reservation as a no-show?")) return;
    setBusy(true);
    await fetch(`http://localhost:3001/admin/reservations/${params.id}/no-show`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    await load();
    setBusy(false);
  }

  async function handleCancel() {
    if (!confirm("Cancel this reservation?")) return;
    setBusy(true);
    await fetch(`http://localhost:3001/admin/reservations/${params.id}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    await load();
    setBusy(false);
  }

  async function saveStaffNotes() {
    await fetch(`http://localhost:3001/admin/reservations/${params.id}/staff-notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ staffNotes }),
    });
  }

  async function openChangeTable() {
    const res = await fetch(`http://localhost:3001/admin/reservations/${params.id}/available-tables`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAvailableTables(await res.json());
    setChangingTable(true);
  }

  async function assignTable(tableId: string) {
    await fetch(`http://localhost:3001/admin/reservations/${params.id}/table`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ tableId }),
    });
    setChangingTable(false);
    await load();
  }

  if (!reservation) return <p className="text-stone">Loading...</p>;

  const canAdvance = reservation.status in NEXT_LABEL;
  const canManage = hasPermission("reservations.manage");
  const isFinal = ["CANCELLED", "NO_SHOW", "COMPLETED"].includes(reservation.status);

  return (
    <div>
      <Link href="/admin/reservations" className="text-sm font-medium tracking-wide text-charcoal">
        ← BACK TO RESERVATIONS
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-4xl text-charcoal">Reservation #{reservation.id.slice(-4).toUpperCase()}</h1>
          <span className="bg-[#E8ECE3] px-3 py-1 text-xs font-medium tracking-wide text-charcoal">
            {reservation.status}
          </span>
        </div>
        {canManage && canAdvance && (
          <button
            onClick={handleAdvance}
            disabled={busy}
            className="bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark disabled:opacity-60"
          >
            {NEXT_LABEL[reservation.status]} →
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-stone">
        {new Date(reservation.reservationDate).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        {" · "}
        {new Date(reservation.reservationDate).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">OVERVIEW</p>
            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-stone">DATE</p>
                <p className="mt-1 text-charcoal">{new Date(reservation.reservationDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-stone">TIME</p>
                <p className="mt-1 text-charcoal">
                  {new Date(reservation.reservationDate).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone">GUESTS</p>
                <p className="mt-1 text-charcoal">{reservation.partySize} Guests</p>
              </div>
              <div>
                <p className="text-xs text-stone">TABLE</p>
                <p className="mt-1 text-charcoal">{reservation.table?.number ?? "Unassigned"}</p>
              </div>
            </div>
          </div>

          <div className="border border-border px-6 py-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-wide text-terracotta">CUSTOMER DETAILS</p>
              <Link href="/admin/customers" className="text-xs font-medium tracking-wide text-charcoal">
                VIEW CUSTOMER →
              </Link>
            </div>
            <p className="mt-3 font-serif text-xl text-charcoal">
              {reservation.customer.firstName} {reservation.customer.lastName}
            </p>
            <p className="mt-1 text-sm text-stone">{reservation.customer.email}</p>
            {reservation.customer.phone && <p className="text-sm text-stone">{reservation.customer.phone}</p>}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-border px-6 py-5">
              <p className="text-xs font-medium tracking-wide text-terracotta">SPECIAL REQUESTS</p>
              <p className="mt-2 text-sm italic text-charcoal">
                {reservation.notes ? `"${reservation.notes}"` : "None provided."}
              </p>
            </div>
            <div className="bg-mist px-6 py-5">
              <p className="text-xs font-medium tracking-wide text-terracotta">STAFF NOTES</p>
              <textarea
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                onBlur={saveStaffNotes}
                placeholder="Internal notes visible only to staff..."
                rows={2}
                className="mt-2 w-full resize-none bg-transparent text-sm italic text-charcoal placeholder:text-stone/60 focus:outline-none"
              />
            </div>
          </div>

          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">TIMELINE</p>
            <div className="mt-4 space-y-4">
              {reservation.statusHistory.map((h, i) => (
                <div key={i} className="flex justify-between border-l-2 border-charcoal pl-4">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{h.status.replace("_", " ")}</p>
                    {h.note && <p className="text-xs text-stone">{h.note}</p>}
                  </div>
                  <p className="text-xs text-stone">
                    {new Date(h.changedAt).toLocaleDateString()}, {new Date(h.changedAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">TABLE ASSIGNMENT</p>
            <div className="mt-4 border border-border px-4 py-6 text-center">
              <p className="font-serif text-2xl text-charcoal">
                {reservation.table ? `TABLE ${reservation.table.number}` : "UNASSIGNED"}
              </p>
              {reservation.table && (
                <p className="mt-1 text-xs text-stone">
                  CAPACITY: {reservation.table.capacity} · RESERVED
                </p>
              )}
            </div>
            {canManage && !isFinal && (
              <button
                onClick={openChangeTable}
                className="mt-4 w-full border border-border py-2.5 text-sm font-medium tracking-wide text-charcoal hover:border-charcoal"
              >
                CHANGE TABLE
              </button>
            )}
            {changingTable && (
              <div className="mt-3 max-h-40 space-y-1 overflow-y-auto border border-border p-2">
                {availableTables.length === 0 ? (
                  <p className="p-2 text-xs text-stone">No suitable tables available.</p>
                ) : (
                  availableTables.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => assignTable(t.id)}
                      className="block w-full px-2 py-1.5 text-left text-sm text-charcoal hover:bg-mist"
                    >
                      Table {t.number} (seats {t.capacity})
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">GUEST STATUS</p>
            <p className="mt-3 text-sm text-charcoal">
              {reservation.previousReservationsCount} previous reservation
              {reservation.previousReservationsCount !== 1 ? "s" : ""}
            </p>
          </div>

          {canManage && !isFinal && (
            <div className="space-y-1 border-t border-border pt-4">
              <button onClick={handleNoShow} disabled={busy} className="block text-sm font-medium tracking-wide text-charcoal">
                MARK AS NO-SHOW
              </button>
              <button onClick={handleCancel} disabled={busy} className="block text-sm font-medium tracking-wide text-terracotta">
                CANCEL RESERVATION
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}