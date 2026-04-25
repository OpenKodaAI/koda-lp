import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { FeatureGrid } from "@/components/feature-grid";
import { SectionDivider } from "@/components/section-divider";
import { OpenFoundations } from "@/components/open-foundations";
import { Integrations } from "@/components/integrations";
import { WhyKoda } from "@/components/why-koda";
import { CtaFinal } from "@/components/cta-final";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FeatureGrid />
        <Integrations />
        <OpenFoundations />
        <SectionDivider />
        <WhyKoda />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
