import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react"

const stats = [
  {
    title: "Receita Total",
    value: "R$ 45.231",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-400",
  },
  {
    title: "Conversões",
    value: "2.350",
    change: "+180.1%",
    trend: "up",
    icon: TrendingUp,
    color: "text-blue-400",
  },
  {
    title: "Visitantes",
    value: "12.234",
    change: "+19%",
    trend: "up",
    icon: Users,
    color: "text-purple-400",
  },
  {
    title: "Funis Ativos",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Zap,
    color: "text-primary",
  },
]

export function OverviewCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="bg-background/40 backdrop-blur-xl border-white/10 hover:bg-background/60 transition-all duration-300 group"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all duration-300`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="flex items-center text-sm">
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-400 mr-1" />
              )}
              <span className={stat.trend === "up" ? "text-green-400" : "text-red-400"}>{stat.change}</span>
              <span className="text-muted-foreground ml-1">vs. mês passado</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
