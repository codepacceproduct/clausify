"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GitBranch, Clock, CheckCircle, Edit3, Loader2 } from "lucide-react"
import { VersionTimelineSkeleton } from "@/components/contracts/skeletons"

interface TimelineEvent {
  id: string
  type: "created" | "edited" | "approved" | "commented" | "uploaded"
  version: string
  user: {
    name: string
    avatar: string
    role: string
  }
  date: string
  description: string
  details?: string
}

interface VersionTimelineProps {
  contractId: string
  contracts?: any[]
}

export function VersionTimeline({ contractId }: VersionTimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (contractId) {
      fetchTimeline()
    }
  }, [contractId])

  async function fetchTimeline() {
    setLoading(true)
    try {
      const res = await fetch(`/api/contracts/${contractId}/versions`)
      if (res.ok) {
        const versions = await res.json()
        
        // Transform versions into timeline events
        const timelineEvents: TimelineEvent[] = versions.map((v: any) => ({
          id: v.id,
          type: "created", // For now, everything is a version creation
          version: v.version_number,
          user: {
            name: "Sistema", // We can improve this if we fetch user details
            avatar: "",
            role: "Automático"
          },
          date: new Date(v.created_at).toLocaleString(),
          description: `Versão ${v.version_number} criada`,
          details: v.changes_summary || "Nova versão gerada via análise"
        }))
        
        setEvents(timelineEvents)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-white" />
      case "edited":
        return <Edit3 className="h-4 w-4 text-white" />
      case "created":
        return <GitBranch className="h-4 w-4 text-white" />
      default:
        return <Clock className="h-4 w-4 text-white" />
    }
  }

  const getBadgeVariant = (type: TimelineEvent["type"]) => {
    switch (type) {
      case "approved":
        return "success"
      case "edited":
        return "warning"
      case "created":
        return "default"
      default:
        return "secondary"
    }
  }

  if (loading) {
      return <VersionTimelineSkeleton />
  }

  if (events.length === 0) {
      return (
          <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum evento registrado para este contrato.</p>
          </div>
      )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Linha do Tempo
            </CardTitle>
            <CardDescription>Histórico completo de alterações e eventos</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="relative space-y-8 pl-6 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-20px)] before:w-[2px] before:bg-muted">
            {events.map((event) => (
              <div key={event.id} className="relative">
                <div
                  className={`absolute -left-[30px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-background ${
                    event.type === "approved"
                      ? "bg-success"
                      : event.type === "edited"
                        ? "bg-warning"
                        : event.type === "created"
                          ? "bg-primary"
                          : "bg-muted-foreground"
                  }`}
                >
                  {getIcon(event.type)}
                </div>
                <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{event.description}</span>
                        <Badge variant="outline" className="text-xs">
                          v{event.version}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.details}</p>
                    </div>
                    <time className="text-xs text-muted-foreground whitespace-nowrap">{event.date}</time>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t mt-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={event.user.avatar} />
                      <AvatarFallback>{event.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-xs">
                      <span className="font-medium">{event.user.name}</span>
                      <span className="text-muted-foreground">{event.user.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
