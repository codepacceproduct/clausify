"use client"

import { useState, useRef, useEffect, FormEvent } from "react"
import {
  User,
  Mic,
  MicOff,
  CalendarCheck,
  FileText,
  Scale,
  MessageCircle,
  Layers,
  BookOpen,
  Calculator,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

type HarveyMessageRole = "user" | "assistant"
type HarveyCoreState = "idle" | "listening" | "processing" | "responding"

type HarveyOrchestrationItem = {
  question: string
  tool?: string
}

interface HarveyMessage {
  role: HarveyMessageRole
  content: string
}

export function HarveyWorkspace() {
  const [messages, setMessages] = useState<HarveyMessage[]>([
    {
      role: "assistant",
      content: "Oi, eu sou o Harvey. Como posso te ajudar agora?",
    },
  ])
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null)
  const [orchestrationLog, setOrchestrationLog] = useState<HarveyOrchestrationItem[]>([])
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    const handle = setTimeout(() => {
      inputRef.current?.focus()
    }, 150)
    return () => clearTimeout(handle)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isThinking])

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isThinking) return
    if (isListening) {
      setIsListening(false)
    }
    const content = input.trim()
    setInput("")
    const userMessage: HarveyMessage = {
      role: "user",
      content,
    }
    setMessages(prev => [...prev, userMessage])
    setOrchestrationLog(prev => [...prev, { question: content }])
    setIsThinking(true)
    const reply = buildHarveyReply(content)
    setTimeout(() => {
      const assistantMessage: HarveyMessage = {
        role: "assistant",
        content: reply,
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsThinking(false)
    }, 600)
  }

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
      return
    }

    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      return
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream)
        audioChunksRef.current = []
        recorder.ondataavailable = event => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data)
          }
        }
        recorder.onstop = async () => {
          stream.getTracks().forEach(track => track.stop())
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" })
          if (blob.size === 0) {
            return
          }
          setIsThinking(true)
          try {
            const formData = new FormData()
            formData.append("file", blob, "harvey-input.webm")
            formData.append("user_id", "1")

            const response = await fetch("/api/harvey-voice", {
              method: "POST",
              body: formData,
            })

            if (!response.ok) {
              return
            }

            const data = await response.json()
            const transcription = data.transcription as string | undefined
            const responseText = data.response_text as unknown
            const audioUrl = data.audio_url as string | undefined

            if (transcription) {
              const userMessage: HarveyMessage = {
                role: "user",
                content: transcription,
              }
              setMessages(prev => [...prev, userMessage])
              setVoiceTranscript(transcription)
              setOrchestrationLog(prev => [...prev, { question: transcription }])
            }

            if (responseText) {
              let displayText = ""
              let toolName: string | undefined

              if (typeof responseText === "string") {
                displayText = responseText
              } else if (responseText && typeof responseText === "object") {
                const anyResponse = responseText as any
                toolName = typeof anyResponse.tool === "string" ? anyResponse.tool : undefined
                const dataPayload = anyResponse.data ?? anyResponse
                displayText = formatHarveyToolResponse(toolName, dataPayload)
              }

              if (displayText) {
                const assistantMessage: HarveyMessage = {
                  role: "assistant",
                  content: displayText,
                }
                setMessages(prev => [...prev, assistantMessage])
              }

              if (toolName) {
                setOrchestrationLog(prev => {
                  if (!prev.length) return prev
                  const next = [...prev]
                  const last = next[next.length - 1]
                  next[next.length - 1] = { ...last, tool: toolName }
                  return next
                })
              }
            }

            if (audioUrl) {
              const audio = new Audio(audioUrl)
              audio.play().catch(() => {})
            }
          } finally {
            setIsThinking(false)
          }
        }

        mediaRecorderRef.current = recorder
        setIsListening(true)
        recorder.start()
      })
      .catch(() => {
        setIsListening(false)
      })
  }

  const coreState: HarveyCoreState =
    isListening ? "listening" : isThinking ? "processing" : messages.length > 1 ? "responding" : "idle"

  return (
    <div className="relative flex h-[calc(100vh-5rem)] items-center justify-center overflow-hidden bg-[#0a0a0a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#022c22_0,transparent_55%)] opacity-40" />

      <div className="relative z-10 flex h-full w-full items-stretch gap-6 px-4 py-6 sm:gap-8 sm:px-6 lg:px-10">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-3 pb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 ring-2 ring-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.45)]">
              <User className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-sm sm:text-base md:text-lg font-semibold tracking-[0.28em] text-emerald-100 uppercase">
                Harvey · Núcleo de IA
              </h1>
              <p className="text-xs text-slate-400">
                Central de orquestração para tudo que você pergunta no sistema.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-10 md:gap-12">
            <HarveyCoreOrb state={coreState} />
            {isThinking && (
              <div className="mt-1 text-[11px] text-emerald-300">
                Processando comando de voz...
              </div>
            )}
            <div className="mt-2 md:mt-4">
              <button
                type="button"
                onClick={toggleListening}
                className={cn(
                  "relative flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/40 bg-slate-950/80 text-emerald-100 shadow-[0_0_24px_rgba(16,185,129,0.4)] transition-all",
                  isListening
                    ? "scale-105 border-emerald-400/80 shadow-[0_0_32px_rgba(16,185,129,0.7)]"
                    : "opacity-80 hover:opacity-100",
                )}
              >
                <div
                  className={cn(
                    "absolute inset-[-6px] rounded-full border border-emerald-400/25",
                    isListening ? "animate-spin" : "",
                  )}
                  style={isListening ? { animationDuration: "4s" } : undefined}
                />
                <div
                  className={cn(
                    "absolute inset-[-12px] rounded-full border border-emerald-400/10",
                    isListening ? "animate-pulse" : "",
                  )}
                />
                {isListening ? (
                  <MicOff className="h-6 w-6 text-emerald-200" />
                ) : (
                  <Mic className="h-6 w-6 text-emerald-200" />
                )}
              </button>
            </div>
            {voiceTranscript && (
              <div className="mt-3 max-w-md text-center text-xs text-slate-300">
                “{voiceTranscript}”
              </div>
            )}
          </div>
        </div>

        <HarveyHudPanel state={coreState} items={orchestrationLog} />
      </div>
    </div>
  )
}

function HarveyWaveform(props: { active: boolean }) {
  const bars = [2, 4, 6, 10, 14, 18, 22, 18, 14, 10, 6, 4, 2]
  return (
    <div className="flex h-16 items-center justify-center">
      <div className="flex h-10 w-full max-w-4xl items-end justify-center gap-[2px]">
        {bars.map((baseHeight, index) => (
          <span
            key={index}
            className="w-[3px] rounded-full"
            style={{
              height: props.active ? `${baseHeight}px` : "2px",
              background:
                "linear-gradient(to top, rgba(15,118,110,0.1), rgba(110,231,183,0.9))",
              boxShadow: props.active
                ? "0 0 16px rgba(16,185,129,0.7)"
                : "0 0 8px rgba(16,185,129,0.4)",
              opacity: props.active ? 0.95 : 0.7,
              transformOrigin: "center bottom",
              animation: props.active ? "harveyBar 1.3s ease-in-out infinite" : "none",
              animationDelay: props.active ? `${index * 0.06}s` : undefined,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function HarveyCoreOrb(props: { state: HarveyCoreState }) {
  const isIdle = props.state === "idle"
  const isListening = props.state === "listening"
  const isProcessing = props.state === "processing"
  const isResponding = props.state === "responding"

  return (
    <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64 md:h-80 md:w-80">
      <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-3xl" />
      <div
        className="absolute inset-3 rounded-full border border-emerald-500/25"
        style={{ boxShadow: "0 0 40px rgba(16,185,129,0.5)" }}
      />
      <div
        className={cn(
          "absolute inset-6 rounded-full border border-emerald-400/40",
          isProcessing || isResponding ? "animate-spin" : "",
        )}
        style={isProcessing || isResponding ? { animationDuration: "18s" } : undefined}
      />
      <div
        className={cn(
          "absolute inset-10 rounded-full border border-emerald-400/30",
          isListening || isProcessing ? "animate-spin" : "",
        )}
        style={isListening || isProcessing ? { animationDuration: "24s", animationDirection: "reverse" } : undefined}
      />
      <div
        className={cn(
          "relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/35 via-emerald-400/25 to-teal-400/35 ring-2 ring-emerald-300/70",
          isIdle ? "animate-pulse" : "",
        )}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-950/85">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-300 to-teal-300 opacity-90" />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <HarveyWaveform active={isListening} />
        </div>
      </div>

      <div className="absolute -bottom-10 flex flex-col items-center text-[11px] text-emerald-100/90">
        <span className="uppercase tracking-[0.3em] text-emerald-200">
          {isListening
            ? "Escutando"
            : isProcessing
            ? "Orquestrando"
            : isResponding
            ? "Respondendo"
            : "Core em espera"}
        </span>
        <span className="mt-1 text-[10px] text-slate-400">
          Núcleo digital em estado {props.state}.
        </span>
      </div>
    </div>
  )
}

function HarveyHudPanel(props: { state: HarveyCoreState; items: HarveyOrchestrationItem[] }) {
  const ultimasPerguntas = props.items.slice(-6).reverse()

  const isAtivo =
    props.state === "listening" || props.state === "processing" || props.state === "responding"

  return (
    <aside className="hidden lg:flex w-72 ml-auto flex-col rounded-3xl border border-slate-800/70 bg-slate-950/80 p-4 backdrop-blur">
      <div className="flex items-center justify-between pb-2">
        <div className="text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">
          AI Orchestration
        </div>
        <span
          className={cn(
            "h-2 w-2 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.9)]",
            isAtivo ? "bg-emerald-400 animate-pulse" : "bg-slate-500",
          )}
        />
      </div>
      <p className="mb-3 text-[11px] text-slate-400">
        Histórico das últimas perguntas feitas ao Harvey.
      </p>
      <div className="space-y-2">
        {ultimasPerguntas.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-[11px] text-slate-400">
            Nenhuma pergunta registrada ainda.
          </div>
        ) : (
          ultimasPerguntas.map((pergunta, index) => {
            const visual = getToolVisual(pergunta.tool)
            return (
              <div
                key={`${index}-${pergunta.question.slice(0, 16)}`}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-[11px] text-slate-200"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <div className="flex-1">
                    <p className="mb-1 leading-relaxed">
                      {pergunta.question}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-emerald-300">
                      {visual.icon}
                      <span>{visual.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}

function buildHarveyReply(content: string): string {
  return (
    "Entendi.\n\n" +
    "Vou te ajudar a transformar isso em próximos passos práticos.\n\n" +
    "Você disse:\n" +
    "“" +
    content +
    "”."
  )
}

function formatHarveyToolResponse(toolName: string | undefined, data: any): string {
  if (!toolName || !data || typeof data !== "object") {
    return typeof data === "string" ? data : JSON.stringify(data)
  }

  if (toolName === "criar_evento") {
    const date = data.date || data.data
    const description = data.description || data.descricao || data.title || ""
    return `Evento criado para ${date ?? "data não informada"} com descrição "${description}".`
  }

  if (toolName === "analisar_contrato") {
    const name = data.name || "Contrato"
    const risk = data.risk_level || "desconhecido"
    const score = data.score != null ? String(data.score) : "sem pontuação"
    return `Análise concluída para ${name}. Risco ${risk}, score ${score}.`
  }

  if (toolName === "consultar_jurisprudencia") {
    return "Consulta de jurisprudência executada. Resultados disponíveis para detalhamento."
  }

  if (toolName === "enviar_mensagem_chat") {
    return "Mensagem enviada ao módulo ClausiChat."
  }

  if (toolName === "criar_versao") {
    return "Nova versão criada no módulo de Versionamento."
  }

  if (toolName === "acessar_playbook") {
    return "Playbook jurídico consultado para o tópico solicitado."
  }

  if (toolName === "executar_calculo") {
    return "Cálculo executado no módulo de Cálculos."
  }

  if (toolName === "atualizar_config") {
    return "Configuração atualizada no módulo de Configurações."
  }

  return JSON.stringify(data)
}

function getToolVisual(toolName: string | undefined): { icon: JSX.Element | null; label: string } {
  if (toolName === "criar_evento") {
    return {
      icon: <CalendarCheck className="h-3 w-3 text-emerald-300" />,
      label: "Evento criado no calendário",
    }
  }

  if (toolName === "analisar_contrato") {
    return {
      icon: <FileText className="h-3 w-3 text-emerald-300" />,
      label: "Contrato analisado",
    }
  }

  if (toolName === "consultar_jurisprudencia") {
    return {
      icon: <Scale className="h-3 w-3 text-emerald-300" />,
      label: "Jurisprudência consultada",
    }
  }

  if (toolName === "enviar_mensagem_chat") {
    return {
      icon: <MessageCircle className="h-3 w-3 text-emerald-300" />,
      label: "Mensagem enviada ao ClausiChat",
    }
  }

  if (toolName === "criar_versao") {
    return {
      icon: <Layers className="h-3 w-3 text-emerald-300" />,
      label: "Versão criada",
    }
  }

  if (toolName === "acessar_playbook") {
    return {
      icon: <BookOpen className="h-3 w-3 text-emerald-300" />,
      label: "Playbook consultado",
    }
  }

  if (toolName === "executar_calculo") {
    return {
      icon: <Calculator className="h-3 w-3 text-emerald-300" />,
      label: "Cálculo executado",
    }
  }

  if (toolName === "atualizar_config") {
    return {
      icon: <Settings className="h-3 w-3 text-emerald-300" />,
      label: "Configuração atualizada",
    }
  }

  return {
    icon: null,
    label: "Sem ação registrada",
  }
}
