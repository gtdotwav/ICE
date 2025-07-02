import { GitCommit, Heart } from "lucide-react"

export function Footer() {
  const year = new Date().getFullYear()
  const links = ["Documentação", "Status", "Segurança", "Contato"]
  const compliance = ["SOC2", "GDPR", "LGPD", "ISO 27001"]

  return (
    <footer className="bg-ice-quantum-950 border-t border-ice-quantum-800 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold font-display text-white">IceFunnel</h3>
            <p className="text-ice-quantum-400 mt-2">Powered by Artificial Intelligence</p>
          </div>
          <div>
            <h4 className="font-bold text-ice-quantum-300 mb-4">Links</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-ice-quantum-400 hover:text-ai-cyan transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-ice-quantum-300 mb-4">Compliance</h4>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {compliance.map((c) => (
                <span key={c} className="px-2 py-1 text-xs bg-ice-quantum-800 border border-ice-quantum-700 rounded">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-ice-quantum-800 text-center text-ice-quantum-500 text-sm">
          <p>&copy; {year} IceFunnel, Inc. Todos os direitos reservados.</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Designed with <Heart className="h-4 w-4 text-ai-purple" /> and coded with{" "}
            <GitCommit className="h-4 w-4 text-ai-cyan" />
          </p>
        </div>
      </div>
    </footer>
  )
}
