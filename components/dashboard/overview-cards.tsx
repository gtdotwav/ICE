import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Zap } from "lucide-react"

const stats = [
  {
    title: "Receita Total",
    value: "R$ 45.231",
    change: "+20.1%",
    icon: DollarSign,
  },
  {
    title: "Conversões",
    value: "2.350",
    change: "+180.1%",
    icon: TrendingUp,
  },
  {
    title: "Visitantes",
    value: "12.234",
    change: "+19%",
    icon: Users,
  },
  {
    title: "Funis Ativos",
    value: "8",
    change: "+2",
    icon: Zap,
  },
]

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change} em relação ao mês passado</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
