import { supabaseServer } from "@/lib/supabase-server"
import { supabase } from "@/lib/supabase"
import { getAuthedUser } from "@/lib/api-auth"

export async function PUT(req: Request) {
  const body = await req.json()
  const { currentPassword, newPassword } = body
  
  const user = await getAuthedUser(req)
  
  if (!user || !user.email) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401 })
  }
  
  if (!newPassword) {
    return new Response(JSON.stringify({ error: "missing newPassword" }), { status: 400 })
  }

  // Verify current password if provided
  if (currentPassword) {
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: user.email, 
      password: currentPassword 
    })
    
    if (error || !data?.user) {
      console.error("Password verification failed:", error?.message)
      return new Response(JSON.stringify({ error: "A senha atual está incorreta" }), { status: 401 })
    }
  }

  // Update password using admin client
  const { error: updErr } = await supabaseServer.auth.admin.updateUserById(user.id, { 
    password: newPassword 
  })
  
  if (updErr) {
    console.error("Password update failed:", updErr.message)
    return new Response(JSON.stringify({ error: updErr.message }), { status: 500 })
  }
  
  return Response.json({ ok: true })
}
