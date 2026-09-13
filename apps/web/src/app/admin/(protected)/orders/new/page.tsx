"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

type Dish = { id: string; name: string; price: string };
type Category = { id: string; name: string; dishes: Dish[] };
type CartLine = { dishId: string; name: string; price: number; quantity: number };

export default function NewOrderPage() {
  const router = useRouter();
  const { token } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://192.168.100.10:3001/menu")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

    function addDish(dish: Dish) {
    setCart((prev) => {
      const existing = prev.find((l) => l.dishId === dish.id);
      if (existing) {
        return prev.map((l) => (l.dishId === dish.id ? { ...l, quantity: l.quantity + 1 } : l));
      }
      return [...prev, { dishId: dish.id, name: dish.name, price: parseFloat(dish.price), quantity: 1 }];
    });
    setToast(`Added ${dish.name}`);
    setTimeout(() => setToast(null), 1500);
  }

  function updateQty(dishId: string, quantity: number) {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((l) => l.dishId !== dishId));
      return;
    }
    setCart((prev) => prev.map((l) => (l.dishId === dishId ? { ...l, quantity } : l)));
  }

  const total = cart.reduce((sum, l) => sum + l.price * l.quantity, 0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (cart.length === 0) {
      setError("Add at least one item to the order.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;
    const email = form.get("email") as string;
    const phone = form.get("phone") as string;
    const notes = form.get("notes") as string;

    setSubmitting(true);
    try {
      const res = await fetch("http://192.168.100.10:3001/admin/orders/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          firstName, lastName, email, phone,
          items: cart.map((l) => ({ dishId: l.dishId, quantity: l.quantity })),
          orderType,
          notes: notes || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || "Failed to create order.");
      }
      const order = await res.json();
      router.push(`/admin/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Link href="/admin/orders" className="text-sm font-medium tracking-wide text-charcoal">
        ← BACK TO ORDERS
      </Link>
      <h1 className="mt-4 font-serif text-4xl text-charcoal">New Order</h1>
      <p className="mt-2 text-stone">Create an order on behalf of a guest (e.g. phone order).</p>

      {error && (
        <p className="mt-6 max-w-2xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="font-serif text-2xl text-charcoal">Customer</h2>
          <div className="mt-4 grid grid-cols-2 gap-5">
            <input name="firstName" required placeholder="First Name" className="border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
            <input name="lastName" required placeholder="Last Name" className="border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
            <input name="email" type="email" required placeholder="Email" className="col-span-2 border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
            <input name="phone" placeholder="Phone" className="col-span-2 border-b border-border bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none" />
          </div>

          <h2 className="mt-8 font-serif text-2xl text-charcoal">Order Type</h2>
          <div className="mt-4 flex gap-6">
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="radio" checked={orderType === "pickup"} onChange={() => setOrderType("pickup")} />
              Pickup
            </label>
            <label className="flex items-center gap-2 text-sm text-charcoal">
              <input type="radio" checked={orderType === "delivery"} onChange={() => setOrderType("delivery")} />
              Delivery
            </label>
          </div>

          <h2 className="mt-8 font-serif text-2xl text-charcoal">Notes</h2>
          <textarea name="notes" rows={2} placeholder="Special instructions..." className="mt-4 w-full border border-border bg-transparent px-4 py-3 text-sm text-charcoal focus:border-charcoal focus:outline-none" />

          <h2 className="mt-8 font-serif text-2xl text-charcoal">Add Items</h2>
          <div className="mt-4 max-h-96 space-y-6 overflow-y-auto border border-border p-4">
            {categories.map((cat) => (
              <div key={cat.id}>
                <p className="text-xs font-medium tracking-wide text-terracotta">{cat.name.toUpperCase()}</p>
                <div className="mt-2 space-y-1">
                  {cat.dishes.map((dish) => {
                    const inCart = cart.find((l) => l.dishId === dish.id);
                    return (
                      <button
                        key={dish.id}
                        type="button"
                        onClick={() => addDish(dish)}
                        className={`flex w-full items-center justify-between px-2 py-2 text-sm transition-colors ${
                          inCart ? "bg-[#E8ECE3]" : "hover:bg-mist"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-charcoal">
                          {dish.name}
                          {inCart && (
                            <span className="bg-olive px-1.5 py-0.5 text-xs text-white">
                              {inCart.quantity}
                            </span>
                          )}
                        </span>
                        <span className="text-terracotta">€{dish.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-fit bg-mist px-6 py-6">
          <h2 className="font-serif text-2xl text-charcoal">Order Summary</h2>
          {cart.length === 0 ? (
            <p className="mt-4 text-sm text-stone">No items added yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {cart.map((line) => (
                <div key={line.dishId} className="flex items-center justify-between text-sm">
                  <span className="text-charcoal">{line.name}</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => updateQty(line.dishId, line.quantity - 1)}>
                      <Minus size={12} className="text-charcoal" />
                    </button>
                    <span className="w-4 text-center text-charcoal">{line.quantity}</span>
                    <button type="button" onClick={() => updateQty(line.dishId, line.quantity + 1)}>
                      <Plus size={12} className="text-charcoal" />
                    </button>
                    <button type="button" onClick={() => updateQty(line.dishId, 0)}>
                      <Trash2 size={12} className="text-terracotta" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex justify-between border-t border-border pt-4 text-lg">
            <span className="text-charcoal">Total</span>
            <span className="text-terracotta">€{total.toFixed(2)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-olive px-6 py-3.5 text-sm font-medium tracking-wide text-white hover:bg-olive-dark disabled:opacity-60"
          >
            {submitting ? "CREATING..." : "CREATE ORDER"}
          </button>
        </div>
      </form>
        {toast && (
        <div className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 bg-charcoal px-5 py-3 text-sm text-cream shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}