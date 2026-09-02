import { ArrowUpRight } from "lucide-react";

const ADDRESS = "123 Mediterranean Avenue, Santa Monica, CA 90401";

export function ContactInfo() {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    ADDRESS
  )}`;

  return (
    <section className="mx-auto max-w-5xl px-8 py-20">
      <div className="grid gap-16 md:grid-cols-2">
        <div className="border-t border-border pt-6">
          <h3 className="font-serif text-2xl text-charcoal">Visit Asteria</h3>
          <p className="mt-4 text-sm leading-relaxed text-stone">
            123 Mediterranean Avenue
            <br />
            Santa Monica, CA 90401
          </p>
          <p className="mt-4 text-sm text-stone">+1 (310) 555-0123</p>
          <p className="mt-1 text-sm text-stone">hello@asteria-restaurant.com</p>
          
           <a href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-charcoal hover:text-terracotta"
          >
            GET DIRECTIONS
            <ArrowUpRight size={14} strokeWidth={2} />
          </a>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-serif text-2xl text-charcoal">Opening Hours</h3>
          <p className="mt-4 text-sm leading-relaxed text-stone">
            Wednesday – Sunday
            <br />
            12:00 PM – 11:00 PM
          </p>
          <p className="mt-4 text-sm italic text-stone">Kitchen closes at 10:30 PM.</p>
          <p className="mt-1 text-sm italic text-stone">Closed Mondays &amp; Tuesdays.</p>
        </div>
      </div>
    </section>
  );
}