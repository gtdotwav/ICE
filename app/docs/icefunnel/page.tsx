"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

const content = `
${"Resumo do SaaS IceFunnel"}
IceFunnel é um dashboard SaaS para otimização de funis de vendas com IA. As páginas principais são:
- Dashboard: métricas chave (receita, conversões, visitantes, taxa de conversão), gráficos de linha e funil, ações de Atualizar/Filtros/Exportar.
- Funis: estatísticas agregadas, tabela de funis com Nome, Status, Receita, Conversão e Tendência; criação/edição com fluxo guiado.
- Produtos: cards de produto com imagem, status, filtros/ordenação/busca e página de edição com validação.
- IA: biblioteca de ferramentas (copywriter, imagens, vídeos, e-mail) com sistema de créditos e métricas.
- Webhooks: saída/entrada, criação de endpoints, logs e reenvio manual, validação de assinatura.
- Configurações: Perfil & Conta, Segurança, Notificações, Cobrança, Integrações, Equipe, Avançado.

${"Arquitetura e práticas"}
- Next.js App Router, RSC e server actions quando apropriado.
- TypeScript e Tailwind; componentes shadcn/ui; acessibilidade e responsividade.
- SWR/React Query para dados; toasts/alerts para erros; loading states/esqueletos.

${"APIs (propostas)"}
- /api/metrics, /api/funnels, /api/products, /api/ai/*, /api/webhooks*, /api/users/me, /api/security, /api/notifications, /api/billing/*, /api/api-keys*, /api/team/*

${"Webhooks"}
- Envio com cabeçalho X-IceFunnel-Signature HMAC-SHA256(body, secret).
- Eventos: funnel.created/updated/deleted, product.*, conversion.completed, lead.qualified, user.registered, ai.generation.completed, payment.succeeded/failed, webhook.retry.
- Entrada: crm.lead.*, payment.subscription.updated, email.bounced.

${"Segurança"}
- Autenticação, RBAC, sanitização, limites de taxa, testes, OpenAPI.

${"Entregáveis"}
- Código completo, docs, openapi.yaml, design responsivo, testes e comentários.
`

function useTOC(md: string) {
  return useMemo(() => {
    const lines = md.split("\n")
    const sections: { id: string; title: string }[] = []
    lines.forEach((l) => {
      if (!l.trim()) return
      if (/^[A-Za-zÁ-ú0-9]/.test(l) && l.length < 80) {
        const id = l.toLowerCase().replace(/[^\w]+/g, "-")
        sections.push({ id, title: l })
      }
    })
    return sections
  }, [md])
}

export default function IceFunnelDocs() {
  const [hash, setHash] = useState<string>("")
  const toc = useTOC(content)

  useEffect(() => {
    const onHash = () => setHash(window.location.hash.replace("#", ""))
    onHash()
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])

  return (
    <main className="min-h-[100dvh] grid lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:block border-r p-4">
        <div className="sticky top-4">
          <h2 className="text-sm font-semibold mb-2">Sumário</h2>
          <nav className="space-y-1 text-sm">
            {toc.map((s) => (
              <Link
                key={s.id}
                href={`#${s.id}`}
                className={`block rounded px-2 py-1 hover:bg-muted ${
                  hash === s.id ? "bg-muted font-medium" : ""
                }`}
              >
                {s.title}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <section className="p-4 lg:p-8">
        <div className="max-w-3xl space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Documentação IceFunnel</h1>
            <div className="flex gap-2">
              <Button asChild variant="outline">
                <Link href="/dashboard">Abrir Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/">Início</Link>
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo e Especificação</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[70dvh] pr-4">
                <article className="prose prose-invert max-w-none">
                  {content.split("\n").map((line, idx) => {
                    const id = line.toLowerCase().replace(/[^\w]+/g, "-")
                    const isHeading =
                      /^[A-Za-zÁ-ú0-9]/.test(line) && line.length < 80 && !line.startsWith("- ")
                    if (!line.trim()) return <Separator key={idx} className="my-3 opacity-20" />
                    if (isHeading) {
                      return (
                        <h2 key={idx} id={id} className="scroll-mt-24">
                          {line}
                        </h2>
                      )
                    }
                    if (line.startsWith("- ")) {
                      return <p key={idx}>{line}</p>
                    }
                    return <p key={idx}>{line}</p>
                  })}
                </article>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
