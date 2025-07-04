"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, ShoppingCart, TrendingUp, Settings, Mail, FileText, Clock, ExternalLink } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "conversion",
    title: "Nova conversão registrada",
    description: "Cliente completou compra do produto Premium",
    user: "João Silva",
    avatar: "/placeholder-user.jpg",
    time: "2 min atrás",
    value: "R$ 299,00",
    icon: ShoppingCart,
    color: "text-green-500",
    bgColor: "bg-green-500/20",
  },
  {
    id: 2,
    type: "user",
    title: "Novo usuário cadastrado",
    description: "Usuário se registrou via funil de leads",
    user: "Maria Santos",
    avatar: "/placeholder-user.jpg",
    time: "5 min atrás",
    icon: User,
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
  },
  {
    id: 3,
    type: "optimization",
    title: "Otimização aplicada",
    description: "Taxa de conversão melhorou em 12%",
    user: "Sistema IA",
    time: "15 min atrás",
    icon: TrendingUp,
    color: "text-purple-500",
    bgColor: "bg-purple-500/20",
  },
  {
    id: 4,
    type: "email",
    title: "Campanha de email enviada",
    description: "Newsletter semanal para 2.5k subscribers",
    user: "Marketing Bot",
    time: "1 hora atrás",
    icon: Mail,
    color: "text-orange-500",
    bgColor: "bg-orange-500/20",
  },
  {
    id: 5,
    type: "settings",
    title: "Configurações atualizadas",
    description: "Integração com Stripe configurada",
    user: "Admin",
    time: "2 horas atrás",
    icon: Settings,
    color: "text-gray-500",
    bgColor: "bg-gray-500/20",
  },
  {
    id: 6,
    type: "report",
    title: "Relatório gerado",
    description: "Relatório mensal de performance",
    user: "Sistema",
    time: "3 horas atrás",
    icon: FileText,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/20",
  },
]

export function RecentActivity() {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer group animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Icon */}
            <div
              className={`p-2 rounded-lg ${activity.bgColor} ${activity.color} group-hover:scale-110 transition-transform duration-200`}
            >
              <activity.icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors duration-200">
                  {activity.title}
                </h4>
                {activity.value && (
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                    {activity.value}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{activity.description}</p>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs bg-primary/20 text-primary">
                      {activity.user.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{activity.user}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
              </div>
            </div>

            {/* Action */}
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-6">
        <Button variant="outline" size="sm" className="glass-button bg-transparent">
          Carregar mais atividades
        </Button>
      </div>
    </ScrollArea>
  )
}
