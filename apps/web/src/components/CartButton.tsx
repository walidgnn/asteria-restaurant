"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartButton({ solid = false }: { solid?: boolean }) {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" aria-label="View cart" className="relative">
      <ShoppingBag size={20} strokeWidth={1.5} />
      {itemCount > 0 && (
        <span
          className={`absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-medium ${
            solid ? "bg-terracotta text-white" : "bg-white text-charcoal"
          }`}
        >
          {itemCount}
        </span>
      )}
    </Link>
  );
}