import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, CheckCircle2, XCircle, Clock, FileText } from "lucide-react"

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
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <FileText className="h-8 w-8 opacity-50" />
            </div>
            <p className="font-medium">Nenhuma cobrança encontrada</p>
            <p className="text-sm mt-1">Suas faturas aparecerão aqui assim que forem geradas.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Fatura</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Método</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => {
                  const status = statusConfig[payment.status as keyof typeof statusConfig]
                  const StatusIcon = status.icon

                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${status.className} flex w-fit items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {payment.method}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:w-auto sm:px-2 sm:h-9">
                          <Download className="h-4 w-4 sm:mr-2" />
                          <span className="hidden sm:inline">Baixar NF-e</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
        
        {payments.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button variant="outline" className="w-full sm:w-auto">Carregar Mais</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
