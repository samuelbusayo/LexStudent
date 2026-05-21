import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  const goals = db.prepare("SELECT * FROM goals ORDER BY id").all();
  res.json(goals);
});

router.post("/", (req, res) => {
  const db = getDb();
  const { subjectTag, title, note, progress, date, status } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: "Title is required" });
  const result = db.prepare(
    `INSERT INTO goals (subject_tag, title, note, progress, date, status) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(subjectTag || '', title.trim(), note || '', progress || 0, date || '', status || 'not_started');
  const goal = db.prepare("SELECT * FROM goals WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(goal);
});

router.put("/:id", (req, res) => {
  const db = getDb();
  const { subjectTag, title, note, progress, date, status } = req.body;
  const result = db.prepare(
    `UPDATE goals SET subject_tag = COALESCE(?, subject_tag), title = COALESCE(?, title), note = COALESCE(?, note), progress = COALESCE(?, progress), date = COALESCE(?, date), status = COALESCE(?, status), updated_at = datetime('now') WHERE id = ?`
  ).run(subjectTag, title, note, progress, date, status, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Goal not found" });
  const goal = db.prepare("SELECT * FROM goals WHERE id = ?").get(req.params.id);
  res.json(goal);
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  const result = db.prepare("DELETE FROM goals WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Goal not found" });
  res.json({ success: true });
});

export default router;
