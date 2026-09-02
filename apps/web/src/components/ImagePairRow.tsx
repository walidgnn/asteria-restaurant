import Image from "next/image";

export function ImagePairRow({
  label,
  centered = false,
  images,
}: {
  label: string;
  centered?: boolean;
  images: { src: string; alt: string; flex: number }[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-8 py-20">
      <p
        className={`mb-8 flex items-center gap-3 text-sm font-medium tracking-[0.2em] text-terracotta ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-6 bg-terracotta" />
        {label}
        {centered && <span className="h-px w-6 bg-terracotta" />}
      </p>

      <div className="flex flex-col gap-6 md:flex-row">
        {images.map((img) => (
          <div
            key={img.src}
            className="relative aspect-[4/3] w-full"
            style={{ flex: img.flex }}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}