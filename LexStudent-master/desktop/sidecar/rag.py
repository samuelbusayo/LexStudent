import os
import platform
import re
from typing import List, Dict, Optional
import numpy as np

_db = None
_embed_model = None


def _get_vectorstore_dir() -> str:
    if platform.system() == "Windows":
        base = os.environ.get("APPDATA", os.path.join(os.path.expanduser("~"), "AppData", "Roaming"))
        return os.path.join(base, "LexScholar", "vectorstore")
    else:
        return os.path.expanduser("~/.lexscholar/vectorstore")


VECTOR_STORE_DIR = _get_vectorstore_dir()


def _get_embed_model():
    global _embed_model
    if _embed_model is not None:
        return _embed_model
    from sentence_transformers import SentenceTransformer
    _embed_model = SentenceTransformer("BAAI/bge-small-en-v1.5")
    return _embed_model


def _get_db():
    global _db
    if _db is not None:
        return _db
    import lancedb
    os.makedirs(VECTOR_STORE_DIR, exist_ok=True)
    _db = lancedb.connect(VECTOR_STORE_DIR)
    return _db


def _get_or_create_table():
    db = _get_db()
    try:
        return db.open_table("chunks")
    except Exception:
        import pyarrow as pa
        schema = pa.schema([
            pa.field("id", pa.string()),
            pa.field("material_id", pa.string()),
            pa.field("module_id", pa.string()),
            pa.field("filename", pa.string()),
            pa.field("page_number", pa.int32()),
            pa.field("text", pa.string()),
            pa.field("vector", pa.list_(pa.float32(), 384)),
        ])
        return db.create_table("chunks", schema=schema)


def extract_pages_from_pdf(file_path: str) -> List[Dict]:
    import fitz  # pymupdf
    pages = []
    doc = fitz.open(file_path)
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text = page.get_text("text")
        if text.strip():
            pages.append({
                "page_number": page_num + 1,
                "text": text.strip(),
            })
    doc.close()
    return pages


def chunk_text(text: str, max_tokens: int = 500, overlap: int = 50) -> List[str]:
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + max_tokens
        chunk = " ".join(words[start:end])
        if chunk.strip():
            chunks.append(chunk)
        start = end - overlap
    return chunks


def ingest_material(material_id: str, module_id: str, file_path: str) -> Dict:
    pages = extract_pages_from_pdf(file_path)
    filename = os.path.basename(file_path)
    model = _get_embed_model()
    table = _get_or_create_table()

    all_records = []
    chunk_count = 0

    for page in pages:
        chunks = chunk_text(page["text"])
        for i, chunk_text_str in enumerate(chunks):
            embedding = model.encode(chunk_text_str).tolist()
            record = {
                "id": f"{material_id}_p{page['page_number']}_c{i}",
                "material_id": material_id,
                "module_id": module_id,
                "filename": filename,
                "page_number": page["page_number"],
                "text": chunk_text_str,
                "vector": embedding,
            }
            all_records.append(record)
            chunk_count += 1

    if all_records:
        table.add(all_records)

    return {
        "material_id": material_id,
        "pages_indexed": len(pages),
        "chunks_created": chunk_count,
    }


def delete_material_chunks(material_id: str):
    try:
        table = _get_or_create_table()
        table.delete(f'material_id = "{material_id}"')
    except Exception:
        pass


def list_ingested_materials(module_id: str) -> List[Dict]:
    try:
        table = _get_or_create_table()
        df = table.to_pandas()
        module_df = df[df["module_id"] == module_id]
        materials = {}
        for _, row in module_df.iterrows():
            mid = row["material_id"]
            if mid not in materials:
                materials[mid] = {
                    "material_id": mid,
                    "filename": row["filename"],
                    "chunks": 0,
                    "pages": set(),
                }
            materials[mid]["chunks"] += 1
            materials[mid]["pages"].add(row["page_number"])

        result = []
        for m in materials.values():
            result.append({
                "material_id": m["material_id"],
                "filename": m["filename"],
                "chunks": m["chunks"],
                "pages": len(m["pages"]),
            })
        return result
    except Exception:
        return []


def retrieve(module_id: str, query: str, k: int = 6) -> List[Dict]:
    try:
        model = _get_embed_model()
        table = _get_or_create_table()
        query_embedding = model.encode(query).tolist()

        results = (
            table.search(query_embedding)
            .where(f'module_id = "{module_id}"')
            .limit(k)
            .to_pandas()
        )

        chunks = []
        for _, row in results.iterrows():
            chunks.append({
                "text": row["text"],
                "filename": row["filename"],
                "page_number": int(row["page_number"]),
                "material_id": row["material_id"],
                "score": float(row.get("_distance", 0.0)),
            })
        return chunks
    except Exception as e:
        print(f"Retrieval error: {e}")
        return []
