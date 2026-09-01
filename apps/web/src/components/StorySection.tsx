import Image from "next/image";
import Link from "next/link";

export function StorySection() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-28">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <div className="relative aspect-square w-full">
          <Image
            src="/images/story.jpg"
            alt="Interior of Asteria restaurant, an arched dining room with wooden tables"
            fill
            className="object-cover"
          />
        </div>

        <div>
          <p className="mb-4 flex items-center gap-3 text-sm font-medium tracking-[0.2em] text-terracotta">
            <span className="h-px w-6 bg-terracotta" />
            OUR STORY
          </p>
          <h2 className="font-serif text-4xl leading-tight text-charcoal md:text-5xl">
            A table rooted in tradition
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-stone">
            Asteria draws its inspiration from the sun-drenched coasts of the
            Mediterranean — where meals are slow, ingredients are honest, and
            every dish tells a story. Our kitchen celebrates the simplicity
            and depth of this tradition, bringing seasonal produce and
            time-honored techniques to a modern table.
          </p>
          <Link
            href="/our-story"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-charcoal"
          >
            DISCOVER OUR STORY
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}