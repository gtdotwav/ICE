"use client"

import type React from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Menu,
  Plus,
  Command,
  Moon,
  Sun,
  Monitor,
  Keyboard,
  X,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { DashboardSidebar } from "./sidebar"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface DashboardHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
    variant?: "default" | "secondary" | "outline"
  }
}

export function DashboardHeader({ title, description, breadcrumbs, action }: DashboardHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [notifications] = useState(3)
  const pathname = usePathname()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape") {
        setSearchOpen(false)
        setSearchValue("")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSearch = (value: string) => {
    setSearchValue(value)
    // Implement search logic here
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-card backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden glass-button hover:scale-110 transition-all duration-200"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 glass-card border-white/10 w-64">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                {/* Logo in mobile sidebar */}
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8">
                    <Image src="/ice-logo.png" alt="IceFunnel" width={32} height={32} className="object-contain" />
                  </div>
                  <span className="text-lg font-semibold">IceFunnel</span>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>
              <DashboardSidebar />
            </SheetContent>
          </Sheet>

          {/* Desktop Logo - Hidden on mobile, shown on larger screens */}
          <div className="hidden lg:flex items-center gap-3 mr-6">
            <div className="relative h-10 w-10 glass-card backdrop-blur-sm border border-white/10 rounded-xl p-1.5">
              <Image src="/ice-logo.png" alt="IceFunnel" width={28} height={28} className="object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold gradient-primary">IceFunnel</span>
              <span className="text-xs text-muted-foreground">Dashboard</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex w-64 justify-start text-muted-foreground glass-input h-10 px-3"
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="flex-1 text-left">Buscar...</span>
              <div className="flex items-center gap-1 ml-auto">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <Command className="h-3 w-3" />K
                </kbd>
              </div>
            </Button>

            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              className="sm:hidden glass-button h-10 w-10"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Search Modal */}
            {searchOpen && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg animate-scale-in">
                  <div className="glass-card border-white/10 p-4 mx-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar em tudo..."
                        value={searchValue}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 pr-10 glass-input h-12 text-base"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchOpen(false)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Search Results */}
                    <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                      <p className="text-sm text-muted-foreground px-2">Digite para buscar...</p>
                    </div>

                    {/* Search Footer */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-muted rounded">↵</kbd>
                        <span>para selecionar</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-muted rounded">Esc</kbd>
                        <span>para fechar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || "default"}
              className="hidden sm:flex bg-primary hover:bg-primary/90 h-10 transition-all duration-200 hover:scale-105"
            >
              {action.icon || <Plus className="h-4 w-4 mr-2" />}
              {action.label}
            </Button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative glass-button h-10 w-10 hover:scale-110 transition-all duration-200"
              >
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-primary text-primary-foreground text-xs flex items-center justify-center animate-pulse">
                    {notifications}
                  </Badge>
                )}
                <span className="sr-only">Notificações</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 glass-card border-white/10" align="end">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notificações</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {notifications}
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Novo funil criado</p>
                    <p className="text-xs text-muted-foreground">Há 2 minutos</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Conversão aumentou 15%</p>
                    <p className="text-xs text-muted-foreground">Há 1 hora</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-white/10 cursor-pointer p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Produto adicionado</p>
                    <p className="text-xs text-muted-foreground">Há 3 horas</p>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="glass-button h-10 w-10 hover:scale-110 transition-all duration-200"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Alternar tema</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-card border-white/10" align="end">
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <Sun className="mr-2 h-4 w-4" />
                <span>Claro</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <Moon className="mr-2 h-4 w-4" />
                <span>Escuro</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <Monitor className="mr-2 h-4 w-4" />
                <span>Sistema</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full glass-button hover:scale-110 transition-all duration-200"
              >
                <Avatar className="h-10 w-10 ring-2 ring-white/20">
                  <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold">U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 glass-card border-white/10" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Usuário Teste</p>
                  <p className="text-xs leading-none text-muted-foreground">usuario@exemplo.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
                <kbd className="ml-auto text-xs bg-muted px-1 rounded">⌘P</kbd>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
                <kbd className="ml-auto text-xs bg-muted px-1 rounded">⌘S</kbd>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <Keyboard className="mr-2 h-4 w-4" />
                <span>Atalhos</span>
                <kbd className="ml-auto text-xs bg-muted px-1 rounded">⌘K</kbd>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="hover:bg-red-500/10 text-red-400 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
                <kbd className="ml-auto text-xs bg-muted px-1 rounded">⌘Q</kbd>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
