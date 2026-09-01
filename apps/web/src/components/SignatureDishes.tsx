import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

const DISHES = [
  {
    name: "Grilled Octopus",
    price: "$34",
    description: "Tender char-grilled octopus with smoked paprika, capers, and lemon oil.",
    image: "/images/dish-octopus.jpg",
  },
  {
    name: "Aegean Sea Bass",
    price: "$42",
    description: "Whole roasted sea bass with herbs, citrus, and olive oil from the Peloponnese.",
    image: "/images/dish-seabass.jpg",
  },
  {
    name: "Pistachio Tiramisu",
    price: "$16",
    description: "Our signature tiramisu layered with Bronte pistachios and mascarpone.",
    image: "/images/dish-tiramisu.jpg",
  },
];

export function SignatureDishes() {
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
        {DISHES.map((dish) => (
          <div key={dish.name}>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={dish.image}
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
                {dish.price}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-stone">
              {dish.description}
            </p>
            <Link
              href="/menu"
              className="mt-5 inline-flex items-center gap-2 border border-border px-5 py-2.5 text-xs font-medium tracking-wide text-charcoal transition-colors hover:border-charcoal"
            >
              <Plus size={14} strokeWidth={2} />
              ADD TO ORDER
            </Link>
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