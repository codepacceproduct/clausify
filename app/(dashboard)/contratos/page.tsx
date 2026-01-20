import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ContractsContent } from "@/components/contracts/contracts-content"
import { ContractHistorySkeleton } from "@/components/contracts/skeletons"

async function getContracts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data: contracts, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
  
  if (error) {
    console.error("Error fetching contracts:", error)
    return []
  }

  return contracts || []
}

// I should verify how /api/contracts/list fetches data to replicate it exactly.
// Reading previous file content showed: fetch("/api/contracts/list")
// I will assume for now we want the same data.

export default async function ContractsPage() {
  const contracts = await getContracts()

  return (
    <Suspense fallback={<ContractHistorySkeleton />}>
      <ContractsContent initialContracts={contracts} />
    </Suspense>
  )
}
