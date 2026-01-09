"use client"

import { AuditLogs } from "@/components/audit-logs"

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Segurança da Organização</h3>
        <p className="text-sm text-muted-foreground">
          Visualize logs de auditoria e eventos de segurança.
        </p>
      </div>

      <AuditLogs />
    </div>
  )
}
