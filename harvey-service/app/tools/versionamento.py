from typing import Any, Dict


def criar_versao(documento_id: str, descricao: str, user_id: str) -> Dict[str, Any]:
  return {
    "tipo": "criar_versao",
    "documento_id": documento_id,
    "descricao": descricao,
    "user_id": user_id,
    "status": "ok",
  }

