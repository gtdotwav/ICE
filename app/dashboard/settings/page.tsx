"use client"

import { useState } from "react"
import { SettingsSidebar } from "@/components/dashboard/settings/settings-sidebar"
import { SettingsContent } from "@/components/dashboard/settings/settings-content"
import { SettingsProvider } from "@/components/dashboard/settings/settings-context"

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile")

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Configurações
        </h1>
        <p className="text-lg text-muted-foreground">Gerencie suas preferências e configurações da conta.</p>
      </div>

      <SettingsProvider>
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          </div>
          <div className="lg:col-span-3">
            <SettingsContent activeSection={activeSection} />
          </div>
        </div>
      </SettingsProvider>
    </div>
  )
}
