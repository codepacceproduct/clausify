from typing import Any, Dict


def enviar_mensagem_chat(mensagem: str, user_id: str) -> Dict[str, Any]:
  return {
    "tipo": "mensagem_clausichat",
    "mensagem": mensagem,
    "user_id": user_id,
    "status": "ok",
  }

