"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, LayoutDashboard, BookOpen } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-6">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center rounded-2xl border px-3 py-1 text-xs">
            IceFunnel
          </div>
          <h1 className="text-4xl font-bold tracking-tight">O seu painel para funis de vendas com IA</h1>
          <p className="text-muted-foreground">
            Explore o Dashboard, crie Funis, gerencie Produtos, conecte Webhooks e use ferramentas de IA.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button asChild>
              <Link href="/dashboard" className="inline-flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Abrir Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs/icefunnel" className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Abrir Documentação
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              O que há incluído
            </CardTitle>
            <CardDescription>
              Endpoints REST, gráficos com Recharts, componentes de Funis/Produtos e utilitários de Webhook HMAC.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground grid sm:grid-cols-2 gap-2">
            <div>• /api/metrics, /api/funnels, /api/products, /api/ai/*, /api/webhooks*</div>
            <div>• Assinatura de webhooks via X-IceFunnel-Signature (HMAC-SHA256)</div>
            <div>• SWR para cache/fetch no cliente</div>
            <div>• Design responsivo com shadcn/ui</div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
