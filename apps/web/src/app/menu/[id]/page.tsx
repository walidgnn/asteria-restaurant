"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart, SelectedCustomization } from "@/lib/cart-context";

const IMAGE_MAP: Record<string, string> = {
  "Grilled Octopus": "/images/dish-octopus.jpg",
  "Mediterranean Sea Bass": "/images/dish-seabass.jpg",
  "Baklava Cheesecake": "/images/dish-tiramisu.jpg",
};
const DEFAULT_IMAGE = "/images/dish-octopus.jpg";

type Option = { id: string; name: string; priceModifier: string };
type Group = {
  id: string;
  name: string;
  isRequired: boolean;
  allowMultiple: boolean;
  options: Option[];
};
type DishDetail = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  customizationGroups: { group: Group }[];
};

export default function DishDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [dish, setDish] = useState<DishDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://192.168.100.10:3001/menu/${params.id}`)
      .then((res) => res.json())
      .then(setDish);
  }, [params.id]);

  if (!dish) {
    return (
      <>
        <Header solid />
        <div className="py-24 text-center text-stone">Loading...</div>
        <Footer />
      </>
    );
  }

  const groups = dish.customizationGroups.map((g) => g.group);

  function toggleOption(group: Group, optionId: string) {
    setSelections((prev) => {
      const current = prev[group.id] ?? [];
      if (group.allowMultiple) {
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [group.id]: next };
      }
      return { ...prev, [group.id]: [optionId] };
    });
  }

  function getSelectedOptions(): SelectedCustomization[] {
    const result: SelectedCustomization[] = [];
    for (const group of groups) {
      const selectedIds = selections[group.id] ?? [];
      for (const option of group.options) {
        if (selectedIds.includes(option.id)) {
          result.push({
            optionId: option.id,
            name: option.name,
            priceModifier: parseFloat(option.priceModifier),
          });
        }
      }
    }
    return result;
  }

  function handleAddToOrder() {
    for (const group of groups) {
      if (group.isRequired && (selections[group.id] ?? []).length === 0) {
        setError(`Please select an option for "${group.name}".`);
        return;
      }
    }
    setError(null);
    const customizations = getSelectedOptions();
    addItem({
      dishId: dish!.id,
      name: dish!.name,
      basePrice: parseFloat(dish!.price),
      customizations,
      quantity,
    });
    router.push("/menu");
  }

  const basePrice = parseFloat(dish.price);
  const modifiersTotal = getSelectedOptions().reduce((s, c) => s + c.priceModifier, 0);
  const unitPrice = basePrice + modifiersTotal;

  return (
    <>
      <Header solid />

      <section className="mx-auto max-w-6xl px-8 py-16">
        <Link href="/menu" className="text-sm font-medium tracking-wide text-charcoal">
          ← BACK TO MENU
        </Link>

        <div className="mt-8 grid gap-16 lg:grid-cols-2">
          <div className="relative aspect-square w-full">
            <Image
              src={IMAGE_MAP[dish.name] ?? DEFAULT_IMAGE}
              alt={dish.name}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h1 className="font-serif text-4xl text-charcoal md:text-5xl">
              {dish.name}
            </h1>
            <p className="mt-3 text-xl text-terracotta">€{basePrice.toFixed(2)}</p>
            {dish.description && (
              <p className="mt-5 text-base leading-relaxed text-stone">
                {dish.description}
              </p>
            )}

            {groups.map((group) => (
              <div key={group.id} className="mt-8 border-t border-border pt-6">
                <p className="text-sm font-medium tracking-wide text-charcoal">
                  {group.name.toUpperCase()}
                  {group.isRequired && (
                    <span className="ml-2 text-xs font-normal text-terracotta">Required</span>
                  )}
                </p>
                <div className="mt-4 space-y-3">
                  {group.options.map((option) => {
                    const isSelected = (selections[group.id] ?? []).includes(option.id);
                    const modifier = parseFloat(option.priceModifier);
                    return (
                      <label
                        key={option.id}
                        className="flex cursor-pointer items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-3 text-charcoal">
                          <input
                            type={group.allowMultiple ? "checkbox" : "radio"}
                            name={group.id}
                            checked={isSelected}
                            onChange={() => toggleOption(group, option.id)}
                          />
                          {option.name}
                        </span>
                        {modifier > 0 && (
                          <span className="text-stone">+€{modifier.toFixed(2)}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            {error && <p className="mt-6 text-sm text-terracotta">{error}</p>}

            <div className="mt-8 flex items-center gap-4 border-t border-border pt-8">
              <div className="flex items-center gap-3 border border-border px-3 py-2">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Minus size={14} className="text-charcoal" />
                </button>
                <span className="w-4 text-center text-sm text-charcoal">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
                  <Plus size={14} className="text-charcoal" />
                </button>
              </div>

              <button
                onClick={handleAddToOrder}
                className="flex-1 bg-olive px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark"
              >
                ADD TO ORDER — €{(unitPrice * quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}