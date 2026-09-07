import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingFeatures } from "@/components/landing/landing-features";
import { LandingDarkBand } from "@/components/landing/landing-dark-band";
import { LandingCta } from "@/components/landing/landing-cta";
import { LandingFooter } from "@/components/landing/landing-footer";

export function LandingPage() {
  return (
    <>
      <LandingNav />
      <main className="bg-canvas">
        <LandingHero />
        <LandingFeatures />
        <LandingDarkBand />
        <LandingCta />
      </main>
      <LandingFooter />
    </>
  );
}