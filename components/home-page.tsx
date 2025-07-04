"use client"

import { useState } from "react"
import { HeroSection } from "@/components/sections/hero-section"
import { TrustBar } from "@/components/sections/trust-bar"
import { ProblemSection } from "@/components/sections/problem-section"
import { FeaturesSection } from "@/components/sections/features-section"
import { IceAiSection } from "@/components/sections/ice-ai-section"
import { DeveloperSection } from "@/components/sections/developer-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { TechnicalDemoSection } from "@/components/sections/technical-demo-section"
import { Footer } from "@/components/sections/footer"
import { Modal } from "@/components/ui/modal"
import { DemoVideoPopup } from "@/components/popups/demo-video-popup"
import type { ModalType } from "@/app/page"

export default function HomePage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  const openModal = (modalType: ModalType) => {
    setActiveModal(modalType)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-5xl font-extrabold">IceFunnel</h1>
      <p className="max-w-xl text-muted-foreground">AI-powered marketing funnels delivered at the speed of thought.</p>

      {/* Sections */}
      <HeroSection onOpenModal={openModal} />
      <TrustBar />
      <ProblemSection />
      <FeaturesSection />
      <IceAiSection />
      <DeveloperSection />
      <PricingSection />
      <TechnicalDemoSection />
      <Footer />

      {/* Modals */}
      <Modal isOpen={activeModal === "demoVideo"} onClose={closeModal}>
        <DemoVideoPopup />
      </Modal>

      {/* Outros modais podem ser adicionados aqui */}
      {activeModal === "signUp" && (
        <Modal isOpen={true} onClose={closeModal}>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Cadastro</h2>
            <p className="text-muted-foreground">Em breve...</p>
          </div>
        </Modal>
      )}

      {activeModal === "contact" && (
        <Modal isOpen={true} onClose={closeModal}>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Contato</h2>
            <p className="text-muted-foreground">Entre em contato conosco em breve...</p>
          </div>
        </Modal>
      )}
    </main>
  )
}
