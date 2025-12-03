export type ContractRow = {
  id: string
  title: string
  client: string | null
  value: number | null
  type: string | null
  status: string
  risk_score: number | null
  created_at: string
  updated_at: string
}

export type InsertContract = {
  title: string
  client?: string | null
  value?: number | null
  type?: string | null
  status?: string
  risk_score?: number | null
}

