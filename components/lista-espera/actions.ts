"use server"

import { z } from "zod"

const quizSchema = z.object({
  role: z.string(),
  challenge: z.string(),
  companySize: z.string(),
  name: z.string(),
  email: z.string().email(),
})

export async function submitQuiz(data: unknown) {
  const parsedData = quizSchema.safeParse(data)

  if (!parsedData.success) {
    throw new Error("Invalid data provided.")
  }

  // Em um aplicativo real, você salvaria isso em seu banco de dados (Supabase, Neon, etc.)
  // ou enviaria para um CRM.
  console.log("Novo lead na lista de espera:", parsedData.data)

  // Simula um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Você pode retornar dados se necessário, mas para este caso,
  // o estado de sucesso é gerenciado no cliente.
  return { success: true, message: "Inscrição na lista de espera confirmada!" }
}
