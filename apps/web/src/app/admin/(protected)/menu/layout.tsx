"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Categories", href: "/admin/menu" },
  { label: "Dishes", href: "/admin/menu/dishes" },
  { label: "Customizations", href: "/admin/menu/customizations" },
];

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <div className="flex gap-8 border-b border-border">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`pb-3 text-sm font-medium tracking-wide ${
                isActive ? "border-b-2 border-terracotta text-charcoal" : "text-stone hover:text-charcoal"
              }`}
            >
              {tab.label.toUpperCase()}
            </Link>
          );
        })}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}