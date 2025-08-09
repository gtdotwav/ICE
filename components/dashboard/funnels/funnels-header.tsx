"use client"

import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Target, Zap, LineChart } from 'lucide-react'

const fetcher = (u: string) => fetch(u).then((r) => r.json())

export function FunnelsHeader({ onOpenWizard }: { onOpenWizard: () => void }) {
  const { data } = useSWR("/api/funnels/stats", fetcher)
  const cards = [
    { label: "Receita Total", value: data?.revenueTotal ?? "—", icon: DollarSign },
    { label: "Conversão Média", value: data ? `${data.avgConversion}%` : "—", icon: Target },
    { label: "Funis Ativos", value: data?.activeFunnels ?? "—", icon: Zap },
    { label: "Otimizações IA", value: data?.aiOptimizations ?? "—", icon: LineChart },
  ]

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{c.label}</div>
              <div className="flex items-center gap-2 mt-1">
                <c.icon className="h-4 w-4 text-primary" />
                <div className="text-xl font-semibold">{c.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <Button onClick={onOpenWizard}>Criar Novo Funil</Button>
      </div>
    </div>
  )
}
