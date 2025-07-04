export function DemoVideoPopup() {
  return (
    <div className="text-center">
      <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">IceFunnel em Ação</h2>
      <p className="text-ice-quantum-300 mb-6">Veja como nossa IA otimiza um funil em tempo real.</p>
      <div className="aspect-video w-full overflow-hidden rounded-2xl border-border bg-background">
        {/* Placeholder for a video. Replace with your actual video component or iframe. */}
        <video
          className="w-full h-full object-cover"
          src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  )
}
