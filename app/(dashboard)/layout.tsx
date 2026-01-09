import { AuthGuard } from "@/components/auth-guard"
import { LawyerChatbot } from "@/components/lawyer-chatbot"
import { DatabaseStatusCheck } from "@/components/database-status-check"
import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      {children}
      <LawyerChatbot />
      <DatabaseStatusCheck />
    </AuthGuard>
  )
}
