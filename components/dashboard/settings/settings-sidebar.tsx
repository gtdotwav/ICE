"use client"

import { useSettings } from "./settings-context"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sections = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "notifications", label: "Notifications" },
  { id: "privacy", label: "Privacy" },
  { id: "billing", label: "Billing" },
  { id: "integrations", label: "Integrations" },
  { id: "team", label: "Team Management" },
  { id: "advanced", label: "Advanced" },
]

export function SettingsSidebar() {
  const { activeSection, setActiveSection } = useSettings()

  return (
    <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant="ghost"
          onClick={() => setActiveSection(section.id)}
          className={cn(
            "justify-start px-3",
            activeSection === section.id
              ? "bg-muted font-semibold text-primary hover:bg-muted"
              : "hover:bg-transparent hover:underline",
          )}
        >
          {section.label}
        </Button>
      ))}
    </nav>
  )
}
