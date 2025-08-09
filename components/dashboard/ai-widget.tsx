"use client"

import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'

const fetcher = (u: string) => fetch(u).then((r) => r.json())

export function AIWidget() {
  const { data } = useSWR("/api/ai/metrics", fetcher)

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold">Métricas IA</span>
          <Badge variant="secondary">Beta</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">Créditos</div>
            <div className="text-lg font-semibold">{data?.credits ?? "—"}</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="text-xs text-muted-foreground">Gerações Hoje</div>
            <div className="text-lg font-semibold">{data?.generationsToday ?? "—"}</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Tempo Economizado
            </div>
            <div className="text-lg font-semibold">{data?.timeSavedHours ?? "—"}h</div>
          </div>
          <div className="rounded-md border p-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              Taxa de Sucesso
            </div>
            <div className="text-lg font-semibold">
              {typeof data?.successRate === "number" ? `${Math.round(data.successRate * 100)}%` : "—"}
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Recomendações: use prompts específicos para melhores resultados.
        </div>
      </CardContent>
    </Card>
  )
}
