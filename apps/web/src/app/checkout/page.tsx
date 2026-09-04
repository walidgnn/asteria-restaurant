"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { stripePromise } from "@/lib/stripe";
import { PaymentForm } from "@/components/PaymentForm";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const { customer, token, loading } = useAuth();
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  async function handleCreateOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!customer || !token) {
      router.push("/login?redirect=/checkout");
      return;
    }

    const form = new FormData(e.currentTarget);
    const notes = form.get("notes") as string;

    setSubmitting(true);
    try {
      const orderRes = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            dishId: i.dishId,
            quantity: i.quantity,
            optionIds: i.customizations.map((c) => c.optionId),
          })),
          orderType,
          notes: notes || undefined,
        }),
      });
      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => null);
        throw new Error(err?.message || "Failed to create order.");
      }
      const order = await orderRes.json();
      setOrderId(order.id);

      const intentRes = await fetch("http://localhost:3001/payments/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: order.id }),
      });
      if (!intentRes.ok) throw new Error("Failed to initialize payment.");
      const { clientSecret } = await intentRes.json();
      setClientSecret(clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  if (!customer) {
    return (
      <>
        <Header solid />
        <div className="mx-auto max-w-2xl px-8 py-24 text-center">
          <h1 className="font-serif text-3xl text-charcoal">
            Please sign in to check out.
          </h1>
          <Link
            href="/login?redirect=/checkout"
            className="mt-6 inline-block bg-olive px-8 py-3.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark"
          >
            SIGN IN →
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (items.length === 0 && !clientSecret) {
    return (
      <>
        <Header solid />
        <div className="mx-auto max-w-3xl px-8 py-24 text-center">
          <h1 className="font-serif text-3xl text-charcoal">
            Your cart is empty.
          </h1>
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

        {error && (
          <p className="mt-6 max-w-2xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
            {error}
          </p>
        )}

        {!clientSecret ? (
          <form onSubmit={handleCreateOrder} className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
            <div>
              <h2 className="font-serif text-2xl text-charcoal">
                Contact Information
              </h2>
              <p className="mt-2 text-sm text-stone">
                Ordering as {customer.firstName} {customer.lastName} ({customer.email})
              </p>

              <h2 className="mt-10 font-serif text-2xl text-charcoal">
                Order Type
              </h2>
              <div className="mt-5 flex gap-6">
                <label className="flex items-center gap-2 text-sm text-charcoal">
                  <input
                    type="radio"
                    checked={orderType === "pickup"}
                    onChange={() => setOrderType("pickup")}
                  />
                  Pickup
                </label>
                <label className="flex items-center gap-2 text-sm text-charcoal">
                  <input
                    type="radio"
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
            </div>

            <div className="h-fit bg-mist px-8 py-8">
              <h2 className="font-serif text-2xl text-charcoal">
                Order Summary
              </h2>
              <div className="mt-6 space-y-4">
                {items.map((item) => {
                  const unitPrice = item.basePrice + item.customizations.reduce((s, c) => s + c.priceModifier, 0);
                  return (
                    <div key={item.lineId} className="flex justify-between text-sm">
                      <span className="text-charcoal">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-terracotta">
                        €{(unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
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
                {submitting ? "CREATING ORDER..." : "CONTINUE TO PAYMENT →"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mx-auto mt-10 max-w-lg">
            <h2 className="font-serif text-2xl text-charcoal">Payment</h2>
            <p className="mt-2 text-sm text-stone">
              Your payment information is securely processed by Stripe.
            </p>
            <div className="mt-6">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm orderId={orderId!} />
              </Elements>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}