import { getDb } from '../db.js'
import { bm25Search } from './bm25.js'
import { generateSingleEmbedding, deserializeEmbedding, cosineSimilarity } from './embeddings.js'

export async function hybridSearch(topicId, query, { topK = 6 } = {}) {
  const db = getDb()

  const link = db.prepare(`
    SELECT mi.id as index_id FROM material_indices mi
    JOIN topic_material_indices tmi ON tmi.index_id = mi.id
    WHERE tmi.topic_id = ? AND mi.status = 'completed'
    ORDER BY mi.updated_at DESC LIMIT 1
  `).get(topicId)

  if (!link) return []

  const chunks = db.prepare(
    'SELECT id, chunk_index, content, page_number, embedding, term_frequencies FROM material_chunks WHERE index_id = ? ORDER BY chunk_index'
  ).all(link.index_id)

  if (chunks.length === 0) return []

  const bm25Results = bm25Search(query, chunks.map(c => ({
    ...c,
    termFrequencies: c.term_frequencies,
  })))

  const bm25Ranks = new Map()
  bm25Results.forEach((r, i) => bm25Ranks.set(r.id, i + 1))

  let vectorRanks = new Map()
  const hasEmbeddings = chunks.some(c => c.embedding)

  if (hasEmbeddings) {
    try {
      const queryEmbedding = await generateSingleEmbedding(query)
      const vectorScored = chunks
        .map(c => {
          const emb = deserializeEmbedding(c.embedding)
          if (!emb) return { id: c.id, sim: -1 }
          return { id: c.id, sim: cosineSimilarity(queryEmbedding, emb) }
        })
        .filter(s => s.sim > 0)
        .sort((a, b) => b.sim - a.sim)

      vectorScored.forEach((r, i) => vectorRanks.set(r.id, i + 1))
    } catch (err) {
      console.warn(`[search] Vector search failed, using BM25 only: ${err.message}`)
    }
  }

  const K = 60
  const allIds = new Set([...bm25Ranks.keys(), ...vectorRanks.keys()])
  const fused = []

  for (const id of allIds) {
    const bm25Rank = bm25Ranks.get(id) || chunks.length + 1
    const vecRank = vectorRanks.get(id) || chunks.length + 1
    const rrfScore = 1 / (K + bm25Rank) + 1 / (K + vecRank)
    fused.push({ id, rrfScore })
  }

  fused.sort((a, b) => b.rrfScore - a.rrfScore)
  const topIds = fused.slice(0, topK).map(f => f.id)

  const chunkMap = new Map(chunks.map(c => [c.id, c]))
  return topIds.map(id => {
    const c = chunkMap.get(id)
    return {
      id: c.id,
      content: c.content,
      pageNumber: c.page_number,
      chunkIndex: c.chunk_index,
    }
  })
}
