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
  }


def analisar_contrato(contrato_id: str, user_id: str) -> Dict[str, Any]:
  base = _supabase_base_url()
  headers = _supabase_headers()
  if not base or not headers:
    return {
      "tipo": "analise_contrato",
      "contrato_id": contrato_id,
      "user_id": user_id,
      "status": "skip",
      "mensagem": "Variáveis SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY não configuradas",
    }

  params = {
    "select": "id,user_id,name,client_name,type,status,risk_level,score,content",
    "id": f"eq.{contrato_id}",
    "user_id": f"eq.{user_id}",
    "limit": "1",
  }

  with httpx.Client(timeout=15) as client:
    resp = client.get(f"{base}/rest/v1/contracts", headers=headers, params=params)
    if resp.status_code >= 400:
      return {
        "tipo": "analise_contrato",
        "contrato_id": contrato_id,
        "user_id": user_id,
        "status": "error",
        "mensagem": f"Falha ao consultar contrato: {resp.text}",
      }
    rows = resp.json()
    if not rows:
      return {
        "tipo": "analise_contrato",
        "contrato_id": contrato_id,
        "user_id": user_id,
        "status": "not_found",
        "mensagem": "Contrato não encontrado para este usuário.",
      }
    row = rows[0]

  return {
    "tipo": "analise_contrato",
    "contrato_id": row.get("id"),
    "user_id": row.get("user_id"),
    "name": row.get("name"),
    "client_name": row.get("client_name"),
    "contract_type": row.get("type"),
    "status": row.get("status"),
    "risk_level": row.get("risk_level"),
    "score": row.get("score"),
    "has_content": bool(row.get("content")),
  }
