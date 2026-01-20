import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { VersionamentoContent } from "@/components/contracts/versionamento-content"
import { Loader2 } from "lucide-react"

async function getContracts() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return []

  const { data: contracts, error } = await supabase
    .from("contracts")
    .select("id, name, client_name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
  
  if (error) {
    console.error("Error fetching contracts:", error)
    return []
  }

  return contracts || []
}

async function getVersions(contractId: string) {
  if (!contractId) return []
  
  const supabase = await createClient()
  const { data: versions, error } = await supabase
    .from("contract_versions")
    .select(`
      id,
      version_number,
      created_at,
      changes_summary,
      status,
      created_by,
      content,
      analysis
    `)
    .eq("contract_id", contractId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching versions:", error)
    return []
  }

  return versions || []
}

export default async function VersionamentoPage(
  props: {
    searchParams: Promise<{ contractId?: string }>
  }
) {
  const searchParams = await props.searchParams
  const contracts = await getContracts()
  
  const initialContractId = searchParams.contractId || (contracts.length > 0 ? contracts[0].id : undefined)
  
  let versions: any[] = []
  if (initialContractId) {
    versions = await getVersions(initialContractId)
  }

  return (
    <Suspense fallback={<div className="flex h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
      <VersionamentoContent 
        initialContracts={contracts} 
        initialVersions={versions}
        initialContractId={initialContractId}
      />
    </Suspense>
  )
}
