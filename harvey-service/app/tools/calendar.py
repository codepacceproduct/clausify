from datetime import datetime
from typing import Any, Dict

import os
import httpx


def _supabase_base_url():
  url = os.getenv("SUPABASE_URL")
  return url.rstrip("/") if url else None


def _supabase_headers():
  srk = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
  if not srk:
    return None
  return {
    "apikey": srk,
    "Authorization": f"Bearer {srk}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
  }


def criar_evento(data: str, descricao: str, user_id: str) -> Dict[str, Any]:
  base = _supabase_base_url()
  headers = _supabase_headers()
  if not base or not headers:
    return {
      "status": "skip",
      "tipo": "evento_calendario",
      "motivo": "Variáveis SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY não configuradas",
      "data": data,
      "descricao": descricao,
      "user_id": user_id,
    }

  # Formata campos para a tabela events
  try:
    dt = datetime.fromisoformat(data)
  except Exception:
    dt = datetime.utcnow()

  payload = {
    "user_id": user_id,
    "title": (descricao[:80] if descricao else "Evento criado pelo Harvey") or "Evento criado pelo Harvey",
    "description": descricao,
    "date": dt.date().isoformat(),
    "start_time": dt.strftime("%H:%M"),
    "type": "meeting",
  }

  with httpx.Client(timeout=15) as client:
    resp = client.post(f"{base}/rest/v1/events", headers=headers, json=payload)
    if resp.status_code >= 400:
      return {
        "status": "error",
        "tipo": "evento_calendario",
        "motivo": f"Falha ao inserir no Supabase: {resp.text}",
        "data": data,
        "descricao": descricao,
        "user_id": user_id,
      }
    out = resp.json()
    row = out[0] if isinstance(out, list) and out else out

  return {
    "status": "ok",
    "tipo": "evento_calendario",
    "id": row.get("id"),
    "user_id": row.get("user_id"),
    "title": row.get("title"),
    "description": row.get("description"),
    "date": row.get("date"),
    "event_type": row.get("type"),
    "priority": row.get("priority"),
    "created_at": row.get("created_at"),
  }
