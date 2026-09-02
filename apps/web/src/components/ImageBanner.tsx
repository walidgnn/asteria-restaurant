import Image from "next/image";

export function ImageBanner({ image, alt }: { image: string; alt: string }) {
  return (
    <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
      <Image src={image} alt={alt} fill className="object-cover" />
    </div>
  );
}