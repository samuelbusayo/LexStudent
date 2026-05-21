CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  avatar TEXT DEFAULT '',
  streak INTEGER DEFAULT 0,
  badge TEXT DEFAULT '',
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

CREATE TABLE IF NOT EXISTS study_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  topic_id INTEGER NOT NULL,
  user_id INTEGER DEFAULT 1,
  type TEXT NOT NULL DEFAULT 'note',
  page INTEGER DEFAULT 1,
  text TEXT NOT NULL DEFAULT '',
  color TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
);
