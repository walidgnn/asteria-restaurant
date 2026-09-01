import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { StorySection } from "@/components/StorySection";
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
        <StorySection />
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