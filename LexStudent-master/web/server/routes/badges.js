import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  const badges = db.prepare("SELECT * FROM badges ORDER BY id").all();
  res.json(badges);
});

router.get("/quote", (req, res) => {
  const db = getDb();
  const quote = db.prepare("SELECT text, author FROM daily_quotes ORDER BY RANDOM() LIMIT 1").get();
  res.json(quote || { text: "The Rule of Law...", author: "Lord Bingham" });
});

router.get("/milestone", (req, res) => {
  const db = getDb();
  const milestone = db.prepare("SELECT * FROM milestones WHERE user_id = 1 ORDER BY id DESC LIMIT 1").get();
  if (!milestone) return res.json(null);

  const now = new Date();
  const target = new Date(milestone.target_date + 'T00:00:00');
  const diffMs = target - now;
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  res.json({
    id: milestone.id,
    title: milestone.title,
    targetDate: milestone.target_date,
    description: milestone.description,
    daysRemaining,
    passed: diffMs < 0,
  });
});

router.post("/milestone", (req, res) => {
  const db = getDb();
  const { title, targetDate, description } = req.body;
  if (!title?.trim() || !targetDate) return res.status(400).json({ error: "Title and target date are required" });

  const result = db.prepare(
    "INSERT INTO milestones (user_id, title, target_date, description) VALUES (1, ?, ?, ?)"
  ).run(title.trim(), targetDate, description?.trim() || '');

  const milestone = db.prepare("SELECT * FROM milestones WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(milestone);
});

router.put("/milestone/:id", (req, res) => {
  const db = getDb();
  const { title, targetDate, description } = req.body;
  if (!title?.trim() || !targetDate) return res.status(400).json({ error: "Title and target date are required" });

  const result = db.prepare(
    "UPDATE milestones SET title = ?, target_date = ?, description = ?, updated_at = datetime('now') WHERE id = ? AND user_id = 1"
  ).run(title.trim(), targetDate, description?.trim() || '', req.params.id);

  if (result.changes === 0) return res.status(404).json({ error: "Milestone not found" });
  const milestone = db.prepare("SELECT * FROM milestones WHERE id = ?").get(req.params.id);
  res.json(milestone);
});

router.delete("/milestone/:id", (req, res) => {
  const db = getDb();
  const result = db.prepare("DELETE FROM milestones WHERE id = ? AND user_id = 1").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Milestone not found" });
  res.json({ success: true });
});

export default router;
