import OpenAI from 'openai'

let client = null

function getClient() {
  if (!client) {
    client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
    })
  }
  return client
}

export async function generateEmbeddings(texts, { model = 'qwen/qwen3-embedding-8b', batchSize = 20 } = {}) {
  const c = getClient()
  const allEmbeddings = []

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    const response = await c.embeddings.create({
      model,
      input: batch,
    })
    for (const item of response.data) {
      allEmbeddings.push(new Float32Array(item.embedding))
    }
  }

  return allEmbeddings
}

export async function generateSingleEmbedding(text, opts) {
  const results = await generateEmbeddings([text], opts)
  return results[0]
}

export function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

export function serializeEmbedding(float32Array) {
  return Buffer.from(float32Array.buffer, float32Array.byteOffset, float32Array.byteLength)
}

export function deserializeEmbedding(buffer) {
  if (!buffer) return null
  const ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  return new Float32Array(ab)
}
