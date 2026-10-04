import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { SocialDock } from "@/components/site/social-dock";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Catalog } from "@/components/sections/catalog";
import { Showcase } from "@/components/sections/showcase";
import { QuoteBuilder } from "@/components/sections/quote-builder";
import { Directory } from "@/components/sections/directory";
import { Location } from "@/components/sections/location";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Catalog />
        <Showcase />
        <QuoteBuilder />
        <Directory />
        <Location />
      </main>
      <Footer />
      <SocialDock />
    </>
  );
}
