"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
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
    <div className="flex h-full w-64 flex-col glass-card border-r">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-center border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 backdrop-blur-sm ring-1 ring-primary/30">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold gradient-primary">IceFunnel</h2>
            <span className="text-xs text-muted-foreground">Dashboard</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 px-4 text-sm font-medium transition-all duration-200",
                    "hover:bg-white/10 hover:backdrop-blur-sm hover:scale-[1.02]",
                    isActive && "bg-primary/20 text-primary backdrop-blur-sm border border-primary/30 shadow-lg",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 border border-primary/30"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* User Section */}
      <div className="border-t border-white/10 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start h-12 px-4 text-muted-foreground hover:bg-white/10 hover:backdrop-blur-sm hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  )
}
