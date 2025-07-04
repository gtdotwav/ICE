import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Acompanhe o desempenho dos seus funis em tempo real</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Analytics Dashboard</CardTitle>
            </div>
            <CardDescription>Visualize métricas detalhadas dos seus funis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 mb-4" />
                <p>Analytics em desenvolvimento</p>
                <p className="text-sm">Em breve você terá acesso a métricas avançadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
