from loguru import logger
from openai import OpenAI


client = OpenAI(timeout=30, max_retries=2)


async def transcrever_audio(file_path: str) -> str:
  try:
    with open(file_path, "rb") as audio_file:
      transcript = client.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file,
      )
  except Exception as exc:
    logger.exception("Erro ao transcrever áudio com Whisper: {}", exc)
    raise

  return transcript.text
