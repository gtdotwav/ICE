"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type SettingsContextType = {
  activeSection: string
  setActiveSection: (section: string) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState("profile")

  return <SettingsContext.Provider value={{ activeSection, setActiveSection }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
