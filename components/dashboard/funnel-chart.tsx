"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

const funnelData = [
  {
    stage: "Visitantes",
    value: 10000,
    percentage: 100,
    change: "+5.2%",
    trend: "up" as const,
    color: "bg-blue-500",
  },
  {
    stage: "Leads",
    value: 2500,
    percentage: 25,
    change: "+12.1%",
    trend: "up" as const,
    color: "bg-green-500",
  },
  {
    stage: "Prospects",
    value: 750,
    percentage: 7.5,
    change: "-2.3%",
    trend: "down" as const,
    color: "bg-yellow-500",
  },
  {
    stage: "Clientes",
    value: 150,
    percentage: 1.5,
    change: "+8.7%",
    trend: "up" as const,
    color: "bg-purple-500",
  },
]

export function FunnelChart() {
  return (
    <div className="space-y-4">
      {funnelData.map((stage, index) => (
        <div key={stage.stage} className="space-y-2 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stage.color}`} />
              <span className="font-medium">{stage.stage}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{stage.value.toLocaleString()}</span>
              <Badge
                variant={stage.trend === "up" ? "default" : "destructive"}
                className={`flex items-center gap-1 text-xs ${
                  stage.trend === "up" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                {stage.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stage.change}
              </Badge>
            </div>
          </div>
          <div className="space-y-1">
            <Progress
              value={stage.percentage}
              className="h-2"
              style={{
                background: `linear-gradient(to right, ${stage.color.replace("bg-", "rgb(var(--")} / 0.2), transparent)`,
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stage.percentage}% do total</span>
              <span>Taxa de conversão</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
