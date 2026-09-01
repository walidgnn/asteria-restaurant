"use client";

import { useState } from "react";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "A beautiful evening from beginning to end. The sea bass was extraordinary, and the atmosphere made us feel like we were dining on the Amalfi Coast.",
    author: "Sofia M.",
  },
  {
    quote:
      "Every dish felt intentional. The octopus alone is worth the visit — smoky, tender, perfectly balanced.",
    author: "James R.",
  },
];

export function Testimonial() {
  const [index, setIndex] = useState(0);
  const testimonial = TESTIMONIALS[index];

  const goPrev = () =>
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const goNext = () => setIndex((i) => (i + 1) % TESTIMONIALS.length);

  return (
    <section className="mx-auto max-w-3xl px-8 py-28 text-center">
      <p className="mb-4 flex items-center justify-center gap-3 text-sm font-medium tracking-[0.2em] text-terracotta">
        <span className="h-px w-6 bg-terracotta" />
        OUR GUESTS
      </p>
      <div className="mb-6 flex justify-center gap-1 text-terracotta">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
        ))}
      </div>
      <p className="flex min-h-[140px] items-center justify-center font-serif text-2xl leading-snug text-charcoal md:min-h-[160px] md:text-3xl">
        &quot;{testimonial.quote}&quot;
      </p>

      <div className="mt-10 flex items-center justify-between">
        <span className="text-sm text-stone">— {testimonial.author}</span>
        <div className="flex gap-2">
          <button
            onClick={goPrev}
            aria-label="Previous testimonial"
            className="border border-border p-2.5 text-charcoal transition-colors hover:border-charcoal"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={goNext}
            aria-label="Next testimonial"
            className="border border-border p-2.5 text-charcoal transition-colors hover:border-charcoal"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}