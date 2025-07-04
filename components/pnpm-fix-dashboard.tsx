"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Copy, Terminal, Github, Package } from "lucide-react"
import { toast } from "sonner"

type LockfileStatus = "sincronizado" | "desatualizado" | "verificando"

const CodeBlock = ({ children }: { children: React.ReactNode }) => {
  const handleCopy = () => {
    if (typeof children === "string") {
      navigator.clipboard.writeText(children)
      toast.success("Comando copiado para a área de transferência!")
    }
  }

  return (
    <div className="relative my-2 rounded-md bg-muted p-4 font-mono text-sm">
      <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-6 w-6" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
      </Button>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  )
}

export default function PnpmFixDashboard() {
  const [status, setStatus] = useState<LockfileStatus>("desatualizado")
  const [logs, setLogs] = useState<string[]>([])

  const runCorrection = () => {
    setStatus("verificando")
    setLogs([])
    const commands = [
      "Verificando versão do pnpm...",
      "pnpm --version -> 8.x.x",
      "Limpando cache do pnpm...",
      "pnpm store prune",
      "Removendo node_modules e lockfiles antigos...",
      "rm -rf node_modules pnpm-lock.yaml package-lock.json",
      "Reinstalando dependências...",
      "pnpm install",
      "Verificando integridade com --frozen-lockfile...",
      "pnpm install --frozen-lockfile",
      "Sucesso! O lockfile foi sincronizado.",
    ]

    let i = 0
    const interval = setInterval(() => {
      if (i < commands.length) {
        setLogs((prev) => [...prev, commands[i]])
        i++
      } else {
        clearInterval(interval)
        setStatus("sincronizado")
        toast.success("Processo de sincronização concluído com sucesso!")
      }
    }, 500)
  }

  const StatusIndicator = () => {
    switch (status) {
      case "sincronizado":
        return (
          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            Sincronizado
          </div>
        )
      case "desatualizado":
        return (
          <div className="flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            Desatualizado
          </div>
        )
      case "verificando":
        return (
          <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <Terminal className="h-4 w-4 animate-pulse" />
            Verificando...
          </div>
        )
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resolvedor de Conflitos `pnpm-lock.yaml`</h1>
          <p className="text-muted-foreground">
            Diagnostique e corrija erros de deploy no Vercel causados por lockfiles desatualizados.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Status do Lockfile:</span>
          <StatusIndicator />
        </div>
      </header>

      <Tabs defaultValue="diagnostico" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="diagnostico">Diagnóstico e Correção</TabsTrigger>
          <TabsTrigger value="manual">Guia Manual</TabsTrigger>
          <TabsTrigger value="prevencao">Prevenção</TabsTrigger>
          <TabsTrigger value="comandos">Comandos Úteis</TabsTrigger>
        </TabsList>

        <TabsContent value="diagnostico" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Diagnóstico do Problema</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant={status === "desatualizado" ? "destructive" : "default"}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Erro Comum: ERR_PNPM_OUTDATED_LOCKFILE</AlertTitle>
                <AlertDescription>
                  Este erro ocorre quando o Vercel detecta que seu arquivo `pnpm-lock.yaml` não está perfeitamente
                  sincronizado com o `package.json`. Por segurança, o Vercel usa o comando `pnpm install
                  --frozen-lockfile`, que falha se houver qualquer inconsistência.
                </AlertDescription>
              </Alert>

              <div className="mt-6">
                <h3 className="mb-2 text-lg font-semibold">Correção Automática (Simulada)</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Clique no botão abaixo para simular o processo de limpeza e resincronização do seu lockfile.
                </p>
                <Button onClick={runCorrection} disabled={status === "verificando"}>
                  <Terminal className="mr-2 h-4 w-4" />
                  {status === "verificando" ? "Executando..." : "Sincronizar Lockfile Agora"}
                </Button>
              </div>

              {logs.length > 0 && (
                <div className="mt-4 rounded-lg bg-muted p-4">
                  <h4 className="mb-2 font-semibold">Log de Execução:</h4>
                  <div className="max-h-60 overflow-y-auto font-mono text-xs">
                    {logs.map((log, index) => (
                      <p key={index} className="flex items-center">
                        <span className="mr-2 text-muted-foreground">{`[${index + 1}]`}</span>
                        <span>{log}</span>
                        {log.startsWith("Sucesso") && <CheckCircle className="ml-2 h-4 w-4 text-green-500" />}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Correção Imediata (Local)</CardTitle>
              <CardDescription>
                Execute estes comandos no seu terminal para atualizar o lockfile e enviar para o seu repositório.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">1. Atualize o lockfile localmente:</p>
              <CodeBlock>pnpm install</CodeBlock>
              <p className="mt-4 text-sm">2. Adicione o arquivo atualizado ao Git e faça o commit:</p>
              <CodeBlock>{`git add pnpm-lock.yaml\ngit commit -m "chore: update pnpm-lock.yaml"`}</CodeBlock>
              <p className="mt-4 text-sm">3. Envie as alterações:</p>
              <CodeBlock>git push</CodeBlock>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Vercel</CardTitle>
              <CardDescription>
                Para evitar o erro, você pode instruir o Vercel a não usar o lockfile congelado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Adicione um arquivo `vercel.json` na raiz do seu projeto com o seguinte conteúdo:
              </p>
              <CodeBlock>{`{
  "installCommand": "pnpm install --no-frozen-lockfile"
}`}</CodeBlock>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Aviso</AlertTitle>
                <AlertDescription>
                  Usar `--no-frozen-lockfile` resolve o erro de deploy, mas pode levar a builds menos consistentes. A
                  melhor prática é manter o lockfile sempre sincronizado.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prevencao" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" /> Scripts no `package.json`
              </CardTitle>
              <CardDescription>
                Adicione scripts para verificar a integridade do lockfile antes de fazer um commit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock>{`{
  "scripts": {
    "verify-lockfile": "pnpm install --frozen-lockfile"
  }
}`}</CodeBlock>
              <p className="mt-2 text-sm text-muted-foreground">
                Você pode integrar isso a um hook de pre-commit usando ferramentas como `husky`.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" /> GitHub Actions
              </CardTitle>
              <CardDescription>
                Use a action oficial do pnpm em seu workflow de CI/CD para garantir a consistência.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock>{`name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 8
      - name: Install dependencies
        run: pnpm install --frozen-lockfile`}</CodeBlock>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comandos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comandos Alternativos do pnpm</CardTitle>
              <CardDescription>Outros comandos úteis para gerenciar suas dependências e lockfile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Forçar atualização do lockfile</h4>
                <p className="text-sm text-muted-foreground mb-1">
                  Ignora o lockfile existente e reinstala as dependências, gerando um novo `pnpm-lock.yaml`.
                </p>
                <CodeBlock>pnpm install --no-frozen-lockfile</CodeBlock>
              </div>
              <div>
                <h4 className="font-semibold">Regenerar apenas o lockfile</h4>
                <p className="text-sm text-muted-foreground mb-1">
                  Atualiza o `pnpm-lock.yaml` sem modificar a pasta `node_modules`.
                </p>
                <CodeBlock>pnpm install --lockfile-only</CodeBlock>
              </div>
              <div>
                <h4 className="font-semibold">Usar npm como fallback</h4>
                <p className="text-sm text-muted-foreground mb-1">
                  Se precisar, você pode usar o npm temporariamente. Lembre-se de remover o `pnpm-lock.yaml`.
                </p>
                <CodeBlock>npm install</CodeBlock>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
