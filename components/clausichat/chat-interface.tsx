"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    
    // Add user message immediately
    const newMessages = [...messages, { role: "user" as const, content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.filter(m => m.role !== "system").map(({ role, content }) => ({ role, content }))
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao enviar mensagem")
      }

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
          const updated = [...prev]
          const lastMsg = updated[updated.length - 1]
          if (lastMsg.role === "assistant") {
            lastMsg.content = assistantMessage
          }
          return updated
        })
      }

    } catch (error) {
      console.error(error)
      toast.error("Ocorreu um erro ao processar sua mensagem.")
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente." 
      }])
    } finally {
      setIsLoading(false)
      // Focus input again after response
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto w-full">
      {/* Header / Top Bar if needed, currently empty to maximize chat space */}
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards" style={{ opacity: 1 }}>
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-6 rounded-full ring-4 ring-emerald-50 dark:ring-emerald-900/10">
              <Bot className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                ClausiChat
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Seu assistente jurídico inteligente. Pergunte sobre contratos, leis, ou peça análises de documentos.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg mt-8">
              {[
                "Analise este contrato de prestação de serviços",
                "Quais são os riscos desta cláusula?",
                "Resuma as obrigações deste documento",
                "Crie uma cláusula de confidencialidade"
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(suggestion)
                    // Optional: auto-submit
                    // handleSubmit() 
                  }}
                  className="text-sm text-left p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-600 dark:text-slate-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex w-full gap-4 p-4 rounded-xl transition-colors",
                msg.role === "assistant" 
                  ? "bg-slate-50 dark:bg-slate-900/50" 
                  : "bg-white dark:bg-transparent"
              )}
            >
              <div className="flex-shrink-0 mt-1">
                {msg.role === "assistant" ? (
                  <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                    <Bot className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-2 overflow-hidden">
                <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed">
                  {/* Simple text rendering for now, could add Markdown support later */}
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} className="min-h-[1em] mb-1 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex w-full gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <div className="flex-shrink-0 mt-1">
              <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-950/80 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800 sticky bottom-0">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all p-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Envie uma mensagem para o ClausiChat..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent py-3 max-h-32 min-h-[50px] resize-none"
              disabled={isLoading}
              autoComplete="off"
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isLoading}
              className={cn(
                "mb-1 h-9 w-9 rounded-lg transition-all",
                input.trim() 
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-500"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">
            O ClausiChat pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </div>
    </div>
  )
}
