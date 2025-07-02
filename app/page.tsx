"use client"

import { useState } from "react"
import { HeroSection } from "@/components/sections/hero-section"
import { TrustBar } from "@/components/sections/trust-bar"
import { ProblemSection } from "@/components/sections/problem-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { DeveloperSection } from "@/components/sections/developer-section"
import { Footer } from "@/components/sections/footer"
import { IceAiSection } from "@/components/sections/ice-ai-section"
import { TechnicalDemoSection } from "@/components/sections/technical-demo-section"
import { Modal } from "@/components/ui/modal"
import { DemoVideoPopup } from "@/components/popups/demo-video-popup"
import { SignUpPopup } from "@/components/popups/signup-popup"
import { ContactPopup } from "@/components/popups/contact-popup"

export type ModalType = "demoVideo" | "signUp" | "contact" | null

export default function LandingPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  const renderModalContent = () => {
    switch (activeModal) {
      case "demoVideo":
        return <DemoVideoPopup />
      case "signUp":
        return <SignUpPopup />
      case "contact":
        return <ContactPopup />
      default:
        return null
    }
  }

  return (
    <div className="overflow-x-hidden">
      <HeroSection onOpenModal={setActiveModal} />
      <TrustBar />
      <ProblemSection />
      <FeaturesSection />
      <IceAiSection />
      <TechnicalDemoSection />
      <PricingSection onOpenModal={setActiveModal} />
      <DeveloperSection />
      <Footer />

      <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)}>
        {renderModalContent()}
      </Modal>
    </div>
  )
}
