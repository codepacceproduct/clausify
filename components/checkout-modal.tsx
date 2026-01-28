"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, PartyPopper, ExternalLink, CreditCard, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  pixData?: {
    qrCode: string
    copyPaste: string
    expiresAt: string
  } | null
  amount: number
  paymentId: string
  planName: string
  invoiceUrl?: string
}

export function CheckoutModal({ isOpen, onClose, amount, paymentId, planName, invoiceUrl }: CheckoutModalProps) {
  const [status, setStatus] = useState<"created" | "pending" | "paid" | "failed">("created")
  const [isChecking, setIsChecking] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
        setStatus("created")
    }
  }, [isOpen])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isOpen && paymentId && status !== "paid") {
      // Poll a cada 3 segundos
      intervalId = setInterval(async () => {
        try {
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

  const handleOpenInvoice = () => {
      if (invoiceUrl) {
          window.open(invoiceUrl, '_blank')
      } else {
          toast.error("Link de pagamento indisponível")
      }
  }

  const isPromo = amount === 1 // R$ 0,01 indica fluxo de cupom/promoção

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px] w-full overflow-hidden p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-center">
                {status === "paid" ? "Assinatura Ativa!" : (isPromo ? "Confirmação Necessária" : "Assinatura Criada")}
            </DialogTitle>
            <DialogDescription className="text-center">
              {status === "paid" 
                  ? `Sua assinatura do plano ${planName} foi confirmada.`
                  : `Plano ${planName} - R$ ${(amount / 100).toFixed(2).replace('.', ',')} / mês`
              }
            </DialogDescription>
          </DialogHeader>
        </div>
        
        {status === "paid" ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-bounce">
                    <PartyPopper className="h-10 w-10" />
                </div>
                <p className="text-center font-medium">Obrigado por assinar a Clausify!</p>
                <p className="text-sm text-muted-foreground text-center">Atualizando seu acesso...</p>
                <Button onClick={onClose} className="w-full">
                    Fechar
                </Button>
            </div>
        ) : (
            <div className="flex flex-col items-center w-full p-6 pt-2 space-y-6">
                
                <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="font-medium">{isPromo ? "Aguardando confirmação" : "Aguardando Pagamento"}</h3>
                        <p className="text-sm text-muted-foreground max-w-[280px]">
                            {isPromo 
                                ? "Para ativar sua oferta promocional, finalize a validação pagando o boleto de verificação." 
                                : "Escolha Pix, Boleto ou Cartão de Crédito no link de pagamento para ativar sua assinatura."
                            }
                        </p>
                    </div>
                </div>

                <div className="w-full space-y-3">
                    {invoiceUrl ? (
                        <Button 
                            onClick={handleOpenInvoice} 
                            className="w-full h-12 text-base font-medium shadow-sm"
                            size="lg"
                        >
                            <CreditCard className="mr-2 h-5 w-5" />
                            {isPromo ? "Validar Cupom (R$ 0,01)" : "Pagar Fatura Agora"}
                        </Button>
                    ) : (
                         <div className="text-center p-4 bg-muted/50 rounded-lg border border-dashed">
                             <p className="text-sm font-medium">Fatura enviada por e-mail</p>
                             <p className="text-xs text-muted-foreground mt-1">
                                 Verifique sua caixa de entrada para realizar o pagamento.
                             </p>
                         </div>
                    )}
                    
                    <p className="text-xs text-center text-muted-foreground">
                        Você será redirecionado para o ambiente seguro do Asaas.
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="w-full pt-4 border-t flex justify-between items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        Fechar
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleManualCheck} disabled={isChecking}>
                        {isChecking ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
                        Já paguei
                    </Button>
                </div>
            </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
