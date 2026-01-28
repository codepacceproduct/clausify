import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, CheckCircle2, XCircle, Clock, ExternalLink, AlertTriangle, CreditCard } from "lucide-react"

export interface Payment {
  id: string
  date: string
  amount: string
  status: string
  method?: string
  invoiceUrl?: string
  metadata?: any
}

interface PaymentHistoryProps {
  payments: Payment[]
}

const statusConfig: any = {
  paid: {
    label: "Pago",
    icon: CheckCircle2,
    className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100",
  },
  pending: {
    label: "Pendente",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100",
  },
  failed: {
    label: "Falhou",
    icon: XCircle,
    className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100",
  },
  past_due: {
    label: "Vencido",
    icon: AlertTriangle,
    className: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-100",
  },
  refunded: {
    label: "Estornado",
    icon: CheckCircle2,
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  canceled: {
      label: "Cancelado",
      icon: XCircle,
      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  }
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const handleOpenInvoice = (paymentId: string) => {
    // Abre a rota dinâmica que redireciona para a fatura atualizada
    window.open(`/api/billing/invoice/${paymentId}`, '_blank');
  }

  const getMethodLabel = (method?: string) => {
    if (!method || method === "UNDEFINED") return "À escolha";
    if (method === "CREDIT_CARD") return "Cartão de Crédito";
    if (method === "BOLETO") return "Boleto";
    return method;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    // Adiciona T12:00:00 para garantir que a data seja interpretada no meio do dia
    // evitando problemas de fuso horário onde meia-noite UTC vira dia anterior no Brasil (UTC-3)
    return new Date(`${dateString}T12:00:00`).toLocaleDateString('pt-BR');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Cobranças</CardTitle>
        <CardDescription>Veja todas as suas cobranças, acesse faturas e verifique status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              Nenhuma cobrança encontrada.
            </div>
          ) : (
            payments.map((payment) => {
              const status = statusConfig[payment.status.toLowerCase()] || statusConfig.pending
              const StatusIcon = status.icon
              const invoiceUrl = payment.invoiceUrl || payment.metadata?.invoiceUrl || payment.metadata?.bankSlipUrl;
              const hasInvoice = !!payment.id; // Agora baseamos a disponibilidade apenas no ID
              const isPending = status.label === 'Pendente' || status.label === 'Vencido';

              return (
                <div
                  key={payment.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 w-full sm:w-auto">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      <StatusIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">
                             {formatDate(payment.date)}
                        </span>
                        <Badge variant="secondary" className={status.className}>
                          {status.label}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-0.5">
                        <div className="font-mono text-xs">{payment.id}</div>
                        <div className="block sm:hidden">{getMethodLabel(payment.method)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <div className="hidden sm:block text-sm text-muted-foreground min-w-[100px] text-right">
                        {getMethodLabel(payment.method)}
                    </div>
                    <div className="font-semibold text-foreground min-w-[100px] text-left sm:text-right">
                      {payment.amount}
                    </div>
                    
                    {hasInvoice ? (
                        <Button 
                            variant={isPending ? "default" : "outline"}
                            size="sm" 
                            className="shrink-0 gap-2"
                            onClick={() => handleOpenInvoice(payment.id)}
                        >
                            {isPending ? <CreditCard className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                            <span className="hidden sm:inline">{isPending ? "Pagar Agora" : "Fatura"}</span>
                            <span className="sm:hidden">{isPending ? "Pagar" : "Ver"}</span>
                        </Button>
                    ) : isPending && (
                        <span className="text-xs text-destructive font-medium">Link indisponível</span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
