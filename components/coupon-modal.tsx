"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Ticket, CreditCard, ArrowRight } from "lucide-react"

interface CouponModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (hasCoupon: boolean) => void
  planName: string
}

export function CouponModal({ isOpen, onClose, onSelect, planName }: CouponModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Você possui um cupom de desconto?</DialogTitle>
          <DialogDescription>
            Selecione uma opção para continuar com a contratação do plano <strong>{planName}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Button 
            variant="outline" 
            className="h-auto py-4 px-6 justify-between hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 group"
            onClick={() => onSelect(true)}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Ticket className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Sim, tenho cupom</div>
                <div className="text-sm text-muted-foreground">Ativação promocional</div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
          </Button>

          <Button 
            variant="outline" 
            className="h-auto py-4 px-6 justify-between hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 group"
            onClick={() => onSelect(false)}
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">Não tenho cupom</div>
                <div className="text-sm text-muted-foreground">Preço padrão</div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
          </Button>
        </div>

        <DialogFooter className="sm:justify-start">
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
