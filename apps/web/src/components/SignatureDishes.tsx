"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { Dish } from "@/lib/api";

const IMAGE_MAP: Record<string, string> = {
  "Grilled Octopus": "/images/dish-octopus.jpg",
  "Mediterranean Sea Bass": "/images/dish-seabass.jpg",
  "Baklava Cheesecake": "/images/dish-tiramisu.jpg",
};

export function SignatureDishes({ dishes }: { dishes: Dish[] }) {
  const { addItem } = useCart();

  return (
    <section className="mx-auto max-w-7xl px-8 py-28">
      <div className="mb-16 text-center">
        <p className="mb-4 flex items-center justify-center gap-3 text-sm font-medium tracking-[0.2em] text-terracotta">
          <span className="h-px w-6 bg-terracotta" />
          OUR SIGNATURES
        </p>
        <h2 className="font-serif text-4xl text-charcoal md:text-5xl">
          Dishes crafted with care, meant to be shared
        </h2>
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        {dishes.map((dish) => (
          <div key={dish.id}>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={IMAGE_MAP[dish.name] ?? "/images/dish-octopus.jpg"}
                alt={dish.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-5 flex items-start justify-between gap-4">
              <h3 className="font-serif text-2xl text-charcoal">
                {dish.name}
              </h3>
              <span className="whitespace-nowrap text-lg text-terracotta">
                €{dish.price}
              </span>
            </div>
            {dish.description && (
              <p className="mt-2 text-sm leading-relaxed text-stone">
                {dish.description}
              </p>
            )}
            <button
              onClick={() =>
                addItem({
                  id: dish.id,
                  name: dish.name,
                  price: parseFloat(dish.price),
                })
              }
              className="mt-5 inline-flex items-center gap-2 border border-border px-5 py-2.5 text-xs font-medium tracking-wide text-charcoal transition-colors hover:border-charcoal"
            >
              <Plus size={14} strokeWidth={2} />
              ADD TO ORDER
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-charcoal"
        >
          VIEW FULL MENU
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}