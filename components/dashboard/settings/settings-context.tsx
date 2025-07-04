"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { toast } from "@/hooks/use-toast"

interface SettingsContextType {
  isLoading: boolean
  unsavedChanges: boolean
  saveSettings: (data: any) => Promise<void>
  setUnsavedChanges: (hasChanges: boolean) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  const saveSettings = useCallback(async (data: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Configurações salvas",
        description: "Suas alterações foram salvas com sucesso.",
      })
      setUnsavedChanges(false)
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas configurações. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <SettingsContext.Provider
      value={{
        isLoading,
        unsavedChanges,
        saveSettings,
        setUnsavedChanges,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
