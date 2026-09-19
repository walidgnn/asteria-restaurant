"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { API_URL } from "@/lib/config";

type Order = { id: string; orderNumber: number; createdAt: string; orderType: string; totalAmount: string; status: string };
type Reservation = { id: string; reservationDate: string; partySize: number; status: string; table: { number: string } | null };

type CustomerDetail = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isVip: boolean;
  staffNotes: string | null;
  createdAt: string;
  orders: Order[];
  reservations: Reservation[];
  orderCount: number;
  reservationCount: number;
  recentActivity: { time: string; message: string }[];
};

export default function CustomerDetailPage() {
  const params = useParams();
  const { token, hasPermission } = useAdminAuth();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [notes, setNotes] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);
  const canManage = hasPermission("customers.manage");

  async function load() {
    const res = await fetch(`${API_URL}/admin/customers/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCustomer(data);
    setNotes(data.staffNotes ?? "");
  }

  useEffect(() => {
    if (!token) return;
    load();
  }, [token, params.id]);

  async function saveNotes() {
    await fetch(`${API_URL}/admin/customers/${params.id}/notes`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ staffNotes: notes }),
    });
    setEditingNotes(false);
    await load();
  }

  async function toggleVip() {
    await fetch(`${API_URL}/admin/customers/${params.id}/vip`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    await load();
  }

  if (!customer) return <p className="text-stone">Loading...</p>;

  return (
    <div>
      <Link href="/admin/customers" className="text-sm font-medium tracking-wide text-charcoal">
        ← BACK TO CUSTOMERS
      </Link>
      <p className="mt-4 text-xs text-stone">
        CUSTOMERS / <span className="text-charcoal">{customer.firstName.toUpperCase()} {customer.lastName.toUpperCase()}</span>
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-3xl text-charcoal">{customer.firstName} {customer.lastName}</h1>
          {customer.isVip && <span className="bg-mist px-2 py-1 text-xs tracking-wide text-charcoal">VIP</span>}
        </div>
        {canManage && (
          <button onClick={toggleVip} className="border border-border px-4 py-2 text-xs font-medium tracking-wide text-charcoal hover:border-charcoal">
            {customer.isVip ? "REMOVE VIP" : "MARK AS VIP"}
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-stone">
        Customer since {new Date(customer.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })} · CUSTOMER ID #{customer.id.slice(-6).toUpperCase()}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">CUSTOMER INFORMATION</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-stone">FULL NAME</p>
                <p className="mt-1 text-charcoal">{customer.firstName} {customer.lastName}</p>
              </div>
              <div>
                <p className="text-xs text-stone">EMAIL</p>
                <p className="mt-1 text-charcoal">{customer.email}</p>
              </div>
              <div>
                <p className="text-xs text-stone">PHONE</p>
                <p className="mt-1 text-charcoal">{customer.phone ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-stone">CUSTOMER SINCE</p>
                <p className="mt-1 text-charcoal">{new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-charcoal">Order History</h2>
            </div>
            <div className="mt-4 overflow-x-auto border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-mist">
                  <tr className="text-xs tracking-wide text-stone">
                    <th className="px-4 py-3">ORDER #</th>
                    <th className="px-4 py-3">DATE</th>
                    <th className="px-4 py-3">TYPE</th>
                    <th className="px-4 py-3">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((o) => (
                    <tr key={o.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium text-charcoal">#A{o.orderNumber}</td>
                      <td className="px-4 py-3 text-stone">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 capitalize text-charcoal">{o.orderType}</td>
                      <td className="px-4 py-3 text-terracotta">€{Number(o.totalAmount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-charcoal">Reservation History</h2>
            <div className="mt-4 overflow-x-auto border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-mist">
                  <tr className="text-xs tracking-wide text-stone">
                    <th className="px-4 py-3">RES #</th>
                    <th className="px-4 py-3">DATE</th>
                    <th className="px-4 py-3">TIME</th>
                    <th className="px-4 py-3">GUESTS</th>
                    <th className="px-4 py-3">TABLE</th>
                    <th className="px-4 py-3">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.reservations.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-medium text-charcoal">#{r.id.slice(-4).toUpperCase()}</td>
                      <td className="px-4 py-3 text-stone">{new Date(r.reservationDate).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-stone">{new Date(r.reservationDate).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</td>
                      <td className="px-4 py-3 text-charcoal">{r.partySize} guests</td>
                      <td className="px-4 py-3 text-charcoal">{r.table?.number ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className="bg-mist px-2 py-1 text-xs tracking-wide text-charcoal">{r.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-mist px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">INTERNAL STAFF NOTES</p>
            {editingNotes ? (
              <div className="mt-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full border border-border bg-cream px-3 py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
                />
                <div className="mt-3 flex gap-3">
                  <button onClick={saveNotes} className="bg-olive px-5 py-2 text-xs font-medium tracking-wide text-white hover:bg-olive-dark">
                    SAVE
                  </button>
                  <button onClick={() => setEditingNotes(false)} className="text-xs font-medium tracking-wide text-charcoal">
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-3 bg-cream px-4 py-3 text-sm italic text-charcoal">
                  {notes ? `"${notes}"` : "No notes yet."}
                </p>
                {canManage && (
                  <button onClick={() => setEditingNotes(true)} className="mt-3 border border-border px-5 py-2 text-xs font-medium tracking-wide text-charcoal hover:border-charcoal">
                    + ADD NOTE
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">CUSTOMER SUMMARY</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone">Orders</span>
                <span className="text-charcoal">{customer.orderCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Reservations</span>
                <span className="text-charcoal">{customer.reservationCount}</span>
              </div>
            </div>
          </div>

          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">RECENT ACTIVITY</p>
            <div className="mt-4 space-y-3">
              {customer.recentActivity.length === 0 ? (
                <p className="text-sm text-stone">No recent activity.</p>
              ) : (
                customer.recentActivity.map((a, i) => (
                  <div key={i} className="border-l-2 border-border pl-3">
                    <p className="text-sm text-charcoal">{a.message}</p>
                    <p className="text-xs text-stone">{new Date(a.time).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}