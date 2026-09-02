import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { ImagePairRow } from "@/components/ImagePairRow";
import { ImageTextSection } from "@/components/ImageTextSection";
import { ImageBanner } from "@/components/ImageBanner";
import { CenteredText } from "@/components/CenteredText";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";

export default function GalleryPage() {
  return (
    <>
      <Header />
      <PageHero
        eyebrow="GALLERY"
        title="Moments at Asteria"
        subtitle="A glimpse into our kitchen, our table, and the Mediterranean spirit behind every dish."
        image="/images/gallery-hero.jpg"
        large
      />

      <FadeIn>
        <ImagePairRow
          label="THE TABLE"
          images={[
            { src: "/images/gallery-burrata.jpg", alt: "Burrata plate set on a wooden table", flex: 1 },
            { src: "/images/gallery-1.jpg", alt: "Guests dining together under a pergola", flex: 2 },
          ]}
        />
      </FadeIn>

      <FadeIn>
        <div className="bg-mist">
          <ImageTextSection
            eyebrow="THE KITCHEN"
            title="From the Kitchen"
            paragraphs={["Where simple ingredients become something worth sharing."]}
            image="/images/chef-plating.jpg"
            imageAlt="Chef plating a dish in the Asteria kitchen"
          />
        </div>
      </FadeIn>

      <FadeIn>
        <ImagePairRow
          label="FROM LAND & SEA"
          centered
          images={[
            { src: "/images/ingredients-flatlay.jpg", alt: "Olives, lemons, and herbs on a stone surface", flex: 1 },
            { src: "/images/gallery-seabass.jpg", alt: "Plated whole roasted sea bass", flex: 1 },
          ]}
        />
      </FadeIn>

      <FadeIn>
        <div className="bg-cream pb-4 pt-20 text-center">
          <p className="mb-8 flex items-center justify-center gap-3 text-sm font-medium tracking-[0.2em] text-terracotta">
            <span className="h-px w-6 bg-terracotta" />
            THE SPACE
            <span className="h-px w-6 bg-terracotta" />
          </p>
        </div>
        <ImageBanner
          image="/images/dining-room.jpg"
          alt="Asteria's arched dining room set for service"
        />
      </FadeIn>

      <FadeIn>
        <div className="bg-mist">
          <CenteredText
            title="Come to the table."
            paragraphs={["See it for yourself. Join us at Asteria."]}
            primaryLink={{ label: "RESERVE A TABLE", href: "/reservations" }}
            secondaryLink={{ label: "EXPLORE THE MENU", href: "/menu" }}
          />
        </div>
      </FadeIn>

      <Footer />
    </>
  );
}