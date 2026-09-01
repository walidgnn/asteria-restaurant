import Link from "next/link";

export function CallToAction() {
  return (
    <section className="border-t border-border px-8 py-28">
      <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-2">
        <div>
          <p className="mb-4 flex items-center gap-3 text-sm font-medium tracking-[0.2em] text-terracotta">
            <span className="h-px w-6 bg-terracotta" />
            JOIN US
          </p>
          <h2 className="font-serif text-4xl leading-tight text-charcoal md:text-5xl">
            Experience the sun at your table
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-stone">
            Reserve your table and experience Mediterranean dining at its
            finest. Walk-ins are always welcomed, though reservations are
            recommended.
          </p>
          <Link
            href="/reservations"
            className="mt-8 inline-block bg-olive px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark"
          >
            RESERVE A TABLE
          </Link>
        </div>

        <div className="flex flex-col justify-center gap-8">
          <div>
            <p className="text-sm font-medium tracking-[0.15em] text-terracotta">
              HOURS OF OPERATION
            </p>
            <p className="mt-2 font-serif text-xl text-charcoal">
              Monday – Sunday
            </p>
            <p className="mt-1 text-sm text-stone">
              Lunch: 12:00 PM – 3:00 PM · Dinner: 5:30 PM – 10:30 PM
            </p>
          </div>
          <div>
            <p className="text-sm font-medium tracking-[0.15em] text-terracotta">
              CONTACT &amp; ENQUIRIES
            </p>
            <p className="mt-2 font-serif text-xl text-charcoal">
              hello@asteria-restaurant.com
            </p>
            <p className="mt-1 text-sm text-stone">
              +1 (310) 555-0192 · 842 Ocean Drive, Santa Monica, CA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}