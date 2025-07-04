/* Revenue chart (client only) */
"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { date: "01/07", revenue: 2345 },
  { date: "02/07", revenue: 2890 },
  { date: "03/07", revenue: 3120 },
  { date: "04/07", revenue: 2980 },
  { date: "05/07", revenue: 3450 },
  { date: "06/07", revenue: 3890 },
  { date: "07/07", revenue: 4123 },
]

export function RevenueChartClient() {
  return (
    <Card className="bg-background/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Receita nos Últimos 7 Dias</CardTitle>
        <CardDescription>Uma visão geral do crescimento da receita.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `R$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background) / 0.8)",
                  borderColor: "hsl(var(--border))",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
