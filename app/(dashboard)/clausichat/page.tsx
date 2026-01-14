"use client"

import { ChatInterface } from "@/components/clausichat/chat-interface"
import { LayoutWrapper } from "@/components/layout-wrapper"

export default function ClausiChatPage() {
  return (
    <LayoutWrapper>
      <div className="flex flex-col h-full bg-white dark:bg-slate-950">
        <ChatInterface />
      </div>
    </LayoutWrapper>
  )
}
