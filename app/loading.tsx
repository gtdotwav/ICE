// Este é um arquivo especial do Next.js App Router para estados de carregamento.
// Ele será exibido automaticamente durante a navegação entre rotas.
// A animação é temática, simulando elementos pulsantes.
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/30" />
        <div className="absolute inset-2 animate-pulse rounded-full bg-primary/50 [animation-delay:0.2s]" />
        <div className="absolute inset-4 animate-pulse rounded-full bg-primary" />
      </div>
    </div>
  )
}
