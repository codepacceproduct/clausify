export const MCP_REGISTRY = {
  schedule_meeting: "calendar.voice_create",
} as const

export type MCPActionKey = keyof typeof MCP_REGISTRY

