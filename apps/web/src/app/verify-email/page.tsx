"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/config";
import { useAuth } from "@/lib/auth-context";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Missing verification token.");
      return;
    }
    fetch(`${API_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.message || "Verification failed.");
        }
        const data = await res.json();
        localStorage.setItem("asteria-token", data.accessToken);
        setStatus("success");
        setTimeout(() => router.push("/account"), 2000);
      })
      .catch((err) => {
        setError(err.message);
        setStatus("error");
      });
  }, [token, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 py-16 text-center">
      <Link href="/" className="mb-10 font-serif text-2xl text-charcoal">
        ASTERIA
      </Link>
      {status === "loading" && <p className="text-stone">Verifying your email...</p>}
      {status === "success" && (
        <>
          <h1 className="font-serif text-4xl text-charcoal">Email Verified</h1>
          <p className="mt-4 text-stone">Your account is now active. Redirecting you...</p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="font-serif text-4xl text-charcoal">Verification Failed</h1>
          <p className="mt-4 text-stone">{error}</p>
          <Link href="/login" className="mt-6 text-sm font-medium tracking-wide text-charcoal">
            ← Back to Sign In
          </Link>
        </>
      )}
    </div>
  );
}