"use client"

import { useState } from "react"
import { Settings, Download, Upload, Trash2, AlertTriangle, Database, Shield } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useSettings } from "../settings-context"

export function AdvancedSettings() {
  const { saveSettings, isLoading } = useSettings()
  const [debugMode, setDebugMode] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [exportProgress, setExportProgress] = useState(0)
  const [isExporting, setIsExporting] = useState(false)

  const handleExportData = async () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleDeleteAccount = () => {
    // This would typically open a confirmation dialog
    console.log("Delete account requested")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Configurações Avançadas</h2>
        <p className="text-muted-foreground mt-1">Configurações do sistema e opções avançadas</p>
      </div>

      {/* System Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preferências do Sistema
          </CardTitle>
          <CardDescription>Configure o comportamento avançado da plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Modo de Depuração</Label>
              <p className="text-sm text-muted-foreground">Ativa logs detalhados para diagnóstico de problemas</p>
            </div>
            <Switch checked={debugMode} onCheckedChange={setDebugMode} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Analytics Avançado</Label>
              <p className="text-sm text-muted-foreground">
                Coleta dados detalhados de uso para melhorar a experiência
              </p>
            </div>
            <Switch checked={analyticsEnabled} onCheckedChange={setAnalyticsEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="font-medium">Backup Automático</Label>
              <p className="text-sm text-muted-foreground">Cria backups diários dos seus dados automaticamente</p>
            </div>
            <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Gerenciamento de Dados
          </CardTitle>
          <CardDescription>Exporte, importe e gerencie seus dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="font-medium">Exportar Todos os Dados</div>
                <div className="text-sm text-muted-foreground">
                  Baixe um arquivo com todos os seus funis, produtos e configurações
                </div>
              </div>
              <Button variant="outline" onClick={handleExportData} disabled={isExporting}>
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exportando..." : "Exportar"}
              </Button>
            </div>

            {isExporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso da exportação</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} />
              </div>
            )}

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="font-medium">Importar Dados</div>
                <div className="text-sm text-muted-foreground">Restaure dados de um backup anterior</div>
              </div>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="font-medium">Backup Manual</div>
                <div className="text-sm text-muted-foreground">Crie um backup dos seus dados agora</div>
              </div>
              <Button variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Criar Backup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & GDPR */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacidade e LGPD
          </CardTitle>
          <CardDescription>Configurações de privacidade e conformidade</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <div className="font-medium">Baixar Meus Dados</div>
                <div className="text-sm text-muted-foreground">Exercer seu direito de portabilidade</div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <div className="font-medium">Política de Privacidade</div>
                <div className="text-sm text-muted-foreground">Leia nossa política atualizada</div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <div className="font-medium">Termos de Uso</div>
                <div className="text-sm text-muted-foreground">Consulte os termos de serviço</div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
              <div className="text-left">
                <div className="font-medium">Configurar Cookies</div>
                <div className="text-sm text-muted-foreground">Gerencie preferências de cookies</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>Ações irreversíveis que afetam permanentemente sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-destructive/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              As ações abaixo são permanentes e não podem ser desfeitas. Proceda com extrema cautela.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
              <div className="space-y-1">
                <div className="font-medium">Limpar Todos os Dados</div>
                <div className="text-sm text-muted-foreground">
                  Remove todos os funis, produtos e dados, mas mantém a conta
                </div>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Dados
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
              <div className="space-y-1">
                <div className="font-medium">Excluir Conta Permanentemente</div>
                <div className="text-sm text-muted-foreground">
                  Remove sua conta e todos os dados associados para sempre
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Conta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => saveSettings({ advanced: { debugMode, analyticsEnabled, autoBackup } })}
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  )
}
