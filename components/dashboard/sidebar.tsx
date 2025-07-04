"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  Zap,
  Package,
  Settings,
  LogOut,
  BarChart3,
  Bot,
  ChevronLeft,
  ChevronRight,
  User,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Visão geral e métricas principais",
  },
  {
    name: "Funis",
    href: "/dashboard/funnels",
    icon: Zap,
    description: "Gerencie seus funis de conversão",
  },
  {
    name: "Produtos",
    href: "/dashboard/products",
    icon: Package,
    description: "Catálogo de produtos e serviços",
  },
  {
    name: "IA",
    href: "/dashboard/ia",
    icon: Bot,
    badge: "Novo",
    description: "Ferramentas de inteligência artificial",
  },
  {
    name: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Configurações da conta e sistema",
  },
]

interface DashboardSidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "flex h-full flex-col glass-card border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          className,
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm ring-1 ring-primary/30">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg font-bold gradient-primary">IceFunnel</h2>
                <span className="text-xs text-muted-foreground">Dashboard</span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm ring-1 ring-primary/30 mx-auto">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
          )}

          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 glass-button hover:scale-110 transition-all duration-200"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              const NavButton = (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full transition-all duration-200 group relative",
                    isCollapsed ? "h-12 px-0 justify-center" : "h-12 px-4 justify-start",
                    "hover:bg-white/10 hover:backdrop-blur-sm hover:scale-[1.02] hover:shadow-lg",
                    isActive &&
                      "bg-primary/20 text-primary backdrop-blur-sm border border-primary/30 shadow-lg scale-[1.02]",
                    "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
                      isCollapsed ? "mx-auto" : "mr-3",
                      isActive && "text-primary scale-110",
                    )}
                  />

                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left font-medium">{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 border border-primary/30 animate-pulse"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                  )}
                </Button>
              )

              return (
                <div key={item.name} className="animate-slide-up">
                  {isCollapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={item.href}>{NavButton}</Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="glass-card border-white/10">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-xs text-muted-foreground">{item.description}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="w-fit bg-primary/20 text-primary text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link href={item.href}>{NavButton}</Link>
                  )}
                </div>
              )
            })}
          </nav>
        </ScrollArea>

        <Separator className="bg-white/10" />

        {/* User Section */}
        <div className="p-3 space-y-2">
          {/* Help Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full transition-all duration-200",
                  isCollapsed ? "h-12 px-0 justify-center" : "h-12 px-4 justify-start",
                  "hover:bg-white/10 hover:backdrop-blur-sm text-muted-foreground hover:text-foreground",
                )}
              >
                <HelpCircle className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "mr-3")} />
                {!isCollapsed && <span className="flex-1 text-left">Ajuda</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? "right" : "top"} className="glass-card border-white/10">
              <span>Central de ajuda e suporte</span>
            </TooltipContent>
          </Tooltip>

          {/* User Profile */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full transition-all duration-200",
                  isCollapsed ? "h-12 px-0 justify-center" : "h-12 px-4 justify-start",
                  "hover:bg-white/10 hover:backdrop-blur-sm text-muted-foreground hover:text-foreground",
                )}
              >
                <User className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "mr-3")} />
                {!isCollapsed && <span className="flex-1 text-left">Perfil</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? "right" : "top"} className="glass-card border-white/10">
              <span>Configurações do perfil</span>
            </TooltipContent>
          </Tooltip>

          {/* Logout */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full transition-all duration-200",
                  isCollapsed ? "h-12 px-0 justify-center" : "h-12 px-4 justify-start",
                  "hover:bg-red-500/10 hover:backdrop-blur-sm text-muted-foreground hover:text-red-400",
                )}
              >
                <LogOut className={cn("h-5 w-5", isCollapsed ? "mx-auto" : "mr-3")} />
                {!isCollapsed && <span className="flex-1 text-left">Sair</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? "right" : "top"} className="glass-card border-white/10">
              <span>Sair da conta</span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
