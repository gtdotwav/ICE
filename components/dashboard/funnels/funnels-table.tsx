"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Bot,
  Zap,
  Users,
  DollarSign,
  MousePointer,
  BarChart3,
  PlusCircle,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for funnels
const funnels = [
  {
    id: "1",
    name: "Lançamento Ebook IA",
    status: "active",
    visitors: 2847,
    conversions: 423,
    conversionRate: 14.9,
    revenue: 8460,
    trend: "up",
    lastUpdated: "2 horas atrás",
    aiOptimizing: true,
    template: "AIDA",
  },
  {
    id: "2",
    name: "Webinar Marketing Digital",
    status: "active",
    visitors: 1523,
    conversions: 187,
    conversionRate: 12.3,
    revenue: 14960,
    trend: "up",
    lastUpdated: "5 horas atrás",
    aiOptimizing: false,
    template: "Webinar",
  },
  {
    id: "3",
    name: "Curso Automação",
    status: "paused",
    visitors: 892,
    conversions: 67,
    conversionRate: 7.5,
    revenue: 3350,
    trend: "down",
    lastUpdated: "1 dia atrás",
    aiOptimizing: false,
    template: "Lead Magnet",
  },
  {
    id: "4",
    name: "Consultoria Premium",
    status: "draft",
    visitors: 0,
    conversions: 0,
    conversionRate: 0,
    revenue: 0,
    trend: "neutral",
    lastUpdated: "3 dias atrás",
    aiOptimizing: false,
    template: "Personalizado",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Ativo</Badge>
    case "paused":
      return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Pausado</Badge>
    case "draft":
      return <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/30">Rascunho</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getTrendIcon = (trend: string, value: number) => {
  if (trend === "up") {
    return <TrendingUp className="h-4 w-4 text-green-500" />
  } else if (trend === "down") {
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }
  return <Minus className="h-4 w-4 text-gray-500" />
}

export function FunnelsTable() {
  const [selectedFunnel, setSelectedFunnel] = useState<string | null>(null)

  if (funnels.length === 0) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-6">
            <BarChart3 className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Nenhum funil criado ainda</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Comece criando seu primeiro funil de vendas com nossa IA. É rápido, fácil e otimizado para conversão.
          </p>
          <Button size="lg" className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Criar Primeiro Funil
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visitantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,262</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12.5%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">677</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8.2%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.9%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+2.1%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 26.770</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+15.3%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Funnels Table */}
      <Card>
        <CardHeader>
          <CardTitle>Seus Funis de Venda</CardTitle>
          <CardDescription>Gerencie e monitore o desempenho dos seus funis de conversão</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Funil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visitantes</TableHead>
                  <TableHead>Conversões</TableHead>
                  <TableHead>Taxa de Conversão</TableHead>
                  <TableHead>Receita</TableHead>
                  <TableHead>Última Atualização</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funnels.map((funnel) => (
                  <TableRow
                    key={funnel.id}
                    className={cn(
                      "cursor-pointer hover:bg-muted/50 transition-colors",
                      selectedFunnel === funnel.id && "bg-muted/50",
                    )}
                    onClick={() => setSelectedFunnel(funnel.id)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-semibold">{funnel.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            {funnel.template}
                            {funnel.aiOptimizing && (
                              <Badge
                                variant="outline"
                                className="bg-blue-500/10 text-blue-400 border-blue-500/30 text-xs"
                              >
                                <Bot className="h-3 w-3 mr-1" />
                                IA Otimizando
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(funnel.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{funnel.visitors.toLocaleString()}</span>
                        {getTrendIcon(funnel.trend, funnel.visitors)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{funnel.conversions.toLocaleString()}</span>
                        {getTrendIcon(funnel.trend, funnel.conversions)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-medium",
                            funnel.conversionRate > 10
                              ? "text-green-600"
                              : funnel.conversionRate > 5
                                ? "text-yellow-600"
                                : "text-red-600",
                          )}
                        >
                          {funnel.conversionRate}%
                        </span>
                        {getTrendIcon(funnel.trend, funnel.conversionRate)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">R$ {funnel.revenue.toLocaleString()}</span>
                        {getTrendIcon(funnel.trend, funnel.revenue)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{funnel.lastUpdated}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            <Zap className="mr-2 h-4 w-4" />
                            Otimizar com IA
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* AI Optimization Banner */}
      <Card className="border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-blue-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-200 mb-2">Otimização Automática com IA</h3>
              <p className="text-sm text-blue-300 mb-4">
                Nossa IA está constantemente analisando e otimizando seus funis para melhor performance. Receba
                sugestões personalizadas e implementações automáticas.
              </p>
              <Button
                variant="outline"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent"
              >
                <Bot className="mr-2 h-4 w-4" />
                Ver Relatório de IA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
