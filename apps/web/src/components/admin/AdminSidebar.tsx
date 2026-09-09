"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid, FileText, CalendarCheck, BookOpen, LayoutTemplate,
  Users, Store, Settings, LogOut, Plus,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "Orders", href: "/admin/orders", icon: FileText },
  { label: "Reservations", href: "/admin/reservations", icon: CalendarCheck },
  { label: "Menu", href: "/admin/menu", icon: BookOpen },
  { label: "Tables", href: "/admin/tables", icon: LayoutTemplate },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Restaurant", href: "/admin/restaurant", icon: Store },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { staff, logout } = useAdminAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/admin/login");
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-cream px-6 py-8">
      <div>
        <h1 className="font-serif text-xl leading-tight tracking-wide text-charcoal">
          ASTERIA
          <br />
          ADMIN
        </h1>
        <p className="mt-1 text-xs text-stone">Management Suite</p>
      </div>

      <Link
        href="/admin/orders/new"
        className="mt-6 flex items-center justify-center gap-2 bg-olive px-4 py-2.5 text-xs font-medium tracking-wide text-white transition-colors hover:bg-olive-dark"
      >
        <Plus size={14} />
        NEW RESERVATION
      </Link>

      <nav className="mt-8 flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-[#E8ECE3] font-medium text-charcoal"
                  : "text-stone hover:text-charcoal"
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-border pt-4">
        <Link
          href="/admin/profile"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-stone hover:text-charcoal"
        >
          <Users size={16} strokeWidth={1.5} />
          Staff Profile
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-stone hover:text-charcoal"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </aside>
  );
}