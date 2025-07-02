import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SignUpPopup() {
  return (
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-bold font-display mb-2">Comece a Congelar a Concorrência</h2>
      <p className="text-ice-quantum-300 mb-8">Crie sua conta e ative o poder da IA em minutos.</p>
      <form className="space-y-4">
        <Input type="text" placeholder="Seu nome" className="h-12 bg-secondary border-border" />
        <Input type="email" placeholder="Seu melhor e-mail" className="h-12 bg-secondary border-border" />
        <Button
          size="lg"
          type="submit"
          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 transition-opacity"
        >
          Criar Conta Grátis
        </Button>
      </form>
      <p className="text-xs text-ice-quantum-500 mt-4">Ao se inscrever, você concorda com nossos Termos de Serviço.</p>
    </div>
  )
}
