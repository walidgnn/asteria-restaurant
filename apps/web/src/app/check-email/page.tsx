"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 py-16 text-center">
      <Link href="/" className="mb-10 font-serif text-2xl text-charcoal">
        ASTERIA
      </Link>
      <h1 className="font-serif text-4xl text-charcoal">Check Your Email</h1>
      <p className="mt-4 max-w-md text-stone">
        We&apos;ve sent a verification link to{" "}
        <strong className="text-charcoal">{email}</strong>. Click the link to
        activate your account, then sign in.
      </p>
      <Link href="/login" className="mt-8 text-sm font-medium tracking-wide text-charcoal">
        ← Back to Sign In
      </Link>
    </div>
  );
}