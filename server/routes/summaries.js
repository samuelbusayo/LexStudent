import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  const summaries = db.prepare("SELECT * FROM summaries ORDER BY id").all();
  res.json(summaries);
});

router.post("/", (req, res) => {
  const db = getDb();
  const { subject, title, content } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: "Title required" });
  const result = db.prepare("INSERT INTO summaries (subject, title, content) VALUES (?, ?, ?)").run(subject || '', title.trim(), content || '');
  const summary = db.prepare("SELECT * FROM summaries WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(summary);
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  const result = db.prepare("DELETE FROM summaries WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Summary not found" });
  res.json({ success: true });
});

export default router;
