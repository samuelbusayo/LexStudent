import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { reconcileBadgeCatalogue } from './services/badgeCatalogue.js'
import { safeEvaluate } from './services/badgeEvaluator.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, 'lexstudent.db')

let db

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
  }
  return db
}

export function initDb() {
  const db = getDb()
  const schemaPath = path.join(__dirname, 'schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf-8')
  db.exec(schema)

  // Idempotent migrations — add columns that may not exist in older DBs
  const cols = db.prepare("PRAGMA table_info(study_notes)").all()
  const colNames = cols.map(c => c.name)
  if (!colNames.includes('paragraph')) {
    db.exec("ALTER TABLE study_notes ADD COLUMN paragraph INTEGER DEFAULT NULL")
  }
  if (!colNames.includes('anchor_text')) {
    db.exec("ALTER TABLE study_notes ADD COLUMN anchor_text TEXT DEFAULT ''")
  }

  // goals: add target_pages column
  const goalCols = db.prepare("PRAGMA table_info(goals)").all()
  const goalColNames = goalCols.map(c => c.name)
  if (!goalColNames.includes('target_pages')) {
    db.exec("ALTER TABLE goals ADD COLUMN target_pages TEXT DEFAULT '[]'")
  }
  if (!goalColNames.includes('baseline_pages_read')) {
    db.exec("ALTER TABLE goals ADD COLUMN baseline_pages_read INTEGER DEFAULT 0")
    // Backfill: pre-existing topic-linked goals should baseline against the
    // topic's current pages_read so they don't all show as "Complete" the
    // instant the new derived-progress logic kicks in.
    db.exec(`
      UPDATE goals SET baseline_pages_read = COALESCE(
        (SELECT pages_read FROM topics WHERE topics.id = goals.topic_id), 0
      )
      WHERE topic_id IS NOT NULL
    `)
  }

  // Fix total_pages for existing topics where selected_pages is non-empty:
  // total_pages should reflect studied page count, not full document length
  db.exec(`
    UPDATE topics SET total_pages = json_array_length(selected_pages)
    WHERE selected_pages IS NOT NULL AND selected_pages != '[]' AND selected_pages != ''
    AND total_pages != json_array_length(selected_pages)
  `)

  // Migrate existing goals that have a date but no occurrences yet
  db.exec(`
    INSERT INTO goal_occurrences (goal_id, user_id, date, status, progress)
    SELECT id, user_id, date, status, progress FROM goals
    WHERE date != '' AND date IS NOT NULL
    AND NOT EXISTS (SELECT 1 FROM goal_occurrences WHERE goal_id = goals.id)
  `)

  // users: add AI usage tracking columns
  const userCols = db.prepare("PRAGMA table_info(users)").all()
  const userColNames = userCols.map(c => c.name)
  if (!userColNames.includes('ai_messages_used')) {
    db.exec("ALTER TABLE users ADD COLUMN ai_messages_used INTEGER DEFAULT 0")
  }
  if (!userColNames.includes('ai_messages_limit')) {
    db.exec("ALTER TABLE users ADD COLUMN ai_messages_limit INTEGER DEFAULT 5")
  }
  if (!userColNames.includes('usage_reset_at')) {
    db.exec("ALTER TABLE users ADD COLUMN usage_reset_at TEXT DEFAULT (datetime('now'))")
  }
  // users: add profile fields (program, campus)
  if (!userColNames.includes('program')) {
    db.exec("ALTER TABLE users ADD COLUMN program TEXT DEFAULT ''")
  }
  if (!userColNames.includes('campus')) {
    db.exec("ALTER TABLE users ADD COLUMN campus TEXT DEFAULT ''")
  }

  // ── BADGES catalogue migration ──
  const badgeCols = db.prepare("PRAGMA table_info(badges)").all().map(c => c.name)
  if (!badgeCols.includes('code'))        db.exec("ALTER TABLE badges ADD COLUMN code TEXT")
  if (!badgeCols.includes('category'))    db.exec("ALTER TABLE badges ADD COLUMN category TEXT DEFAULT ''")
  if (!badgeCols.includes('tier'))        db.exec("ALTER TABLE badges ADD COLUMN tier INTEGER DEFAULT 0")
  if (!badgeCols.includes('criteria'))    db.exec("ALTER TABLE badges ADD COLUMN criteria TEXT DEFAULT '{}'")
  if (!badgeCols.includes('target'))      db.exec("ALTER TABLE badges ADD COLUMN target INTEGER DEFAULT 1")

  db.exec(`
    CREATE TABLE IF NOT EXISTS user_badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 1,
      badge_code TEXT NOT NULL,
      progress INTEGER DEFAULT 0,
      earned_at TEXT,
      UNIQUE(user_id, badge_code)
    )
  `)

  // milestones: new fields
  const msCols = db.prepare("PRAGMA table_info(milestones)").all().map(c => c.name)
  if (!msCols.includes('category'))     db.exec("ALTER TABLE milestones ADD COLUMN category TEXT DEFAULT 'custom'")
  if (!msCols.includes('icon'))         db.exec("ALTER TABLE milestones ADD COLUMN icon TEXT DEFAULT 'flag'")
  if (!msCols.includes('completed_at')) db.exec("ALTER TABLE milestones ADD COLUMN completed_at TEXT")

  // Reconcile the canonical badge catalogue + backfill progress for the
  // default user so historical activity counts retroactively.
  reconcileBadgeCatalogue(db)
  safeEvaluate(db, 1)

  return db
}

export function closeDb() {
  if (db) {
    db.close()
    db = null
  }
}
