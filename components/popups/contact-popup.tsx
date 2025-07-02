import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactPopup() {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold font-display mb-2">Solução Enterprise</h2>
        <p className="text-ice-quantum-300">Vamos construir um plano customizado para suas necessidades.</p>
      </div>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input type="text" placeholder="Nome" className="h-12 bg-secondary border-border" />
          <Input type="text" placeholder="Empresa" className="h-12 bg-secondary border-border" />
        </div>
        <Input type="email" placeholder="E-mail corporativo" className="h-12 bg-secondary border-border" />
        <Textarea placeholder="Descreva suas necessidades..." className="bg-secondary border-border" />
        <Button
          size="lg"
          type="submit"
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity"
        >
          Agendar uma Demonstração
        </Button>
      </form>
    </div>
  )
}
