"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: string;
  dish: { name: string };
};

type Order = {
  id: string;
  orderNumber: number;
  status: string;
  totalAmount: string;
  createdAt: string;
  items: OrderItem[];
};

export default function AccountOverviewPage() {
  const { customer, token } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3001/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setOrders);
  }, [token]);

  const activeOrder = orders?.find((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED");
  const recentOrders = orders?.slice(0, 3) ?? [];

  return (
    <div>
      <h1 className="font-serif text-5xl leading-tight text-charcoal">
        Welcome Back{customer ? `, ${customer.firstName}` : ""}.
      </h1>
      <p className="mt-3 text-stone">
        Everything you need for your next visit to Asteria.
      </p>

      <div className="mt-10 border-t border-border pt-8">
        <p className="text-xs font-medium tracking-[0.15em] text-terracotta">
          YOUR ACTIVE ORDER
        </p>

        {!orders ? (
          <p className="mt-4 text-stone">Loading...</p>
        ) : activeOrder ? (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="font-serif text-2xl text-charcoal">
                #A{activeOrder.orderNumber}
              </p>
              <p className="text-sm font-medium capitalize text-charcoal">
                {activeOrder.status.toLowerCase()}
              </p>
            </div>
            <div className="mt-3 space-y-1">
              {activeOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-stone">
                  <span>{item.dish.name}</span>
                  <span>€{(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <Link
              href={`/order-confirmation?order=${activeOrder.id}`}
              className="mt-4 inline-block text-sm font-medium tracking-wide text-charcoal"
            >
              TRACK ORDER →
            </Link>
          </div>
        ) : (
          <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-stone">You have no active orders right now.</p>
            <Link href="/menu" className="text-sm font-medium tracking-wide text-charcoal">
              EXPLORE THE MENU →
            </Link>
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <p className="text-xs font-medium tracking-[0.15em] text-terracotta">
          UPCOMING RESERVATION
        </p>
        <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-stone">You have no upcoming reservations.</p>
          <Link href="/reservations" className="text-sm font-medium tracking-wide text-charcoal">
            RESERVE A TABLE →
          </Link>
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-8">
        <p className="text-xs font-medium tracking-[0.15em] text-terracotta">
          RECENT ACTIVITY
        </p>
        {recentOrders.length === 0 ? (
          <p className="mt-4 text-stone">
            Your order and reservation history will appear here once you
            place your first order.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/order-confirmation?order=${order.id}`}
                className="flex items-center justify-between border-b border-border py-3 text-sm hover:text-terracotta"
              >
                <span className="text-charcoal">
                  #A{order.orderNumber} · {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="text-terracotta">€{parseFloat(order.totalAmount).toFixed(2)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}