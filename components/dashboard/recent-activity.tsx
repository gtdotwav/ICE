import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Clock } from "lucide-react"

const activities = [
  {
    user: "João Silva",
    action: "completou o funil 'Produto Premium'",
    time: "2 min atrás",
    avatar: "/placeholder-user.jpg",
    type: "conversion",
    value: "R$ 299",
  },
  {
    user: "Maria Santos",
    action: "se inscreveu na lista de espera",
    time: "5 min atrás",
    avatar: "/placeholder-user.jpg",
    type: "lead",
    value: null,
  },
  {
    user: "Pedro Costa",
    action: "abandonou carrinho no checkout",
    time: "10 min atrás",
    avatar: "/placeholder-user.jpg",
    type: "abandonment",
    value: "R$ 149",
  },
  {
    user: "Ana Oliveira",
    action: "visualizou página de preços",
    time: "15 min atrás",
    avatar: "/placeholder-user.jpg",
    type: "view",
    value: null,
  },
  {
    user: "Carlos Mendes",
    action: "iniciou teste gratuito",
    time: "22 min atrás",
    avatar: "/placeholder-user.jpg",
    type: "trial",
    value: null,
  },
  {
    user: "Lucia Ferreira",
    action: "compartilhou produto no WhatsApp",
    time: "28 min atrás",
    avatar: "/placeholder-user.jpg",
    type: "share",
    value: null,
  },
]

const typeColors = {
  conversion: "bg-green-500/20 text-green-400 border-green-500/30",
  lead: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  abandonment: "bg-red-500/20 text-red-400 border-red-500/30",
  view: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  trial: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  share: "bg-pink-500/20 text-pink-400 border-pink-500/30",
}

const typeLabels = {
  conversion: "Conversão",
  lead: "Lead",
  abandonment: "Abandono",
  view: "Visualização",
  trial: "Teste",
  share: "Compartilhamento",
}

export function RecentActivity() {
  return (
    <Card className="bg-background/40 backdrop-blur-xl border-white/10 hover:bg-background/60 transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Atividade Recente
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse ml-auto"></div>
        </CardTitle>
        <CardDescription>Últimas interações dos usuários em tempo real</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
              >
                <Avatar className="h-10 w-10 border border-white/20">
                  <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{activity.user}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{activity.action}</p>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`text-xs ${typeColors[activity.type as keyof typeof typeColors]}`}
                    >
                      {typeLabels[activity.type as keyof typeof typeLabels]}
                    </Badge>
                    {activity.value && <span className="text-xs font-semibold text-green-400">{activity.value}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
