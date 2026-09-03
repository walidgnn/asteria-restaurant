import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ImageTextSection } from "@/components/ImageTextSection";
import { SignatureDishes } from "@/components/SignatureDishes";
import { Philosophy } from "@/components/Philosophy";
import { Gallery } from "@/components/Gallery";
import { Testimonial } from "@/components/Testimonial";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";
import { getMenu } from "@/lib/api";

const FEATURED_DISH_NAMES = [
  "Grilled Octopus",
  "Mediterranean Sea Bass",
  "Baklava Cheesecake",
];

export default async function Home() {
  const categories = await getMenu();
  const allDishes = categories.flatMap((c) => c.dishes);
  const featuredDishes = FEATURED_DISH_NAMES.map((name) =>
    allDishes.find((d) => d.name === name)
  ).filter((d): d is NonNullable<typeof d> => Boolean(d));

  return (
    <>
      <Header />
      <Hero />
      <FadeIn>
        <ImageTextSection
          eyebrow="OUR STORY"
          title="A table rooted in tradition"
          paragraphs={[
            "Asteria draws its inspiration from the sun-drenched coasts of the Mediterranean — where meals are slow, ingredients are honest, and every dish tells a story. Our kitchen celebrates the simplicity and depth of this tradition, bringing seasonal produce and time-honored techniques to a modern table.",
          ]}
          image="/images/story.jpg"
          imageAlt="Interior of Asteria restaurant, an arched dining room with wooden tables"
          linkLabel="DISCOVER OUR STORY"
          linkHref="/our-story"
        />
      </FadeIn>
      <FadeIn>
        <SignatureDishes dishes={featuredDishes} />
      </FadeIn>
      <FadeIn>
        <Philosophy />
      </FadeIn>
      <FadeIn>
        <Gallery />
      </FadeIn>
      <FadeIn>
        <Testimonial />
      </FadeIn>
      <FadeIn>
        <CallToAction />
      </FadeIn>
      <Footer />
    </>
  );
}