"use client"

import React, { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"

export function PricingSection() {
  const [visitors, setVisitors] = useState(25000)
  const [conversion, setConversion] = useState(1.5)
  const [ticket, setTicket] = useState(200)

  const roiResult = useMemo(() => {
    const hiasflowPlanCost = 199 * 12
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
    const roi = (additionalRevenue / hiasflowPlanCost) * 100

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
    },
    {
      name: "Scale AI",
      price: "199",
      features: ["100k decisões/mês", "IA Avançada", "Consultoria de IA", "API Access"],
      highlight: true,
      badge: "Mais Popular",
    },
    {
      name: "Enterprise AI",
      price: "Custom",
      features: ["Decisões Ilimitadas", "IA Customizada", "SLA 99.99%", "Suporte Dedicado"],
      highlight: false,
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
    <section className="py-12 sm:py-16 md:py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display">
            Investimento <span className="text-primary">Inteligente</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
            ROI calculado por IA em tempo real. Escolha o plano que escala com você e otimiza suas conversões.
          </p>
        </motion.div>

        <motion.div
          className="mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative p-6 sm:p-8 rounded-lg border border-primary/30 bg-secondary/50 shadow-[0_0_80px_hsl(var(--primary)/0.15)] backdrop-blur-xl">
            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-foreground mb-2">
                  Calcule seu ROI com IA
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Arraste os controles e veja o impacto potencial do HIAS FLOW em tempo real.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div className="space-y-6 sm:space-y-8">
                  {/* ROI Controls */}
                  <div>
                    <label htmlFor="visitors" className="flex justify-between text-foreground mb-2 font-medium text-sm sm:text-base">
                      <span>Tráfego Mensal</span>
                      <span className="font-bold text-primary">{new Intl.NumberFormat("pt-BR").format(visitors)}</span>
                    </label>
                    <input
                      id="visitors"
                      type="range"
                      min="1000"
                      max="200000"
                      step="1000"
                      value={visitors}
                      onChange={(e) => setVisitors(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <div>
                    <label htmlFor="conversion" className="flex justify-between text-foreground mb-2 font-medium text-sm sm:text-base">
                      <span>Taxa de Conversão Atual</span>
                      <span className="font-bold text-primary">{conversion.toFixed(1)}%</span>
                    </label>
                    <input
                      id="conversion"
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.1"
                      value={conversion}
                      onChange={(e) => setConversion(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <div>
                    <label htmlFor="ticket" className="flex justify-between text-foreground mb-2 font-medium text-sm sm:text-base">
                      <span>Ticket Médio</span>
                      <span className="font-bold text-primary">{formatCurrency(ticket)}</span>
                    </label>
                    <input
                      id="ticket"
                      type="range"
                      min="50"
                      max="2000"
                      step="10"
                      value={ticket}
                      onChange={(e) => setTicket(Number(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-xl" />
                  <div className="relative p-6 sm:p-8 bg-background/80 rounded-lg border border-border/50 backdrop-blur-sm">
                    <div className="text-center space-y-4 sm:space-y-6">
                      <div>
                        <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-wider font-medium mb-2">
                          Receita Adicional Anual
                        </p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-green-400">
                          {formatCurrency(roiResult.additionalRevenue)}
                        </p>
                      </div>
                      <div className="h-px bg-border" />
                      <div>
                        <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-wider font-medium mb-2">
                          ROI Anual Previsto
                        </p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-primary">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
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
                className={`relative p-6 sm:p-8 rounded-lg border flex flex-col h-full transition-all duration-300 ${
                  plan.highlight
                    ? "border-primary/50 bg-secondary/50 shadow-[0_0_60px_hsl(var(--primary)/0.2)]"
                    : "border-border bg-secondary/30 hover:border-border/80"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-4 sm:px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-lg">
                      {plan.badge}
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-foreground mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-display ${
                          plan.highlight ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {plan.price !== "Custom" ? `R$${plan.price}` : plan.price}
                      </span>
                      {plan.price !== "Custom" && <span className="text-muted-foreground text-base sm:text-lg">/mês</span>}
                    </div>
                  </div>

                  <ul className="space-y-3 sm:space-y-4 text-muted-foreground flex-grow mb-6 sm:mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                            plan.highlight ? "bg-primary/20" : "bg-green-500/20"
                          }`}
                        >
                          <Check className={`h-3 w-3 ${plan.highlight ? "text-primary" : "text-green-400"}`} />
                        </div>
                        <span className="text-foreground text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    size="lg"
                    data-track-conversion="true"
                    data-funnel-id="pricing"
                    data-step-id={plan.name.toLowerCase()}
                    data-value={plan.price !== "Custom" ? plan.price : "0"}
                    className={`w-full font-bold transition-all duration-300 text-sm sm:text-base ${
                      plan.highlight
                        ? "bg-primary text-primary-foreground hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:scale-105"
                        : "bg-secondary text-foreground hover:bg-accent"
                    }`}
                  >
                    <Link href={plan.price === "Custom" ? "/dashboard" : "/lista-espera"}>
                      {plan.price === "Custom" ? "Falar com Especialista" : "Começar Agora"}
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 0 0 1px hsl(var(--primary)/0.3);
          transition: all 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 0 3px hsl(var(--primary)/0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 2px solid hsl(var(--background));
          box-shadow: 0 0 0 1px hsl(var(--primary)/0.3);
          transition: all 0.2s ease;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 0 3px hsl(var(--primary)/0.3);
        }
      `}</style>
    </section>
  )
}