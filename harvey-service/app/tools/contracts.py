from typing import Any, Dict, Optional

import os
import psycopg2


def _get_connection():
  database_url = os.getenv("DATABASE_URL")
  if not database_url:
    return None

  return psycopg2.connect(database_url)


def analisar_contrato(contrato_id: str, user_id: str) -> Dict[str, Any]:
  try:
    conn = _get_connection()
  except Exception:
    conn = None
  if conn is None:
    return {
      "tipo": "analise_contrato",
      "contrato_id": contrato_id,
      "user_id": user_id,
      "status": "skip",
      "mensagem": "DATABASE_URL não configurada para o Harvey Service",
    }
  try:
    with conn:
      with conn.cursor() as cur:
        cur.execute(
          """
          SELECT id, user_id, name, client_name, type, status, risk_level, score, content
          FROM contracts
          WHERE id = %s AND user_id = %s;
          """,
          (contrato_id, user_id),
        )
        row = cur.fetchone()

    if not row:
      return {
        "tipo": "analise_contrato",
        "contrato_id": contrato_id,
        "user_id": user_id,
        "status": "not_found",
        "mensagem": "Contrato não encontrado para este usuário.",
      }

    return {
      "tipo": "analise_contrato",
      "contrato_id": str(row[0]),
      "user_id": str(row[1]),
      "name": row[2],
      "client_name": row[3],
      "contract_type": row[4],
      "status": row[5],
      "risk_level": row[6],
      "score": row[7],
      "has_content": bool(row[8]),
    }
  finally:
    conn.close()
