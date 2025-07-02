// Este componente cria um gradiente animado e sutil que fica no fundo da página.
// Ele usa CSS puro para performance máxima, evitando re-renderizações do React.
// A animação de gradiente adiciona profundidade e um toque dinâmico à UI.
export function AnimatedGradient() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 h-full w-full bg-background">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,hsl(var(--secondary))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--secondary))_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background via-background/80 to-background" />
    </div>
  )
}
