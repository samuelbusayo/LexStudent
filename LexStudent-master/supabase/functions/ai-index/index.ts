import { getServiceClient, getUser, corsHeaders, errorResponse, jsonResponse } from '../_shared/supabase-client.ts'
import OpenAI from 'https://esm.sh/openai@4.58.1'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const user = await getUser(req)
    if (!user) return errorResponse('Unauthorized', 401)

    const { topicId, materialId, fileHash, chunks, originalName } = await req.json()

    if (!topicId || !fileHash || !chunks?.length) {
      return errorResponse('topicId, fileHash, and chunks are required')
    }

    const db = getServiceClient()

    // Check dedup — if already indexed, just link to topic
    const { data: existing } = await db
      .from('material_indices')
      .select('id, status, total_chunks')
      .eq('file_hash', fileHash)
      .maybeSingle()

    if (existing && existing.status === 'completed') {
      // Just link to this topic if not already linked
      await db.from('topic_material_indices').upsert({
        user_id: user.id,
        topic_id: topicId,
        index_id: existing.id,
        material_id: materialId || null,
      }, { onConflict: 'user_id,topic_id,index_id' })

      return jsonResponse({
        indexId: existing.id,
        status: 'completed',
        totalChunks: existing.total_chunks,
        deduplicated: true,
      })
    }

    // Create index record
    const { data: indexRow, error: indexErr } = await db
      .from('material_indices')
      .insert({
        file_hash: fileHash,
        original_name: originalName || 'unknown',
        status: 'processing',
      })
      .select('id')
      .single()

    if (indexErr) {
      // Could be a race condition — another request started indexing
      if (indexErr.code === '23505') { // unique violation
        const { data: race } = await db
          .from('material_indices')
          .select('id, status')
          .eq('file_hash', fileHash)
          .single()
        return jsonResponse({ indexId: race?.id, status: race?.status || 'processing' })
      }
      return errorResponse('Failed to create index: ' + indexErr.message, 500)
    }

    const indexId = indexRow.id

    // Link to topic
    await db.from('topic_material_indices').upsert({
      user_id: user.id,
      topic_id: topicId,
      index_id: indexId,
      material_id: materialId || null,
    }, { onConflict: 'user_id,topic_id,index_id' })

    // Batch embed chunks (20 at a time)
    const openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: Deno.env.get('OPENROUTER_API_KEY'),
    })

    const BATCH_SIZE = 20
    let embeddingDimensions: number | null = null
    const chunkRows: Array<{
      index_id: number
      chunk_index: number
      content: string
      page_number: number
      embedding: string | null
    }> = []

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE)
      const texts = batch.map((c: { content: string }) => c.content)

      try {
        const embResponse = await openai.embeddings.create({
          model: 'qwen/qwen3-embedding-8b',
          input: texts,
        })

        for (let j = 0; j < batch.length; j++) {
          const embedding = embResponse.data[j]?.embedding
          if (!embeddingDimensions && embedding) {
            embeddingDimensions = embedding.length
          }
          chunkRows.push({
            index_id: indexId,
            chunk_index: i + j,
            content: batch[j].content,
            page_number: batch[j].pageNumber || 1,
            embedding: embedding ? `[${embedding.join(',')}]` : null,
          })
        }
      } catch (e) {
        console.error(`[ai-index] Embedding batch ${i} failed:`, e.message)
        // Store chunks without embeddings (FTS will still work)
        for (let j = 0; j < batch.length; j++) {
          chunkRows.push({
            index_id: indexId,
            chunk_index: i + j,
            content: batch[j].content,
            page_number: batch[j].pageNumber || 1,
            embedding: null,
          })
        }
      }
    }

    // Insert all chunks
    if (chunkRows.length > 0) {
      // Insert in batches of 50 to avoid payload limits
      for (let i = 0; i < chunkRows.length; i += 50) {
        const batch = chunkRows.slice(i, i + 50)
        const { error: insertErr } = await db
          .from('material_chunks')
          .insert(batch)

        if (insertErr) {
          console.error(`[ai-index] Chunk insert batch ${i} failed:`, insertErr.message)
        }
      }
    }

    // Update index status
    await db.from('material_indices').update({
      status: 'completed',
      total_chunks: chunkRows.length,
      embedding_dimensions: embeddingDimensions,
    }).eq('id', indexId)

    console.log(`[ai-index] Indexed ${chunkRows.length} chunks for ${originalName} (hash: ${fileHash.slice(0, 8)}...)`)

    return jsonResponse({
      indexId,
      status: 'completed',
      totalChunks: chunkRows.length,
      embeddingDimensions,
    })
  } catch (err) {
    console.error('[ai-index] Error:', err.message)
    return errorResponse(err.message, 500)
  }
})
