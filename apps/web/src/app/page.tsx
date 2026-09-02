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

export default function Home() {
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
        <SignatureDishes />
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