"use client"

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
import { Bell, Search, Settings, User, LogOut, Menu, Plus } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardSidebar } from "./sidebar"

interface DashboardHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function DashboardHeader({ title, description, action }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 glass-card">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Mobile menu */}
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden glass-button">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 glass-card border-white/10 w-64">
              <DashboardSidebar />
            </SheetContent>
          </Sheet>

          {/* Page Title */}
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold gradient-text">{title}</h1>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar..." className="w-64 pl-10 glass-input h-10" />
          </div>

          {/* Action Button */}
          {action && (
            <Button onClick={action.onClick} className="hidden sm:flex bg-primary hover:bg-primary/90 h-10">
              <Plus className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative glass-button h-10 w-10">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-primary text-primary-foreground text-xs flex items-center justify-center">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full glass-button">
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
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="hover:bg-white/10 text-red-400 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
