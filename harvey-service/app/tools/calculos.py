from typing import Any, Dict


def executar_calculo(tipo: str, parametros: Dict[str, Any], user_id: str) -> Dict[str, Any]:
  return {
    "tipo": "executar_calculo",
    "calculo": tipo,
    "parametros": parametros,
    "user_id": user_id,
    "status": "ok",
  }

