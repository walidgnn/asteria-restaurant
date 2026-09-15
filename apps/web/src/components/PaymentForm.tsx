"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

export function PaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { token } = useAuth();
  const { clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      await fetch("http://localhost:3001payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });
      clearCart();
      router.push(`/order-confirmation?order=${orderId}`);
    } else {
      setError("Payment did not complete. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <p className="mt-4 text-sm text-terracotta">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="mt-6 w-full bg-olive px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark disabled:opacity-60"
      >
        {submitting ? "PROCESSING..." : "PLACE ORDER →"}
      </button>
    </form>
  );
}