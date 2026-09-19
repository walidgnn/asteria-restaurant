"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { API_URL } from "@/lib/config";

const NEXT_LABEL: Record<string, string> = {
  PENDING: "MARK AS CONFIRMED",
  CONFIRMED: "MARK AS PREPARING",
  PREPARING: "MARK AS READY",
  READY: "MARK AS COMPLETED",
};

type OrderDetail = {
  id: string;
  orderNumber: number;
  status: string;
  orderType: string;
  notes: string | null;
  totalAmount: string;
  createdAt: string;
  customer: { firstName: string; lastName: string; email: string; phone: string | null };
  payment: { status: string; method: string } | null;
  statusHistory: { status: string; changedAt: string; note: string | null }[];
  items: {
    id: string;
    quantity: number;
    unitPrice: string;
    dish: { name: string };
    customizations: { priceModifier: string; option: { name: string } }[];
  }[];
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, hasPermission } = useAdminAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/admin/orders/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setOrder);
  }, [token, params.id]);

  async function refresh() {
    const res = await fetch(`${API_URL}/admin/orders/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrder(await res.json());
  }

  async function handleAdvance() {
    setBusy(true);
    await fetch(`${API_URL}/admin/orders/${params.id}/advance`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    await refresh();
    setBusy(false);
  }

  async function handleCancel() {
    if (!confirm("Cancel this order?")) return;
    setBusy(true);
    await fetch(`${API_URL}/admin/orders/${params.id}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    await refresh();
    setBusy(false);
  }

  if (!order) return <p className="text-stone">Loading...</p>;

  const subtotal = order.items.reduce((s, i) => s + Number(i.unitPrice) * i.quantity, 0);
  const customizationsTotal = order.items.reduce(
    (s, i) => s + i.customizations.reduce((cs, c) => cs + Number(c.priceModifier), 0) * i.quantity,
    0
  );
  const canAdvance = order.status in NEXT_LABEL;
  const canManage = hasPermission("orders.manage");

  return (
    <div>
      <Link href="/admin/orders" className="text-sm font-medium tracking-wide text-charcoal">
        ← BACK TO ORDERS
      </Link>
      <p className="mt-4 text-xs text-stone">
        ORDERS / <span className="text-charcoal">ORDER #A{order.orderNumber}</span>
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-4xl text-charcoal">Order #A{order.orderNumber}</h1>
        {canManage && (
          <div className="flex items-center gap-3">
            {order.status !== "CANCELLED" && order.status !== "COMPLETED" && (
              <button
                onClick={handleCancel}
                disabled={busy}
                className="border border-terracotta px-6 py-3 text-sm font-medium tracking-wide text-terracotta transition-colors hover:bg-terracotta hover:text-white disabled:opacity-60"
              >
                CANCEL ORDER
              </button>
            )}
            {canAdvance && (
              <button
                onClick={handleAdvance}
                disabled={busy}
                className="bg-olive px-6 py-3 text-sm font-medium tracking-wide text-white hover:bg-olive-dark disabled:opacity-60"
              >
                {NEXT_LABEL[order.status]} →
              </button>
            )}
          </div>
        )}
      </div>

      <p className="mt-2 text-sm text-stone">
        {new Date(order.createdAt).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}{" "}
        · {new Date(order.createdAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
      </p>

      <div className="mt-3 flex gap-2">
        <span className="bg-mist px-3 py-1 text-xs font-medium tracking-wide text-charcoal">{order.status}</span>
        <span className="bg-mist px-3 py-1 text-xs font-medium capitalize tracking-wide text-charcoal">{order.orderType}</span>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">ORDER ITEMS</p>
            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between border-b border-border pb-4 last:border-0">
                  <div>
                    <p className="text-charcoal">
                      <span className="text-stone">{item.quantity} ×</span> {item.dish.name}
                    </p>
                    {item.customizations.map((c, i) => (
                      <p key={i} className="mt-0.5 text-xs text-stone">
                        {c.option.name} {Number(c.priceModifier) > 0 && `(+€${Number(c.priceModifier).toFixed(2)})`}
                      </p>
                    ))}
                  </div>
                  <p className="text-terracotta">€{Number(item.unitPrice).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {order.notes && (
            <div className="border border-terracotta/30 bg-terracotta/5 px-6 py-5">
              <p className="text-xs font-medium tracking-wide text-terracotta">SPECIAL REQUEST</p>
              <p className="mt-2 text-sm italic text-charcoal">&quot;{order.notes}&quot;</p>
            </div>
          )}

          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">TIMELINE</p>
            <div className="mt-4 space-y-4">
              {order.statusHistory.map((h, i) => (
                <div key={i} className="flex gap-3 border-l-2 border-charcoal pl-4">
                  <div>
                    <p className="text-sm text-charcoal">
                      {new Date(h.changedAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                    </p>
                    <p className="text-sm text-stone">{h.note ?? h.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">ORDER TOTAL</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-charcoal">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-charcoal">
                <span>Customizations</span>
                <span>€{customizationsTotal.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg">
              <span className="text-charcoal">Total</span>
              <span className="text-terracotta">€{Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">CUSTOMER</p>
            <p className="mt-3 text-charcoal">{order.customer.firstName} {order.customer.lastName}</p>
            <p className="mt-1 text-sm text-stone">{order.customer.email}</p>
            {order.customer.phone && <p className="text-sm text-stone">{order.customer.phone}</p>}
          </div>

          <div className="border border-border px-6 py-6">
            <p className="text-xs font-medium tracking-wide text-terracotta">PAYMENT</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-charcoal">STATUS</span>
              <span className="text-sm text-charcoal">{order.payment?.status ?? "Pending"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}