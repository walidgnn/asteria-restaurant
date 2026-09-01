import Image from "next/image";
import Link from "next/link";

const GALLERY_IMAGES = [
  { src: "/images/gallery-1.jpg", alt: "Asteria's arched dining room", className: "md:col-span-2 md:row-span-2" },
  { src: "/images/gallery-2.jpg", alt: "Chef plating a dish in the kitchen", className: "" },
  { src: "/images/gallery-3.jpg", alt: "A colorful plated dish on the table", className: "" },
  { src: "/images/gallery-4.jpg", alt: "Olive branch in a ceramic vase", className: "" },
  { src: "/images/gallery-5.jpg", alt: "Guests dining together in the evening", className: "" },
];

export function Gallery() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-28">
      <p className="mb-4 flex items-center gap-3 text-sm font-medium tracking-[0.2em] text-terracotta">
        <span className="h-px w-6 bg-terracotta" />
        GALLERY
      </p>
      <h2 className="font-serif text-4xl text-charcoal md:text-5xl">
        Moments from Asteria
      </h2>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
        {GALLERY_IMAGES.map((img) => (
          <div
            key={img.src}
            className={`relative aspect-square overflow-hidden ${img.className}`}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-charcoal"
        >
          VIEW GALLERY
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}