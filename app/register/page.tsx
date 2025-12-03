"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase-client"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, surname, email, phone, bio, password }),
      })
      const json = await res.json()
      if (res.ok && json?.token) {
        toast.success("Registro concluído com sucesso.")
        router.push("/dashboard")
      } else if (res.status === 200) {
        toast.success("Registro concluído. Efetuando login...")
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (!error && data.session) {
          router.push("/dashboard")
        } else {
          toast.error("Registro criado, mas não foi possível acessar agora.")
        }
      } else {
        toast.error("Não foi possível registrar. Tente novamente.")
        router.push("/login")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleRegister} className="w-full max-w-md space-y-4 p-6">
        <div>
          <label className="text-sm">Nome</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Sobrenome</label>
          <Input value={surname} onChange={(e) => setSurname(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">E-mail</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Telefone</label>
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Bio</label>
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
        </div>
        <div>
          <label className="text-sm">Senha</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Registrando..." : "Registrar"}
        </Button>
      </form>
    </div>
  )
}
