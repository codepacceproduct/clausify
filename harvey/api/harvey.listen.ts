import { runHarvey } from "../core/harvey.engine"

export async function POST(req: Request) {
  const { text, user_id } = await req.json()

  const response = await runHarvey(text, user_id)

  return Response.json(response)
}

