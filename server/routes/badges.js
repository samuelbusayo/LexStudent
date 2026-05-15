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

router.get("/countdown", (req, res) => {
  const db = getDb();
  const countdown = db.prepare("SELECT title, days_remaining FROM countdowns WHERE id = 1").get() || { title: "Bar Finals", daysRemaining: 42 };
  res.json({ title: countdown.title, daysRemaining: countdown.days_remaining });
});

export default router;
