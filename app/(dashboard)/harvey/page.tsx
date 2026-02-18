import { LayoutWrapper } from "@/components/layout-wrapper"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { HarveyWorkspace } from "@/components/harvey/harvey-workspace"

export default async function HarveyPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <LayoutWrapper>
      <HarveyWorkspace />
    </LayoutWrapper>
  )
}

