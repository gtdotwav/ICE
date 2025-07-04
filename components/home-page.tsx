import { HeroSection } from "@/components/sections/hero-section"
import { TrustBar } from "@/components/sections/trust-bar"
import { ProblemSection } from "@/components/sections/problem-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { IceAiSection } from "@/components/sections/ice-ai-section"
import { TechnicalDemoSection } from "@/components/sections/technical-demo-section"
import { DeveloperSection } from "@/components/sections/developer-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { Footer } from "@/components/sections/footer"

export default function HomePage() {
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
