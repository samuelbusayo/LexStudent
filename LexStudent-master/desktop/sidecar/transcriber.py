import io
import base64
import numpy as np
from typing import Optional

_model = None
_model_name = None


def _get_model(model_name: str = "distil-large-v3"):
    global _model, _model_name
    if _model is not None and _model_name == model_name:
        return _model

    from faster_whisper import WhisperModel
    import torch

    device = "cpu"
    compute_type = "int8"

    if torch.cuda.is_available():
        device = "cuda"
        compute_type = "float16"

    try:
        _model = WhisperModel(model_name, device=device, compute_type=compute_type)
    except Exception:
        _model = WhisperModel(model_name, device="cpu", compute_type="int8")

    _model_name = model_name
    return _model


def transcribe_audio(audio_b64: str, language: str = "en", model: str = "distil-large-v3"):
    audio_bytes = base64.b64decode(audio_b64)
    samples = np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32) / 32768.0

    if len(samples) == 0:
        return {"text": "", "segments": []}

    whisper_model = _get_model(model)
    segments_gen, info = whisper_model.transcribe(
        samples,
        language=language,
        beam_size=5,
        word_timestamps=True,
        vad_filter=True,
        vad_parameters=dict(
            min_silence_duration_ms=500,
            speech_pad_ms=400,
        ),
    )

    segments = []
    full_text_parts = []
    for seg in segments_gen:
        speaker = classify_speaker(seg.text)
        segments.append({
            "text": seg.text.strip(),
            "t_start": round(seg.start, 2),
            "t_end": round(seg.end, 2),
            "speaker": speaker,
        })
        full_text_parts.append(seg.text.strip())

    return {
        "text": " ".join(full_text_parts),
        "segments": segments,
    }


def classify_speaker(text: str) -> str:
    text_lower = text.lower().strip()
    question_indicators = [
        "?",
        "excuse me",
        "professor, ",
        "can you explain",
        "what about",
        "how does",
        "why is",
        "could you",
        "i have a question",
        "what if",
        "is it true",
        "does that mean",
    ]
    for indicator in question_indicators:
        if indicator in text_lower:
            return "STUDENT"
    return "PROFESSOR"


def get_available_models():
    """Delegate to model_manager for consistent model listing."""
    from model_manager import list_downloaded_whisper_models
    return list_downloaded_whisper_models()
