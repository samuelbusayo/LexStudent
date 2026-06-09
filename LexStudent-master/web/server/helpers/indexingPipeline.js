import crypto from 'crypto'
import fs from 'fs'
import { getDb } from '../db.js'
import { extractText } from './textExtractor.js'
import { chunkText } from './chunker.js'
import { computeTermFrequencies } from './bm25.js'
import { generateEmbeddings, serializeEmbedding } from './embeddings.js'

export async function indexMaterial(materialId, topicId) {
  const db = getDb()
  const material = db.prepare('SELECT * FROM materials WHERE id = ?').get(materialId)
  if (!material) {
    console.error(`[indexer] Material ${materialId} not found`)
    return
  }

  if (!fs.existsSync(material.filepath)) {
    console.error(`[indexer] File not found: ${material.filepath}`)
    return
  }

  const fileBuffer = fs.readFileSync(material.filepath)
  const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex')

  const existing = db.prepare('SELECT * FROM material_indices WHERE file_hash = ?').get(fileHash)

  if (existing && existing.status === 'completed') {
    const link = db.prepare(
      'SELECT * FROM topic_material_indices WHERE topic_id = ? AND index_id = ?'
    ).get(topicId, existing.id)
    if (!link) {
      db.prepare(
        'INSERT INTO topic_material_indices (topic_id, index_id, material_id) VALUES (?, ?, ?)'
      ).run(topicId, existing.id, materialId)
    }
    console.log(`[indexer] Dedup: "${material.original_name}" already indexed (${existing.total_chunks} chunks), linked to topic ${topicId}`)
    return
  }

  if (existing && existing.status === 'processing') {
    console.log(`[indexer] Already processing: "${material.original_name}"`)
    const link = db.prepare(
      'SELECT * FROM topic_material_indices WHERE topic_id = ? AND index_id = ?'
    ).get(topicId, existing.id)
    if (!link) {
      db.prepare(
        'INSERT INTO topic_material_indices (topic_id, index_id, material_id) VALUES (?, ?, ?)'
      ).run(topicId, existing.id, materialId)
    }
    return
  }

  let indexId
  if (existing) {
    db.prepare('DELETE FROM material_chunks WHERE index_id = ?').run(existing.id)
    db.prepare(
      "UPDATE material_indices SET status = 'processing', error_message = '', updated_at = datetime('now') WHERE id = ?"
    ).run(existing.id)
    indexId = existing.id
  } else {
    const result = db.prepare(
      "INSERT INTO material_indices (file_hash, original_name, status) VALUES (?, ?, 'processing')"
    ).run(fileHash, material.original_name)
    indexId = result.lastInsertRowid
  }

  const link = db.prepare(
    'SELECT * FROM topic_material_indices WHERE topic_id = ? AND index_id = ?'
  ).get(topicId, indexId)
  if (!link) {
    db.prepare(
      'INSERT INTO topic_material_indices (topic_id, index_id, material_id) VALUES (?, ?, ?)'
    ).run(topicId, indexId, materialId)
  }

  try {
    console.log(`[indexer] Extracting text from "${material.original_name}"...`)
    const extracted = await extractText(material.filepath, material.mime_type)

    const chunks = chunkText(extracted.pages)
    if (chunks.length === 0) {
      throw new Error('No text could be extracted from the document')
    }
    console.log(`[indexer] Created ${chunks.length} chunks from "${material.original_name}"`)

    let embeddings = null
    try {
      console.log(`[indexer] Generating embeddings...`)
      embeddings = await generateEmbeddings(chunks.map(c => c.content))
      console.log(`[indexer] Generated ${embeddings.length} embeddings`)
    } catch (err) {
      console.warn(`[indexer] Embedding generation failed (BM25 will still work): ${err.message}`)
    }

    const insertChunk = db.prepare(`
      INSERT INTO material_chunks (index_id, chunk_index, content, page_number, start_char, end_char, embedding, term_frequencies)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const insertAll = db.transaction(() => {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        const tf = computeTermFrequencies(chunk.content)
        const embeddingBlob = embeddings?.[i] ? serializeEmbedding(embeddings[i]) : null
        insertChunk.run(
          indexId, chunk.chunkIndex, chunk.content, chunk.pageNumber,
          chunk.startChar, chunk.endChar, embeddingBlob, JSON.stringify(tf)
        )
      }
    })
    insertAll()

    db.prepare(
      "UPDATE material_indices SET status = 'completed', total_chunks = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(chunks.length, indexId)

    console.log(`[indexer] Indexed ${chunks.length} chunks for "${material.original_name}"`)
  } catch (err) {
    console.error(`[indexer] Failed to index "${material.original_name}":`, err.message)
    db.prepare(
      "UPDATE material_indices SET status = 'failed', error_message = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(err.message, indexId)
  }
}

export function getIndexStatusForTopic(topicId) {
  const db = getDb()
  return db.prepare(`
    SELECT mi.* FROM material_indices mi
    JOIN topic_material_indices tmi ON tmi.index_id = mi.id
    WHERE tmi.topic_id = ?
    ORDER BY mi.updated_at DESC
    LIMIT 1
  `).get(topicId)
}
