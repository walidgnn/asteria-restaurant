import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  large = false,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  large?: boolean;
}) {
  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden ${
        large ? "h-[640px]" : "h-[480px]"
      }`}
    >
      <Image src={image} alt={title} fill priority className="object-cover" />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center text-white">
        <p className="mb-4 flex items-center gap-3 text-sm font-medium tracking-[0.25em] text-white/80">
          <span className="h-px w-6 bg-white/70" />
          {eyebrow}
          <span className="h-px w-6 bg-white/70" />
        </p>
        <h1
          className={`font-serif leading-none ${
            large
              ? "text-6xl md:text-8xl lg:text-[7.5rem]"
              : "text-5xl md:text-6xl"
          }`}
        >
          {title}
        </h1>
        <p className="mt-4 text-base text-white/90">{subtitle}</p>
      </div>
    </section>
  );
}