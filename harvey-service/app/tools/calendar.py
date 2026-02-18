from datetime import datetime
from typing import Any, Dict, Optional

import os
import psycopg2


def _get_connection():
  database_url = os.getenv("DATABASE_URL")
  if not database_url:
    return None

  return psycopg2.connect(database_url)


def criar_evento(data: str, descricao: str, user_id: str) -> Dict[str, Any]:
  try:
    conn = _get_connection()
  except Exception:
    conn = None
  if conn is None:
    return {
      "status": "skip",
      "tipo": "evento_calendario",
      "motivo": "DATABASE_URL não configurada para o Harvey Service",
      "data": data,
      "descricao": descricao,
      "user_id": user_id,
    }
  try:
    with conn:
      with conn.cursor() as cur:
        cur.execute(
          """
          CREATE TABLE IF NOT EXISTS events (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            date DATE NOT NULL,
            start_time TEXT,
            end_time TEXT,
            type TEXT NOT NULL,
            priority TEXT DEFAULT 'medium',
            location TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          """,
        )

        cur.execute(
          """
          INSERT INTO events (user_id, title, description, date, type)
          VALUES (%s, %s, %s, %s, %s)
          RETURNING id, user_id, title, description, date, type, priority, created_at;
          """,
          (
            user_id,
            descricao[:80] or "Evento criado pelo Harvey",
            descricao,
            datetime.fromisoformat(data).date(),
            "obrigacao",
          ),
        )
        row = cur.fetchone()

    return {
      "status": "ok",
      "tipo": "evento_calendario",
      "id": str(row[0]),
      "user_id": str(row[1]),
      "title": row[2],
      "description": row[3],
      "date": row[4].isoformat(),
      "event_type": row[5],
      "priority": row[6],
      "created_at": row[7].isoformat() if row[7] else None,
    }
  finally:
    conn.close()
