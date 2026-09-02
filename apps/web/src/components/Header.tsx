import Link from "next/link";
import { User, ShoppingBag } from "lucide-react";

const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "/our-story" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export function Header({ solid = false }: { solid?: boolean }) {
  const textColor = solid ? "text-charcoal" : "text-white";
  const subTextColor = solid ? "text-stone" : "text-white/90";
  const borderColor = solid ? "border-charcoal/70" : "border-white/70";

  return (
    <header
      className={
        solid
          ? "relative z-50 border-b border-border bg-cream"
          : "absolute top-0 left-0 right-0 z-50"
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <Link href="/" className={`font-serif text-2xl tracking-wide ${textColor}`}>
          ASTERIA
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide ${subTextColor} transition-colors hover:${solid ? "text-charcoal" : "text-white"}`}
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>

        <div className={`flex items-center gap-5 ${textColor}`}>
          <Link href="/login" aria-label="Account">
            <User size={20} strokeWidth={1.5} />
          </Link>
          <Link href="/cart" aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={1.5} />
          </Link>
          <Link
            href="/reservations"
            className={`border ${borderColor} px-5 py-2.5 text-sm font-medium tracking-wide ${textColor} transition-colors hover:${solid ? "bg-charcoal hover:text-cream" : "bg-white hover:text-charcoal"}`}
          >
            RESERVE A TABLE
          </Link>
        </div>
      </div>
    </header>
  );
}