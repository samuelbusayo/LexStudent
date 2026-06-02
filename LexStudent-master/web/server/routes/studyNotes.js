import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

/** Parse body: valid JSON array → return it; plain text → wrap; empty → [] */
function parseBody(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return raw.trim() ? [{ type: "text", value: raw }] : [];
}

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
     WHERE (ts.id IS NOT NULL AND ts.body IS NOT NULL AND TRIM(ts.body) != '' AND TRIM(ts.body) != '[]')
        OR EXISTS (SELECT 1 FROM study_notes sn3
                   WHERE sn3.topic_id = t.id AND sn3.type = 'highlight')
     ORDER BY updated_at DESC
     LIMIT 40`
  ).all();

  // Post-filter: drop rows whose body is effectively empty (only whitespace text)
  // and have no highlight rows
  const filtered = rows.filter(r => {
    if (r.highlight_count > 0) return true;
    const nodes = parseBody(r.summary_body);
    return nodes.some(n =>
      n.type === "highlight" || (n.type === "text" && n.value && n.value.trim())
    );
  }).slice(0, 20);

  res.json(filtered);
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

  // Parse structured body (with plain-text migration)
  let bodyNodes = parseBody(summary?.body);

  // Migration: embed existing highlight rows if body has no highlight nodes yet
  const hasEmbeddedHighlights = bodyNodes.some(n => n.type === "highlight");
  if (!hasEmbeddedHighlights && highlights.length > 0) {
    for (const h of highlights) {
      bodyNodes.push({
        type: "highlight",
        text: h.text,
        page: h.page,
        paragraph: h.paragraph ?? null,
        anchorText: h.anchor_text || "",
        sourceId: h.id,
      });
    }
  }

  res.json({
    body: bodyNodes,
    updatedAt: summary?.updated_at || null,
    highlights,
  });
});

// ─── Upsert summary body for a topic (structured JSON array) ───
router.put("/:topicId/summary", (req, res) => {
  const db = getDb();
  const { topicId } = req.params;
  const { body } = req.body;
  if (body === undefined) return res.status(400).json({ error: "body is required" });

  // Accept array or JSON string; legacy plain text is wrapped
  let bodyStr;
  if (Array.isArray(body)) {
    bodyStr = JSON.stringify(body);
  } else if (typeof body === "string") {
    try {
      const p = JSON.parse(body);
      bodyStr = Array.isArray(p) ? body : JSON.stringify([{ type: "text", value: body }]);
    } catch {
      bodyStr = JSON.stringify(body.trim() ? [{ type: "text", value: body }] : []);
    }
  } else {
    return res.status(400).json({ error: "body must be an array or string" });
  }

  // Normalize: if body only has empty/whitespace text nodes, collapse to "[]"
  const parsed = parseBody(bodyStr);
  const hasContent = parsed.some(n =>
    n.type === "highlight" || (n.type === "text" && n.value && n.value.trim())
  );
  if (!hasContent) bodyStr = "[]";

  const existing = db.prepare(
    "SELECT id FROM topic_summaries WHERE topic_id = ?"
  ).get(topicId);

  if (existing) {
    db.prepare(
      "UPDATE topic_summaries SET body = ?, updated_at = datetime('now') WHERE topic_id = ?"
    ).run(bodyStr, topicId);
  } else {
    db.prepare(
      "INSERT INTO topic_summaries (topic_id, user_id, body) VALUES (?, 1, ?)"
    ).run(topicId, bodyStr);
  }

  // Clean up orphaned highlight rows: delete any study_notes highlights
  // for this topic whose id is no longer referenced as a sourceId in the body
  const savedNodes = parseBody(bodyStr);
  const keepIds = savedNodes
    .filter(n => n.type === "highlight" && n.sourceId)
    .map(n => n.sourceId);
  if (keepIds.length > 0) {
    const placeholders = keepIds.map(() => "?").join(",");
    db.prepare(
      `DELETE FROM study_notes WHERE topic_id = ? AND type = 'highlight' AND id NOT IN (${placeholders})`
    ).run(topicId, ...keepIds);
  } else {
    // No highlights in body — remove all highlight rows for this topic
    db.prepare(
      "DELETE FROM study_notes WHERE topic_id = ? AND type = 'highlight'"
    ).run(topicId);
  }

  const summary = db.prepare(
    "SELECT id, topic_id, user_id, body, created_at, updated_at FROM topic_summaries WHERE topic_id = ?"
  ).get(topicId);

  res.json({ ...summary, body: parseBody(summary?.body) });
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
