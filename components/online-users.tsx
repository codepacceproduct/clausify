"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface OnlineUsersProps {
  channelId: string
}

interface UserPresence {
  user_id: string
  email: string
  full_name?: string
  avatar_url?: string
  online_at: string
}

export function OnlineUsers({ channelId }: OnlineUsersProps) {
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (!channelId) return

    const channel = supabase.channel(channelId)

    const initPresence = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const userPresence: UserPresence = {
        user_id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
        online_at: new Date().toISOString()
      }

      channel
        .on('presence', { event: 'sync' }, () => {
          const newState = channel.presenceState<UserPresence>()
          const users = Object.values(newState).flat()
          // Remove duplicates based on user_id
          const uniqueUsers: UserPresence[] = Array.from(new Map(users.map(u => [u.user_id, u])).values())
          setOnlineUsers(uniqueUsers)
        })
        .subscribe(async (status: any) => {
          if (status === 'SUBSCRIBED') {
            await channel.track(userPresence)
          }
        })
    }

    initPresence()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelId, supabase])

  if (onlineUsers.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground hidden sm:inline-block">Online:</span>
      <div className="flex items-center -space-x-2">
        <TooltipProvider>
          {onlineUsers.slice(0, 5).map((user) => (
            <Tooltip key={user.user_id}>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 border-2 border-background cursor-pointer hover:z-10 transition-all ring-2 ring-emerald-500/20">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xs font-medium">
                    {user.full_name ? user.full_name.substring(0, 2).toUpperCase() : user.email.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{user.full_name || user.email}</p>
                <p className="text-xs text-emerald-500">● Online agora</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
        {onlineUsers.length > 5 && (
          <div className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-background bg-muted text-xs font-medium z-10 hover:bg-muted/80 transition-colors cursor-help" title={`+${onlineUsers.length - 5} outros usuários`}>
            +{onlineUsers.length - 5}
          </div>
        )}
      </div>
    </div>
  )
}
