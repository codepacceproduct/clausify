"use client"

export type NotificationItem = {
  id: string
  title: string
  message?: string
  createdAt: string
  read?: boolean
}

export function useNotifications() {
  // TODO: trocar por fetch real futuramente: const res = await fetch('/api/notifications')
  // Por enquanto, mantém lista vazia ou lê de localStorage como mock.
  let items: NotificationItem[] = []
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("__mock_notifications") : null
    if (raw) items = JSON.parse(raw)
  } catch {}
  const unread = items.filter((i) => !i.read).length
  return { items, unread }
}
