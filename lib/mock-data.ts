export interface WaitlistLead {
  id: string
  name: string
  email: string
  company: string
  position: number
  status: "pending" | "contacted" | "converted"
  createdAt: string
  source: string
}

export const mockWaitlistLeads: WaitlistLead[] = [
  {
    id: "1",
    name: "Dr. Carlos Silva",
    email: "carlos.silva@tozzinifreire.com.br",
    company: "TozziniFreire Advogados",
    position: 23,
    status: "contacted",
    createdAt: "2024-12-15T14:30:00",
    source: "Landing Page",
  },
  {
    id: "2",
    name: "Dra. Ana Paula Costa",
    email: "ana.costa@mattosfilho.com.br",
    company: "Mattos Filho Advogados",
    position: 45,
    status: "pending",
    createdAt: "2024-12-14T09:15:00",
    source: "LinkedIn",
  },
  {
    id: "3",
    name: "Dr. Roberto Mendes",
    email: "roberto.mendes@pinheiro.com.br",
    company: "Pinheiro Neto Advogados",
    position: 67,
    status: "converted",
    createdAt: "2024-12-13T16:45:00",
    source: "Indicação",
  },
  {
    id: "4",
    name: "Dra. Fernanda Alves",
    email: "fernanda.alves@machado.com.br",
    company: "Machado Meyer Advogados",
    position: 89,
    status: "pending",
    createdAt: "2024-12-12T11:20:00",
    source: "Google Ads",
  },
  {
    id: "5",
    name: "Dr. Pedro Santos",
    email: "pedro.santos@demarest.com.br",
    company: "Demarest Advogados",
    position: 102,
    status: "contacted",
    createdAt: "2024-12-11T13:50:00",
    source: "Landing Page",
  },
  {
    id: "6",
    name: "Dra. Julia Lima",
    email: "julia.lima@lefosse.com.br",
    company: "Lefosse Advogados",
    position: 134,
    status: "pending",
    createdAt: "2024-12-10T10:30:00",
    source: "Landing Page",
  },
  {
    id: "7",
    name: "Dr. Marcos Oliveira",
    email: "marcos.oliveira@trenchrossi.com.br",
    company: "Trench Rossi Watanabe",
    position: 156,
    status: "contacted",
    createdAt: "2024-12-09T15:10:00",
    source: "Facebook",
  },
  {
    id: "8",
    name: "Dra. Patricia Rocha",
    email: "patricia.rocha@vbso.com.br",
    company: "VBSO Advogados",
    position: 178,
    status: "pending",
    createdAt: "2024-12-08T08:45:00",
    source: "LinkedIn",
  },
  {
    id: "9",
    name: "Dr. Lucas Ferreira",
    email: "lucas.ferreira@bmag.com.br",
    company: "BMAG Advogados",
    position: 201,
    status: "converted",
    createdAt: "2024-12-07T14:20:00",
    source: "Indicação",
  },
  {
    id: "10",
    name: "Dra. Camila Barbosa",
    email: "camila.barbosa@gvm.com.br",
    company: "GVM Advogados",
    position: 223,
    status: "pending",
    createdAt: "2024-12-06T12:00:00",
    source: "Landing Page",
  },
]

export function getWaitlistLeads(): WaitlistLead[] {
  return mockWaitlistLeads
}

export function getWaitlistStats() {
  const leads = mockWaitlistLeads
  return {
    total: leads.length,
    pending: leads.filter((l) => l.status === "pending").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    converted: leads.filter((l) => l.status === "converted").length,
    todaySignups: 12,
    conversionRate: 20,
  }
}
