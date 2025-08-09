"use client"

import { Card, CardContent } from "@/components/ui/card"

export function StatsCards() {
  const items = [
    { label: "Produtos", value: 3 },
    { label: "Ativos", value: 2 },
    { label: "Rascunhos", value: 1 },
  ]
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((i) => (
        <Card key={i.label}>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground">{i.label}</div>
            <div className="text-xl font-semibold">{i.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
