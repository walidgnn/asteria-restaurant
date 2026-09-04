"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { MenuCategory } from "@/lib/api";

const TAGLINES: Record<string, string> = {
  "Small Plates": "TO START",
  Starters: "BEGINNINGS",
  "From the Sea": "THE CATCH OF THE DAY",
  "From the Grill": "OVER OPEN FLAME",
  "Pasta & Grains": "THE ART OF PASTA",
  "From the Garden": "FRESH & GREEN",
  Sides: "ACCOMPANIMENTS",
  Desserts: "SWEET ENDINGS",
  "Coffee & Tea": "TO FINISH",
};

export function MenuBrowser({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState("All");
  const { addItem } = useCart();

  const visibleCategories =
    active === "All"
      ? categories
      : categories.filter((c) => c.name === active);

  return (
    <section className="mx-auto max-w-7xl px-8 py-16">
      {/* Filter bar */}
      <div className="flex items-center justify-between gap-6 overflow-x-auto border-b border-border pb-5">
        <div className="flex gap-8 whitespace-nowrap">
          <button
            onClick={() => setActive("All")}
            className={`text-sm font-medium tracking-wide ${
              active === "All"
                ? "border-b-2 border-terracotta text-charcoal"
                : "text-stone hover:text-charcoal"
            }`}
          >
            ALL
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.name)}
              className={`text-sm font-medium tracking-wide ${
                active === cat.name
                  ? "border-b-2 border-terracotta text-charcoal"
                  : "text-stone hover:text-charcoal"
              }`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>
        <Search size={18} className="shrink-0 text-charcoal" />
      </div>

      {/* Category sections */}
      {visibleCategories.map((cat, i) => (
        <div key={cat.id}>
          <div className="mb-10 mt-16 text-center">
            <p className="mb-3 flex items-center justify-center gap-3 text-sm font-medium tracking-[0.2em] text-terracotta">
              <span className="h-px w-6 bg-terracotta" />
              {TAGLINES[cat.name] ?? "ASTERIA"}
              <span className="h-px w-6 bg-terracotta" />
            </p>
            <h2 className="font-serif text-4xl text-olive-dark md:text-5xl">
              {cat.name}
            </h2>
          </div>

          <div className="grid gap-x-12 md:grid-cols-2">
            {cat.dishes.map((dish) => (
              <div
                key={dish.id}
                className="border-b border-border py-6 first:pt-0"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <Link href={`/menu/${dish.id}`}>
                    <h3 className="font-serif text-2xl text-charcoal hover:text-terracotta">
                      {dish.name}
                    </h3>
                  </Link>
                  <span className="whitespace-nowrap text-terracotta">
                    €{dish.price}
                  </span>
                </div>
                {dish.description && (
                  <p className="mt-1 max-w-md text-sm leading-relaxed text-stone">
                    {dish.description}
                  </p>
                )}
                <button
                  onClick={() =>
                    addItem({
                      dishId: dish.id,
                      name: dish.name,
                      basePrice: parseFloat(dish.price),
                    })
                  }
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-charcoal transition-colors hover:text-terracotta"
                >
                  <Plus size={12} strokeWidth={2} />
                  ADD
                </button>
              </div>
            ))}
          </div>

          {/* Chef photo break after the 2nd section, matching the reference */}
          {active === "All" && i === 1 && (
            <div className="relative my-20 aspect-[16/9] w-full">
              <Image
                src="/images/chef-plating.jpg"
                alt="Chef plating a dish in the Asteria kitchen"
                fill
                className="object-cover object-top"
              />
            </div>
          )}
        </div>
      ))}
    </section>
  );
}