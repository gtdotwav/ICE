"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from "recharts"

const data = [
  { name: "Jan", value: 4000, previous: 3200 },
  { name: "Fev", value: 3000, previous: 2800 },
  { name: "Mar", value: 5000, previous: 4200 },
  { name: "Abr", value: 4500, previous: 3800 },
  { name: "Mai", value: 6000, previous: 5200 },
  { name: "Jun", value: 5500, previous: 4800 },
  { name: "Jul", value: 7200, previous: 6100 },
]

export function RevenueChart() {
  return (
    <Card className="bg-background/40 backdrop-blur-xl border-white/10 hover:bg-background/60 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Receita
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
        </CardTitle>
        <CardDescription>Evolução da receita nos últimos 7 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background) / 0.95)",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                backdropFilter: "blur(12px)",
              }}
              formatter={(value: number, name: string) => [
                `R$${value.toLocaleString()}`,
                name === "value" ? "Este ano" : "Ano passado",
              ]}
            />
            <Area
              type="monotone"
              dataKey="previous"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              fill="url(#colorPrevious)"
              strokeDasharray="5 5"
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
