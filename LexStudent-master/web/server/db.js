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
