"use client"
import { CreditCard, Download, Calendar, TrendingUp, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSettings } from "../settings-context"

const currentPlan = {
  name: "Pro",
  price: 97,
  currency: "R$",
  billing: "monthly",
  renewsAt: "2024-02-20",
  features: ["Funis ilimitados", "10.000 visitantes/mês", "Integrações avançadas", "Suporte prioritário"],
}

const usage = {
  visitors: { current: 7500, limit: 10000 },
  funnels: { current: 12, limit: null },
  storage: { current: 2.3, limit: 10 },
  apiCalls: { current: 45000, limit: 100000 },
}

const paymentMethods = [
  {
    id: 1,
    type: "card",
    brand: "Visa",
    last4: "4242",
    expiresAt: "12/25",
    isDefault: true,
  },
  {
    id: 2,
    type: "card",
    brand: "Mastercard",
    last4: "8888",
    expiresAt: "08/26",
    isDefault: false,
  },
]

const invoices = [
  {
    id: "INV-2024-001",
    date: "2024-01-20",
    amount: 97,
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "INV-2023-012",
    date: "2023-12-20",
    amount: 97,
    status: "paid",
    downloadUrl: "#",
  },
  {
    id: "INV-2023-011",
    date: "2023-11-20",
    amount: 97,
    status: "paid",
    downloadUrl: "#",
  },
]

export function BillingSettings() {
  const { saveSettings, isLoading } = useSettings()

  const getUsagePercentage = (current: number, limit: number | null) => {
    if (!limit) return 0
    return (current / limit) * 100
  }

  const formatUsage = (current: number, limit: number | null, unit: string) => {
    if (!limit) return `${current} ${unit}`
    return `${current.toLocaleString()} / ${limit.toLocaleString()} ${unit}`
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Cobrança</h2>
        <p className="text-muted-foreground mt-1">Gerencie seu plano, pagamentos e faturas</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Plano Atual</span>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {currentPlan.name}
            </Badge>
          </CardTitle>
          <CardDescription>
            Renovação automática em {new Date(currentPlan.renewsAt).toLocaleDateString("pt-BR")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">
                {currentPlan.currency}
                {currentPlan.price}
                <span className="text-lg font-normal text-muted-foreground">
                  /{currentPlan.billing === "monthly" ? "mês" : "ano"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Cobrança automática no cartão terminado em {paymentMethods.find((p) => p.isDefault)?.last4}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Alterar Plano</Button>
              <Button variant="outline">Cancelar</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="text-sm text-muted-foreground">
                ✓ {feature}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Uso Atual
          </CardTitle>
          <CardDescription>Acompanhe seu consumo mensal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Visitantes únicos</span>
                <span>{formatUsage(usage.visitors.current, usage.visitors.limit, "visitantes")}</span>
              </div>
              <Progress value={getUsagePercentage(usage.visitors.current, usage.visitors.limit)} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Armazenamento</span>
                <span>{formatUsage(usage.storage.current, usage.storage.limit, "GB")}</span>
              </div>
              <Progress value={getUsagePercentage(usage.storage.current, usage.storage.limit)} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Chamadas de API</span>
                <span>{formatUsage(usage.apiCalls.current, usage.apiCalls.limit, "chamadas")}</span>
              </div>
              <Progress value={getUsagePercentage(usage.apiCalls.current, usage.apiCalls.limit)} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Funis ativos</span>
                <span>{usage.funnels.current} funis</span>
              </div>
              <div className="text-xs text-muted-foreground">Ilimitado no plano Pro</div>
            </div>
          </div>

          {getUsagePercentage(usage.visitors.current, usage.visitors.limit) > 80 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Você está próximo do limite de visitantes. Considere fazer upgrade do seu plano.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Métodos de Pagamento
          </CardTitle>
          <CardDescription>Gerencie seus cartões e formas de pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-8 w-12 bg-muted rounded flex items-center justify-center text-xs font-medium">
                  {method.brand}
                </div>
                <div>
                  <div className="font-medium">•••• •••• •••• {method.last4}</div>
                  <div className="text-sm text-muted-foreground">Expira em {method.expiresAt}</div>
                </div>
                {method.isDefault && <Badge variant="secondary">Padrão</Badge>}
              </div>
              <div className="flex gap-2">
                {!method.isDefault && (
                  <Button variant="outline" size="sm">
                    Tornar Padrão
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  Remover
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full bg-transparent">
            <CreditCard className="h-4 w-4 mr-2" />
            Adicionar Método de Pagamento
          </Button>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Histórico de Cobrança
          </CardTitle>
          <CardDescription>Suas faturas e comprovantes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="font-medium">{invoice.id}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(invoice.date).toLocaleDateString("pt-BR")}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-medium">R$ {invoice.amount}</div>
                  <Badge variant={invoice.status === "paid" ? "secondary" : "destructive"}>
                    {invoice.status === "paid" ? "Pago" : "Pendente"}
                  </Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}

          <Button variant="outline" className="w-full bg-transparent">
            Ver Histórico Completo
          </Button>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço de Cobrança</CardTitle>
          <CardDescription>Informações para suas faturas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="font-medium">Minha Empresa Ltda</div>
              <div className="text-sm text-muted-foreground">CNPJ: 12.345.678/0001-90</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Rua das Flores, 123
                <br />
                São Paulo, SP - 01234-567
                <br />
                Brasil
              </div>
            </div>
          </div>
          <Button variant="outline">Editar Endereço</Button>
        </CardContent>
      </Card>
    </div>
  )
}
