"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

type Summary = {
  todaysOrdersCount: number;
  activeOrdersCount: number;
  todaysReservationsCount: number;
  upcomingReservationsCount: number;
  revenueToday: number;
  activeOrders: { id: string; orderNumber: number; status: string; orderType: string; totalAmount: string }[];
  upcomingReservations: {
    id: string;
    partySize: number;
    reservationDate: string;
    status: string;
    customer: { firstName: string; lastName: string };
  }[];
  tableStatus: { total: number; available: number; occupied: number; reserved: number };
  recentActivity: { time: string; message: string }[];
};

export default function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3001/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setSummary);
  }, [token]);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!summary) return <p className="text-stone">Loading...</p>;

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl text-charcoal">Dashboard</h1>
          <p className="mt-2 text-stone">Here&apos;s what&apos;s happening at Asteria today.</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border border-border px-6 py-4">
        <p className="text-sm text-charcoal">
          TODAY: {today.toUpperCase()}
        </p>
        <p className="flex items-center gap-2 text-sm text-terracotta">
          <span className="h-2 w-2 rounded-full bg-terracotta" />
          ASTERIA: OPEN 12:00 PM — 11:00 PM
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="border border-border px-6 py-6">
          <p className="text-xs font-medium tracking-wide text-stone">TODAY&apos;S ORDERS</p>
          <p className="mt-2 font-serif text-4xl text-charcoal">
            {summary.todaysOrdersCount}{" "}
            <span className="text-base text-stone">(Active: {summary.activeOrdersCount})</span>
          </p>
        </div>
        <div className="border border-border px-6 py-6">
          <p className="text-xs font-medium tracking-wide text-stone">TODAY&apos;S RESERVATIONS</p>
          <p className="mt-2 font-serif text-4xl text-charcoal">
            {summary.todaysReservationsCount}{" "}
            <span className="text-base text-stone">(Upcoming: {summary.upcomingReservationsCount})</span>
          </p>
        </div>
        <div className="border border-border px-6 py-6">
          <p className="text-xs font-medium tracking-wide text-stone">REVENUE TODAY</p>
          <p className="mt-2 font-serif text-4xl text-charcoal">€{summary.revenueToday.toFixed(0)}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="border border-border px-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-charcoal">Active Orders</h2>
            <Link href="/admin/orders" className="text-xs font-medium tracking-wide text-terracotta">
              VIEW ALL →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {summary.activeOrders.length === 0 ? (
              <p className="text-sm text-stone">No active orders right now.</p>
            ) : (
              summary.activeOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between bg-mist px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-cream px-2 py-1 text-xs font-medium text-charcoal">
                      #A{o.orderNumber}
                    </span>
                    <div>
                      <p className="text-sm text-charcoal">
                        {o.status} · {o.orderType.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-terracotta">€{Number(o.totalAmount).toFixed(0)}</span>
                    <Link href={`/admin/orders/${o.id}`} className="text-xs font-medium tracking-wide text-charcoal">
                      VIEW →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            href="/admin/orders/new"
            className="mt-4 flex items-center justify-center gap-2 border border-border py-3 text-sm font-medium tracking-wide text-charcoal hover:border-charcoal"
          >
            <Plus size={14} /> NEW ORDER
          </Link>
        </div>

        <div className="border border-border px-6 py-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-charcoal">Upcoming Reservations</h2>
            <Link href="/admin/reservations" className="text-xs font-medium tracking-wide text-terracotta">
              VIEW ALL →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {summary.upcomingReservations.length === 0 ? (
              <p className="text-sm text-stone">No upcoming reservations today.</p>
            ) : (
              summary.upcomingReservations.map((r) => (
                <div key={r.id} className="flex items-center justify-between bg-mist px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-charcoal">
                      {new Date(r.reservationDate).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                    </span>
                    <div>
                      <p className="text-sm text-charcoal">
                        {r.customer.firstName} {r.customer.lastName}
                      </p>
                      <p className="text-xs text-stone">{r.partySize} Guests · {r.status}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            href="/admin/reservations/new"
            className="mt-4 flex items-center justify-center gap-2 bg-olive py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark"
          >
            <Plus size={14} /> NEW RESERVATION
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="border border-border px-6 py-6">
          <h2 className="font-serif text-2xl text-charcoal">Table Status</h2>
          <p className="mt-4 font-serif text-5xl text-charcoal">
            {summary.tableStatus.total}
            <span className="ml-2 text-sm text-stone">TOTAL TABLES</span>
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-4">
            <div>
              <p className="text-xs tracking-wide text-stone">AVAILABLE</p>
              <p className="mt-1 text-2xl text-charcoal">{summary.tableStatus.available}</p>
            </div>
            <div>
              <p className="text-xs tracking-wide text-stone">OCCUPIED</p>
              <p className="mt-1 text-2xl text-charcoal">{summary.tableStatus.occupied}</p>
            </div>
            <div>
              <p className="text-xs tracking-wide text-stone">RESERVED</p>
              <p className="mt-1 text-2xl text-charcoal">{summary.tableStatus.reserved}</p>
            </div>
          </div>
          <Link href="/admin/tables" className="mt-4 inline-block text-sm font-medium tracking-wide text-charcoal">
            MANAGE TABLES →
          </Link>
        </div>

        <div className="border border-border px-6 py-6">
          <h2 className="font-serif text-2xl text-charcoal">Recent Activity</h2>
          <div className="mt-4 space-y-4">
            {summary.recentActivity.length === 0 ? (
              <p className="text-sm text-stone">No recent activity.</p>
            ) : (
              summary.recentActivity.map((a, i) => (
                <div key={i} className="flex gap-3 border-l-2 border-border pl-4">
                  <div>
                    <p className="text-xs text-stone">
                      {new Date(a.time).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                    </p>
                    <p className="mt-1 text-sm text-charcoal">{a.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}