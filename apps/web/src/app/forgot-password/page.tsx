"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // No real email-sending backend yet — simulate the request.
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-16">
        <Link href="/" className="mb-10 font-serif text-2xl text-charcoal">
          ASTERIA
        </Link>

        <div className="w-full max-w-md text-center">
          {submitted ? (
            <>
              <h1 className="font-serif text-4xl leading-tight text-charcoal">
                Check Your Email
              </h1>
              <p className="mt-4 text-stone">
                If an account exists for that email, we&apos;ve sent a link to
                reset your password.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-4xl leading-tight text-charcoal">
                Reset Your Password
              </h1>
              <p className="mt-4 text-stone">
                Enter your email and we&apos;ll send you a link to reset your
                password.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 text-left">
                <label className="text-xs font-medium tracking-wide text-stone">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 w-full bg-olive px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark disabled:opacity-60"
                >
                  {loading ? "SENDING..." : "SEND RESET LINK →"}
                </button>
              </form>
            </>
          )}

          <Link
            href="/login"
            className="mt-8 inline-block text-sm font-medium tracking-wide text-charcoal"
          >
            ← BACK TO SIGN IN
          </Link>
        </div>
      </div>

      <p className="border-t border-border py-6 text-center text-xs text-stone">
        © 2026 Asteria Mediterranean. All rights reserved.
      </p>
    </div>
  );
}