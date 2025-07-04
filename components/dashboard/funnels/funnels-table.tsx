"use client"

import { MoreHorizontal, ArrowUpRight, ArrowDownRight, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export interface Funnel {
  id: string
  name: string
  status: "active" | "paused" | "draft"
  revenue: number
  conversion: number
  trend: number
}

interface FunnelsTableProps {
  funnels: Funnel[]
  onOpenWizard: () => void
}

const statusConfig = {
  active: { label: "Ativo", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  paused: { label: "Pausado", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  draft: { label: "Rascunho", className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
}

export function FunnelsTable({ funnels, onOpenWizard }: FunnelsTableProps) {
  const totalRevenue = funnels.reduce((acc, funnel) => acc + funnel.revenue, 0)
  const avgConversion =
    funnels.length > 0 ? funnels.reduce((acc, funnel) => acc + funnel.conversion, 0) / funnels.length : 0

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </div>
            <p className="text-xs text-muted-foreground">+20.1% desde o mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversão Média</CardTitle>
            <span className="text-2xl">🎯</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConversion.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">+2.1% desde a semana passada</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funis Ativos</CardTitle>
            <span className="text-2xl">🚀</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{funnels.filter((f) => f.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Otimizados por IA 24/7</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Otimizações da IA</CardTitle>
            <span className="text-2xl">🤖</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">+1,240</div>
            <p className="text-xs text-primary/80">Ações realizadas nas últimas 24h</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {funnels.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Funil</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="hidden text-right md:table-cell">Receita</TableHead>
                    <TableHead className="hidden text-right lg:table-cell">Conversão</TableHead>
                    <TableHead className="hidden text-right lg:table-cell">Tendência (7d)</TableHead>
                    <TableHead>
                      <span className="sr-only">Ações</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funnels.map((funnel) => (
                    <TableRow key={funnel.id}>
                      <TableCell className="font-medium">{funnel.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={statusConfig[funnel.status as keyof typeof statusConfig].className}
                        >
                          {statusConfig[funnel.status as keyof typeof statusConfig].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-right md:table-cell">
                        {funnel.revenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </TableCell>
                      <TableCell className="hidden text-right lg:table-cell">{funnel.conversion.toFixed(1)}%</TableCell>
                      <TableCell className="hidden text-right lg:table-cell">
                        <span
                          className={`flex items-center justify-end ${funnel.trend > 0 ? "text-green-400" : funnel.trend < 0 ? "text-red-400" : "text-muted-foreground"}`}
                        >
                          {funnel.trend > 0 ? (
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                          ) : funnel.trend < 0 ? (
                            <ArrowDownRight className="h-4 w-4 mr-1" />
                          ) : null}
                          {funnel.trend.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>Ver Analytics</DropdownMenuItem>
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem>Duplicar</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Deletar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-8 sm:p-16 text-center">
              <h3 className="text-xl font-bold">Nenhum funil encontrado</h3>
              <p className="text-muted-foreground">
                Parece que você ainda não criou nenhum funil. Que tal começar agora?
              </p>
              <Button onClick={onOpenWizard} size="lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                Criar seu Primeiro Funil
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
