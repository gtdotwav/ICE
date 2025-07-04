"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Funnel, FunnelChart as FunnelChartComponent, LabelList, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { value: 12540, name: "Visitantes", fill: "#8884d8" },
  { value: 9843, name: "Leads", fill: "#83a6ed" },
  { value: 6432, name: "Qualificados", fill: "#8dd1e1" },
  { value: 2341, name: "Clientes", fill: "hsl(var(--primary))" },
]

export function FunnelChart() {
  return (
    <Card className="bg-background/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Funil de Vendas Principal</CardTitle>
        <CardDescription>Performance do funil este mês.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChartComponent>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background) / 0.8)",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Funnel dataKey="value" data={data} isAnimationActive>
                <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
              </Funnel>
            </FunnelChartComponent>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
