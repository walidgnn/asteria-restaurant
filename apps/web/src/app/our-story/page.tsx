import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { CenteredText } from "@/components/CenteredText";
import { Philosophy } from "@/components/Philosophy";
import { ImageTextSection } from "@/components/ImageTextSection";
import { CenteredImageSection } from "@/components/CenteredImageSection";
import { ImageBanner } from "@/components/ImageBanner";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";

export default function OurStoryPage() {
  return (
    <>
      <Header />
      <PageHero
        eyebrow="OUR STORY"
        title="A Table Rooted in Tradition"
        subtitle="At Asteria, Mediterranean tradition meets a contemporary table."
        image="/images/story-hero.jpg"
        large
      />

      <FadeIn>
        <CenteredText
          title="From the Mediterranean, with intention."
          paragraphs={[
            "Asteria was born from a desire to capture the effortless elegance of coastal Mediterranean dining and translate it into a modern culinary experience. We believe that a meal is more than sustenance; it is a ritual of connection, a time to pause, and a celebration of the season's quiet offerings.",
            "Drawing inspiration from the sun-drenched coastlines where ingredients are treated with reverence, our approach is rooted in simplicity. We honor time-tested techniques while embracing contemporary refinement, creating a space where every shared plate tells a story of heritage and craft.",
          ]}
        />
      </FadeIn>

      <FadeIn>
        <Philosophy />
      </FadeIn>

      <FadeIn>
        <ImageTextSection
          eyebrow="THE KITCHEN"
          title="Honest cooking, carefully considered."
          paragraphs={[
            "Our kitchen is a testament to the art of balance. We source with rigorous intention, seeking out purveyors who share our dedication to sustainable practices and unparalleled quality. Here, traditional preparation methods are applied with a modern sensibility, resulting in dishes that feel both comforting and revelatory. It is an honest expression of hospitality, served without pretense.",
          ]}
          image="/images/chef-plating-story.jpg"
          imageAlt="Chef carefully plating a dish in the Asteria kitchen"
        />
      </FadeIn>

      <FadeIn>
        <CenteredImageSection
          title="From Land and Sea"
          image="/images/ingredients-flatlay.jpg"
          alt="Fresh olives, lemons, herbs, and sea salt on a stone surface"
        />
      </FadeIn>

      <FadeIn>
        <ImageBanner
          image="/images/dining-room.jpg"
          alt="Asteria's arched dining room set for service"
        />
      </FadeIn>

      <FadeIn>
        <CenteredText
          title="Come to the table."
          paragraphs={["Join us at Asteria for a Mediterranean experience made to be shared."]}
          primaryLink={{ label: "RESERVE A TABLE", href: "/reservations" }}
          secondaryLink={{ label: "EXPLORE THE MENU", href: "/menu" }}
        />
      </FadeIn>

      <Footer />
    </>
  );
}