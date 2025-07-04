"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target } from "lucide-react"

const cards = [
  {
    title: "Receita Total",
    value: "R$ 45.231,89",
    change: "+20.1%",
    trend: "up" as const,
    icon: DollarSign,
    description: "vs mês anterior",
  },
  {
    title: "Usuários Ativos",
    value: "2.350",
    change: "+180.1%",
    trend: "up" as const,
    icon: Users,
    description: "vs mês anterior",
  },
  {
    title: "Vendas",
    value: "12.234",
    change: "+19%",
    trend: "up" as const,
    icon: ShoppingCart,
    description: "vs mês anterior",
  },
  {
    title: "Taxa de Conversão",
    value: "3.24%",
    change: "-4.3%",
    trend: "down" as const,
    icon: Target,
    description: "vs mês anterior",
  },
]

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className="glass-card-hover transition-all duration-300 hover:scale-[1.02]"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text mb-2">{card.value}</div>
            <div className="flex items-center gap-2">
              <Badge
                variant={card.trend === "up" ? "default" : "destructive"}
                className={`flex items-center gap-1 ${
                  card.trend === "up"
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                }`}
              >
                {card.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {card.change}
              </Badge>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
