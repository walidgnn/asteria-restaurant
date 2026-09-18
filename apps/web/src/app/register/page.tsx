"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const firstName = form.get("firstName") as string;
    const lastName = form.get("lastName") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const confirmPassword = form.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await register({ firstName, lastName, email, password });
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen md:grid md:grid-cols-2">
      {/* Mobile top banner with overlaid logo */}
      <div className="relative h-44 w-full md:hidden">
        <Image
          src="/images/gallery-1.jpg"
          alt="Friends sharing a Mediterranean meal outdoors"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/30" />

        <Link
          href="/"
          className="absolute inset-x-0 top-8 text-center font-serif text-2xl tracking-wide text-white"
        >
          ASTERIA
        </Link>
      </div>

      {/* Desktop full-height image */}
      <div className="relative hidden md:block">
        <Image
          src="/images/gallery-1.jpg"
          alt="Friends sharing a Mediterranean meal outdoors"
          fill
          className="object-cover"
        />
      </div>

      {/* Form card — overlaps the mobile banner */}
      <div className="relative -mt-6 flex flex-col justify-center rounded-t-3xl bg-cream px-8 py-10 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] sm:px-16 md:mt-0 md:rounded-none md:py-16 md:shadow-none">
        {/* Desktop logo */}
        <Link
          href="/"
          className="mb-8 hidden text-center font-serif text-2xl text-charcoal md:mb-12 md:block"
        >
          ASTERIA
        </Link>

        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-center font-serif text-3xl leading-tight text-charcoal md:text-left md:text-4xl">
            Create Your Asteria Account
          </h1>

          <p className="mt-3 text-center text-stone md:text-left">
            Create an account to manage your orders and reservations.
          </p>

          {error && (
            <p className="mt-6 border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* First Name + Last Name */}
            <div className="grid grid-cols-2 gap-5">
              <input
                name="firstName"
                required
                placeholder="First Name"
                className="border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
              />

              <input
                name="lastName"
                required
                placeholder="Last Name"
                className="border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
              />
            </div>

            {/* Email */}
            <input
              name="email"
              type="email"
              required
              placeholder="Email Address"
              className="w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
            />

            {/* Password */}
            <div>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="Password"
                className="w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
              />

              <p className="mt-1.5 text-xs italic text-stone">
                Must be at least 8 characters long.
              </p>
            </div>

            {/* Confirm Password */}
            <input
              name="confirmPassword"
              type="password"
              required
              placeholder="Confirm Password"
              className="w-full border-b border-border bg-transparent py-2 text-sm text-charcoal placeholder:text-stone/60 focus:border-charcoal focus:outline-none"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-olive px-6 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark active:bg-olive-dark disabled:opacity-60"
            >
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT →"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-stone">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-terracotta hover:text-charcoal"
            >
              SIGN IN →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
