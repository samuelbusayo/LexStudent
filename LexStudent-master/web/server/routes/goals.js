import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

function safeJson(val, fallback = []) {
  if (!val) return fallback;
  try { const p = JSON.parse(val); return Array.isArray(p) ? p : fallback; } catch { return fallback; }
}

/** Build a full goal response object with parsed arrays and occurrences */
function enrichGoal(db, g) {
  const occurrences = db.prepare(
    "SELECT id, goal_id, date, status, progress FROM goal_occurrences WHERE goal_id = ? ORDER BY date"
  ).all(g.id);

  return {
    id: g.id,
    user_id: g.user_id,
    subject_tag: g.subject_tag,
    title: g.title,
    note: g.note,
    date: g.date,
    status: g.status,
    topic_id: g.topic_id,
    target_amount: g.target_amount,
    target_pages: safeJson(g.target_pages),
    baseline_pages_read: g.baseline_pages_read || 0,
    created_at: g.created_at,
    updated_at: g.updated_at,
    course_id: g.course_id || null,
    topic_name: g.topic_name || null,
    selected_pages: safeJson(g.selected_pages),
    pages_read: g.pages_read || 0,
    total_document_pages: g.total_document_pages || 0,
    occurrences,
  };
}

const GOAL_QUERY = `
  SELECT
    g.id, g.user_id, g.subject_tag, g.title, g.note, g.progress,
    g.date, g.status, g.topic_id, g.target_amount, g.target_pages,
    g.baseline_pages_read,
    g.created_at, g.updated_at,
    t.course_id, t.name AS topic_name,
    t.selected_pages, t.pages_read, t.total_document_pages
  FROM goals g
  LEFT JOIN topics t ON g.topic_id = t.id
`;

// ── GET all goals with topic/course data and occurrences ──
router.get("/", (req, res) => {
  const db = getDb();
  const goals = db.prepare(GOAL_QUERY + " ORDER BY g.id").all();
  res.json(goals.map(g => enrichGoal(db, g)));
});

// ── PUT update a specific occurrence (must come before /:id) ──
router.put("/occurrences/:id", (req, res) => {
  const db = getDb();
  const { status, progress } = req.body;

  const occ = db.prepare("SELECT * FROM goal_occurrences WHERE id = ?").get(req.params.id);
  if (!occ) return res.status(404).json({ error: "Occurrence not found" });

  db.prepare(
    "UPDATE goal_occurrences SET status = COALESCE(?, status), progress = COALESCE(?, progress) WHERE id = ?"
  ).run(status ?? null, progress ?? null, req.params.id);

  const updated = db.prepare("SELECT id, goal_id, date, status, progress FROM goal_occurrences WHERE id = ?").get(req.params.id);

  // Log activity on first completion
  const nowComplete = (updated.status === 'completed' || updated.progress >= 100) &&
                      (occ.status !== 'completed' && occ.progress < 100);
  if (nowComplete) {
    db.prepare(
      "INSERT INTO activity_log (user_id, type, goal_id, amount, created_at) VALUES (1, 'goal_completed', ?, 1, datetime('now'))"
    ).run(occ.goal_id);
  }

  res.json(updated);
});

// ── POST create goal + occurrences ──
router.post("/", (req, res) => {
  const db = getDb();
  const { subjectTag, title, note, topicId, targetPages, targetAmount, dates, date, status } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: "Title is required" });

  const tpArr = Array.isArray(targetPages) ? targetPages : [];
  const tpJson = JSON.stringify(tpArr);
  const amount = tpArr.length > 0 ? tpArr.length : (Number(targetAmount) || 0);

  // dates array (new) or single date (legacy)
  const dateList = Array.isArray(dates) && dates.length > 0 ? dates : (date ? [date] : []);
  const firstDate = dateList[0] || '';

  // Snapshot the topic's current pages_read so the goal starts fresh
  let baseline = 0;
  if (topicId) {
    const topic = db.prepare("SELECT pages_read FROM topics WHERE id = ?").get(topicId);
    if (topic) baseline = topic.pages_read || 0;
  }

  const result = db.prepare(
    `INSERT INTO goals (subject_tag, title, note, progress, date, status, topic_id, target_amount, target_pages, baseline_pages_read)
     VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?)`
  ).run(
    subjectTag || '', title.trim(), note || '', firstDate,
    status || 'not_started', topicId || null, amount, tpJson, baseline
  );
  const goalId = result.lastInsertRowid;

  // Insert one occurrence per selected date
  const insertOcc = db.prepare(
    "INSERT INTO goal_occurrences (goal_id, user_id, date, status, progress) VALUES (?, 1, ?, 'not_started', 0)"
  );
  for (const d of dateList) {
    insertOcc.run(goalId, d);
  }

  const goal = db.prepare(GOAL_QUERY + " WHERE g.id = ?").get(goalId);
  res.status(201).json(enrichGoal(db, goal));
});

// ── PUT update goal definition ──
router.put("/:id", (req, res) => {
  const db = getDb();
  const { subjectTag, title, note, progress, date, status, topicId, targetAmount, targetPages } = req.body;

  const oldGoal = db.prepare("SELECT * FROM goals WHERE id = ?").get(req.params.id);
  if (!oldGoal) return res.status(404).json({ error: "Goal not found" });

  // Handle target_pages update
  let tpJson = undefined;
  let amount = targetAmount;
  if (targetPages !== undefined) {
    const tpArr = Array.isArray(targetPages) ? targetPages : [];
    tpJson = JSON.stringify(tpArr);
    if (tpArr.length > 0) amount = tpArr.length;
  }

  db.prepare(
    `UPDATE goals SET
      subject_tag = COALESCE(?, subject_tag),
      title = COALESCE(?, title),
      note = COALESCE(?, note),
      progress = COALESCE(?, progress),
      date = COALESCE(?, date),
      status = COALESCE(?, status),
      topic_id = COALESCE(?, topic_id),
      target_amount = COALESCE(?, target_amount),
      target_pages = COALESCE(?, target_pages),
      updated_at = datetime('now')
    WHERE id = ?`
  ).run(
    subjectTag ?? null, title ?? null, note ?? null, progress ?? null,
    date ?? null, status ?? null, topicId ?? null, amount ?? null,
    tpJson ?? null, req.params.id
  );

  const goal = db.prepare(GOAL_QUERY + " WHERE g.id = ?").get(req.params.id);

  // Activity log on first completion
  const nowComplete = (goal.status === 'completed' || goal.progress >= 100) &&
                      (oldGoal.status !== 'completed' && oldGoal.progress < 100);
  if (nowComplete) {
    db.prepare(
      "INSERT INTO activity_log (user_id, type, goal_id, amount, created_at) VALUES (?, 'goal_completed', ?, 1, datetime('now'))"
    ).run(goal.user_id, goal.id);
  }

  res.json(enrichGoal(db, goal));
});

// ── DELETE goal (occurrences cascade) ──
router.delete("/:id", (req, res) => {
  const db = getDb();
  const result = db.prepare("DELETE FROM goals WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Goal not found" });
  res.json({ success: true });
});

export default router;
