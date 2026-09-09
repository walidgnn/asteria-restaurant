"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/lib/admin-auth-context";

export function RequireAdminAuth({ children }: { children: React.ReactNode }) {
  const { staff, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !staff) {
      router.push("/admin/login");
    }
  }, [loading, staff, router]);

  if (loading || !staff) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm text-stone">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}