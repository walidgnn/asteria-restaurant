"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { customer, token, loading } = useAuth();
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      const res = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((i) => ({ dishId: i.id, quantity: i.quantity })),
          orderType,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to place order.");
      }

      const order = await res.json();
      clearCart();
      router.push(`/order-confirmation?order=${order.id}`);
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
          <p className="mt-3 text-stone">
            You&apos;ll need an account to place an order.
          </p>
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

        {error && (
          <p className="mt-6 max-w-2xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
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
                  <span className="text-charcoal">
                    {item.name} × {item.quantity}
                  </span>
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