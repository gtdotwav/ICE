"use client"

import { cn } from "@/lib/utils"
import { User, Shield, Bell, CreditCard, Plug, Users, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SettingsSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const settingsSections = [
  {
    id: "profile",
    label: "Perfil & Conta",
    icon: User,
    description: "Informações pessoais e preferências",
  },
  {
    id: "security",
    label: "Segurança",
    icon: Shield,
    description: "Senha, 2FA e sessões ativas",
    badge: "2FA",
  },
  {
    id: "notifications",
    label: "Notificações",
    icon: Bell,
    description: "Email, push e preferências",
  },
  {
    id: "billing",
    label: "Cobrança",
    icon: CreditCard,
    description: "Planos, pagamentos e faturas",
  },
  {
    id: "integrations",
    label: "Integrações",
    icon: Plug,
    description: "APIs, webhooks e conexões",
  },
  {
    id: "team",
    label: "Equipe",
    icon: Users,
    description: "Membros e permissões",
  },
  {
    id: "advanced",
    label: "Avançado",
    icon: Settings,
    description: "Configurações do sistema",
  },
]

export function SettingsSidebar({ activeSection, onSectionChange }: SettingsSidebarProps) {
  return (
    <div className="w-80 border-r bg-muted/30 p-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Configurações</h2>
        <p className="text-sm text-muted-foreground">Gerencie sua conta e preferências</p>
      </div>

      <nav className="mt-8 space-y-2">
        {settingsSections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "w-full flex items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent",
                isActive && "bg-accent border-l-4 border-l-primary",
              )}
            >
              <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn("font-medium text-sm", isActive ? "text-foreground" : "text-muted-foreground")}>
                    {section.label}
                  </span>
                  {section.badge && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      {section.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </div>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
