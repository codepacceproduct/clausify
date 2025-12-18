import { getWaitlistCount } from "@/app/actions/waitlist"
import WaitlistContent from "@/components/waitlist-content"

export const dynamic = "force-dynamic"

export default async function ListaDeEsperaPage() {
  const count = await getWaitlistCount()
  
  return <WaitlistContent initialCount={count} />
}
