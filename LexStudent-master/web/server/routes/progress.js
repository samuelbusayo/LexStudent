import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

router.get("/overall", (req, res) => {
  const db = getDb();

  // Compute overall progress dynamically from all topics across all courses
  const allTopics = db.prepare("SELECT total_pages, pages_read FROM topics").all();

  let overall = 0;
  if (allTopics.length > 0) {
    const totalPagesSum = allTopics.reduce((acc, t) => acc + (t.total_pages || 0), 0);
    const pagesReadSum = allTopics.reduce((acc, t) => acc + Math.min(t.pages_read || 0, t.total_pages || 0), 0);
    overall = totalPagesSum > 0 ? Math.round((pagesReadSum / totalPagesSum) * 100) : 0;
  }

  // Streak and badge still come from the stored record
  const meta = db.prepare("SELECT streak, badge FROM progress_overall WHERE user_id = 1").get() || { streak: 0, badge: '' };

  // Per-course breakdown for the progress section
  const courses = db.prepare("SELECT id, name FROM courses ORDER BY id").all();
  const courseProgress = courses.map(course => {
    const topics = db.prepare("SELECT id, name, total_pages, pages_read FROM topics WHERE course_id = ?").all(course.id);
    const totalTopics = topics.length;
    const completedTopics = topics.filter(t => t.pages_read >= t.total_pages && t.total_pages > 0).length;

    const totalPagesSum = topics.reduce((acc, t) => acc + (t.total_pages || 0), 0);
    const pagesReadSum = topics.reduce((acc, t) => acc + Math.min(t.pages_read || 0, t.total_pages || 0), 0);
    const progressPercent = totalPagesSum > 0 ? Math.round((pagesReadSum / totalPagesSum) * 100) : 0;

    return {
      course_id: course.id,
      course_name: course.name,
      total_topics: totalTopics,
      completed_topics: completedTopics,
      progress_percent: progressPercent,
      topics: topics.map(t => ({
        id: t.id,
        name: t.name,
        total_pages: t.total_pages,
        pages_read: Math.min(t.pages_read, t.total_pages),
        progress_percent: t.total_pages > 0 ? Math.round((Math.min(t.pages_read, t.total_pages) / t.total_pages) * 100) : 0,
        completed: t.pages_read >= t.total_pages && t.total_pages > 0,
      })),
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
  const data = db.prepare("SELECT streak, badge FROM progress_overall WHERE user_id = 1").get() || { streak: 0, badge: '' };
  res.json(data);
});

router.get("/gaps", (req, res) => {
  const db = getDb();
  const gaps = db.prepare("SELECT subject, topic, progress, last_reviewed FROM knowledge_gaps WHERE user_id = 1 ORDER BY id").all();
  res.json(gaps);
});

router.get("/heatmap", (req, res) => {
  const db = getDb();
  const heatmap = db.prepare("SELECT intensity FROM heatmap_data WHERE user_id = 1 ORDER BY day_index").all();
  res.json(heatmap.map(h => h.intensity));
});

export default router;
