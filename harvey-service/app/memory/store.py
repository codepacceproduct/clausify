import json
import os
from datetime import datetime
from typing import Any, Dict, List

import psycopg2


def _get_connection():
  database_url = os.getenv("DATABASE_URL")
  if not database_url:
    return None

  return psycopg2.connect(database_url)


def _ensure_table():
  try:
    conn = _get_connection()
  except Exception:
    return
  if conn is None:
    return
  try:
    with conn:
      with conn.cursor() as cur:
        cur.execute(
          """
          CREATE TABLE IF NOT EXISTS harvey_memory (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            tool_name TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          """,
        )
  finally:
    conn.close()


_ensure_table()


def add_memory(user_id: str, role: str, content: str, tool_name: str | None = None) -> None:
  try:
    conn = _get_connection()
  except Exception:
    return
  if conn is None:
    return
  try:
    with conn:
      with conn.cursor() as cur:
        cur.execute(
          """
          INSERT INTO harvey_memory (user_id, role, content, tool_name)
          VALUES (%s, %s, %s, %s);
          """,
          (user_id, role, content, tool_name),
        )
  finally:
    conn.close()


def get_recent_memory(user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
  try:
    conn = _get_connection()
  except Exception:
    return []
  if conn is None:
    return []
  try:
    with conn:
      with conn.cursor() as cur:
        cur.execute(
          """
          SELECT role, content, tool_name, created_at
          FROM harvey_memory
          WHERE user_id = %s
          ORDER BY created_at DESC
          LIMIT %s;
          """,
          (user_id, limit),
        )
        rows = cur.fetchall()

    return [
      {
        "role": row[0],
        "content": row[1],
        "tool_name": row[2],
        "created_at": row[3].isoformat() if row[3] else None,
      }
      for row in rows
    ]
  finally:
    conn.close()
