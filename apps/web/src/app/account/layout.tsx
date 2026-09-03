"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, UtensilsCrossed, Calendar, User, Settings, LogOut } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Overview", href: "/account", icon: LayoutGrid },
  { label: "Orders", href: "/account/orders", icon: UtensilsCrossed },
  { label: "Reservations", href: "/account/reservations", icon: Calendar },
  { label: "Profile", href: "/account/profile", icon: User },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { customer, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <RequireAuth>
      <Header solid />
      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-64 shrink-0 border-r border-border px-6 py-12 md:block">
          <p className="text-xs tracking-wide text-stone">Welcome back,</p>
          <p className="font-serif text-2xl uppercase text-charcoal">
            {customer?.firstName}.
          </p>

          <nav className="mt-10 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm font-medium tracking-wide transition-colors ${
                    isActive
                      ? "border-terracotta text-charcoal"
                      : "border-transparent text-stone hover:text-charcoal"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  {item.label.toUpperCase()}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-10 flex items-center gap-3 px-3 py-2.5 text-sm font-medium tracking-wide text-stone hover:text-terracotta"
          >
            <LogOut size={16} strokeWidth={1.5} />
            LOG OUT
          </button>
        </aside>

        <main className="flex-1 px-8 py-12">{children}</main>
      </div>
      <Footer />
    </RequireAuth>
  );
}