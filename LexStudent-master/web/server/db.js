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

  return db
}

export function closeDb() {
  if (db) {
    db.close()
    db = null
  }
}
