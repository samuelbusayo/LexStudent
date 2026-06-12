-- ============================================================
-- LexStudent Cloud Schema: Auth, AI Chat, Subscriptions
-- Run this in Supabase SQL Editor (Dashboard → SQL → New Query)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;       -- pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS pg_trgm;      -- trigram for fuzzy text matching

-- ============================================================
-- 1. USER PROFILES (extends Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  avatar TEXT DEFAULT '',
  is_superuser BOOLEAN DEFAULT false,        -- bypasses all limits

  -- Subscription fields
  subscription_status TEXT DEFAULT 'free'
    CHECK (subscription_status IN ('free', 'active', 'cancelled', 'past_due', 'expired')),
  subscription_plan TEXT DEFAULT NULL,           -- 'monthly', 'yearly'
  paystack_customer_code TEXT,
  paystack_subscription_code TEXT,
  paystack_email_token TEXT,
  subscription_started_at TIMESTAMPTZ,
  subscription_expires_at TIMESTAMPTZ,

  -- AI usage tracking
  ai_messages_used INTEGER DEFAULT 0,            -- resets monthly
  ai_messages_limit INTEGER DEFAULT 5,           -- free: 5/month, premium: 999999
  usage_reset_at TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup via trigger
-- Superuser emails get is_superuser=true and active subscription automatically
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _is_super BOOLEAN := false;
  _sub_status TEXT := 'free';
  _msg_limit INTEGER := 5;
BEGIN
  -- Check if this email is a superuser
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Monthly usage reset function (call via Supabase cron or Edge Function)
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

-- ============================================================
-- 2. MATERIAL INDICES (dedup by file hash)
-- ============================================================
CREATE TABLE IF NOT EXISTS material_indices (
  id SERIAL PRIMARY KEY,
  file_hash TEXT UNIQUE NOT NULL,
  original_name TEXT,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  embedding_model TEXT DEFAULT 'qwen/qwen3-embedding-8b',
  embedding_dimensions INTEGER,
  total_chunks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. MATERIAL CHUNKS with pgvector embeddings + FTS
-- ============================================================
CREATE TABLE IF NOT EXISTS material_chunks (
  id SERIAL PRIMARY KEY,
  index_id INTEGER REFERENCES material_indices(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  page_number INTEGER DEFAULT 1,
  embedding vector(4096),  -- qwen/qwen3-embedding-8b dimensions
  -- Auto-generated full-text search vector
  search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTE: No IVFFlat index on embedding column because pgvector IVFFlat
-- is limited to 2000 dimensions, and qwen3-embedding-8b outputs 4096.
-- Exact nearest-neighbor search (<=> operator) works without an index
-- and is fast enough for typical study material volumes (< 50K chunks).
-- If you need an index later, use HNSW when pgvector supports > 2000 dims.

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_chunks_search
  ON material_chunks USING gin(search_vector);

-- Fast lookup by index_id
CREATE INDEX IF NOT EXISTS idx_chunks_index_id
  ON material_chunks(index_id);

-- ============================================================
-- 4. TOPIC <-> MATERIAL INDEX JUNCTION (per-user)
-- ============================================================
CREATE TABLE IF NOT EXISTS topic_material_indices (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  topic_id INTEGER NOT NULL,
  index_id INTEGER REFERENCES material_indices(id) ON DELETE CASCADE,
  material_id INTEGER,
  UNIQUE(user_id, topic_id, index_id)
);

-- ============================================================
-- 5. AI CONVERSATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_conversations (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  topic_id INTEGER NOT NULL,
  title TEXT DEFAULT 'New conversation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_topic
  ON ai_conversations(user_id, topic_id);

-- ============================================================
-- 6. AI MESSAGES with worker status tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL DEFAULT '',
  context_chunks JSONB,
  status TEXT DEFAULT 'completed'
    CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'error')),
  request_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
  ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_request
  ON ai_messages(request_id) WHERE request_id IS NOT NULL;

-- ============================================================
-- 7. CHAT CANCELLATION SIGNALS
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_cancellations (
  request_id TEXT PRIMARY KEY,
  cancelled_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-cleanup old cancellations (older than 1 hour)
CREATE OR REPLACE FUNCTION cleanup_old_cancellations()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM ai_cancellations WHERE cancelled_at < NOW() - INTERVAL '1 hour';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cleanup_cancellations ON ai_cancellations;
CREATE TRIGGER trg_cleanup_cancellations
  AFTER INSERT ON ai_cancellations
  FOR EACH STATEMENT
  EXECUTE FUNCTION cleanup_old_cancellations();

-- ============================================================
-- 8. SUBSCRIPTION EVENT LOG (Paystack webhooks)
-- ============================================================
CREATE TABLE IF NOT EXISTS subscription_events (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  event_type TEXT NOT NULL,
  paystack_reference TEXT,
  amount INTEGER,                     -- in kobo (NGN x 100)
  currency TEXT DEFAULT 'NGN',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 9. ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_material_indices ENABLE ROW LEVEL SECURITY;

-- Profiles: users read/update own
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Conversations: users manage own
CREATE POLICY "conversations_all_own" ON ai_conversations
  FOR ALL USING (auth.uid() = user_id);

-- Messages: users read own conversations' messages
CREATE POLICY "messages_select_own" ON ai_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM ai_conversations WHERE user_id = auth.uid()
    )
  );

-- Messages: users insert into own conversations
CREATE POLICY "messages_insert_own" ON ai_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM ai_conversations WHERE user_id = auth.uid()
    )
  );

-- Messages: users delete from own conversations
CREATE POLICY "messages_delete_own" ON ai_messages
  FOR DELETE USING (
    conversation_id IN (
      SELECT id FROM ai_conversations WHERE user_id = auth.uid()
    )
  );

-- Topic material indices: users manage own
CREATE POLICY "topic_indices_all_own" ON topic_material_indices
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 10. HYBRID SEARCH RPC (pgvector + FTS with RRF)
-- ============================================================
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
  -- Get index IDs for this user's topic
  topic_indices AS (
    SELECT index_id FROM topic_material_indices
    WHERE topic_id = p_topic_id AND user_id = p_user_id
  ),
  -- Semantic search via pgvector cosine distance (exact scan, no index needed)
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
  -- Full-text search via PostgreSQL tsvector
  fulltext AS (
    SELECT mc.id, ROW_NUMBER() OVER (
      ORDER BY ts_rank(mc.search_vector, websearch_to_tsquery('english', query_text)) DESC
    ) AS rank
    FROM material_chunks mc
    WHERE mc.index_id IN (SELECT index_id FROM topic_indices)
      AND mc.search_vector @@ websearch_to_tsquery('english', query_text)
    LIMIT match_count * 3
  ),
  -- Reciprocal Rank Fusion
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
