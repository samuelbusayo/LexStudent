-- ============================================================
-- PATCH: Fix embedding dimensions + add superuser support
-- Run this in Supabase SQL Editor AFTER 001_schema.sql
-- ============================================================

-- 1. Drop the IVFFlat index (it fails with 4096 dims, not needed for small datasets)
DROP INDEX IF EXISTS idx_chunks_embedding;

-- 2. Change embedding column from vector(1536) to vector(4096)
ALTER TABLE material_chunks
  ALTER COLUMN embedding TYPE vector(4096);

-- 3. Update default embedding model name
ALTER TABLE material_indices
  ALTER COLUMN embedding_model SET DEFAULT 'qwen/qwen3-embedding-8b';

-- 4. Add is_superuser column to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_superuser BOOLEAN DEFAULT false;

-- 5. Replace the hybrid_search function with correct 4096 dims
CREATE OR REPLACE FUNCTION hybrid_search(
  query_text TEXT,
  query_embedding vector(4096),
  p_topic_id INTEGER,
  p_user_id UUID,
  match_count INTEGER DEFAULT 6,
  rrf_k INTEGER DEFAULT 60
)
RETURNS TABLE (
  chunk_id INTEGER,
  chunk_content TEXT,
  chunk_page_number INTEGER,
  rrf_score DOUBLE PRECISION
)
LANGUAGE sql STABLE
SECURITY DEFINER
AS $$
  WITH
  topic_indices AS (
    SELECT index_id FROM topic_material_indices
    WHERE topic_id = p_topic_id AND user_id = p_user_id
  ),
  semantic AS (
    SELECT mc.id, ROW_NUMBER() OVER (
      ORDER BY mc.embedding <=> query_embedding
    ) AS rank
    FROM material_chunks mc
    WHERE mc.index_id IN (SELECT index_id FROM topic_indices)
      AND mc.embedding IS NOT NULL
    ORDER BY mc.embedding <=> query_embedding
    LIMIT match_count * 3
  ),
  fulltext AS (
    SELECT mc.id, ROW_NUMBER() OVER (
      ORDER BY ts_rank(mc.search_vector, websearch_to_tsquery('english', query_text)) DESC
    ) AS rank
    FROM material_chunks mc
    WHERE mc.index_id IN (SELECT index_id FROM topic_indices)
      AND mc.search_vector @@ websearch_to_tsquery('english', query_text)
    LIMIT match_count * 3
  ),
  rrf AS (
    SELECT
      COALESCE(s.id, f.id) AS id,
      COALESCE(1.0 / (rrf_k + s.rank), 0.0) + COALESCE(1.0 / (rrf_k + f.rank), 0.0) AS score
    FROM semantic s
    FULL OUTER JOIN fulltext f ON s.id = f.id
  )
  SELECT mc.id AS chunk_id, mc.content AS chunk_content, mc.page_number AS chunk_page_number,
         rrf.score AS rrf_score
  FROM rrf
  JOIN material_chunks mc ON mc.id = rrf.id
  ORDER BY rrf.score DESC
  LIMIT match_count;
$$;

-- 6. Replace handle_new_user trigger to auto-set superuser
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _is_super BOOLEAN := false;
  _sub_status TEXT := 'free';
  _msg_limit INTEGER := 5;
BEGIN
  -- Superuser emails get full access automatically
  IF NEW.email IN ('adedamolaadeusiofficial@gmail.com') THEN
    _is_super := true;
    _sub_status := 'active';
    _msg_limit := 999999;
  END IF;

  INSERT INTO profiles (id, name, email, is_superuser, subscription_status, ai_messages_limit)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.email, ''),
    _is_super,
    _sub_status,
    _msg_limit
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Update monthly reset to skip superusers
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET ai_messages_used = 0,
      usage_reset_at = NOW()
  WHERE usage_reset_at < NOW() - INTERVAL '30 days'
    AND is_superuser = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
