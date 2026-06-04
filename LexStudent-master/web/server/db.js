import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

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

  return db
}

export function closeDb() {
  if (db) {
    db.close()
    db = null
  }
}
