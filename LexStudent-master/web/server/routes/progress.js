import { Router } from "express";
import { getDb } from "../db.js";
import { getStudiedPages } from "../helpers/studiedPages.js";

const router = Router();

const DAILY_TARGET = 5;

router.get("/overall", (req, res) => {
  const db = getDb();

  const allTopics = db.prepare("SELECT selected_pages, total_pages, pages_read FROM topics").all();

  let overallTotalPages = 0;
  let overallPagesRead = 0;
  for (const t of allTopics) {
    const studied = getStudiedPages(t);
    overallTotalPages += studied;
    overallPagesRead += Math.min(t.pages_read || 0, studied);
  }
  const overall = overallTotalPages > 0 ? Math.round((overallPagesRead / overallTotalPages) * 100) : 0;

  const meta = db.prepare("SELECT streak, badge FROM progress_overall WHERE user_id = 1").get() || { streak: 0, badge: '' };

  const courses = db.prepare("SELECT id, name FROM courses ORDER BY id").all();
  const courseProgress = courses.map(course => {
    const topics = db.prepare(
      "SELECT id, name, selected_pages, total_pages, pages_read FROM topics WHERE course_id = ?"
    ).all(course.id);

    const totalTopics = topics.length;
    let totalPagesSum = 0;
    let pagesReadSum = 0;
    let completedTopics = 0;

    const topicDetails = topics.map(t => {
      const studied = getStudiedPages(t);
      const read = Math.min(t.pages_read || 0, studied);
      totalPagesSum += studied;
      pagesReadSum += read;
      const completed = read >= studied && studied > 0;
      if (completed) completedTopics++;

      return {
        id: t.id,
        name: t.name,
        studied_pages: studied,
        pages_read: read,
        pages_remaining: Math.max(0, studied - read),
        progress_percent: studied > 0 ? Math.round((read / studied) * 100) : 0,
        completed,
      };
    });

    const progressPercent = totalPagesSum > 0 ? Math.round((pagesReadSum / totalPagesSum) * 100) : 0;

    return {
      course_id: course.id,
      course_name: course.name,
      total_topics: totalTopics,
      completed_topics: completedTopics,
      progress_percent: progressPercent,
      topics: topicDetails,
    };
  });

  res.json({
    overall,
    streak: meta.streak,
    badge: meta.badge,
    courses: courseProgress,
  });
});

router.get("/recent", (req, res) => {
  const db = getDb();
  const recent = db.prepare("SELECT type, title, status FROM progress_activities WHERE user_id = 1 ORDER BY id DESC LIMIT 5").all();
  res.json(recent);
});

router.get("/streak", (req, res) => {
  const db = getDb();

  const days = db.prepare(
    `SELECT DISTINCT date(created_at) as day FROM activity_log WHERE user_id = ? ORDER BY day DESC`
  ).all(1);

  let streak = 0;
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  for (let i = 0; i < days.length; i++) {
    const expected = new Date(todayUTC);
    expected.setUTCDate(expected.getUTCDate() - i);
    const expectedStr = expected.toISOString().slice(0, 10);
    if (days[i].day === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  const todayActivities = db.prepare(
    `SELECT COALESCE(SUM(amount), 0) as total FROM activity_log WHERE user_id = ? AND date(created_at) = date('now')`
  ).get(1);

  const ringPercent = Math.min(100, Math.round((todayActivities.total / DAILY_TARGET) * 100));

  const meta = db.prepare("SELECT badge FROM progress_overall WHERE user_id = 1").get() || { badge: '' };

  res.json({ streak, badge: meta.badge, ring_percent: ringPercent, daily_target: DAILY_TARGET });
});

router.get("/gaps", (req, res) => {
  const db = getDb();

  const topics = db.prepare(
    `SELECT t.id, t.name, t.selected_pages, t.total_pages, t.pages_read,
            t.last_reviewed_at, t.review_interval_days, c.name as course_name
     FROM topics t JOIN courses c ON t.course_id = c.id`
  ).all();

  const countdown = db.prepare("SELECT days_remaining FROM countdowns WHERE id = 1").get();
  const daysToExam = countdown ? countdown.days_remaining : 60;

  const now = new Date();
  const gaps = [];

  for (const t of topics) {
    const studied = getStudiedPages(t);
    const mastery = studied > 0 ? Math.min(t.pages_read || 0, studied) / studied : 0;
    const masteryPct = Math.round(mastery * 100);

    let daysOverdue = 0;
    let lastReviewedStr = 'Unread Topic';
    if (t.last_reviewed_at) {
      const lastDate = new Date(t.last_reviewed_at);
      const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
      daysOverdue = Math.max(0, diffDays - (t.review_interval_days || 1));
      if (diffDays === 0) lastReviewedStr = 'Today';
      else if (diffDays === 1) lastReviewedStr = '1 day ago';
      else if (diffDays < 7) lastReviewedStr = `${diffDays} days ago`;
      else if (diffDays < 14) lastReviewedStr = '1 week ago';
      else lastReviewedStr = `${Math.floor(diffDays / 7)} weeks ago`;
    }

    const isOverdue = t.last_reviewed_at
      ? daysOverdue > 0
      : true;
    const isLowMastery = mastery < 0.7;

    if (!isLowMastery && !isOverdue) continue;

    const priority = (1 - mastery) * 40 + Math.min(daysOverdue, 30) * 1.5 + Math.max(0, (60 - daysToExam)) * 0.5;

    gaps.push({
      id: t.id,
      subject: t.course_name,
      topic: t.name,
      progress: masteryPct,
      last_reviewed: lastReviewedStr,
      priority,
      mastery,
      review_interval_days: t.review_interval_days,
    });
  }

  gaps.sort((a, b) => b.priority - a.priority);

  res.json(gaps);
});

router.get("/heatmap", (req, res) => {
  const db = getDb();

  const rows = db.prepare(
    `SELECT date(created_at) as day, SUM(amount) as total
     FROM activity_log WHERE user_id = ?
       AND date(created_at) >= date('now', '-20 days')
     GROUP BY date(created_at)`
  ).all(1);

  const dayMap = {};
  for (const r of rows) dayMap[r.day] = r.total;

  const maxVal = Math.max(1, ...Object.values(dayMap));
  const intensities = [];
  const today = new Date();

  for (let i = 20; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = dayMap[key] || 0;
    intensities.push(Math.round((count / maxVal) * 5));
  }

  const weekStart = new Date(today);
  const dayOfWeek = weekStart.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  weekStart.setDate(weekStart.getDate() - mondayOffset);

  let targetMetDays = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    if (d > today) break;
    const key = d.toISOString().slice(0, 10);
    if ((dayMap[key] || 0) >= DAILY_TARGET) targetMetDays++;
  }

  const elapsedWeekDays = Math.min(7, mondayOffset + 1);

  res.json({ intensities, target_met: targetMetDays, target_total: elapsedWeekDays });
});

router.post("/review", (req, res) => {
  const db = getDb();
  const { topicId, rating } = req.body;

  const topic = db.prepare("SELECT * FROM topics WHERE id = ?").get(topicId);
  if (!topic) return res.status(404).json({ error: "Topic not found" });

  let newInterval = topic.review_interval_days || 1;
  if (rating === 'got_it') {
    newInterval = Math.min(30, newInterval * 2 + 1);
  } else if (rating === 'forgot') {
    newInterval = 1;
  }

  db.prepare(
    `UPDATE topics SET last_reviewed_at = datetime('now'), review_interval_days = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(newInterval, topicId);

  db.prepare(
    `INSERT INTO activity_log (user_id, type, topic_id, amount, created_at) VALUES (1, 'topic_reviewed', ?, 1, datetime('now'))`
  ).run(topicId);

  const updated = db.prepare("SELECT * FROM topics WHERE id = ?").get(topicId);
  res.json(updated);
});

export default router;
