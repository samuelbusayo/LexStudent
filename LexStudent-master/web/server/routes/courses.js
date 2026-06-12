import { Router } from "express";
import fs from "fs";
import { getDb } from "../db.js";
import { getStudiedPages } from "../helpers/studiedPages.js";
import { safeEvaluate } from "../services/badgeEvaluator.js";

const router = Router();

// Helper: compute progress stats for a single course from its topics
function computeCourseProgress(db, courseId) {
  const topics = db.prepare(
    "SELECT selected_pages, total_pages, pages_read FROM topics WHERE course_id = ?"
  ).all(courseId);

  const totalTopics = topics.length;
  let totalPagesSum = 0;
  let pagesReadSum = 0;
  let completedTopics = 0;

  for (const t of topics) {
    const studied = getStudiedPages(t);
    totalPagesSum += studied;
    pagesReadSum += Math.min(t.pages_read || 0, studied);
    if ((t.pages_read || 0) >= studied && studied > 0) completedTopics++;
  }

  const progressPercent = totalPagesSum > 0 ? Math.round((pagesReadSum / totalPagesSum) * 100) : 0;
  return { totalTopics, completedTopics, progressPercent };
}

/** Enrich a topic row with parsed arrays + studied_pages + pages_remaining */
function enrichTopic(t) {
  const selectedPages = JSON.parse(t.selected_pages || '[]');
  const studied = selectedPages.length > 0 ? selectedPages.length : (t.total_pages || 0);
  const pagesRead = Math.min(t.pages_read || 0, studied);
  return {
    ...t,
    selectedPages,
    materials: JSON.parse(t.materials || '[]'),
    studied_pages: studied,
    pages_remaining: Math.max(0, studied - pagesRead),
  };
}

router.get("/", (req, res) => {
  const db = getDb();
  const courses = db.prepare("SELECT * FROM courses ORDER BY id").all();

  const enriched = courses.map(course => {
    const { totalTopics, completedTopics, progressPercent } = computeCourseProgress(db, course.id);
    return {
      ...course,
      total_topics: totalTopics,
      completed_topics: completedTopics,
      progress_percent: progressPercent,
    };
  });

  res.json(enriched);
});

router.get("/:id", (req, res) => {
  const db = getDb();
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });

  const { totalTopics, completedTopics, progressPercent } = computeCourseProgress(db, course.id);
  res.json({
    ...course,
    total_topics: totalTopics,
    completed_topics: completedTopics,
    progress_percent: progressPercent,
  });
});

router.get("/:courseId/topics", (req, res) => {
  const db = getDb();
  const topics = db.prepare("SELECT * FROM topics WHERE course_id = ? ORDER BY id").all(req.params.courseId);
  res.json(topics.map(enrichTopic));
});

router.put("/:courseId/topics/:topicId/progress", (req, res) => {
  const db = getDb();
  const { pagesRead } = req.body;
  if (pagesRead === undefined) return res.status(400).json({ error: "pagesRead required" });

  const oldTopic = db.prepare("SELECT * FROM topics WHERE id = ? AND course_id = ?").get(req.params.topicId, req.params.courseId);
  if (!oldTopic) return res.status(404).json({ error: "Topic not found" });

  const oldPagesRead = oldTopic.pages_read || 0;
  const delta = pagesRead - oldPagesRead;

  db.prepare("UPDATE topics SET pages_read = ?, updated_at = datetime('now') WHERE id = ? AND course_id = ?")
    .run(pagesRead, req.params.topicId, req.params.courseId);

  let newlyEarned = [];
  if (delta > 0) {
    db.prepare(
      `INSERT INTO activity_log (user_id, type, topic_id, amount, created_at) VALUES (1, 'page_read', ?, ?, datetime('now'))`
    ).run(oldTopic.id, delta);

    // If this update just completed the topic, log a topic_completed event
    const updated = db.prepare("SELECT pages_read, total_pages FROM topics WHERE id = ?").get(req.params.topicId);
    const wasComplete = oldTopic.total_pages > 0 && oldTopic.pages_read >= oldTopic.total_pages;
    const isComplete  = updated.total_pages > 0 && updated.pages_read >= updated.total_pages;
    if (isComplete && !wasComplete) {
      db.prepare(
        `INSERT INTO activity_log (user_id, type, topic_id, amount, created_at) VALUES (1, 'topic_completed', ?, 1, datetime('now'))`
      ).run(oldTopic.id);
    }

    newlyEarned = safeEvaluate(db, 1);
  }

  const topic = db.prepare("SELECT * FROM topics WHERE id = ?").get(req.params.topicId);
  res.json({ ...topic, newlyEarnedBadges: newlyEarned });
});

router.post("/:courseId/topics", (req, res) => {
  const db = getDb();
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.courseId);
  if (!course) return res.status(404).json({ error: "Course not found" });

  const { name, hasMaterials, materialFile, materialType, selectedPages, totalDocumentPages } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: "Topic name is required" });

  // total_pages = studied page count (selectedPages.length), falling back to totalDocumentPages
  const selArr = Array.isArray(selectedPages) ? selectedPages : [];
  const totalPages = selArr.length > 0 ? selArr.length : (totalDocumentPages || 0);

  const result = db.prepare(
    `INSERT INTO topics (course_id, name, subtitle, total_pages, has_materials, material_file, material_type, selected_pages, total_document_pages)
     VALUES (?, ?, '', ?, ?, ?, ?, ?, ?)`
  ).run(
    req.params.courseId, name.trim(), totalPages,
    hasMaterials ? 1 : 0, materialFile || null, materialType || null,
    JSON.stringify(selArr), totalDocumentPages || 0
  );

  const newTopic = db.prepare("SELECT * FROM topics WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(enrichTopic(newTopic));
});

router.put("/:courseId/topics/:topicId/materials", (req, res) => {
  const db = getDb();
  const { hasMaterials, materialFile, materialType, selectedPages, totalDocumentPages } = req.body;

  // total_pages = studied page count
  const selArr = Array.isArray(selectedPages) ? selectedPages : [];
  const totalPages = selArr.length > 0 ? selArr.length : (totalDocumentPages || 0);

  const result = db.prepare(
    `UPDATE topics SET has_materials = ?, material_file = ?, material_type = ?, selected_pages = ?,
     total_document_pages = ?, total_pages = ?, updated_at = datetime('now')
     WHERE id = ? AND course_id = ?`
  ).run(
    hasMaterials ? 1 : 1, materialFile || null, materialType || null,
    JSON.stringify(selArr), totalDocumentPages || 0, totalPages,
    req.params.topicId, req.params.courseId
  );
  if (result.changes === 0) return res.status(404).json({ error: "Topic not found" });
  const topic = db.prepare("SELECT * FROM topics WHERE id = ?").get(req.params.topicId);
  res.json(enrichTopic(topic));
});

router.delete("/:courseId/topics/:topicId", (req, res) => {
  const db = getDb();
  const topic = db.prepare("SELECT * FROM topics WHERE id = ? AND course_id = ?").get(req.params.topicId, req.params.courseId);
  if (!topic) return res.status(404).json({ error: "Topic not found" });

  db.prepare("DELETE FROM topics WHERE id = ? AND course_id = ?").run(req.params.topicId, req.params.courseId);
  res.json({ success: true });
});

router.delete("/:courseId/topics/:topicId/materials", (req, res) => {
  const db = getDb();
  const materials = db.prepare("SELECT * FROM materials WHERE topic_id = ?").all(req.params.topicId);
  for (const m of materials) {
    try { if (fs.existsSync(m.filepath)) fs.unlinkSync(m.filepath); } catch (e) {}
  }
  db.prepare("DELETE FROM materials WHERE topic_id = ?").run(req.params.topicId);

  const result = db.prepare(
    `UPDATE topics SET has_materials = 0, material_file = NULL, material_type = NULL, selected_pages = '[]', total_document_pages = 0, total_pages = 0, updated_at = datetime('now')
     WHERE id = ? AND course_id = ?`
  ).run(req.params.topicId, req.params.courseId);
  if (result.changes === 0) return res.status(404).json({ error: "Topic not found" });
  res.json({ success: true });
});

export default router;
