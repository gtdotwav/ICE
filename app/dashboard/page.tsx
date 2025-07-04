"use client"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { FunnelChart } from "@/components/dashboard/funnel-chart"
import { AIWidget } from "@/components/dashboard/ai-widget"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const quickStats = [
    {
      title: "Receita Total",
      value: "R$ 45.231",
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Conversões",
      value: "2.350",
      change: "+15.3%",
      trend: "up",
      icon: Target,
      color: "text-blue-500",
    },
    {
      title: "Visitantes",
      value: "12.234",
      change: "-2.4%",
      trend: "down",
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Taxa de Conversão",
      value: "3.24%",
      change: "+0.8%",
      trend: "up",
      icon: Activity,
      color: "text-orange-500",
    },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-8 bg-white/10 rounded w-1/2 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/4" />
            </div>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="glass-card p-6 lg:col-span-4">
            <div className="h-64 bg-white/10 rounded" />
          </div>
          <div className="glass-card p-6 lg:col-span-3">
            <div className="h-64 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Bem-vindo de volta!</h2>
          <p className="text-muted-foreground">Aqui está um resumo da sua performance hoje.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="glass-button bg-transparent"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button variant="outline" size="sm" className="glass-button bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" className="glass-button bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card
            key={stat.title}
            className="glass-card-hover cursor-pointer group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div
                className={`p-2 rounded-lg bg-white/5 ${stat.color} group-hover:scale-110 transition-transform duration-200`}
              >
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                <span className="text-muted-foreground ml-1">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="glass-card lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="gradient-text">Receita</CardTitle>
                <CardDescription>Performance de receita nos últimos 12 meses</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-3">
          <CardHeader>
            <CardTitle className="gradient-text">Funil de Conversão</CardTitle>
            <CardDescription>Taxa de conversão por etapa</CardDescription>
          </CardHeader>
          <CardContent>
            <FunnelChart />
          </CardContent>
        </Card>
      </div>

      {/* Secondary Content */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="gradient-text">Atividade Recente</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="gradient-text flex items-center gap-2">
              IA Assistant
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                Beta
              </Badge>
            </CardTitle>
            <CardDescription>Insights e recomendações personalizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <AIWidget />
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-text">Metas do Mês</CardTitle>
              <CardDescription>Progresso das suas metas mensais</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="glass-button bg-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              Este mês
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Receita</span>
                <span className="font-medium">R$ 45.231 / R$ 50.000</span>
              </div>
              <Progress value={90} className="h-2" />
              <p className="text-xs text-muted-foreground">90% da meta atingida</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Conversões</span>
                <span className="font-medium">2.350 / 3.000</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">78% da meta atingida</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Novos Clientes</span>
                <span className="font-medium">156 / 200</span>
              </div>
              <Progress value={78} className="h-2" />
              <p className="text-xs text-muted-foreground">78% da meta atingida</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
