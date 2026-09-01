import Link from "next/link";

const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "/our-story" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
  { label: "Reservations", href: "/reservations" },
];

export function Footer() {
  return (
    <footer className="bg-cream px-8 pt-20">
      <div className="mx-auto grid max-w-7xl gap-12 border-b border-border pb-16 md:grid-cols-4">
        <div>
          <span className="font-serif text-2xl text-charcoal">ASTERIA</span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone">
            Honest Mediterranean dining in a refined, contemporary space.
            Made to share, curated with gratitude.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium tracking-[0.15em] text-terracotta">
            NAVIGATION
          </p>
          <ul className="mt-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-charcoal hover:text-stone"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium tracking-[0.15em] text-terracotta">
            LOCATION
          </p>
          <p className="mt-4 text-sm text-charcoal">
            842 Ocean Drive, Santa Monica, CA 90401
          </p>
          <p className="mt-2 text-sm text-charcoal">+1 (310) 555-0192</p>
          <p className="mt-2 text-sm text-charcoal">
            hello@asteria-restaurant.com
          </p>
        </div>

        <div>
          <p className="text-sm font-medium tracking-[0.15em] text-terracotta">
            CONNECT
          </p>
          <ul className="mt-4 space-y-3">
            <li>
              <Link href="#" className="text-sm text-charcoal hover:text-stone">
                Instagram
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-charcoal hover:text-stone">
                Facebook
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-charcoal hover:text-stone">
                Pinterest
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm text-charcoal hover:text-stone">
                Journal
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 py-8 text-sm text-stone md:flex-row">
        <p>© 2026 Asteria Restaurant. All rights reserved.</p>
        <div className="flex gap-4 text-charcoal">
            <a href="#" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
            </a>
            <a href="#" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
            </a>
            <a href="#" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C4 16 2.7 12.8 3 9c1.8 2 4.3 3.2 7 3.4-2.4-2.3-2.4-6 0-8.4 2.4-2.3 6-2.3 8 .1C19.6 4 21 3.5 21 3.5c-.3 1.5-1.2 2.7-2.5 3.5.7-.1 1.9-.4 2.5-.9z" fill="currentColor" stroke="none" />
                </svg>
            </a>
            </div>
      </div>
    </footer>
  );
}