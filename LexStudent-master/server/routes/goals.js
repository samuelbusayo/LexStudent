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
  const { subjectTag, title, note, progress, date, status, topicId, targetAmount } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: "Title is required" });
  const result = db.prepare(
    `INSERT INTO goals (subject_tag, title, note, progress, date, status, topic_id, target_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(subjectTag || '', title.trim(), note || '', progress || 0, date || '', status || 'not_started', topicId || null, targetAmount || 0);
  const goal = db.prepare("SELECT * FROM goals WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(goal);
});

router.put("/:id", (req, res) => {
  const db = getDb();
  const { subjectTag, title, note, progress, date, status, topicId, targetAmount } = req.body;

  const oldGoal = db.prepare("SELECT * FROM goals WHERE id = ?").get(req.params.id);
  if (!oldGoal) return res.status(404).json({ error: "Goal not found" });

  const result = db.prepare(
    `UPDATE goals SET subject_tag = COALESCE(?, subject_tag), title = COALESCE(?, title), note = COALESCE(?, note), progress = COALESCE(?, progress), date = COALESCE(?, date), status = COALESCE(?, status), topic_id = COALESCE(?, topic_id), target_amount = COALESCE(?, target_amount), updated_at = datetime('now') WHERE id = ?`
  ).run(subjectTag, title, note, progress, date, status, topicId, targetAmount, req.params.id);

  const goal = db.prepare("SELECT * FROM goals WHERE id = ?").get(req.params.id);

  const nowCompleted = (goal.status === 'completed' || goal.progress >= 100) &&
                       (oldGoal.status !== 'completed' && oldGoal.progress < 100);
  if (nowCompleted) {
    db.prepare(
      `INSERT INTO activity_log (user_id, type, goal_id, amount, created_at) VALUES (?, 'goal_completed', ?, 1, datetime('now'))`
    ).run(goal.user_id, goal.id);
  }

  res.json(goal);
});

router.delete("/:id", (req, res) => {
  const db = getDb();
  const result = db.prepare("DELETE FROM goals WHERE id = ?").run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: "Goal not found" });
  res.json({ success: true });
});

export default router;
