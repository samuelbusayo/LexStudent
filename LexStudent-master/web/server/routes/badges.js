import { Router } from "express";
import { getDb } from "../db.js";
import { CATEGORIES } from "../services/badgeCatalogue.js";
import { safeEvaluate } from "../services/badgeEvaluator.js";

const router = Router();

// Returns the full catalogue joined with the current user's progress.
// Re-evaluates on every fetch so a fresh page load always reflects reality.
router.get("/", (req, res) => {
  const db = getDb();
  safeEvaluate(db, 1);

  const rows = db.prepare(`
    SELECT b.id, b.code, b.name, b.icon, b.description, b.category, b.tier, b.target, b.criteria,
           ub.progress, ub.earned_at
      FROM badges b
      LEFT JOIN user_badges ub ON ub.badge_code = b.code AND ub.user_id = 1
     WHERE b.code IS NOT NULL
     ORDER BY b.category, b.tier, b.id
  `).all();

  res.json(rows.map(r => ({
    id: r.id,
    code: r.code,
    name: r.name,
    icon: r.icon,
    description: r.description,
    category: r.category,
    tier: r.tier,
    target: r.target,
    progress: r.progress || 0,
    earned: !!r.earned_at,
    earnedAt: r.earned_at,
    percent: Math.min(100, Math.round(((r.progress || 0) / Math.max(1, r.target)) * 100)),
  })));
});

router.get("/categories", (req, res) => {
  res.json(CATEGORIES);
});

// Lifetime achievement counters — always-visible stats, not earned
router.get("/achievements", (req, res) => {
  const db = getDb();

  const pages = db.prepare(
    "SELECT COALESCE(SUM(amount), 0) AS t FROM activity_log WHERE type = 'page_read'"
  ).get().t;

  const quizzes = db.prepare(
    "SELECT COUNT(*) AS c FROM quiz_attempts WHERE completed_at IS NOT NULL"
  ).get().c;

  const avgQuizRow = db.prepare(`
    SELECT AVG(CAST(correct_count AS REAL) / NULLIF(total_count, 0)) AS a
      FROM quiz_attempts WHERE completed_at IS NOT NULL AND total_count > 0
  `).get();
  const avgQuiz = avgQuizRow.a ? Math.round(avgQuizRow.a * 100) : 0;

  const longestStreakRow = db.prepare(
    "SELECT COALESCE(MAX(streak), 0) AS s FROM users WHERE id = 1"
  ).get();

  const highlights = db.prepare(
    "SELECT COUNT(*) AS c FROM study_notes WHERE type = 'highlight'"
  ).get().c;

  const topicsCompleted = db.prepare(
    "SELECT COUNT(*) AS c FROM topics WHERE total_pages > 0 AND pages_read >= total_pages"
  ).get().c;

  const aiRequests = db.prepare(
    "SELECT COUNT(*) AS c FROM activity_log WHERE type = 'ai_question'"
  ).get().c;

  const daysActiveRow = db.prepare(
    "SELECT COUNT(DISTINCT date(created_at)) AS c FROM activity_log WHERE user_id = 1"
  ).get();

  res.json({
    totalPagesRead: pages,
    totalQuizzes: quizzes,
    avgQuizScore: avgQuiz,
    longestStreak: longestStreakRow.s,
    highlightsCreated: highlights,
    topicsCompleted,
    aiRequests,
    daysActive: daysActiveRow.c,
  });
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
