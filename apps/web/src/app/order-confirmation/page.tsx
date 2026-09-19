"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
  orderType: string;
  totalAmount: string;
  items: OrderItem[];
};
export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const { token, customer } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !token) {
      setLoading(false);
      return;
    }

    function fetchOrder() {
      fetch(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then(setOrder)
        .finally(() => setLoading(false));
    }

    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId, token]);

  if (loading) {
    return (
      <>
        <Header solid />
        <div className="py-24 text-center text-stone">Loading order...</div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header solid />
        <div className="mx-auto max-w-3xl px-8 py-24 text-center">
          <h1 className="font-serif text-3xl text-charcoal">
            No order found.
          </h1>
          <Link
            href="/menu"
            className="mt-6 inline-block text-sm font-medium tracking-wide text-charcoal"
          >
            ← Back to Menu
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header solid />

      <section className="mx-auto max-w-3xl px-8 py-20 text-center">
        <p className="mb-3 text-sm font-medium tracking-[0.2em] text-terracotta">
          ORDER #A{order.orderNumber}
        </p>
        <h1 className="font-serif text-5xl text-charcoal">
          Thank You for Your Order
        </h1>
        <p className="mt-4 text-stone">
          Your order has been received and is being prepared with care.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-8 pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="bg-mist px-8 py-8">
            <h2 className="mb-6 font-serif text-xl text-charcoal">
              Order Status
            </h2>
            <div className="space-y-6">
              {[
                { key: "PENDING", label: "Order Received", icon: Check },
                { key: "CONFIRMED", label: "Order Confirmed", icon: Check },
                { key: "PREPARING", label: "Being Prepared", icon: UtensilsCrossed },
                { key: "READY", label: "Ready for Pickup", icon: ShoppingBag },
                { key: "COMPLETED", label: "Completed", icon: Check },
              ]
                .filter((step, i, arr) => {
                  // Always show PENDING and CONFIRMED as the base, plus up through current status
                  const order_ = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED"];
                  const currentIndex = order_.indexOf(order.status);
                  return i <= Math.max(currentIndex, 1);
                })
                .map((step, i, arr) => {
                  const order_ = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED"];
                  const currentIndex = order_.indexOf(order.status);
                  const stepIndex = order_.indexOf(step.key);
                  const isDone = stepIndex < currentIndex;
                  const isCurrent = stepIndex === currentIndex;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.key}
                      className={`flex items-center gap-4 ${!isDone && !isCurrent ? "opacity-50" : ""}`}
                    >
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          isDone || isCurrent
                            ? "bg-olive text-white"
                            : "border border-charcoal text-charcoal"
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-charcoal">{step.label}</p>
                        {isCurrent && step.key !== "COMPLETED" && (
                          <p className="text-xs text-stone">In progress</p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 text-left">
              <div>
                <p className="text-xs tracking-wide text-stone">ORDER TYPE</p>
                <p className="mt-1 text-charcoal capitalize">
                  {order.orderType}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-wide text-stone">CUSTOMER</p>
                <p className="mt-1 text-charcoal">
                  {customer?.firstName} {customer?.lastName}
                </p>
              </div>
            </div>
          </div>

          <div className="h-fit bg-mist px-8 py-8">
            <h2 className="font-serif text-xl text-charcoal">Order Summary</h2>
            <div className="mt-5 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-charcoal">
                    {item.dish.name} × {item.quantity}
                  </span>
                  <span className="text-terracotta">
                    €{(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between border-t border-border pt-5 text-lg">
              <span className="text-charcoal">Total</span>
              <span className="text-terracotta">
                €{parseFloat(order.totalAmount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-charcoal"
          >
            ← BACK TO MENU
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}