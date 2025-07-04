"use client"

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Jan", value: 4000, previous: 2400 },
  { name: "Fev", value: 3000, previous: 1398 },
  { name: "Mar", value: 2000, previous: 9800 },
  { name: "Abr", value: 2780, previous: 3908 },
  { name: "Mai", value: 1890, previous: 4800 },
  { name: "Jun", value: 2390, previous: 3800 },
  { name: "Jul", value: 3490, previous: 4300 },
  { name: "Ago", value: 4000, previous: 2400 },
  { name: "Set", value: 3000, previous: 1398 },
  { name: "Out", value: 2000, previous: 9800 },
  { name: "Nov", value: 2780, previous: 3908 },
  { name: "Dez", value: 1890, previous: 4800 },
]

export function RevenueChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickFormatter={(value) => `R$ ${value}`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="glass-card border-white/10 p-3 shadow-lg">
                    <p className="text-sm font-medium">{label}</p>
                    <div className="space-y-1 mt-2">
                      <p className="text-sm text-primary">Atual: R$ {payload[0]?.value?.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        Anterior: R$ {payload[1]?.value?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )
              }
              return null
            }}
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
            strokeWidth={2}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
