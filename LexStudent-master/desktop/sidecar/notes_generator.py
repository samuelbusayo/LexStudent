import os
import json
import re
from typing import List, Dict, Optional
from rag import retrieve
import llm_engine

SYSTEM_PROMPT = """You are LexGPT-V4.2, an AI legal study assistant. Generate structured lecture notes from a transcript.

Output MUST be valid JSON with this structure:
{
  "title": "Lecture title",
  "blocks": [...],
  "citations": [...]
}

Block types you can use:
- {"id": "...", "type": "heading", "props": {"level": 1|2|3}, "content": [{"type": "text", "text": "..."}]}
- {"id": "...", "type": "paragraph", "content": [{"type": "text", "text": "..."}]}
- {"id": "...", "type": "bulletListItem", "content": [{"type": "text", "text": "..."}]}
- {"id": "...", "type": "numberedListItem", "content": [{"type": "text", "text": "..."}]}
- {"id": "...", "type": "keyConcept", "props": {"title": "..."}, "content": [{"type": "text", "text": "..."}]}
- {"id": "...", "type": "qaBlock", "props": {"question": "...", "confidence": "HIGH"|"LOW", "citation": "..."}, "content": [{"type": "text", "text": "answer text"}]}

Citation format in the citations array:
{"material_id": "...", "filename": "...", "page_start": N, "page_end": N, "confidence": "HIGH"|"LOW", "anchor_block_id": "..."}

Rules:
- Use headings for lecture title, case names (e.g. "Marbury v. Madison (1803)")
- Use bulletListItem for holdings, key facts, arguments
- Use keyConcept blocks for important principles (highlighted callouts)
- Use qaBlock for detected student questions with answers
- Mark HIGH confidence when the answer is directly supported by retrieved material
- Mark LOW confidence (LOW CONF) when inferred or not directly found
- Only cite real page numbers from the provided context. Never fabricate citations.
- Generate unique IDs for each block (use format "blk_1", "blk_2", etc.)
"""


def _call_llm(prompt: str, system: str, config: dict) -> str:
    """Route to correct LLM backend based on config."""
    backend = config.get("backend", "local")

    if backend == "local":
        # Use bundled llama.cpp via llm_engine
        model_name = config.get("local_model", "qwen2.5-3b")
        return llm_engine.generate(
            prompt=prompt,
            system_prompt=system,
            max_tokens=3000,
            temperature=0.3,
            model_name=model_name,
        )
    elif backend == "anthropic":
        from anthropic import Anthropic

        client = Anthropic(api_key=config.get("api_key", ""))
        msg = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=3000,
            system=system,
            messages=[{"role": "user", "content": prompt}],
        )
        return msg.content[0].text
    elif backend == "openai":
        from openai import OpenAI

        client = OpenAI(api_key=config.get("api_key", ""))
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            max_tokens=3000,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
        )
        return resp.choices[0].message.content
    else:
        raise ValueError(f"Unknown backend: {backend}")


def _detect_qa_moments(transcript: str) -> List[Dict]:
    lines = transcript.strip().split("\n")
    qa_pairs = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if "[STUDENT]" in line:
            question = line.replace("[STUDENT]", "").strip()
            answer_parts = []
            j = i + 1
            while j < len(lines):
                next_line = lines[j].strip()
                if "[PROFESSOR]" in next_line:
                    answer_parts.append(next_line.replace("[PROFESSOR]", "").strip())
                    j += 1
                elif "[STUDENT]" in next_line:
                    break
                else:
                    j += 1
            if answer_parts:
                qa_pairs.append({
                    "question": question,
                    "answer": " ".join(answer_parts),
                })
            i = j
        else:
            i += 1
    return qa_pairs


def generate_notes(
    session_id: str,
    module_id: str,
    transcript: str,
    topic: str,
    llm_config: Optional[dict] = None,
) -> Dict:
    if llm_config is None:
        llm_config = {"backend": "local", "local_model": "qwen2.5-3b"}

    qa_moments = _detect_qa_moments(transcript)
    all_queries = [topic, transcript[:500]]
    for qa in qa_moments:
        all_queries.append(qa["question"])

    all_chunks = []
    seen_texts = set()
    for query in all_queries:
        chunks = retrieve(module_id, query, k=4)
        for chunk in chunks:
            if chunk["text"] not in seen_texts:
                all_chunks.append(chunk)
                seen_texts.add(chunk["text"])

    context_parts = []
    for chunk in all_chunks:
        context_parts.append(
            f"[Source: {chunk['filename']}, Page {chunk['page_number']}]\n{chunk['text']}"
        )
    context = "\n\n".join(context_parts) if context_parts else "No reference materials available."

    qa_section = ""
    if qa_moments:
        qa_section = "\n\nDetected Student Q&A:\n"
        for qa in qa_moments:
            qa_section += f"Q: {qa['question']}\nA: {qa['answer']}\n\n"

    prompt = f"""Generate structured lecture notes for the following lecture.

Topic: {topic}

Transcript:
{transcript}
{qa_section}

Reference Materials (use these for citations — only cite actual pages shown):
{context}

Generate comprehensive notes with headings, bullet points, key concept callouts, and Q&A blocks. Include citations with page numbers where supported by the reference materials."""

    try:
        raw_response = _call_llm(prompt, SYSTEM_PROMPT, llm_config)
        json_match = re.search(r'\{[\s\S]*\}', raw_response)
        if json_match:
            result = json.loads(json_match.group())
        else:
            result = {
                "title": topic,
                "blocks": [
                    {
                        "id": "blk_1",
                        "type": "heading",
                        "props": {"level": 1},
                        "content": [{"type": "text", "text": topic}],
                    },
                    {
                        "id": "blk_2",
                        "type": "paragraph",
                        "content": [{"type": "text", "text": raw_response}],
                    },
                ],
                "citations": [],
            }
    except Exception as e:
        result = {
            "title": topic,
            "blocks": [
                {
                    "id": "blk_1",
                    "type": "heading",
                    "props": {"level": 1},
                    "content": [{"type": "text", "text": topic}],
                },
                {
                    "id": "blk_err",
                    "type": "paragraph",
                    "content": [{"type": "text", "text": f"Note generation error: {str(e)}. Please check your LLM configuration in Settings."}],
                },
            ],
            "citations": [],
        }

    # Validate citations against actually retrieved chunks
    validated_citations = []
    for cit in result.get("citations", []):
        matched = any(
            c["material_id"] == cit.get("material_id")
            and c["page_number"] >= cit.get("page_start", 0)
            and c["page_number"] <= cit.get("page_end", 0)
            for c in all_chunks
        )
        if matched:
            cit["confidence"] = "HIGH"
        else:
            cit["confidence"] = "LOW"
        validated_citations.append(cit)

    result["citations"] = validated_citations
    return result
