"use client"

import { useSettings } from "./settings-context"
import { ProfileSettings } from "./sections/profile-settings"
import { SecuritySettings } from "./sections/security-settings"
import { NotificationSettings } from "./sections/notification-settings"
import { PrivacySettings } from "./sections/privacy-settings"
import { BillingSettings } from "./sections/billing-settings"
import { IntegrationSettings } from "./sections/integration-settings"
import { TeamSettings } from "./sections/team-settings"
import { AdvancedSettings } from "./sections/advanced-settings"

export function SettingsContent() {
  const { activeSection } = useSettings()

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings />
      case "security":
        return <SecuritySettings />
      case "notifications":
        return <NotificationSettings />
      case "privacy":
        return <PrivacySettings />
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

  return <div className="grid gap-6">{renderSection()}</div>
}
