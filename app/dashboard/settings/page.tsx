import { SettingsProvider } from "@/components/dashboard/settings/settings-context"
import { SettingsSidebar } from "@/components/dashboard/settings/settings-sidebar"
import { SettingsContent } from "@/components/dashboard/settings/settings-content"

export default function SettingsPage() {
  return (
    <SettingsProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <h1 className="text-3xl font-semibold">Settings</h1>
          </div>
          <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
            <SettingsSidebar />
            <SettingsContent />
          </div>
        </main>
      </div>
    </SettingsProvider>
  )
}
