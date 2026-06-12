CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  avatar TEXT DEFAULT '',
  streak INTEGER DEFAULT 0,
  badge TEXT DEFAULT '',
  ai_messages_used INTEGER DEFAULT 0,
  ai_messages_limit INTEGER DEFAULT 5,
  usage_reset_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT DEFAULT 'CORE',
  total_topics INTEGER DEFAULT 0,
  completed_topics INTEGER DEFAULT 0,
  color TEXT DEFAULT '#002147',
  icon TEXT DEFAULT 'gavel',
  total_modules INTEGER DEFAULT 12,
  total_credits INTEGER DEFAULT 48,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  total_pages INTEGER DEFAULT 10,
  pages_read INTEGER DEFAULT 0,
  has_materials INTEGER DEFAULT 0,
  material_file TEXT,
  material_type TEXT,
  selected_pages TEXT DEFAULT '[]',
  total_document_pages INTEGER DEFAULT 0,
  materials TEXT DEFAULT '[]',
  last_reviewed_at TEXT,
  review_interval_days INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  subject_tag TEXT DEFAULT '',
  title TEXT NOT NULL,
  note TEXT DEFAULT '',
  progress INTEGER DEFAULT 0,
  date TEXT DEFAULT '',
  status TEXT DEFAULT 'not_started',
  topic_id INTEGER,
  target_amount INTEGER DEFAULT 0,
  target_pages TEXT DEFAULT '[]',
  baseline_pages_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS progress_overall (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  overall INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  badge TEXT DEFAULT '',
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS progress_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  type TEXT DEFAULT '',
  title TEXT DEFAULT '',
  status TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS knowledge_gaps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  subject TEXT DEFAULT '',
  topic TEXT DEFAULT '',
  progress INTEGER DEFAULT 0,
  last_reviewed TEXT DEFAULT '',
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS heatmap_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  day_index INTEGER DEFAULT 0,
  intensity INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  feature_key TEXT DEFAULT '',
  title TEXT NOT NULL,
  time TEXT DEFAULT '',
  enabled INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS summaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  subject TEXT DEFAULT '',
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  citation TEXT DEFAULT '',
  year INTEGER DEFAULT 0,
  description TEXT DEFAULT '',
  tags TEXT DEFAULT '[]',
  is_featured INTEGER DEFAULT 0,
  bookmarked INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '',
  earned INTEGER DEFAULT 0,
  description TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS daily_quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  author TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS milestones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  title TEXT NOT NULL,
  target_date TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS materials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  user_id INTEGER DEFAULT 1,
  original_name TEXT NOT NULL,
  stored_name TEXT,
  mime_type TEXT DEFAULT '',
  size_bytes INTEGER DEFAULT 0,
  filepath TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS countdowns (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  days_remaining INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS study_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  user_id INTEGER DEFAULT 1,
  type TEXT NOT NULL DEFAULT 'note',
  page INTEGER DEFAULT 1,
  text TEXT NOT NULL DEFAULT '',
  color TEXT DEFAULT '',
  paragraph INTEGER DEFAULT NULL,
  anchor_text TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS topic_summaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL UNIQUE,
  user_id INTEGER DEFAULT 1,
  body TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS activity_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  type TEXT NOT NULL,
  topic_id INTEGER,
  goal_id INTEGER,
  amount INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS goal_occurrences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  goal_id INTEGER NOT NULL,
  user_id INTEGER DEFAULT 1,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'not_started',
  progress INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_scenarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  scenario_id INTEGER,
  blank_number INTEGER,
  prompt TEXT,
  options TEXT NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  FOREIGN KEY (scenario_id) REFERENCES quiz_scenarios(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER DEFAULT 1,
  topic_id INTEGER NOT NULL,
  course_id INTEGER NOT NULL,
  seconds_per_question INTEGER NOT NULL,
  question_order TEXT NOT NULL,
  num_questions INTEGER NOT NULL,
  correct_count INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0,
  started_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS quiz_attempt_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attempt_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  selected_index INTEGER,
  is_correct INTEGER DEFAULT 0,
  time_taken_seconds INTEGER,
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS material_indices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_hash TEXT NOT NULL UNIQUE,
  original_name TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  error_message TEXT DEFAULT '',
  total_chunks INTEGER DEFAULT 0,
  embedding_model TEXT DEFAULT 'qwen3-embedding-8b',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS material_chunks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  index_id INTEGER NOT NULL,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  page_number INTEGER DEFAULT 1,
  start_char INTEGER DEFAULT 0,
  end_char INTEGER DEFAULT 0,
  embedding BLOB,
  term_frequencies TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (index_id) REFERENCES material_indices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS topic_material_indices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  index_id INTEGER NOT NULL,
  material_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
  FOREIGN KEY (index_id) REFERENCES material_indices(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
  UNIQUE(topic_id, index_id)
);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  user_id INTEGER DEFAULT 1,
  title TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  context_chunks TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE
);
