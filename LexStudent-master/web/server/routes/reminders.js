import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  const db = getDb();
  const reminders = db.prepare("SELECT * FROM reminders ORDER BY id").all();
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
