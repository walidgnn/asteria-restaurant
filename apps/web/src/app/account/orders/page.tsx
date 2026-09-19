"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { API_URL } from "@/lib/config";

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

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setOrders);
  }, [token]);

  return (
    <div>
      <h1 className="font-serif text-4xl text-charcoal">Your Orders</h1>

      {!orders ? (
        <p className="mt-6 text-stone">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 text-stone">
          You haven&apos;t placed any orders yet.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order-confirmation?order=${order.id}`}
              className="block border border-border px-6 py-5 transition-colors hover:border-charcoal"
            >
              <div className="flex items-center justify-between">
                <p className="font-serif text-xl text-charcoal">
                  Order #A{order.orderNumber}
                </p>
                <p className="text-terracotta">
                  €{parseFloat(order.totalAmount).toFixed(2)}
                </p>
              </div>
              <p className="mt-1 text-sm capitalize text-stone">
                {new Date(order.createdAt).toLocaleDateString()} · {order.status.toLowerCase()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}