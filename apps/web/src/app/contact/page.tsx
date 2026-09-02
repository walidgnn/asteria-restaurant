import { Header } from "@/components/Header";
import { CenteredText } from "@/components/CenteredText";
import { ImageBanner } from "@/components/ImageBanner";
import { ContactInfo } from "@/components/ContactInfo";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { FadeIn } from "@/components/FadeIn";

export default function ContactPage() {
  return (
    <>
      <Header solid />

      <div className="pt-16">
        <CenteredText
          title="Come find us."
          paragraphs={[
            "We'd love to welcome you to Asteria. Reach out with inquiries, or visit us to experience Mediterranean dining at its finest.",
          ]}
        />
      </div>

      <FadeIn>
        <ImageBanner
          image="/images/contact-storefront.jpg"
          alt="Asteria's storefront at dusk, with warm lighting and outdoor seating"
        />
      </FadeIn>

      <FadeIn>
        <ContactInfo />
      </FadeIn>

      <FadeIn>
        <ContactForm />
      </FadeIn>

      <FadeIn>
        <div className="bg-mist">
          <CenteredText
            title="See you at the table."
            paragraphs={["Reserve your table and join us for an evening inspired by the Mediterranean."]}
            primaryLink={{ label: "RESERVE A TABLE", href: "/reservations" }}
            secondaryLink={{ label: "EXPLORE THE MENU", href: "/menu" }}
          />
        </div>
      </FadeIn>

      <Footer />
    </>
  );
}