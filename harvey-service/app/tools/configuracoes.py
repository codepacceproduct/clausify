from typing import Any, Dict


def atualizar_config(chave: str, valor: Any, user_id: str) -> Dict[str, Any]:
  return {
    "tipo": "atualizar_config",
    "chave": chave,
    "valor": valor,
    "user_id": user_id,
    "status": "ok",
  }

