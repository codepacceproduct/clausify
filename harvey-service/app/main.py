import os

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from loguru import logger

from app.api.routes import router
from app.voice.routes import router as voice_router

logger.add("logs/harvey.log", rotation="10 MB", retention="7 days", enqueue=True)

app = FastAPI(title="Harvey AI - Clausify")


@app.get("/health")
async def health():
  return {"status": "ok"}


app.include_router(router)
app.include_router(voice_router)

os.makedirs("audio", exist_ok=True)
app.mount("/audio", StaticFiles(directory="audio"), name="audio")


if __name__ == "__main__":
  import uvicorn

  uvicorn.run(
    "app.main:app",
    host="0.0.0.0",
    port=8000,
    reload=True,
  )
