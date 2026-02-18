from fastapi import APIRouter, Depends, HTTPException
from loguru import logger
from pydantic import BaseModel

from app.agents.harvey import run_harvey
from app.security import verify_harvey_signature


router = APIRouter()


class HarveyRequest(BaseModel):
  command: str


@router.post("/harvey")
async def harvey_endpoint(payload: HarveyRequest, user_id: str = Depends(verify_harvey_signature)):
  try:
    logger.info("HTTP /harvey start user_id={}", user_id)
    result = await run_harvey(payload.command, user_id)
    logger.info("HTTP /harvey end user_id={}", user_id)
    return {"result": result}
  except Exception as exc:
    logger.exception("Erro ao executar Harvey para user_id={}: {}", user_id, exc)
    raise HTTPException(status_code=500, detail="Erro ao executar Harvey")
