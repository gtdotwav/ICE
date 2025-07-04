"use client"

import { ProfileSettings } from "./sections/profile-settings"
import { SecuritySettings } from "./sections/security-settings"
import { NotificationSettings } from "./sections/notification-settings"
import { BillingSettings } from "./sections/billing-settings"
import { IntegrationSettings } from "./sections/integration-settings"
import { TeamSettings } from "./sections/team-settings"
import { AdvancedSettings } from "./sections/advanced-settings"

interface SettingsContentProps {
  activeSection: string
}

export function SettingsContent({ activeSection }: SettingsContentProps) {
  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings />
      case "security":
        return <SecuritySettings />
      case "notifications":
        return <NotificationSettings />
      case "billing":
        return <BillingSettings />
      case "integrations":
        return <IntegrationSettings />
      case "team":
        return <TeamSettings />
      case "advanced":
        return <AdvancedSettings />
      default:
        return <ProfileSettings />
    }
  }

  return <div className="flex-1 p-6 overflow-y-auto">{renderSection()}</div>
}
