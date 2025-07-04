"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Zap, Package, Settings, LogOut, BarChart3, Bot } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Funis",
    href: "/dashboard/funnels",
    icon: Zap,
  },
  {
    name: "Produtos",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    name: "IA",
    href: "/dashboard/ia",
    icon: Bot,
    badge: "Novo",
  },
  {
    name: "Configurações",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-background/20 backdrop-blur-xl border-r border-white/10">
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 backdrop-blur-sm">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            IceFunnel
          </h2>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start transition-all duration-200 hover:bg-white/10 hover:backdrop-blur-sm",
                    isActive && "bg-primary/20 text-primary backdrop-blur-sm border border-primary/20",
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-white/10 p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:bg-white/10 hover:backdrop-blur-sm transition-all duration-200"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}
