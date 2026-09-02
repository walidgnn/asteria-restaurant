import { Header } from "@/components/Header";
import { PageHero } from "@/components/PageHero";
import { MenuBrowser } from "@/components/MenuBrowser";
import { Footer } from "@/components/Footer";
import { getMenu } from "@/lib/api";

export default async function MenuPage() {
  const categories = await getMenu();

  return (
    <>
      <Header />
      <PageHero
        eyebrow="MODERN MEDITERRANEAN"
        title="Our Menu"
        subtitle="Inspired by the Mediterranean, prepared with care."
        image="/images/menu-hero.jpg"
      />
      <MenuBrowser categories={categories} />
      <Footer />
    </>
  );
}