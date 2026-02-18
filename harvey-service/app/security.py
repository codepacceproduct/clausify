import hmac
import os
from hashlib import sha256

from fastapi import Header, HTTPException


def verify_harvey_signature(
  x_harvey_user_id: str = Header(...),
  x_harvey_timestamp: str = Header(...),
  x_harvey_signature: str = Header(...),
) -> str:
  secret = os.getenv("HARVEY_SHARED_SECRET", "")
  if not secret:
    return x_harvey_user_id

  msg = f"{x_harvey_user_id}:{x_harvey_timestamp}"
  expected = hmac.new(secret.encode("utf-8"), msg.encode("utf-8"), sha256).hexdigest()

  if not hmac.compare_digest(expected, x_harvey_signature):
    raise HTTPException(status_code=401, detail="Assinatura inválida para o Harvey Service")

  return x_harvey_user_id
