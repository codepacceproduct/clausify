import os
from typing import Any, Dict, List

import httpx


def _supabase_base_url() -> str | None:
  url = os.getenv("SUPABASE_URL")
  return url.rstrip("/") if url else None


def _supabase_headers() -> Dict[str, str] | None:
  srk = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
  if not srk:
    return None
  return {
    "apikey": srk,
    "Authorization": f"Bearer {srk}",
    "Content-Type": "application/json",
  }


def _post(table: str, json: Dict[str, Any]) -> Dict[str, Any] | None:
  base = _supabase_base_url()
  headers = _supabase_headers()
  if not base or not headers:
    return None
  with httpx.Client(timeout=15) as client:
    resp = client.post(f"{base}/rest/v1/{table}", headers={**headers, "Prefer": "return=representation"}, json=json)
    if resp.status_code >= 400:
      return None
    data = resp.json()
    return data[0] if isinstance(data, list) and data else data


def _get(table: str, params: Dict[str, Any]) -> List[Dict[str, Any]]:
  base = _supabase_base_url()
  headers = _supabase_headers()
  if not base or not headers:
    return []
  with httpx.Client(timeout=15) as client:
    resp = client.get(f"{base}/rest/v1/{table}", headers=headers, params=params)
    if resp.status_code >= 400:
      return []
    return resp.json()


def add_memory(user_id: str, role: str, content: str, tool_name: str | None = None) -> None:
  try:
    _post(
      "harvey_memory",
      {"user_id": user_id, "role": role, "content": content, "tool_name": tool_name},
    )
  except Exception:
    return


def get_recent_memory(user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
  try:
    rows = _get(
      "harvey_memory",
      {
        "select": "role,content,tool_name,created_at",
        "user_id": f"eq.{user_id}",
        "order": "created_at.desc",
        "limit": str(limit),
      },
    )
    return [
      {
        "role": r.get("role"),
        "content": r.get("content"),
        "tool_name": r.get("tool_name"),
        "created_at": r.get("created_at"),
      }
      for r in rows
    ]
  except Exception:
    return []
