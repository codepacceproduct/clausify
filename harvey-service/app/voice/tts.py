from pathlib import Path

from loguru import logger
from openai import OpenAI


client = OpenAI(timeout=30, max_retries=2)


async def gerar_audio_resposta(texto: str, output_path: str) -> str:
  path = Path(output_path)
  path.parent.mkdir(parents=True, exist_ok=True)

  try:
    response = client.audio.speech.create(
      model="gpt-4o-mini-tts",
      voice="alloy",
      input=texto,
    )
  except Exception as exc:
    logger.exception("Erro ao gerar áudio de resposta com TTS: {}", exc)
    raise

  with path.open("wb") as f:
    f.write(response.content)

  return str(path)
