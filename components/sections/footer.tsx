import { GitCommit, Heart } from "lucide-react"

export function Footer() {
  const year = new Date().getFullYear()
  const links = ["Documentação", "Status", "Segurança", "Contato"]
  const compliance = ["SOC2", "GDPR", "LGPD", "ISO 27001"]

  return (
    <footer className="bg-background border-t border-border py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold font-display text-foreground">IceFunnel</h3>
            <p className="text-muted-foreground mt-2">Powered by Artificial Intelligence</p>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Links</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Compliance</h4>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {compliance.map((c) => (
                <span key={c} className="px-2 py-1 text-xs bg-secondary border border-border rounded">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground text-sm">
          <p>&copy; {year} IceFunnel, Inc. Todos os direitos reservados.</p>
          <p className="mt-2 flex items-center justify-center gap-1.5">
            Designed with <Heart className="h-4 w-4 text-red-500" /> and coded with{" "}
            <GitCommit className="h-4 w-4 text-primary" />
          </p>
        </div>
      </div>
    </footer>
  )
}
