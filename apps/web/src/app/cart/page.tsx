"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <>
      <Header solid />

      <section className="mx-auto max-w-7xl px-8 py-16">
        <h1 className="font-serif text-5xl text-charcoal">Your Order</h1>
        <p className="mt-3 text-stone">Review your selection before continuing.</p>

        {items.length === 0 ? (
          <div className="mt-16 border-t border-border py-16 text-center">
            <p className="text-stone">Your cart is empty.</p>
            <Link
              href="/menu"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-charcoal"
            >
              ← BACK TO MENU
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]">
            <div className="border-t border-border">
              {items.map((item) => {
                const modifiersTotal = item.customizations.reduce((s, c) => s + c.priceModifier, 0);
                const unitPrice = item.basePrice + modifiersTotal;
                return (
                    <div
                    key={item.lineId}
                    className="flex items-start justify-between gap-6 border-b border-border py-8"
                    >
                    <div className="flex-1">
                        <h3 className="font-serif text-2xl text-charcoal">
                        {item.name}
                        </h3>
                        {item.customizations.length > 0 && (
                        <ul className="mt-1 space-y-0.5">
                            {item.customizations.map((c) => (
                            <li key={c.optionId} className="text-xs text-stone">
                                + {c.name} {c.priceModifier > 0 ? `(+€${c.priceModifier.toFixed(2)})` : ""}
                            </li>
                            ))}
                        </ul>
                        )}
                        <p className="mt-1 text-sm text-terracotta">
                        €{unitPrice.toFixed(2)}
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                        <button
                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-8 w-8 items-center justify-center border border-border text-charcoal hover:border-charcoal"
                        >
                            <Minus size={13} />
                        </button>
                        <span className="w-5 text-center text-sm text-charcoal">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="flex h-8 w-8 items-center justify-center border border-border text-charcoal hover:border-charcoal"
                        >
                            <Plus size={13} />
                        </button>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <button
                        onClick={() => removeItem(item.lineId)}
                        className="flex items-center gap-1.5 text-xs text-stone hover:text-terracotta"
                        >
                        <Trash2 size={13} />
                        REMOVE
                        </button>
                        <div className="text-right">
                        <p className="text-xs text-stone">Item Total</p>
                        <p className="text-charcoal">
                            €{(unitPrice * item.quantity).toFixed(2)}
                        </p>
                        </div>
                    </div>
                    </div>
                );
                })}
            </div>

            <div className="h-fit bg-mist px-8 py-8">
              <h2 className="font-serif text-2xl text-charcoal">Summary</h2>
              <div className="mt-6 flex justify-between text-sm text-charcoal">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <p className="mt-2 text-xs italic text-stone">
                Taxes &amp; fees calculated at checkout.
              </p>

              <div className="mt-6 flex justify-between border-t border-border pt-6 text-lg">
                <span className="text-charcoal">Total</span>
                <span className="text-terracotta">€{subtotal.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block bg-olive px-6 py-3.5 text-center text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark"
              >
                PROCEED TO CHECKOUT →
              </Link>
              <Link
                href="/menu"
                className="mt-4 block text-center text-sm font-medium tracking-wide text-charcoal"
              >
                ← CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}