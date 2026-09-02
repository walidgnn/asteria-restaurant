import Image from "next/image";
import Link from "next/link";

export function ImageTextSection({
  eyebrow,
  title,
  paragraphs,
  image,
  imageAlt,
  linkLabel,
  linkHref,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  linkLabel?: string;
  linkHref?: string;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto max-w-7xl px-8 py-28">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <div className={reverse ? "md:order-2" : ""}>
          <div className="relative aspect-square w-full">
            <Image src={image} alt={imageAlt} fill className="object-cover" />
          </div>
        </div>

        <div className={reverse ? "md:order-1" : ""}>
          <p className="mb-4 flex items-center gap-3 text-sm font-medium tracking-[0.2em] text-terracotta">
            <span className="h-px w-6 bg-terracotta" />
            {eyebrow}
          </p>
          <h2 className="font-serif text-4xl leading-tight text-charcoal md:text-5xl">
            {title}
          </h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="mt-6 max-w-md text-base leading-relaxed text-stone">
              {p}
            </p>
          ))}
          {linkLabel && linkHref && (
            <Link
              href={linkHref}
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-charcoal"
            >
              {linkLabel}
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}