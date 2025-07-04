import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, DollarSign, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react"

const stats = [
  {
    title: "Receita Total",
    value: "R$ 45.231",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    description: "vs. mês passado",
  },
  {
    title: "Conversões",
    value: "2.350",
    change: "+180.1%",
    trend: "up",
    icon: TrendingUp,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    description: "leads convertidos",
  },
  {
    title: "Visitantes",
    value: "12.234",
    change: "+19%",
    trend: "up",
    icon: Users,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    description: "visitantes únicos",
  },
  {
    title: "Funis Ativos",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Zap,
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "funis em execução",
  },
]

export function OverviewCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className="glass-card-hover group animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-200`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-400" />
                )}
                <Badge
                  variant="outline"
                  className={`text-xs ${stat.trend === "up" ? "text-green-400 border-green-400/30" : "text-red-400 border-red-400/30"}`}
                >
                  {stat.change}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
