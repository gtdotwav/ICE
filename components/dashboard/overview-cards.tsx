import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GitFork, Target, Users, DollarSign } from "lucide-react"

const cardData = [
  {
    title: "Funis Ativos",
    value: "12",
    change: "+2.1%",
    icon: GitFork,
  },
  {
    title: "Taxa de Conversão",
    value: "4.82%",
    change: "+18.3%",
    icon: Target,
  },
  {
    title: "Leads Gerados (Mês)",
    value: "1,482",
    change: "+7.2%",
    icon: Users,
  },
  {
    title: "Receita (Mês)",
    value: "R$ 47,392.50",
    change: "+24.9%",
    icon: DollarSign,
  },
]

export function OverviewCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cardData.map((card) => (
        <Card key={card.title} className="bg-background/60 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-green-400">{card.change} vs. mês passado</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
