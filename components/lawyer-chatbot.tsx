"use client"

import * as React from "react"
import { Bot, X, Send, User, Minimize2, Loader2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Message {
  role: "user" | "assistant"
  content: string
}

import { usePathname } from "next/navigation"

export function LawyerChatbot() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou o ClausiBot, seu assistente jurídico especializado em contratos e compliance. Como posso ajudar você hoje?"
    }
  ])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  if (pathname === "/clausichat") return null

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }].map(({ role, content }) => ({ role, content }))
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (!reader) return

      // Add empty assistant message to start streaming into
      setMessages(prev => [...prev, { role: "assistant", content: "" }])

      let assistantMessage = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        assistantMessage += chunk

        setMessages(prev => {
          const newMessages = [...prev]
          const lastMsg = newMessages[newMessages.length - 1]
          if (lastMsg.role === "assistant") {
            lastMsg.content = assistantMessage
          }
          return newMessages
        })
      }

    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { role: "assistant", content: "Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-[380px] h-[500px] shadow-2xl border-emerald-500/20 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
          <CardHeader className="bg-emerald-600 text-white rounded-t-lg p-4 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <div className="bg-black rounded-full p-2 h-10 w-10 flex items-center justify-center border border-white/10 relative">
                <Image 
                  src="/images/clausify-logo.png" 
                  alt="Clausify Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <CardTitle className="text-base">ClausiBot</CardTitle>
                <p className="text-xs text-emerald-100 font-normal">Assistente Jurídico</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-emerald-700 hover:text-white h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-hidden bg-slate-50 dark:bg-slate-950/50">
            <div className="h-full overflow-y-auto p-4 space-y-4" ref={scrollRef}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex w-full",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "flex max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                    msg.role === "user" 
                      ? "bg-emerald-600 text-white rounded-br-none" 
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-bl-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                   <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-3 bg-white dark:bg-slate-900 border-t">
            <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
              <Input 
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua dúvida jurídica..."
                className="flex-1 focus-visible:ring-emerald-500"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !input.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-black hover:bg-black/90 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 p-3 border-2 border-emerald-500"
        >
          <div className="relative w-full h-full">
            <Image 
              src="/images/clausify-logo.png" 
              alt="ClausiBot" 
              fill
              className="object-contain"
            />
          </div>
          <span className="sr-only">Abrir Chat</span>
        </Button>
      )}
    </div>
  )
}
