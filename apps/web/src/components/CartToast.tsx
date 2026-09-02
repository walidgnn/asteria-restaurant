"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartToast() {
  const { toastMessage } = useCart();

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[200] -translate-x-1/2">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto flex items-center gap-4 bg-charcoal px-5 py-3.5 text-sm text-cream shadow-lg"
          >
            <span className="flex items-center gap-2">
              <Check size={16} className="text-terracotta" />
              {toastMessage}
            </span>
            <Link
              href="/cart"
              className="whitespace-nowrap border-l border-white/20 pl-4 font-medium tracking-wide text-terracotta hover:text-white"
            >
              VIEW CART
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}