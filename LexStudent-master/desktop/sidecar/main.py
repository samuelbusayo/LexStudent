import argparse
import os
import sys
import json
import base64
import asyncio
from pathlib import Path
from typing import Optional

import uvicorn
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import transcriber
import rag
import notes_generator
import llm_engine
from model_manager import (
    get_data_dir,
    get_models_dir,
    list_downloaded_whisper_models,
    list_downloaded_llm_models,
    download_whisper_model,
    download_llm_model,
    get_whisper_model_path,
    get_llm_model_path,
    WHISPER_MODELS,
    LLM_MODELS,
)

app = FastAPI(title="LexScholar AI Sidecar", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Persistent config ──────────────────────────────────────────────────────────

_config_path = get_data_dir() / "sidecar_config.json"
config: dict = {}


def load_config():
    global config
    if _config_path.exists():
        try:
            config = json.loads(_config_path.read_text())
        except Exception:
            config = {}
    else:
        config = {"backend": "local", "local_model": "qwen2.5-3b"}


def save_config(cfg: dict):
    _config_path.parent.mkdir(parents=True, exist_ok=True)
    _config_path.write_text(json.dumps(cfg, indent=2))


load_config()


# ── GPU detection ──────────────────────────────────────────────────────────────

def detect_gpu() -> str:
    try:
        import torch

        if torch.cuda.is_available():
            return f"cuda ({torch.cuda.get_device_name(0)})"
        elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            return "mps (Apple Silicon)"
    except ImportError:
        pass
    return "none"


# ── Request/Response Models ────────────────────────────────────────────────────

class TranscribeRequest(BaseModel):
    audio_b64: str
    language: str = "en"
    model: str = "distil-large-v3"


class IngestRequest(BaseModel):
    material_id: str
    module_id: str
    file_path: str


class NoteGenerateRequest(BaseModel):
    session_id: str
    module_id: str
    transcript: str
    topic: str


# ── Health ─────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    whisper_models = list_downloaded_whisper_models()
    llm_models = list_downloaded_llm_models()

    whisper_ready = any(m["downloaded"] for m in whisper_models)
    llm_ready = any(m["downloaded"] for m in llm_models)

    backend = config.get("backend", "local")
    # Cloud backends are "ready" if API key is set
    if backend == "anthropic":
        llm_ready = llm_ready or bool(config.get("api_key"))
    elif backend == "openai":
        llm_ready = llm_ready or bool(config.get("api_key"))

    return {
        "status": "ok",
        "whisper_ready": whisper_ready,
        "llm_ready": llm_ready,
        "llm_backend": backend,
        "llm_loaded": llm_engine.get_loaded_model(),
        "gpu": detect_gpu(),
    }


# ── Model Management ──────────────────────────────────────────────────────────

@app.get("/models")
async def get_models():
    return {
        "whisper": list_downloaded_whisper_models(),
        "llm": list_downloaded_llm_models(),
    }


@app.post("/models/download")
async def download_model_endpoint(body: dict):
    model_type = body.get("type")  # "whisper" or "llm"
    model_name = body.get("name")

    if model_type == "whisper":
        if model_name not in WHISPER_MODELS:
            raise HTTPException(400, f"Unknown whisper model: {model_name}")
        path = await asyncio.to_thread(download_whisper_model, model_name)
        return {"status": "ok", "path": str(path)}
    elif model_type == "llm":
        if model_name not in LLM_MODELS:
            raise HTTPException(400, f"Unknown LLM model: {model_name}")
        path = await asyncio.to_thread(download_llm_model, model_name)
        return {"status": "ok", "path": str(path)}
    else:
        raise HTTPException(400, "type must be 'whisper' or 'llm'")


# ── Transcription ─────────────────────────────────────────────────────────────

@app.post("/transcribe")
async def transcribe(req: TranscribeRequest):
    # Resolve the whisper model path from our managed directory
    model_path = get_whisper_model_path(req.model)
    model_ref = str(model_path) if model_path else req.model
    result = transcriber.transcribe_audio(req.audio_b64, req.language, model_ref)
    return result


@app.websocket("/stream")
async def stream_transcription(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            data = await ws.receive_bytes()
            audio_b64 = base64.b64encode(data).decode()
            result = transcriber.transcribe_audio(audio_b64)
            if result["text"].strip():
                for seg in result["segments"]:
                    await ws.send_json({
                        "type": "final",
                        "text": seg["text"],
                        "t_start": seg["t_start"],
                        "t_end": seg["t_end"],
                        "speaker": seg["speaker"],
                    })
    except WebSocketDisconnect:
        pass


# ── Materials / RAG ───────────────────────────────────────────────────────────

@app.post("/materials/ingest")
async def ingest_material(req: IngestRequest):
    result = rag.ingest_material(req.material_id, req.module_id, req.file_path)
    return result


@app.delete("/materials/{material_id}")
async def delete_material(material_id: str):
    rag.delete_material_chunks(material_id)
    return {"status": "ok"}


@app.get("/materials/{module_id}")
async def list_materials(module_id: str):
    return rag.list_ingested_materials(module_id)


# ── Note Generation ───────────────────────────────────────────────────────────

@app.post("/notes/generate")
async def generate_note(req: NoteGenerateRequest):
    result = notes_generator.generate_notes(
        session_id=req.session_id,
        module_id=req.module_id,
        transcript=req.transcript,
        topic=req.topic,
        llm_config=config,
    )
    return result


@app.websocket("/notes/stream")
async def stream_notes(ws: WebSocket):
    await ws.accept()
    try:
        data = await ws.receive_json()
        result = notes_generator.generate_notes(
            session_id=data.get("session_id", ""),
            module_id=data.get("module_id", ""),
            transcript=data.get("transcript", ""),
            topic=data.get("topic", ""),
            llm_config=config,
        )
        for block in result.get("blocks", []):
            await ws.send_json({"type": "block", "block": block})
            await asyncio.sleep(0.05)
        await ws.send_json({"type": "done", "citations": result.get("citations", [])})
    except WebSocketDisconnect:
        pass


# ── LLM Backend Configuration ─────────────────────────────────────────────────

@app.post("/config/llm")
async def set_llm_config(body: dict):
    backend = body.get("backend", "local")  # "local", "anthropic", "openai"
    config["backend"] = backend

    if backend == "local":
        model_name = body.get("model", "qwen2.5-3b")
        config["local_model"] = model_name
        # Pre-load model into memory if downloaded
        if get_llm_model_path(model_name):
            await asyncio.to_thread(llm_engine.load_model, model_name)
    elif backend in ("anthropic", "openai"):
        config["api_key"] = body.get("api_key", "")

    save_config(config)
    return {"status": "ok", "backend": backend}


# ── Entry Point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--host", type=str, default="127.0.0.1")
    args = parser.parse_args()

    uvicorn.run(app, host=args.host, port=args.port, log_level="info")
