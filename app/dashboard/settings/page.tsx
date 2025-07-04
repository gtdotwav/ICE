"use client"

import { useState } from "react"
import { SettingsSidebar } from "@/components/dashboard/settings/settings-sidebar"
import { SettingsContent } from "@/components/dashboard/settings/settings-content"
import { SettingsProvider } from "@/components/dashboard/settings/settings-context"

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile")

  return (
    <SettingsProvider>
      <div className="flex h-full min-h-[calc(100vh-4rem)]">
        <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <SettingsContent activeSection={activeSection} />
      </div>
    </SettingsProvider>
  )
}
