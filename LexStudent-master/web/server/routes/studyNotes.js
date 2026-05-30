import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

// ─── Revision feed: one card per topic that has a summary or highlights ───
router.get("/", (req, res) => {
  const db = getDb();
  const rows = db.prepare(
    `SELECT
       t.id            AS topic_id,
       t.name          AS topic_name,
       c.id            AS course_id,
       c.name          AS course_name,
       ts.body         AS summary_body,
       ts.updated_at   AS summary_updated_at,
       (SELECT COUNT(*) FROM study_notes sn
        WHERE sn.topic_id = t.id AND sn.type = 'highlight') AS highlight_count,
       COALESCE(ts.updated_at,
         (SELECT MAX(sn2.created_at) FROM study_notes sn2
          WHERE sn2.topic_id = t.id AND sn2.type = 'highlight')) AS updated_at
     FROM topics t
     JOIN courses c ON t.course_id = c.id
     LEFT JOIN topic_summaries ts ON ts.topic_id = t.id
     WHERE ts.id IS NOT NULL
        OR EXISTS (SELECT 1 FROM study_notes sn3
                   WHERE sn3.topic_id = t.id AND sn3.type = 'highlight')
     ORDER BY updated_at DESC
     LIMIT 20`
  ).all();
  res.json(rows);
});

// ─── Get summary + highlights for a topic ───
router.get("/:topicId/summary", (req, res) => {
  const db = getDb();
  const { topicId } = req.params;

  const summary = db.prepare(
    `SELECT id, topic_id, user_id, body, created_at, updated_at
     FROM topic_summaries WHERE topic_id = ?`
  ).get(topicId);

  const highlights = db.prepare(
    `SELECT id, topic_id, user_id, page, paragraph, anchor_text, text, created_at
     FROM study_notes
     WHERE topic_id = ? AND type = 'highlight'
     ORDER BY page ASC, paragraph ASC, created_at ASC`
  ).all(topicId);

  res.json({
    body: summary?.body || "",
    updatedAt: summary?.updated_at || null,
    highlights,
  });
});

// ─── Upsert summary body for a topic ───
router.put("/:topicId/summary", (req, res) => {
  const db = getDb();
  const { topicId } = req.params;
  const { body } = req.body;
  if (body === undefined) return res.status(400).json({ error: "body is required" });

  const existing = db.prepare(
    "SELECT id FROM topic_summaries WHERE topic_id = ?"
  ).get(topicId);

  if (existing) {
    db.prepare(
      "UPDATE topic_summaries SET body = ?, updated_at = datetime('now') WHERE topic_id = ?"
    ).run(body, topicId);
  } else {
    db.prepare(
      "INSERT INTO topic_summaries (topic_id, user_id, body) VALUES (?, 1, ?)"
    ).run(topicId, body);
  }

  const summary = db.prepare(
    "SELECT id, topic_id, user_id, body, created_at, updated_at FROM topic_summaries WHERE topic_id = ?"
  ).get(topicId);

  res.json(summary);
});

// ─── Create a highlight (immutable) ───
router.post("/:topicId/highlight", (req, res) => {
  const db = getDb();
  const { topicId } = req.params;
  const { page, paragraph, anchorText, text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "text is required" });

  const result = db.prepare(
    `INSERT INTO study_notes (topic_id, user_id, type, page, paragraph, anchor_text, text)
     VALUES (?, 1, 'highlight', ?, ?, ?, ?)`
  ).run(topicId, page || 1, paragraph ?? null, anchorText || "", text.trim());

  const highlight = db.prepare("SELECT * FROM study_notes WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(highlight);
});

// ─── Legacy: get all notes & highlights for a topic (used by reader) ───
router.get("/:topicId", (req, res) => {
  const db = getDb();
  const notes = db
    .prepare("SELECT * FROM study_notes WHERE topic_id = ? ORDER BY page ASC, created_at ASC")
    .all(req.params.topicId);
  res.json(notes);
});

// ─── Delete a highlight ───
router.delete("/:id", (req, res) => {
  const db = getDb();
  const result = db.prepare("DELETE FROM study_notes WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Note not found" });
  res.json({ success: true });
});

export default router;
