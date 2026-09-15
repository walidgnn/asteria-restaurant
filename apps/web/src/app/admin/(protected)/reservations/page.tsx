"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

type Reservation = {
  id: string;
  partySize: number;
  reservationDate: string;
  status: string;
  notes: string | null;
  customer: { firstName: string; lastName: string; phone: string | null };
  table: { number: string } | null;
};

export default function AdminReservationsPage() {
  const { token } = useAdminAuth();
  const [date, setDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState({ totalReservations: 0, totalGuests: 0, upcoming: 0, tablesAvailable: 0 });

  useEffect(() => {
    if (!token) return;
    const params = new URLSearchParams();
    params.set("date", date.toISOString());
    if (statusFilter) params.set("status", statusFilter);
    if (search) params.set("search", search);

    fetch(`http://localhost:3001admin/reservations?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setReservations(data.reservations);
        setStats(data.stats);
      });
  }, [token, date, statusFilter, search]);

  function shiftDay(delta: number) {
    setDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + delta);
      return next;
    });
  }

  const isToday = date.toDateString() === new Date().toDateString();

  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-terracotta">
        <span className="h-px w-6 bg-terracotta" />
        MANAGEMENT
      </p>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl text-charcoal">Reservations</h1>
          <p className="mt-2 text-stone">Manage today&apos;s bookings and upcoming reservations.</p>
        </div>
        <Link
          href="/admin/reservations/new"
          className="bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark"
        >
          + NEW RESERVATION
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border border-border bg-mist px-6 py-5">
        <div className="flex items-center gap-4 bg-cream px-4 py-2">
          <button onClick={() => shiftDay(-1)} aria-label="Previous day">
            <ChevronLeft size={16} className="text-charcoal" />
          </button>
          <span className="text-sm font-medium tracking-wide text-charcoal">
            {isToday ? "TODAY: " : ""}
            {date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
          </span>
          <button onClick={() => shiftDay(1)} aria-label="Next day">
            <ChevronRight size={16} className="text-charcoal" />
          </button>
        </div>

        <div className="flex gap-10">
          <div>
            <p className="font-serif text-2xl text-charcoal">{stats.totalReservations}</p>
            <p className="text-xs tracking-wide text-stone">RESERVATIONS</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-charcoal">{stats.totalGuests}</p>
            <p className="text-xs tracking-wide text-stone">GUESTS</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-charcoal">{stats.upcoming}</p>
            <p className="text-xs tracking-wide text-stone">UPCOMING</p>
          </div>
          <div>
            <p className="font-serif text-2xl text-terracotta">{stats.tablesAvailable}</p>
            <p className="text-xs tracking-wide text-stone">TABLES AVAIL</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reservations..."
            className="w-full border border-border bg-transparent py-2.5 pl-9 pr-3 text-sm text-charcoal focus:border-charcoal focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-border bg-transparent py-2.5 px-3 text-sm text-charcoal focus:border-charcoal focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="SEATED">Seated</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="NO_SHOW">No-Show</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-mist">
            <tr className="text-xs tracking-wide text-stone">
              <th className="px-4 py-3">TIME</th>
              <th className="px-4 py-3">RESERVATION</th>
              <th className="px-4 py-3">GUESTS</th>
              <th className="px-4 py-3">TABLE</th>
              <th className="px-4 py-3">CONTACT</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">SPECIAL REQUEST</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-4 py-4 font-medium text-charcoal">
                  {new Date(r.reservationDate).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                </td>
                <td className="px-4 py-4">
                  <p className="font-medium text-charcoal">
                    {r.customer.firstName.toUpperCase()} {r.customer.lastName.toUpperCase()}
                  </p>
                  <p className="text-xs text-stone">{r.partySize} GUESTS</p>
                </td>
                <td className="px-4 py-4 text-charcoal">{r.partySize}</td>
                <td className="px-4 py-4">
                  {r.table ? (
                    <span className="text-charcoal">{r.table.number}</span>
                  ) : (
                    <span className="text-terracotta">UNASSIGNED</span>
                  )}
                </td>
                <td className="px-4 py-4 text-stone">{r.customer.phone ?? "—"}</td>
                <td className="px-4 py-4">
                  <span className="bg-mist px-2 py-1 text-xs font-medium tracking-wide text-charcoal">
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-4 italic text-stone">{r.notes ?? "—"}</td>
                <td className="px-4 py-4">
                  <Link href={`/admin/reservations/${r.id}`} className="text-xs font-medium tracking-wide text-charcoal">
                    VIEW →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}