import { ChatInterface } from "@/components/clausichat/chat-interface"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ClausiChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <LayoutWrapper>
      <div className="flex flex-col h-full bg-white dark:bg-slate-950">
        <ChatInterface />
      </div>
    </LayoutWrapper>
  )
}
