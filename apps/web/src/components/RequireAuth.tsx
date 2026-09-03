"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { customer, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !customer) {
      router.push("/login");
    }
  }, [loading, customer, router]);

  if (loading || !customer) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-stone">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}