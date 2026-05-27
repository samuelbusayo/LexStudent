"""
Local LLM inference via llama-cpp-python.
Replaces Ollama — runs entirely within the sidecar process.
"""

from llama_cpp import Llama
from typing import Optional, Generator

from model_manager import get_llm_model_path

_llm_instance: Optional[Llama] = None
_current_model: Optional[str] = None


def load_model(model_name: str) -> Llama:
    """Load a GGUF model into memory. Reuses if already loaded."""
    global _llm_instance, _current_model

    if _llm_instance and _current_model == model_name:
        return _llm_instance

    path = get_llm_model_path(model_name)
    if not path:
        raise ValueError(
            f"Model '{model_name}' not downloaded. Please download it first."
        )

    # Unload previous model to free memory
    if _llm_instance:
        del _llm_instance
        _llm_instance = None

    _llm_instance = Llama(
        model_path=str(path),
        n_ctx=4096,
        n_threads=4,
        n_gpu_layers=-1,  # auto-detect GPU layers (0 = CPU only)
        verbose=False,
    )
    _current_model = model_name
    return _llm_instance


def generate(
    prompt: str,
    system_prompt: str = "",
    max_tokens: int = 2048,
    temperature: float = 0.3,
    model_name: Optional[str] = None,
) -> str:
    """Generate text using the local LLM."""
    if model_name is None:
        model_name = _current_model or "qwen2.5-3b"

    llm = load_model(model_name)

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    response = llm.create_chat_completion(
        messages=messages,
        max_tokens=max_tokens,
        temperature=temperature,
        stop=["```\n\n", "\n\n\n"],
    )

    return response["choices"][0]["message"]["content"]


def generate_stream(
    prompt: str,
    system_prompt: str = "",
    max_tokens: int = 2048,
    temperature: float = 0.3,
    model_name: Optional[str] = None,
) -> Generator[str, None, None]:
    """Stream generate text using the local LLM. Yields chunks."""
    if model_name is None:
        model_name = _current_model or "qwen2.5-3b"

    llm = load_model(model_name)

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    for chunk in llm.create_chat_completion(
        messages=messages,
        max_tokens=max_tokens,
        temperature=temperature,
        stream=True,
    ):
        delta = chunk["choices"][0].get("delta", {})
        if "content" in delta:
            yield delta["content"]


def is_loaded() -> bool:
    return _llm_instance is not None


def get_loaded_model() -> Optional[str]:
    return _current_model


def unload():
    global _llm_instance, _current_model
    if _llm_instance:
        del _llm_instance
        _llm_instance = None
        _current_model = None
