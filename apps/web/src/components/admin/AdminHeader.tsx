"use client";

import { Bell } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

export function AdminHeader() {
  const { staff } = useAdminAuth();

  return (
    <header className="flex items-center justify-end gap-5 border-b border-border px-8 py-5">
      <button aria-label="Notifications" className="relative">
        <Bell size={20} className="text-charcoal" strokeWidth={1.5} />
        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-terracotta" />
      </button>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mist font-serif text-sm text-charcoal">
          {staff?.firstName?.[0]}
          {staff?.lastName?.[0]}
        </div>
        <div>
          <p className="text-sm font-medium text-charcoal">
            {staff?.firstName} {staff?.lastName}
          </p>
          <p className="text-xs text-stone">{staff?.roles?.[0] ?? "Staff"}</p>
        </div>
      </div>
    </header>
  );
}