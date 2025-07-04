import { create } from "zustand"
import { nanoid } from "nanoid"
import type { ReactNode } from "react"

// --- Mock Data & Functions ---

const initialCode = `
<div class="w-full max-w-sm mx-auto">
  <div class="bg-white shadow-md rounded-lg p-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Login</h2>
    <form>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
          Username
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
          Password
        </label>
        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************">
      </div>
      <div class="flex items-center justify-between">
        <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Sign In
        </button>
        <a class="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800" href="#">
          Forgot Password?
        </a>
      </div>
    </form>
  </div>
</div>
`

const welcomeMessage = `
Olá! Sou a IA do IceFunnel, pronta para te ajudar a criar componentes incríveis.

**O que você gostaria de construir hoje?**

Você pode usar um dos prompts rápidos ou descrever o que precisa. Por exemplo:

*   "Crie um card de produto com imagem, título, preço e botão de compra."
*   "Gere uma seção de depoimentos com 3 cards."
`

const mockResponses: Record<string, string> = {
  default: `
Ok, aqui está um componente de card de depoimento.

\`\`\`html
<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-5">
  <div class="p-8">
    <div class="flex items-center mb-4">
      <img class="h-12 w-12 rounded-full" src="/placeholder-user.jpg" alt="Foto de Maria Silva">
      <div class="ml-4">
        <div class="text-lg leading-tight font-medium text-black">Maria Silva</div>
        <div class="text-sm text-gray-500">CEO, Tech Solutions</div>
      </div>
    </div>
    <p class="mt-2 text-gray-500">"O IceFunnel transformou nossa estratégia de vendas. A automação e a análise de dados são de outro nível. Recomendo fortemente!"</p>
  </div>
</div>
\`\`\`

Você pode customizar o conteúdo e os estilos conforme necessário. O que mais posso fazer?
  `,
}

const mockCode: Record<string, string> = {
  default: `
<div class="font-sans antialiased text-gray-900">
  <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-5">
    <div class="p-8">
      <div class="flex items-center mb-4">
        <img class="h-12 w-12 rounded-full" src="/placeholder-user.jpg" alt="Foto de Maria Silva">
        <div class="ml-4">
          <div class="text-lg leading-tight font-medium text-black">Maria Silva</div>
          <div class="text-sm text-gray-500">CEO, Tech Solutions</div>
        </div>
      </div>
      <p class="mt-2 text-gray-500">"O IceFunnel transformou nossa estratégia de vendas. A automação e a análise de dados são de outro nível. Recomendo fortemente!"</p>
    </div>
  </div>
</div>
  `,
}

async function getAIResponse(prompt: string): Promise<{ text: string; code: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay
  const key = Object.keys(mockResponses).find((k) => prompt.toLowerCase().includes(k)) || "default"
  return {
    text: mockResponses[key],
    code: mockCode[key],
  }
}

const TAILWIND_CDN = `<script src="https://cdn.tailwindcss.com"></script><style>body { font-family: 'Inter', sans-serif; }</style><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`
const BODY_CLASSES = "bg-gray-100 flex items-center justify-center h-full p-4"

// --- Type Definitions ---

export type Message = {
  id: string
  sender: "bot" | "user"
  content: ReactNode
}

export type ViewportSize = "mobile" | "tablet" | "desktop"

type GeneratedCode = {
  html: string
  css: string
  js: string
}

type AIToolsState = {
  messages: Message[]
  isTyping: boolean
  userInput: string
  previewSize: number
  generatedCode: GeneratedCode
}

type AIToolsActions = {
  setUserInput: (input: string) => void
  sendMessage: (text: string) => void
  setPreviewSize: (size: ViewportSize) => void
}

// --- Store ---

export const useAIToolsStore = create<AIToolsState & AIToolsActions>((set, get) => ({
  // State
  messages: [{ id: nanoid(), sender: "bot", content: welcomeMessage }],
  isTyping: false,
  userInput: "",
  previewSize: 1024,
  generatedCode: {
    html: `<html><head>${TAILWIND_CDN}</head><body class="${BODY_CLASSES}">${initialCode}</body></html>`,
    css: "",
    js: "",
  },

  // Actions
  setUserInput: (input) => set({ userInput: input }),

  setPreviewSize: (size) => {
    const sizes = {
      mobile: 375,
      tablet: 768,
      desktop: 1024,
    }
    set({ previewSize: sizes[size] })
  },

  sendMessage: async (text) => {
    if (!text.trim() || get().isTyping) return

    const userMessage: Message = {
      id: nanoid(),
      sender: "user",
      content: text,
    }

    set((state) => ({
      messages: [...state.messages, userMessage],
      userInput: "",
      isTyping: true,
    }))

    const { text: botText, code: botCode } = await getAIResponse(text)

    const botMessage: Message = {
      id: nanoid(),
      sender: "bot",
      content: botText,
    }

    set((state) => ({
      messages: [...state.messages, botMessage],
      isTyping: false,
      generatedCode: {
        ...state.generatedCode,
        html: `<html><head>${TAILWIND_CDN}</head><body class="${BODY_CLASSES}">${botCode}</body></html>`,
      },
    }))
  },
}))
