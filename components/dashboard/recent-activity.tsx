import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: "João Silva",
    action: "completou o funil 'Produto Premium'",
    time: "2 min atrás",
    avatar: "/placeholder-user.jpg",
  },
  {
    user: "Maria Santos",
    action: "se inscreveu na lista de espera",
    time: "5 min atrás",
    avatar: "/placeholder-user.jpg",
  },
  {
    user: "Pedro Costa",
    action: "abandonou carrinho no checkout",
    time: "10 min atrás",
    avatar: "/placeholder-user.jpg",
  },
  {
    user: "Ana Oliveira",
    action: "visualizou página de preços",
    time: "15 min atrás",
    avatar: "/placeholder-user.jpg",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>Últimas interações dos usuários</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.avatar || "/placeholder.svg"} />
                <AvatarFallback>{activity.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{activity.user}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.action}</p>
              </div>
              <div className="text-xs text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
