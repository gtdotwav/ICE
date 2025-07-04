"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, BarChart3, Home, Package, Settings, Zap, Users, CreditCard } from "lucide-react"

import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Funis", href: "/dashboard/funnels", icon: Zap },
  { name: "Produtos", href: "/dashboard/products", icon: Package },
  { name: "IA Tools", href: "/dashboard/ai-tools", icon: Bot },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Equipe", href: "/dashboard/team", icon: Users },
  { name: "Faturamento", href: "/dashboard/billing", icon: CreditCard },
  { name: "Configurações", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-col border-r bg-background lg:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">IF</span>
          </div>
          <span className="text-lg font-bold">IceFunnel</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
