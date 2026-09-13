"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, User } from "lucide-react";
import { CartButton } from "@/components/CartButton";
import { useAuth } from "@/lib/auth-context";

const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "/our-story" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function Header({ solid = false }: { solid?: boolean }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const textColor = solid ? "text-charcoal" : "text-white";
  const subTextColor = solid ? "text-stone" : "text-white/90";
  const borderColor = solid ? "border-charcoal/70" : "border-white/70";
  const { customer } = useAuth();

  return (
    <>
      <header
        className={
          solid
            ? "relative z-50 border-b border-border bg-cream"
            : "absolute top-0 left-0 right-0 z-50"
        }
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 sm:py-6">
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            className={`rounded-full p-1.5 transition-colors active:bg-black/10 md:hidden ${textColor}`}
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <Link href="/" className={`font-serif text-xl tracking-wide ${textColor} sm:text-2xl`}>
            ASTERIA
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide ${subTextColor} transition-colors hover:${solid ? "text-charcoal" : "text-white"} active:opacity-60`}
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
          </nav>

          <div className={`flex items-center gap-4 sm:gap-5 ${textColor}`}>
            <Link
              href={customer ? "/account" : "/login"}
              aria-label={customer ? "My Account" : "Sign In"}
              className="hidden rounded-full p-1.5 transition-colors active:bg-black/10 sm:block"
            >
              <User size={20} strokeWidth={1.5} />
            </Link>
            <CartButton solid={solid} />
            <Link
              href="/reservations"
              className={`hidden border ${borderColor} px-5 py-2.5 text-sm font-medium tracking-wide ${textColor} transition-colors hover:${solid ? "bg-charcoal hover:text-cream" : "bg-white hover:text-charcoal"} active:opacity-70 md:block`}
            >
              RESERVE A TABLE
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile slide-in drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-4/5 max-w-xs flex-col bg-cream px-6 py-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xl text-charcoal">ASTERIA</span>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="rounded-full p-1.5 transition-colors active:bg-mist"
              >
                <X size={22} className="text-charcoal" />
              </button>
            </div>

            <nav className="mt-10 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                  className="rounded px-3 py-3 text-base font-medium tracking-wide text-charcoal transition-colors active:bg-mist"
                >
                  {link.label.toUpperCase()}
                </Link>
              ))}
            </nav>

            <div className="mt-8 border-t border-border pt-6">
              <Link
                href={customer ? "/account" : "/login"}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3 rounded border border-border px-4 py-3 text-sm font-medium tracking-wide text-charcoal transition-colors active:bg-mist"
              >
                <User size={18} strokeWidth={1.5} />
                {customer ? "MY ACCOUNT" : "SIGN IN"}
              </Link>
            </div>

            <Link
              href="/reservations"
              onClick={() => setDrawerOpen(false)}
              className="mt-auto bg-olive px-6 py-3.5 text-center text-sm font-medium tracking-wide text-white transition-colors active:bg-olive-dark"
            >
              RESERVE A TABLE
            </Link>
          </div>
        </div>
      )}
    </>
  );
}