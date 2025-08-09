"use client"

import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreVertical, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export type Funnel = {
  id: string
  name: string
  status: "active" | "paused" | "draft"
  revenue: number
  conversion: number
  trend: number
}

const fetcher = (u: string) => fetch(u).then((r) => r.json())

export function FunnelsTable({ onOpenWizard }: { onOpenWizard: () => void }) {
  const { data, mutate, isLoading } = useSWR("/api/funnels", fetcher)

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3">Nome</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Receita</th>
                <th className="text-right p-3">Conversão</th>
                <th className="text-right p-3">Tendência</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              )}
              {data?.items?.map((f: Funnel) => (
                <tr key={f.id} className="border-t">
                  <td className="p-3">{f.name}</td>
                  <td className="p-3 capitalize">{f.status}</td>
                  <td className="p-3 text-right">R$ {f.revenue.toLocaleString("pt-BR")}</td>
                  <td className="p-3 text-right">{f.conversion}%</td>
                  <td className="p-3 text-right">
                    <span className={f.trend >= 0 ? "text-green-500" : "text-red-500"} />
                    <div className="inline-flex items-center gap-1">
                      {f.trend >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                      {f.trend}%
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Total: {data?.total ?? 0}</div>
          <Button variant="outline" onClick={() => mutate()}>Atualizar</Button>
        </div>
      </CardContent>
    </Card>
  )
}
