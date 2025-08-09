import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DocsPage() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center bg-background">
      <div className="w-full max-w-5xl px-4 py-10 md:py-16">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Project Docs and Assets
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            This page embeds the provided v0.dev homepage screenshot for quick reference.
          </p>
        </header>

        <section className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-3">v0.dev Homepage Screenshot</h2>
            <p className="text-sm text-muted-foreground mb-4">
              A reference image showing the v0.dev landing UI with the main build prompt and community examples.
            </p>
            <div className="relative w-full overflow-hidden rounded-lg border bg-muted/20">
              <Image
                src="/images/v0-dev-home.jpeg"
                alt="Screenshot of v0.dev homepage showing the main build prompt and community examples"
                width={1365}
                height={768}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Source:{" "}
              <a
                href="https://sjc.microlink.io/DALgH5-uN2OXcUZH93wwM17XGGKo0Td8oHHDHnHsAlTSoXRGhboRsubVu9q-8f1tWKwm2Y7kI9vvNDRgjFuLDw.jpeg"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline underline-offset-2"
              >
                https://sjc.microlink.io/DALgH5-uN2OXcUZH93wwM17XGGKo0Td8oHHDHnHsAlTSoXRGhboRsubVu9q-8f1tWKwm2Y7kI9vvNDRgjFuLDw.jpeg
              </a>
            </div>
          </div>

          <div className="px-4 md:px-6 py-4 border-t flex items-center justify-between gap-3 flex-col md:flex-row">
            <p className="text-xs md:text-sm text-muted-foreground">
              Tip: v0 uses the Next.js App Router by default, enabling colocated routes and server actions for full‑stack apps [^1].
            </p>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Open Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
