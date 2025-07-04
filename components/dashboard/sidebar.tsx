"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, BarChart, Settings, Package, LayoutDashboard, GitFork } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/funnels", icon: GitFork, label: "Funis" },
  { href: "/dashboard/products", icon: Package, label: "Produtos" },
  { href: "/dashboard/ai-tools", icon: Bot, label: "IA Tools" },
  { href: "/dashboard/settings", icon: Settings, label: "Configurações" },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-16 flex-col border-r border-border bg-background/50 lg:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <BarChart className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">IceFunnel</span>
          </Link>
          {navItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    pathname === item.href && "bg-accent text-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  )
}
