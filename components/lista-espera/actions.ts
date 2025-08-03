"use server"

import { z } from "zod"
import { API } from "@/lib/api-client"

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

  try {
    // Registrar usuário no sistema
    await API.registerUser({
      email: parsedData.data.email,
      name: parsedData.data.name,
      source: 'lista_espera'
    })

    // Qualificar como lead
    await API.qualifyLead({
      email: parsedData.data.email,
      name: parsedData.data.name,
      score: 85, // Score alto para lista de espera
      criteria: ['lista_espera', parsedData.data.role, parsedData.data.challenge],
      source: 'lista_espera',
      tags: [parsedData.data.role, parsedData.data.challenge, parsedData.data.companySize]
    })

    // Simula um atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return { success: true, message: "Inscrição na lista de espera confirmada!" }
  } catch (error) {
    console.error('Erro ao processar inscrição:', error)
    throw new Error("Erro ao processar inscrição. Tente novamente.")
  }