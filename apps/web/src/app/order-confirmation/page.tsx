"use client";

import Link from "next/link";
import { Check, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart-context";

export default function OrderConfirmationPage() {
  const { lastOrder } = useCart();

  if (!lastOrder) {
    return (
      <>
        <Header solid />
        <div className="mx-auto max-w-3xl px-8 py-24 text-center">
          <h1 className="font-serif text-3xl text-charcoal">
            No recent order found.
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
          ORDER #{lastOrder.orderId}
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
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-olive text-white">
                  <Check size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    Order Received
                  </p>
                  <p className="text-xs text-stone">Confirmed</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal text-charcoal">
                  <UtensilsCrossed size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    Being Prepared
                  </p>
                  <p className="text-xs text-stone">In progress</p>
                </div>
              </div>
              <div className="flex items-center gap-4 opacity-40">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-stone text-stone">
                  <ShoppingBag size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    Ready for Pickup
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6 text-left">
              <div>
                <p className="text-xs tracking-wide text-stone">ORDER TYPE</p>
                <p className="mt-1 text-charcoal capitalize">
                  {lastOrder.orderType}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-wide text-stone">CUSTOMER</p>
                <p className="mt-1 text-charcoal">{lastOrder.customerName}</p>
              </div>
            </div>
          </div>

          <div className="h-fit bg-mist px-8 py-8">
            <h2 className="font-serif text-xl text-charcoal">Order Summary</h2>
            <div className="mt-5 space-y-4">
              {lastOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-charcoal">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-terracotta">
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between border-t border-border pt-5 text-lg">
              <span className="text-charcoal">Total</span>
              <span className="text-terracotta">
                €{lastOrder.subtotal.toFixed(2)}
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