import { DollarSign, Package, ShoppingCart, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsCards() {
  const stats = [
    {
      title: "Receita (30d)",
      value: "R$ 12.345,67",
      icon: DollarSign,
      change: "+5.2%",
    },
    {
      title: "Vendas (30d)",
      value: "342",
      icon: ShoppingCart,
      change: "+12.1%",
    },
    {
      title: "Produtos Ativos",
      value: "12",
      icon: Package,
      change: "2",
      changeType: "new",
    },
    {
      title: "Em Rascunho",
      value: "3",
      icon: FileText,
      change: "",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.change && (
              <p className="text-xs text-muted-foreground">
                {stat.changeType !== "new" && `${stat.change} desde o último mês`}
                {stat.changeType === "new" && `${stat.change} novos este mês`}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
