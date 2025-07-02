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
import { ChatContainer } from "@/src/components/chat/ChatContainer"
import { AnimatePresence } from "framer-motion"

export type ModalType = "demoVideo" | "signUp" | "contact" | null

export default function HomePage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

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
    <>
      <HeroSection onOpenModal={setActiveModal} onOpenChatbot={() => setIsChatbotOpen(true)} />
      <main className="flex-1">
        <TrustBar />
        <ProblemSection />
        <FeaturesSection />
        <IceAiSection />
        <TechnicalDemoSection />
        <PricingSection onOpenModal={setActiveModal} />
        <DeveloperSection />
      </main>
      <Footer />

      <AnimatePresence>{isChatbotOpen && <ChatContainer onClose={() => setIsChatbotOpen(false)} />}</AnimatePresence>

      <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)}>
        {renderModalContent()}
      </Modal>
    </>
  )
}
