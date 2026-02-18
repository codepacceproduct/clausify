import os
from uuid import uuid4

from fastapi import APIRouter, Depends, File, UploadFile
from loguru import logger

from app.voice.stt import transcrever_audio
from app.voice.tts import gerar_audio_resposta
from app.agents.harvey import run_harvey
from app.security import verify_harvey_signature


router = APIRouter()


@router.post("/harvey/voice")
async def harvey_voice(
  file: UploadFile = File(...),
  user_id: str = Depends(verify_harvey_signature),
):
  os.makedirs("audio", exist_ok=True)

  input_filename = f"audio/input_{uuid4().hex}_{file.filename or 'audio.webm'}"
  output_filename = f"audio/response_{uuid4().hex}.mp3"

  logger.info("Harvey voice request user_id={} file_name={}", user_id, file.filename)

  with open(input_filename, "wb") as buffer:
    buffer.write(await file.read())

  texto_usuario = await transcrever_audio(input_filename)

  resposta_texto = await run_harvey(texto_usuario, user_id)

  audio_path = await gerar_audio_resposta(str(resposta_texto), output_filename)

  audio_rel_path = audio_path.replace("\\", "/")
  audio_url = f"http://localhost:8000/{audio_rel_path}"

  logger.info("Harvey voice response user_id={} transcription={} audio_file={}", user_id, texto_usuario, audio_rel_path)

  return {
    "transcription": texto_usuario,
    "response_text": resposta_texto,
    "audio_file": audio_rel_path,
    "audio_url": audio_url,
  }
