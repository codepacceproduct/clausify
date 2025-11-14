import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, CheckCircle2, XCircle, Clock } from "lucide-react"

const payments = [
  {
    id: "INV-2024-012",
    date: "15 Dez 2024",
    amount: "R$ 299,00",
    status: "paid",
    method: "Cartão •••• 4532",
  },
  {
    id: "INV-2024-011",
    date: "15 Nov 2024",
    amount: "R$ 299,00",
    status: "paid",
    method: "Cartão •••• 4532",
  },
  {
    id: "INV-2024-010",
    date: "15 Out 2024",
    amount: "R$ 299,00",
    status: "paid",
    method: "Cartão •••• 4532",
  },
  {
    id: "INV-2024-009",
    date: "15 Set 2024",
    amount: "R$ 299,00",
    status: "paid",
    method: "Cartão •••• 4532",
  },
  {
    id: "INV-2024-008",
    date: "15 Ago 2024",
    amount: "R$ 299,00",
    status: "failed",
    method: "Cartão •••• 1234",
  },
]

const statusConfig = {
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
}

export function PaymentHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pagamentos</CardTitle>
        <CardDescription>Veja todas as suas transações e baixe notas fiscais</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payments.map((payment) => {
            const status = statusConfig[payment.status as keyof typeof statusConfig]
            const StatusIcon = status.icon

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
                      <span className="font-medium text-foreground">{payment.id}</span>
                      <Badge variant="secondary" className={status.className}>
                        {status.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      <div>{payment.date}</div>
                      <div className="block sm:hidden">{payment.method}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <div className="hidden sm:block text-sm text-muted-foreground min-w-[140px]">{payment.method}</div>
                  <div className="font-semibold text-foreground min-w-[100px] text-left sm:text-right">
                    {payment.amount}
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0">
                    <Download className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">NF-e</span>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-6 flex justify-center">
          <Button variant="outline">Carregar Mais</Button>
        </div>
      </CardContent>
    </Card>
  )
}
