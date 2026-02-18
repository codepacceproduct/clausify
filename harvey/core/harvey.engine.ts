import { parseIntent } from "./intent.parser"
import { executeAction } from "../mcp/executor"

export async function runHarvey(inputText: string, user_id: string) {
  const { intent, payload } = await parseIntent(inputText)

  if (intent === "unknown") {
    return { message: "Não entendi seu pedido." }
  }

  const result = await executeAction(intent, user_id, payload)

  return {
    message: "Evento criado com sucesso.",
    result,
  }
}

