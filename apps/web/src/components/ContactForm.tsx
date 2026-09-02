"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // No backend endpoint yet — simulate submission for now.
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-2xl px-8 py-20 text-center">
        <h2 className="font-serif text-3xl text-charcoal">Message sent.</h2>
        <p className="mt-3 text-stone">
          Thank you for reaching out — we&apos;ll get back to you shortly.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-8 py-20 text-center">
      <h2 className="font-serif text-3xl text-charcoal md:text-4xl">Get in Touch</h2>
      <p className="mt-3 text-stone">
        For private dining inquiries, press, or general questions.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 text-left">
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
          <input
            required
            type="text"
            placeholder="Name"
            className="border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/70 focus:border-charcoal focus:outline-none"
          />
          <input
            required
            type="email"
            placeholder="Email"
            className="border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/70 focus:border-charcoal focus:outline-none"
          />
          <input
            type="tel"
            placeholder="Phone (Optional)"
            className="border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/70 focus:border-charcoal focus:outline-none"
          />
          <select
            required
            defaultValue=""
            className="border-b border-border bg-transparent py-2 text-sm text-stone focus:border-charcoal focus:outline-none"
          >
            <option value="" disabled>
              Subject
            </option>
            <option value="reservation">Reservation Inquiry</option>
            <option value="private-dining">Private Dining</option>
            <option value="press">Press</option>
            <option value="general">General Question</option>
          </select>
        </div>

        <textarea
          required
          placeholder="Message"
          rows={4}
          className="mt-6 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/70 focus:border-charcoal focus:outline-none"
        />

        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-olive px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark disabled:opacity-60"
          >
            {loading ? "SENDING..." : "SEND MESSAGE"}
            {!loading && <span aria-hidden>→</span>}
          </button>
        </div>
      </form>
    </section>
  );
}