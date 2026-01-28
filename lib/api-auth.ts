function getTokenFromReq(req: Request): string | null {
  const authHeader = req.headers.get("authorization") || ""
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim()
  }
  
  const cookieHeader = req.headers.get("cookie") || ""
  const cookies = cookieHeader.split(";").map(c => c.trim())
  
  for (const cookie of cookies) {
    const parts = cookie.split("=")
    if (parts.length < 2) continue
    const name = parts[0]
    const valRaw = parts.slice(1).join("=")
    
    // Look for standard auth cookies
    if (name === "auth_token" || name.endsWith("-auth-token")) {
        const decoded = decodeURIComponent(valRaw)
        
        // If it's a raw JWT
        if (decoded.startsWith("eyJ")) return decoded
        
        // If it's a JSON object/array
        if (decoded.startsWith("{") || decoded.startsWith("[")) {
            try {
                const parsed = JSON.parse(decoded)
                if (Array.isArray(parsed) && typeof parsed[0] === "string" && parsed[0].startsWith("eyJ")) {
                    return parsed[0]
                }
                if (parsed.access_token && typeof parsed.access_token === "string") {
                    return parsed.access_token
                }
            } catch {}
        }
        
        // Fallback: if it's long enough, assume it might be the token
        if (decoded.length > 50) return decoded
    }
  }
  
  return null
}

import { ENV } from "@/lib/env"

export async function getAuthedUser(req: Request): Promise<any | null> {
  const token = getTokenFromReq(req)
  if (!token) return null
  
  try {
    const supabaseUrl = ENV.NEXT_PUBLIC_SUPABASE_URL as string
    const supabaseAnonKey = ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    const res = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseAnonKey,
      },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function getAuthedEmail(req: Request): Promise<string | null> {
  const token = getTokenFromReq(req)
  const cookieHeader = req.headers.get("cookie") || ""
  const emailCookieMatch = cookieHeader.match(/(?:^|; )user_email=([^;]+)/)
  const emailCookie = emailCookieMatch && emailCookieMatch[1] ? decodeURIComponent(emailCookieMatch[1]) : null
  
  if (!token) return emailCookie
  
  try {
    const user = await getAuthedUser(req)
    if (user?.email) return user.email
    return emailCookie
  } catch {
    return emailCookie
  }
}
