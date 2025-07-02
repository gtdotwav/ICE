import type React from "react"
import type { ReactNode } from "react"
import { nanoid } from "nanoid"

// --- Type Definitions ---

export type Message = {
  id: string
  sender: "bot" | "user"
  content: ReactNode
  timestamp?: number
  component?: React.ComponentType<any>
  componentProps?: Record<string, any>
}

export type ChatState = {
  currentStep: number
  messages: Message[]
  isTyping: boolean
  profile: Record<string, any>
  score: Record<string, number>
}

export type ChatAction =
  | { type: "ADD_MESSAGE"; payload: Omit<Message, "id" | "timestamp"> }
  | { type: "SET_TYPING"; payload: boolean }
  | { type: "NEXT_STEP" }
  | { type: "UPDATE_PROFILE"; payload: Record<string, any> }
  | { type: "UPDATE_SCORE"; payload: Record<string, number> }
  | { type: "RESET" }

// --- Initial State ---

export const initialState: ChatState = {
  currentStep: 0,
  messages: [],
  isTyping: false,
  profile: {},
  score: {},
}

// --- Reducer Function ---

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: nanoid(),
            timestamp: Date.now(),
            ...action.payload,
          },
        ],
      }
    case "SET_TYPING":
      return { ...state, isTyping: action.payload }
    case "NEXT_STEP":
      return { ...state, currentStep: state.currentStep + 1 }
    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: { ...state.profile, ...action.payload },
      }
    case "UPDATE_SCORE":
      return {
        ...state,
        score: Object.entries(action.payload).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: (acc[key] || 0) + value }),
          state.score,
        ),
      }
    case "RESET":
      return initialState
    default:
      return state
  }
}
