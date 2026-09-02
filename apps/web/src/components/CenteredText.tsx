import Link from "next/link";

export function CenteredText({
  title,
  paragraphs,
  primaryLink,
  secondaryLink,
}: {
  title: string;
  paragraphs: string[];
  primaryLink?: { label: string; href: string };
  secondaryLink?: { label: string; href: string };
}) {
  return (
    <section className="mx-auto max-w-3xl px-8 py-28 text-center">
      <h2 className="font-serif text-4xl leading-tight text-charcoal md:text-5xl">
        {title}
      </h2>
      {paragraphs.map((p, i) => (
        <p key={i} className="mt-6 text-base leading-relaxed text-stone">
          {p}
        </p>
      ))}
      {(primaryLink || secondaryLink) && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          {primaryLink && (
            <Link
              href={primaryLink.href}
              className="inline-flex items-center gap-2 bg-olive px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-colors hover:bg-olive-dark"
            >
              {primaryLink.label}
              <span aria-hidden>→</span>
            </Link>
          )}
          {secondaryLink && (
            <Link
              href={secondaryLink.href}
              className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-charcoal"
            >
              {secondaryLink.label}
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      )}
    </section>
  );
}