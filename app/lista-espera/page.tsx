import { Suspense } from "react"
import { QuizForm } from "@/components/quiz-form"

export default function ListaDeEsperaPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-3xl">
          <QuizForm />
        </div>
      </main>
    </Suspense>
  )
}
