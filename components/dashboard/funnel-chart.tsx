"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts"

const data = [
  { name: "Visitantes", value: 1000, percentage: 100 },
  { name: "Leads", value: 400, percentage: 40 },
  { name: "Prospects", value: 200, percentage: 20 },
  { name: "Clientes", value: 50, percentage: 5 },
]

const colors = ["hsl(var(--primary))", "hsl(180 90% 65%)", "hsl(260 70% 60%)", "hsl(140 70% 50%)"]

export function FunnelChart() {
  return (
    <Card className="bg-background/40 backdrop-blur-xl border-white/10 hover:bg-background/60 transition-all duration-300">
      <CardHeader>
        <CardTitle>Funil de Conversão</CardTitle>
        <CardDescription>Taxa de conversão por etapa do funil principal</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background) / 0.95)",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                backdropFilter: "blur(12px)",
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} (${props.payload.percentage}%)`,
                "Conversões",
              ]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
