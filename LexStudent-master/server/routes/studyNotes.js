import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

// Get all notes & highlights for a topic
router.get("/:topicId", (req, res) => {
  const db = getDb();
  const notes = db
    .prepare("SELECT * FROM study_notes WHERE topic_id = ? ORDER BY page ASC, created_at ASC")
    .all(req.params.topicId);
  res.json(notes);
});

// Create a note or highlight
router.post("/:topicId", (req, res) => {
  const db = getDb();
  const { type, page, text, color } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "Text is required" });

  const result = db
    .prepare(
      `INSERT INTO study_notes (topic_id, type, page, text, color) VALUES (?, ?, ?, ?, ?)`
    )
    .run(req.params.topicId, type || "note", page || 1, text.trim(), color || "");

  const note = db.prepare("SELECT * FROM study_notes WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(note);
});

// Update a note
router.put("/:id", (req, res) => {
  const db = getDb();
  const { text, color } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "Text is required" });

  const result = db
    .prepare("UPDATE study_notes SET text = ?, color = ?, updated_at = datetime('now') WHERE id = ?")
    .run(text.trim(), color || "", req.params.id);

  if (result.changes === 0) return res.status(404).json({ error: "Note not found" });
  const note = db.prepare("SELECT * FROM study_notes WHERE id = ?").get(req.params.id);
  res.json(note);
});

// Delete a note
router.delete("/:id", (req, res) => {
  const db = getDb();
  const result = db.prepare("DELETE FROM study_notes WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Note not found" });
  res.json({ success: true });
});

export default router;
