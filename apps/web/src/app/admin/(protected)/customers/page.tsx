"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isVip: boolean;
  _count: { orders: number; reservations: number };
  lastActivity: string | null;
};

export default function AdminCustomersPage() {
  const { token } = useAdminAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) return;
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    fetch(`${API_URL}/admin/customers?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data.customers);
        setTotal(data.total);
      });
  }, [token, search, page]);

  const totalPages = Math.ceil(total / 20);

  function initials(c: Customer) {
    return `${c.firstName[0] ?? ""}${c.lastName[0] ?? ""}`.toUpperCase();
  }

  return (
    <div>
      <h1 className="font-serif text-4xl text-charcoal">Customers</h1>
      <p className="mt-2 text-stone">View and manage customer information and activity.</p>

      <div className="mt-8 border border-border p-6">
        <label className="flex items-center gap-2 text-xs font-medium tracking-wide text-terracotta">
          <span className="h-px w-6 bg-terracotta" />
          SEARCH CUSTOMERS
        </label>
        <div className="relative mt-2">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, or phone..."
            className="w-full border border-border bg-transparent py-2.5 pl-9 pr-3 text-sm text-charcoal focus:border-charcoal focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-mist">
            <tr className="text-xs tracking-wide text-stone">
              <th className="px-4 py-3">CUSTOMER</th>
              <th className="px-4 py-3">ORDERS</th>
              <th className="px-4 py-3">RESERVATIONS</th>
              <th className="px-4 py-3">LAST ACTIVITY</th>
              <th className="px-4 py-3">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mist font-serif text-sm text-charcoal">
                      {initials(c)}
                    </div>
                    <div>
                      <p className="flex items-center gap-2 font-medium text-charcoal">
                        {c.firstName} {c.lastName}
                        {c.isVip && <span className="bg-mist px-1.5 py-0.5 text-[10px] tracking-wide text-charcoal">VIP</span>}
                      </p>
                      <p className="text-xs text-stone">{c.email} · {c.phone ?? "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-charcoal">{c._count.orders}</td>
                <td className="px-4 py-4 text-charcoal">{c._count.reservations}</td>
                <td className="px-4 py-4 text-stone">
                  {c.lastActivity ? new Date(c.lastActivity).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-4">
                  <Link href={`/admin/customers/${c.id}`} className="text-xs font-medium tracking-wide text-charcoal">
                    VIEW →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-stone">
        <span>Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, total)} of {total} customers</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 disabled:opacity-40">←</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`h-8 w-8 ${p === page ? "bg-charcoal text-white" : "text-charcoal"}`}>
              {p}
            </button>
          ))}
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 disabled:opacity-40">→</button>
        </div>
      </div>
    </div>
  );
}