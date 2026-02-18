from typing import Any, Dict


def acessar_playbook(topico: str, user_id: str) -> Dict[str, Any]:
  return {
    "tipo": "acessar_playbook",
    "topico": topico,
    "user_id": user_id,
    "status": "ok",
    "resumo": "Playbook consultado de forma simulada.",
  }

