import Image from "next/image";

export function CenteredImageSection({
  title,
  image,
  alt,
}: {
  title: string;
  image: string;
  alt: string;
}) {
  return (
    <section className="bg-[#EDEAE6] px-8 py-28">
      <h2 className="mb-12 text-center font-serif text-3xl text-charcoal md:text-4xl">
        {title}
      </h2>
      <div className="relative mx-auto aspect-square w-full max-w-2xl">
        <Image src={image} alt={alt} fill className="object-cover" />
      </div>
    </section>
  );
}