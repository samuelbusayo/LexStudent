import os
import platform
from pathlib import Path
from typing import Optional, Callable

from huggingface_hub import hf_hub_download


def get_data_dir() -> Path:
    """Return the platform-appropriate LexScholar data directory."""
    if platform.system() == "Windows":
        base = Path(os.environ.get("APPDATA", str(Path.home() / "AppData" / "Roaming")))
        return base / "LexScholar"
    else:
        return Path.home() / ".lexscholar"


def get_models_dir() -> Path:
    models_dir = get_data_dir() / "models"
    models_dir.mkdir(parents=True, exist_ok=True)
    return models_dir


# ─── Whisper models ───────────────────────────────────────────────────────────

WHISPER_MODELS = {
    "distil-large-v3": {
        "repo": "distil-whisper/distil-large-v3",
        "size_mb": 756,
        "description": "Best quality-to-speed ratio (Recommended)",
    },
    "small": {
        "repo": "openai/whisper-small",
        "size_mb": 461,
        "description": "Fast, good accuracy",
    },
    "medium": {
        "repo": "openai/whisper-medium",
        "size_mb": 1500,
        "description": "High accuracy, slower",
    },
}

# ─── LLM models (GGUF) ───────────────────────────────────────────────────────

LLM_MODELS = {
    "qwen2.5-3b": {
        "repo": "Qwen/Qwen2.5-3B-Instruct-GGUF",
        "filename": "qwen2.5-3b-instruct-q4_k_m.gguf",
        "size_mb": 2048,
        "description": "Best for structured notes (Recommended)",
    },
    "phi-3.5-mini": {
        "repo": "bartowski/Phi-3.5-mini-instruct-GGUF",
        "filename": "Phi-3.5-mini-instruct-Q4_K_M.gguf",
        "size_mb": 2300,
        "description": "Strong reasoning, slightly larger",
    },
    "llama-3.2-3b": {
        "repo": "bartowski/Llama-3.2-3B-Instruct-GGUF",
        "filename": "Llama-3.2-3B-Instruct-Q4_K_M.gguf",
        "size_mb": 2020,
        "description": "Solid general-purpose",
    },
    "gemma-2-2b": {
        "repo": "bartowski/gemma-2-2b-it-GGUF",
        "filename": "gemma-2-2b-it-Q5_K_M.gguf",
        "size_mb": 1800,
        "description": "Smallest option, fast",
    },
}


def get_whisper_model_path(model_name: str) -> Optional[Path]:
    """Returns path to downloaded whisper model, or None if not present."""
    model_dir = get_models_dir() / "whisper" / model_name
    if model_dir.exists() and any(model_dir.iterdir()):
        return model_dir
    return None


def get_llm_model_path(model_name: str) -> Optional[Path]:
    """Returns path to GGUF file, or None if not downloaded."""
    info = LLM_MODELS.get(model_name)
    if not info:
        return None
    path = get_models_dir() / "llm" / info["filename"]
    if path.exists():
        return path
    return None


def download_whisper_model(
    model_name: str,
    progress_callback: Optional[Callable[[float], None]] = None,
) -> Path:
    """Download whisper model from HuggingFace. Returns model directory."""
    info = WHISPER_MODELS[model_name]
    dest = get_models_dir() / "whisper" / model_name
    dest.mkdir(parents=True, exist_ok=True)

    # faster-whisper uses CTranslate2 format — its download_model utility
    # handles conversion and caching into our controlled directory
    from faster_whisper.utils import download_model

    model_path = download_model(
        info["repo"] if "/" in info["repo"] else f"openai/whisper-{model_name}",
        output_dir=str(dest),
    )
    if progress_callback:
        progress_callback(100.0)
    return Path(model_path)


def download_llm_model(
    model_name: str,
    progress_callback: Optional[Callable[[float], None]] = None,
) -> Path:
    """Download GGUF model from HuggingFace. Returns path to .gguf file."""
    info = LLM_MODELS[model_name]
    dest_dir = get_models_dir() / "llm"
    dest_dir.mkdir(parents=True, exist_ok=True)

    path = hf_hub_download(
        repo_id=info["repo"],
        filename=info["filename"],
        local_dir=str(dest_dir),
        local_dir_use_symlinks=False,
    )
    if progress_callback:
        progress_callback(100.0)
    return Path(path)


def list_downloaded_whisper_models() -> list:
    results = []
    for name, info in WHISPER_MODELS.items():
        path = get_whisper_model_path(name)
        results.append(
            {
                "name": name,
                "downloaded": path is not None,
                "size_mb": info["size_mb"],
                "description": info["description"],
                "path": str(path) if path else None,
            }
        )
    return results


def list_downloaded_llm_models() -> list:
    results = []
    for name, info in LLM_MODELS.items():
        path = get_llm_model_path(name)
        results.append(
            {
                "name": name,
                "downloaded": path is not None,
                "size_mb": info["size_mb"],
                "description": info["description"],
                "path": str(path) if path else None,
            }
        )
    return results
