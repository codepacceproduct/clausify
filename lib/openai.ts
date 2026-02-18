import OpenAI from "openai"

const apiKey = process.env.OPENAI_API_KEY
const baseURL = process.env.OPENAI_BASE_URL

export const openai = (() => {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não definida")
  }
  return new OpenAI({
    apiKey,
    baseURL,
    timeout: 30000,
    maxRetries: 3,
  })
})()

export function getOpenAIClient(): OpenAI | null {
  if (!apiKey) return null
  return openai
}
