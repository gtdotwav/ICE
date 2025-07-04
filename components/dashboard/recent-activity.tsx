import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: "Usuário Teste",
    action: "gerou uma nova headline.",
    time: "5 min atrás",
  },
  {
    user: "IA Automática",
    action: "ajustou o CTA do funil de checkout.",
    time: "2 horas atrás",
  },
  {
    user: "Usuário Teste",
    action: "iniciou um teste A/B.",
    time: "8 horas atrás",
  },
  {
    user: "IA Automática",
    action: "identificou um gargalo no funil.",
    time: "1 dia atrás",
  },
]

export function RecentActivity() {
  return (
    <Card className="bg-background/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>Últimas ações realizadas na sua conta.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage
                src={activity.user === "IA Automática" ? "/placeholder.svg?query=ai+robot" : "/placeholder-user.jpg"}
                alt="Avatar"
              />
              <AvatarFallback>{activity.user.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">
                {activity.user} <span className="text-muted-foreground">{activity.action}</span>
              </p>
              <p className="text-sm text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
