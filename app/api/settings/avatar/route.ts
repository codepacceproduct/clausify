import { supabaseServer } from "@/lib/supabase-server"
import { getAuthedEmail } from "@/lib/api-auth"

export async function POST(req: Request) {
  const form = await req.formData()
  const authed = await getAuthedEmail(req)
  const file = form.get("file") as File | null
  if (!authed || !file) return new Response(JSON.stringify({ error: "unauthorized or missing file" }), { status: 400 })

  const bucket = "avatars"
  const { data: bucketInfo } = await supabaseServer.storage.getBucket(bucket)
  if (!bucketInfo) {
    const { error: bucketErr } = await supabaseServer.storage.createBucket(bucket, { public: true })
    if (bucketErr) return new Response(JSON.stringify({ error: bucketErr.message }), { status: 500 })
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase()
  const safeFolder = authed.replace(/[@.]/g, "-")
  const path = `${safeFolder}/${Date.now()}.${ext}`
  const { error: uploadErr } = await supabaseServer.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: true })
  if (uploadErr) return new Response(JSON.stringify({ error: uploadErr.message }), { status: 500 })

  const { data: publicUrl } = await supabaseServer.storage.from(bucket).getPublicUrl(path)

  await supabaseServer.from("profiles").update({ avatar_url: publicUrl.publicUrl }).eq("email", authed)

  return Response.json({ url: publicUrl.publicUrl })
}
