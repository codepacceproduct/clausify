from typing import Any, Dict


def consultar_jurisprudencia(consulta: str, user_id: str) -> Dict[str, Any]:
  return {
    "tipo": "consulta_jurisprudencia",
    "consulta": consulta,
    "user_id": user_id,
    "status": "ok",
    "resumo": "Resultado de consulta de jurisprudência simulado.",
  }

