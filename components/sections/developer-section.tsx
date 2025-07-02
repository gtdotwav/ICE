"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Terminal } from "lucide-react"

export function DeveloperSection() {
  const codeSnippet = `const response = await icefunnel.ai.predict({
  funnel: 'main_sales',
  user: { id: 'user_123' },
  goal: 'maximize_ltv'
});`

  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display">Para Devs: API First, IA Native</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Integre o poder da nossa IA em qualquer stack com APIs robustas e SDKs completos.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 max-w-4xl mx-auto bg-background/50 rounded-lg border border-border text-left shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <div className="px-4 py-2 border-b border-border flex items-center gap-2">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">REST & GraphQL API</span>
          </div>
          <div className="p-6 bg-secondary/30">
            <pre className="text-sm whitespace-pre-wrap">
              <code className="language-typescript">{codeSnippet}</code>
            </pre>
          </div>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button size="lg" variant="outline">
            Acessar Documentação
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
