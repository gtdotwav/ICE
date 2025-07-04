import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Equipe</h1>
        <p className="text-muted-foreground">Gerencie sua equipe e permissões</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <CardTitle>Gerenciamento de Equipe</CardTitle>
            </div>
            <CardDescription>Adicione membros e configure permissões</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Users className="mx-auto h-12 w-12 mb-4" />
                <p>Gerenciamento de equipe em desenvolvimento</p>
                <p className="text-sm">Em breve você poderá convidar membros para sua equipe</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
