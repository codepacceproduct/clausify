import { LandingHeader } from "@/components/landing/landing-header"
import { LandingHero } from "@/components/landing/landing-hero"
import { LandingFeatures } from "@/components/landing/landing-features"
import { LandingStats } from "@/components/landing/landing-stats"
import { LandingEcosystem } from "@/components/landing/landing-ecosystem"
import { LandingBenefits } from "@/components/landing/landing-benefits"
import { LandingTestimonials } from "@/components/landing/landing-testimonials"
import { LandingPricing } from "@/components/landing/landing-pricing"
import { LandingCTA } from "@/components/landing/landing-cta"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingStats />
        <LandingFeatures />
        <LandingEcosystem />
        <LandingBenefits />
        <LandingPricing />
        <LandingTestimonials />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  )
}
