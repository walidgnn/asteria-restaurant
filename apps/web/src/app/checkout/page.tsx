"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, placeOrder } = useCart();
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;
    const email = form.get("email") as string;

    setSubmitting(true);
    setTimeout(() => {
      const orderId = placeOrder({
        customerName: `${firstName} ${lastName}`.trim(),
        email,
        orderType,
      });
      router.push(`/order-confirmation?order=${orderId}`);
    }, 600);
  }

  if (items.length === 0) {
    return (
      <>
        <Header solid />
        <div className="mx-auto max-w-3xl px-8 py-24 text-center">
          <h1 className="font-serif text-3xl text-charcoal">
            Your cart is empty.
          </h1>
          <p className="mt-3 text-stone">Add something delicious first.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header solid />

      <section className="mx-auto max-w-7xl px-8 py-16">
        <h1 className="font-serif text-5xl text-charcoal">Checkout</h1>
        <p className="mt-3 text-stone">Complete your order.</p>

        <form onSubmit={handleSubmit} className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">
              Contact Information
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <input
                name="firstName"
                required
                placeholder="First Name"
                className="border border-border bg-transparent px-4 py-3 text-sm text-charcoal placeholder:text-stone/70 focus:border-charcoal focus:outline-none"
              />
              <input
                name="lastName"
                required
                placeholder="Last Name"
                className="border border-border bg-transparent px-4 py-3 text-sm text-charcoal placeholder:text-stone/70 focus:border-charcoal focus:outline-none"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                className="border border-border bg-transparent px-4 py-3 text-sm text-charcoal placeholder:text-stone/70 focus:border-charcoal focus:outline-none sm:col-span-2"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="border border-border bg-transparent px-4 py-3 text-sm text-charcoal placeholder:text-stone/70 focus:border-charcoal focus:outline-none sm:col-span-2"
              />
            </div>

            <h2 className="mt-10 font-serif text-2xl text-charcoal">
              Order Type
            </h2>
            <div className="mt-5 flex gap-6">
              <label className="flex items-center gap-2 text-sm text-charcoal">
                <input
                  type="radio"
                  name="orderType"
                  checked={orderType === "pickup"}
                  onChange={() => setOrderType("pickup")}
                />
                Pickup
              </label>
              <label className="flex items-center gap-2 text-sm text-charcoal">
                <input
                  type="radio"
                  name="orderType"
                  checked={orderType === "delivery"}
                  onChange={() => setOrderType("delivery")}
                />
                Delivery
              </label>
            </div>

            <h2 className="mt-10 font-serif text-2xl text-charcoal">
              Order Notes
            </h2>
            <textarea
              name="notes"
              rows={3}
              placeholder="Special instructions, allergies, etc."
              className="mt-5 w-full border border-border bg-transparent px-4 py-3 text-sm text-charcoal placeholder:text-stone/70 focus:border-charcoal focus:outline-none"
            />

            <h2 className="mt-10 font-serif text-2xl text-charcoal">
              Payment
            </h2>
            <p className="mt-2 text-sm italic text-stone">
              Your payment information is securely processed.
            </p>
            <div className="mt-5 grid gap-5">
              <input
                placeholder="Cardholder Name"
                className="border border-border bg-transparent px-4 py-3 text-sm text-charcoal placeholder:text-stone/70 focus:border-charcoal focus:outline-none"
              />
              <input
                placeholder="Card Number"
                className="border border-border bg-transparent px-4 py-3 text-sm text-charcoal placeholder:text-stone/70 focus:border-charcoal focus:outline-none"
              />
              <div className="grid grid-cols-2 gap-5">
                <input
                  placeholder="MM / YY"
                  className="border border-border bg-transparent px-4 py-3 text-sm text-charcoal placeholder:text-stone/70 focus:border-charcoal focus:outline-none"
                />
                <input
                  placeholder="CVC"
                  className="border border-border bg-transparent px-4 py-3 text-sm text-charcoal placeholder:text-stone/70 focus:border-charcoal focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="h-fit bg-mist px-8 py-8">
            <h2 className="font-serif text-2xl text-charcoal">
              Order Summary
            </h2>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-charcoal">{item.name}</span>
                  <span className="text-terracotta">
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between border-t border-border pt-6 text-lg">
              <span className="text-charcoal">Total</span>
              <span className="text-terracotta">€{subtotal.toFixed(2)}</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-olive px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark disabled:opacity-60"
            >
              {submitting ? "PLACING ORDER..." : "PLACE ORDER →"}
            </button>
          </div>
        </form>
      </section>

      <Footer />
    </>
  );
}