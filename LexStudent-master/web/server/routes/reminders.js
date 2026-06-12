import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

// Canonical reminder set — each tied to a real app feature.
// On every GET, we reconcile the DB to this list so old seed data is replaced
// and any new reminder added to code shows up automatically.
const CANONICAL_REMINDERS = [
  { key: 'daily_reading',     title: 'Daily Reading Goal',     time: 'Notify at 8:00 AM if unread',   enabled: 1 },
  { key: 'revision_quiz',     title: 'Revision Quiz',          time: 'Notify at 6:00 PM',             enabled: 1 },
  { key: 'ai_assistant',      title: 'AI Study Assistant',     time: 'Daily reminder to ask questions', enabled: 0 },
  { key: 'streak_protector',  title: 'Streak Protector',       time: 'Alert if streak at risk',       enabled: 1 },
];

function reconcileReminders(db) {
  // Ensure feature_key column exists (additive migration)
  const cols = db.prepare("PRAGMA table_info(reminders)").all();
  if (!cols.some(c => c.name === 'feature_key')) {
    db.exec("ALTER TABLE reminders ADD COLUMN feature_key TEXT DEFAULT ''");
  }

  const existing = db.prepare("SELECT id, feature_key, title FROM reminders").all();
  const byKey = new Map(existing.filter(r => r.feature_key).map(r => [r.feature_key, r]));

  // Delete legacy seed rows that don't match canonical keys (e.g., "Morning Briefing")
  const legacyTitles = new Set(['Morning Briefing', 'Mock Exam Alert', 'Case Study Window']);
  for (const r of existing) {
    if (!r.feature_key && legacyTitles.has(r.title)) {
      db.prepare("DELETE FROM reminders WHERE id = ?").run(r.id);
    }
  }

  // Upsert canonical reminders by feature_key (preserve user's enabled choice if row exists)
  const upsert = db.prepare(`
    INSERT INTO reminders (feature_key, title, time, enabled)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(feature_key) DO UPDATE SET title=excluded.title, time=excluded.time
  `);

  // SQLite needs a UNIQUE constraint for ON CONFLICT — use a manual check
  for (const r of CANONICAL_REMINDERS) {
    if (byKey.has(r.key)) {
      db.prepare("UPDATE reminders SET title = ?, time = ? WHERE feature_key = ?")
        .run(r.title, r.time, r.key);
    } else {
      db.prepare("INSERT INTO reminders (feature_key, title, time, enabled) VALUES (?, ?, ?, ?)")
        .run(r.key, r.title, r.time, r.enabled);
    }
  }
}

router.get("/", (req, res) => {
  const db = getDb();
  reconcileReminders(db);
  const reminders = db.prepare(
    "SELECT id, feature_key, title, time, enabled FROM reminders ORDER BY id"
  ).all();
  res.json(reminders);
});

router.put("/:id/toggle", (req, res) => {
  const db = getDb();
  const reminder = db.prepare("SELECT * FROM reminders WHERE id = ?").get(req.params.id);
  if (!reminder) return res.status(404).json({ error: "Reminder not found" });
  const newVal = reminder.enabled ? 0 : 1;
  db.prepare("UPDATE reminders SET enabled = ? WHERE id = ?").run(newVal, req.params.id);
  const updated = db.prepare("SELECT * FROM reminders WHERE id = ?").get(req.params.id);
  res.json(updated);
});

export default router;
