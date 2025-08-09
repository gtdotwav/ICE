export async function registerUser(payload: { email: string; name: string; plan?: string }) {
  const r = await fetch("/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!r.ok) throw new Error(`Register failed: ${r.status}`)
  return r.json()
}

export async function requestAIAutomation(p: {
  type: "copywriter" | "images" | "videos" | "email"
  prompt: string
  userId: string
}) {
  const r = await fetch("/api/ai-automation/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
  })
  if (!r.ok) throw new Error(`AI request failed: ${r.status}`)
  return r.json()
}
