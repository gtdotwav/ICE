export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-400/20 to-transparent rounded-full animate-spin"
          style={{ animationDuration: "20s" }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-green-400/20 to-transparent rounded-full animate-spin"
          style={{ animationDuration: "25s", animationDirection: "reverse" }}
        />
      </div>
      <div className="relative z-10 text-center max-w-lg mx-auto px-8">
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 rounded-full border-4 border-blue-300/30" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white animate-spin" />
            <div className="absolute inset-4 rounded-full border-2 border-blue-200/50" />
            <div className="absolute inset-1/2 w-4 h-4 -ml-2 -mt-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="w-full bg-blue-800/50 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full animate-pulse"
              style={{ width: "75%" }}
            />
          </div>
          <div className="min-h-[60px] flex items-center justify-center">
            <p className="text-xl text-white font-medium animate-pulse">
              Analisando sua localização e perfil socioeconômico...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
