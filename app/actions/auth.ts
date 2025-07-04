"use server"

import { redirect } from "next/navigation"

export async function magicLogin() {
  // Em um aplicativo real, você criaria uma sessão para o usuário,
  // definiria um cookie e então redirecionaria.
  console.log("Simulando login mágico...")
  redirect("/dashboard")
}

export async function logout() {
  // Em um aplicativo real, você destruiria a sessão,
  // limparia o cookie e então redirecionaria.
  console.log("Simulando logout...")
  redirect("/")
}
