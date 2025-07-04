export function DemoVideoPopup() {
  return (
    <div className="text-center max-w-2xl mx-auto p-6">
      <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">IceFunnel em Ação</h2>
      <p className="text-muted-foreground mb-8 text-lg">Veja como nossa IA otimiza um funil em tempo real.</p>

      {/* Clean content area without video */}
      <div className="bg-gradient-to-br from-background to-muted/50 rounded-2xl p-8 border">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Demo em Breve</h3>
          <p className="text-muted-foreground">
            Nossa demonstração interativa estará disponível em breve. Entre na lista de espera para ser notificado
            quando lançarmos.
          </p>
        </div>
      </div>
    </div>
  )
}
