import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Faturamento</h1>
        <p className="text-muted-foreground">Gerencie sua assinatura e métodos de pagamento</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle>Faturamento e Pagamentos</CardTitle>
            </div>
            <CardDescription>Visualize faturas e atualize informações de pagamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <CreditCard className="mx-auto h-12 w-12 mb-4" />
                <p>Sistema de faturamento em desenvolvimento</p>
                <p className="text-sm">Em breve você terá acesso completo ao faturamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
