"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Copy, Loader2, PartyPopper } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  pixData: {
    qrCode: string
    copyPaste: string
    expiresAt: string
  } | null
  amount: number
  paymentId: string
  planName: string
}

export function CheckoutModal({ isOpen, onClose, pixData, amount, paymentId, planName }: CheckoutModalProps) {
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<"pending" | "paid" | "failed">("pending")
  const [isChecking, setIsChecking] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isOpen && paymentId && status === "pending") {
      // Poll a cada 3 segundos
      intervalId = setInterval(async () => {
        try {
          // Check local apenas para feedback visual de loading se quisesse, 
          // mas polling deve ser silencioso na UI até mudar status
          const res = await fetch(`/api/payments/status?id=${paymentId}`)
          if (res.ok) {
            const data = await res.json()
            if (data.paid) {
              setStatus("paid")
              toast.success("Pagamento confirmado com sucesso!")
              clearInterval(intervalId)
              
              // Recarregar a página após 3 segundos para atualizar plano
              setTimeout(() => {
                onClose()
                window.location.reload()
              }, 3000)
            }
          }
        } catch (error) {
          console.error("Erro ao verificar status", error)
        }
      }, 3000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isOpen, paymentId, status, onClose])

  const copyToClipboard = () => {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste)
      setCopied(true)
      toast.success("Código Pix copiado!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleManualCheck = async () => {
    setIsChecking(true)
    try {
        const res = await fetch(`/api/payments/status?id=${paymentId}`)
        if (res.ok) {
            const data = await res.json()
            if (data.paid) {
                setStatus("paid")
                toast.success("Pagamento confirmado!")
                setTimeout(() => {
                    onClose()
                    window.location.reload()
                }, 2000)
            } else {
                toast.info("Pagamento ainda não confirmado. Aguarde alguns instantes.")
            }
        }
    } catch (error) {
        toast.error("Erro ao verificar pagamento.")
    } finally {
        setIsChecking(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{status === "paid" ? "Pagamento Confirmado!" : "Pagamento via Pix"}</DialogTitle>
          <DialogDescription>
            {status === "paid" 
                ? `Sua assinatura do plano ${planName} foi ativada.`
                : `Valor: R$ ${(amount / 100).toFixed(2).replace('.', ',')} - Plano ${planName}`
            }
          </DialogDescription>
        </DialogHeader>
        
        {status === "paid" ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                    <PartyPopper className="h-10 w-10" />
                </div>
                <p className="text-center font-medium">Obrigado por assinar a Clausify!</p>
                <p className="text-sm text-muted-foreground text-center">Atualizando seu acesso...</p>
            </div>
        ) : (
            pixData && (
            <div className="flex flex-col items-center space-y-4 py-4">
                {/* QR Code Image */}
                <div className="relative h-48 w-48 bg-white p-2 rounded-lg border flex items-center justify-center shadow-sm">
                    {pixData.qrCode ? (
                        <img 
                            src={pixData.qrCode} 
                            alt="QR Code Pix" 
                            className="h-full w-full object-contain" 
                        />
                    ) : (
                        <div className="text-xs text-center text-muted-foreground">
                            QR Code Visual Indisponível<br/>(Use o Copia e Cola)
                        </div>
                    )}
                </div>

                <div className="w-full space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Pix Copia e Cola</label>
                <div className="flex items-center gap-2">
                    <code className="flex-1 rounded bg-muted p-2 font-mono text-xs truncate select-all border">
                    {pixData.copyPaste}
                    </code>
                    <Button size="icon" variant="outline" onClick={copyToClipboard}>
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground text-center bg-blue-50 dark:bg-blue-900/20 p-2 rounded w-full justify-center">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Aguardando confirmação do pagamento...
                </div>
            </div>
            )
        )}
        
        <div className="flex justify-end gap-2">
            {!status || status === "pending" ? (
                <>
                    <Button variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="outline" onClick={handleManualCheck} disabled={isChecking}>
                        {isChecking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Já paguei
                    </Button>
                </>
            ) : (
                <Button onClick={onClose}>
                    Fechar
                </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
