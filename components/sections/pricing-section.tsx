"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import type { ModalType } from "@/app/page"

type PricingSectionProps = {
  onOpenModal: (type: ModalType) => void
}

export function PricingSection({ onOpenModal }: PricingSectionProps) {
  const [visitors, setVisitors] = useState(25000)
  const [conversion, setConversion] = useState(1.5)
  const [ticket, setTicket] = useState(200)

  const roiResult = useMemo(() => {
    const icefunnelPlanCost = 199 * 12
    const visitorsNum = Number(visitors)
    const conversionNum = Number(conversion) / 100
    const ticketNum = Number(ticket)

    if (!visitorsNum || !conversionNum || !ticketNum) {
      return { additionalRevenue: 0, roi: 0 }
    }

    const newConversion = conversionNum * 4
    const newTicket = ticketNum * 1.15

    const currentRevenue = visitorsNum * conversionNum * ticketNum
    const newRevenue = visitorsNum * newConversion * newTicket
    const additionalRevenue = newRevenue - currentRevenue
    const roi = (additionalRevenue / icefunnelPlanCost) * 100

    return { additionalRevenue, roi }
  }, [visitors, conversion, ticket])

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)

  const plans = [
    {
      name: "Starter AI",
      price: "49",
      features: ["1k decisões/mês", "IA Básica", "Suporte 24/7"],
      highlight: false,
      action: () => onOpenModal("signUp"),
    },
    {
      name: "Scale AI",
      price: "199",
      features: ["100k decisões/mês", "IA Avançada", "Consultoria de IA", "API Access"],
      highlight: true,
      badge: "Mais Popular",
      action: () => onOpenModal("signUp"),
    },
    {
      name: "Enterprise AI",
      price: "Custom",
      features: ["Decisões Ilimitadas", "IA Customizada", "SLA 99.99%", "Suporte Dedicado"],
      highlight: false,
      action: () => onOpenModal("contact"),
    },
  ]

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: "easeOut",
      },
    }),
  }

  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-ice-quantum-950 via-ice-quantum-900 to-ice-quantum-950" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display">
            Investimento{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ai-cyan via-ai-purple to-ai-green">
              Inteligente
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-ice-quantum-300">
            ROI calculado por IA em tempo real. Escolha o plano que escala com você e congela a concorrência.
          </p>
        </motion.div>

        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative p-8 rounded-3xl border border-ai-purple/30 bg-gradient-to-br from-ai-purple/10 via-ai-cyan/5 to-transparent shadow-[0_0_80px_rgba(139,92,246,0.15)] backdrop-blur-xl">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-ai-cyan/5 to-ai-purple/5 opacity-50" />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold font-display text-white mb-2">Calcule seu ROI com IA</h3>
                <p className="text-ice-quantum-300">
                  Arraste os controles e veja o impacto potencial do IceFunnel em tempo real.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-8">
                  <div className="group">
                    <label htmlFor="visitors" className="flex justify-between text-ice-quantum-200 mb-3 font-medium">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-ai-cyan rounded-full" />
                        Tráfego Mensal
                      </span>
                      <span className="font-bold text-white text-lg">
                        {new Intl.NumberFormat("pt-BR").format(visitors)}
                      </span>
                    </label>
                    <input
                      id="visitors"
                      type="range"
                      min="1000"
                      max="200000"
                      step="1000"
                      value={visitors}
                      onChange={(e) => setVisitors(Number(e.target.value))}
                      className="w-full h-3 bg-ice-quantum-700 rounded-lg appearance-none cursor-pointer range-thumb group-hover:bg-ice-quantum-600 transition-colors"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="conversion" className="flex justify-between text-ice-quantum-200 mb-3 font-medium">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-ai-purple rounded-full" />
                        Taxa de Conversão Atual
                      </span>
                      <span className="font-bold text-white text-lg">{conversion.toFixed(1)}%</span>
                    </label>
                    <input
                      id="conversion"
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.1"
                      value={conversion}
                      onChange={(e) => setConversion(Number(e.target.value))}
                      className="w-full h-3 bg-ice-quantum-700 rounded-lg appearance-none cursor-pointer range-thumb group-hover:bg-ice-quantum-600 transition-colors"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="ticket" className="flex justify-between text-ice-quantum-200 mb-3 font-medium">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-ai-green rounded-full" />
                        Ticket Médio
                      </span>
                      <span className="font-bold text-white text-lg">{formatCurrency(ticket)}</span>
                    </label>
                    <input
                      id="ticket"
                      type="range"
                      min="50"
                      max="2000"
                      step="10"
                      value={ticket}
                      onChange={(e) => setTicket(Number(e.target.value))}
                      className="w-full h-3 bg-ice-quantum-700 rounded-lg appearance-none cursor-pointer range-thumb group-hover:bg-ice-quantum-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-ai-cyan/10 to-ai-green/10 rounded-2xl blur-xl" />
                  <div className="relative p-8 bg-ice-quantum-900/80 rounded-2xl border border-ice-quantum-700/50 backdrop-blur-sm">
                    <div className="text-center space-y-6">
                      <div>
                        <p className="text-ice-quantum-300 text-sm uppercase tracking-wider font-medium mb-2">
                          Receita Adicional Anual
                        </p>
                        <p className="text-3xl lg:text-4xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-ai-green to-ai-cyan">
                          {formatCurrency(roiResult.additionalRevenue)}
                        </p>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-ice-quantum-600 to-transparent" />

                      <div>
                        <p className="text-ice-quantum-300 text-sm uppercase tracking-wider font-medium mb-2">
                          ROI Anual Previsto
                        </p>
                        <p className="text-3xl lg:text-4xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-ai-cyan to-ai-purple">
                          +{roiResult.roi.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative group ${plan.highlight ? "lg:-mt-4 lg:mb-4" : ""}`}
              variants={cardVariants}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div
                className={`relative p-8 rounded-3xl border flex flex-col h-full transition-all duration-300 ${
                  plan.highlight
                    ? "border-ai-cyan/50 bg-gradient-to-br from-ice-quantum-800/80 to-ice-quantum-900/80 shadow-[0_0_60px_rgba(0,240,255,0.2)] backdrop-blur-xl"
                    : "border-ice-quantum-700/50 bg-ice-quantum-900/50 hover:border-ice-quantum-600/50 backdrop-blur-xl"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-6 py-2 bg-gradient-to-r from-ai-cyan to-ai-purple text-ice-quantum-950 text-sm font-bold rounded-full shadow-lg">
                      {plan.badge}
                    </div>
                  </div>
                )}

                {plan.highlight && (
                  <div className="absolute inset-0 bg-gradient-to-br from-ai-cyan/5 to-ai-purple/5 rounded-3xl" />
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold font-display text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-4xl lg:text-5xl font-bold font-display ${
                          plan.highlight
                            ? "text-transparent bg-clip-text bg-gradient-to-r from-ai-cyan to-ai-purple"
                            : "text-white"
                        }`}
                      >
                        {plan.price !== "Custom" ? `$${plan.price}` : plan.price}
                      </span>
                      {plan.price !== "Custom" && <span className="text-ice-quantum-400 text-lg">/mês</span>}
                    </div>
                  </div>

                  <ul className="space-y-4 text-ice-quantum-300 flex-grow mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                            plan.highlight ? "bg-ai-cyan/20" : "bg-ai-green/20"
                          }`}
                        >
                          <Check className={`h-3 w-3 ${plan.highlight ? "text-ai-cyan" : "text-ai-green"}`} />
                        </div>
                        <span className="text-ice-quantum-200">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="lg"
                    onClick={plan.action}
                    className={`w-full font-bold transition-all duration-300 ${
                      plan.highlight
                        ? "bg-gradient-to-r from-ai-cyan to-ai-purple text-ice-quantum-950 hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-105"
                        : "bg-ice-quantum-700 text-white hover:bg-ice-quantum-600 border border-ice-quantum-600 hover:border-ice-quantum-500"
                    }`}
                  >
                    {plan.price === "Custom" ? "Falar com Especialista" : "Começar Agora"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
