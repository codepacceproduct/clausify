import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { email, name, company, whatsapp } = json

    if (!email || !name) {
      return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check existing
    const { data: existing } = await supabase
      .from("waitlist")
      .select("id")
      .eq("email", email)
      .single()

    if (existing) {
      return NextResponse.json({ error: "Este email já está na lista de espera" }, { status: 409 })
    }

    // Insert
    const { error } = await supabase.from("waitlist").insert({
      email,
      name,
      company,
      whatsapp,
      status: "pending",
    })

    if (error) {
      console.error("Erro ao salvar na lista de espera:", error)
      return NextResponse.json({ error: "Erro ao salvar dados" }, { status: 500 })
    }

    // Get count for position
    const { count } = await supabase.from("waitlist").select("*", { count: "exact", head: true })

    return NextResponse.json({ success: true, position: count })
  } catch (error) {
    console.error("Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
