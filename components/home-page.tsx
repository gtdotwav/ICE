import { HeroSection } from "@/components/sections/hero-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { ProblemSection } from "@/components/sections/problem-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { TechnicalDemoSection } from "@/components/sections/technical-demo-section"
import { IceAiSection } from "@/components/sections/ice-ai-section"
import { DeveloperSection } from "@/components/sections/developer-section"
import { TrustBar } from "@/components/sections/trust-bar"
import { Footer } from "@/components/sections/footer"

export function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TrustBar />
      <ProblemSection />
      <FeaturesSection />
      <IceAiSection />
      <TechnicalDemoSection />
      <DeveloperSection />
      <PricingSection />
      <Footer />
    </main>
  )
}
