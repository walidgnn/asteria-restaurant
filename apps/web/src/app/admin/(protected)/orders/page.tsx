"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

type Order = {
  id: string;
  orderNumber: number;
  status: string;
  orderType: string;
  totalAmount: string;
  createdAt: string;
  customer: { firstName: string; lastName: string };
  items: { id: string }[];
  payment: { status: string } | null;
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-mist text-charcoal",
  CONFIRMED: "bg-mist text-charcoal",
  PREPARING: "bg-mist text-charcoal",
  READY: "bg-[#E8ECE3] text-charcoal",
  COMPLETED: "bg-[#E8ECE3] text-charcoal",
  CANCELLED: "bg-terracotta/10 text-terracotta",
};

export default function AdminOrdersPage() {
  const { token, hasPermission } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    if (!token) return;
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (typeFilter) params.set("orderType", typeFilter);
    if (search) params.set("search", search);
    params.set("page", String(page));

    fetch(`${API_URL}/admin/orders?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
        setTotal(data.total);
      });
  }, [token, statusFilter, typeFilter, search, page]);

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl text-charcoal">Orders</h1>
          <p className="mt-2 text-stone">
            Manage and monitor restaurant orders. View statuses, types, and customer details.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 border border-border p-6 sm:grid-cols-3">
        <div>
          <label className="text-xs font-medium tracking-wide text-stone">SEARCH ORDERS</label>
          <div className="relative mt-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Customer name..."
              className="w-full border border-border bg-transparent py-2 pl-9 pr-3 text-sm text-charcoal focus:border-charcoal focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium tracking-wide text-stone">STATUS</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="mt-2 w-full border border-border bg-transparent py-2 px-3 text-sm text-charcoal focus:border-charcoal focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium tracking-wide text-stone">ORDER TYPE</label>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="mt-2 w-full border border-border bg-transparent py-2 px-3 text-sm text-charcoal focus:border-charcoal focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-mist">
            <tr className="text-xs tracking-wide text-stone">
              <th className="px-4 py-3">ORDER #</th>
              <th className="px-4 py-3">CUSTOMER</th>
              <th className="px-4 py-3">TYPE</th>
              <th className="px-4 py-3">ITEMS</th>
              <th className="px-4 py-3">TOTAL</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">PAYMENT</th>
              <th className="px-4 py-3">TIME</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="px-4 py-4 font-medium text-charcoal">#A{o.orderNumber}</td>
                <td className="px-4 py-4 text-charcoal">
                  {o.customer.firstName} {o.customer.lastName}
                </td>
                <td className="px-4 py-4 capitalize text-charcoal">{o.orderType}</td>
                <td className="px-4 py-4 text-stone">{o.items.length} items</td>
                <td className="px-4 py-4 text-terracotta">€{Number(o.totalAmount).toFixed(2)}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs font-medium tracking-wide ${STATUS_COLORS[o.status] ?? "bg-mist text-charcoal"}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-stone">{o.payment?.status ?? "Pending"}</td>
                <td className="px-4 py-4 text-stone">
                  {new Date(o.createdAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                </td>
                <td className="px-4 py-4">
                  <Link href={`/admin/orders/${o.id}`} className="text-xs font-medium tracking-wide text-charcoal">
                    VIEW →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-stone">
        <span>Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, total)} of {total} orders</span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 disabled:opacity-40"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 ${p === page ? "bg-charcoal text-white" : "text-charcoal"}`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}