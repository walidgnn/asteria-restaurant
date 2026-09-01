import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex h-screen min-h-[700px] items-center justify-center overflow-hidden">
      <Image
        src="/images/hero.png"
        alt="A table set with Mediterranean dishes, olives, and wine at golden hour"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center text-white">
        <p className="mb-4 text-sm font-medium tracking-[0.25em] text-white/80">
          MODERN MEDITERRANEAN
        </p>
        <h1 className="font-serif text-6xl leading-none md:text-8xl">
          Made to Share
        </h1>
        <p className="mt-6 text-base text-white/90 md:text-lg">
          Seasonal ingredients · Timeless recipes · Modern cuisine
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/menu"
            className="bg-white px-8 py-3.5 text-sm font-medium tracking-wide text-charcoal transition-colors hover:bg-white/90"
          >
            EXPLORE MENU
          </Link>
          <Link
            href="/reservations"
            className="border border-white px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-white hover:text-charcoal"
          >
            RESERVE A TABLE
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/70">
        <span className="text-xs tracking-[0.2em]">SCROLL</span>
        <span className="h-10 w-px bg-white/50" />
      </div>
    </section>
  );
}