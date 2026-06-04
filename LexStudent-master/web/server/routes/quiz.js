import { Router } from "express";
import { getDb } from "../db.js";

const router = Router();

// GET /quiz/courses — courses with count of topics that have questions
router.get("/courses", (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT c.id, c.name, c.type, c.color, c.icon,
           COUNT(DISTINCT qq.topic_id) as question_topic_count
    FROM courses c
    LEFT JOIN quiz_questions qq ON qq.topic_id IN (
      SELECT t.id FROM topics t WHERE t.course_id = c.id
    )
    GROUP BY c.id
    ORDER BY c.id
  `).all();
  res.json(rows);
});

// GET /quiz/courses/:courseId/topics — topics in course with question counts
router.get("/courses/:courseId/topics", (req, res) => {
  const db = getDb();
  const courseId = Number(req.params.courseId);
  const rows = db.prepare(`
    SELECT t.id, t.name,
           (SELECT COUNT(*) FROM quiz_questions qq WHERE qq.topic_id = t.id) as question_count
    FROM topics t
    WHERE t.course_id = ?
    ORDER BY t.id
  `).all(courseId);
  res.json(rows);
});

// GET /quiz/topics/:topicId/session — scenarios + questions (without answers)
router.get("/topics/:topicId/session", (req, res) => {
  const db = getDb();
  const topicId = Number(req.params.topicId);

  const scenarios = db.prepare(
    `SELECT id, text, order_index FROM quiz_scenarios WHERE topic_id = ? ORDER BY order_index`
  ).all(topicId);

  const questions = db.prepare(
    `SELECT id, scenario_id, blank_number, prompt, options, order_index
     FROM quiz_questions WHERE topic_id = ? ORDER BY order_index`
  ).all(topicId);

  // Parse options JSON but strip correct_index and explanation
  const safeQuestions = questions.map(q => ({
    id: q.id,
    scenario_id: q.scenario_id,
    blank_number: q.blank_number,
    prompt: q.prompt,
    options: JSON.parse(q.options),
    order_index: q.order_index,
  }));

  res.json({ scenarios, questions: safeQuestions });
});

// POST /quiz/attempts — start a quiz attempt
router.post("/attempts", (req, res) => {
  const db = getDb();
  const { topicId, secondsPerQuestion, questionOrder, numQuestions } = req.body;

  // Validate
  const seconds = Math.min(30, Math.max(10, secondsPerQuestion || 20));
  const order = questionOrder === 'shuffled' ? 'shuffled' : 'sequential';

  // Get course for this topic
  const topic = db.prepare("SELECT course_id FROM topics WHERE id = ?").get(topicId);
  if (!topic) return res.status(404).json({ error: "Topic not found" });

  // Get all question IDs in order
  let questionIds = db.prepare(
    "SELECT id FROM quiz_questions WHERE topic_id = ? ORDER BY order_index"
  ).all(topicId).map(r => r.id);

  if (questionIds.length === 0) {
    return res.status(400).json({ error: "No questions available for this topic" });
  }

  // Shuffle if requested
  if (order === 'shuffled') {
    for (let i = questionIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionIds[i], questionIds[j]] = [questionIds[j], questionIds[i]];
    }
  }

  // Cap number of questions
  let cap = questionIds.length;
  if (numQuestions && numQuestions !== 'all' && Number(numQuestions) > 0) {
    cap = Math.min(Number(numQuestions), questionIds.length);
  }
  questionIds = questionIds.slice(0, cap);

  // Create attempt
  const result = db.prepare(`
    INSERT INTO quiz_attempts (user_id, topic_id, course_id, seconds_per_question, question_order, num_questions, total_count)
    VALUES (1, ?, ?, ?, ?, ?, ?)
  `).run(topicId, topic.course_id, seconds, order, cap, cap);

  res.json({
    attempt_id: result.lastInsertRowid,
    question_ids: questionIds,
    seconds_per_question: seconds,
  });
});

// POST /quiz/attempts/:id/answer — submit one answer (no correct answer revealed)
router.post("/attempts/:id/answer", (req, res) => {
  const db = getDb();
  const attemptId = Number(req.params.id);
  const { questionId, selectedIndex, timeTakenSeconds } = req.body;

  // Verify attempt exists and is incomplete
  const attempt = db.prepare("SELECT id, completed_at FROM quiz_attempts WHERE id = ?").get(attemptId);
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });
  if (attempt.completed_at) return res.status(400).json({ error: "Attempt already completed" });

  // Look up the correct answer
  const question = db.prepare("SELECT correct_index FROM quiz_questions WHERE id = ?").get(questionId);
  if (!question) return res.status(404).json({ error: "Question not found" });

  const isCorrect = selectedIndex !== null && selectedIndex !== undefined && selectedIndex === question.correct_index ? 1 : 0;

  db.prepare(`
    INSERT INTO quiz_attempt_answers (attempt_id, question_id, selected_index, is_correct, time_taken_seconds)
    VALUES (?, ?, ?, ?, ?)
  `).run(attemptId, questionId, selectedIndex ?? null, isCorrect, timeTakenSeconds ?? null);

  // Intentionally do NOT reveal correct answer
  res.json({ recorded: true });
});

// POST /quiz/attempts/:id/complete — finalize and get full review
router.post("/attempts/:id/complete", (req, res) => {
  const db = getDb();
  const attemptId = Number(req.params.id);

  const attempt = db.prepare("SELECT * FROM quiz_attempts WHERE id = ?").get(attemptId);
  if (!attempt) return res.status(404).json({ error: "Attempt not found" });
  if (attempt.completed_at) return res.status(400).json({ error: "Already completed" });

  // Compute score
  const answers = db.prepare(
    "SELECT * FROM quiz_attempt_answers WHERE attempt_id = ? ORDER BY id"
  ).all(attemptId);

  const correctCount = answers.filter(a => a.is_correct).length;
  const totalCount = answers.length;

  // Mark complete
  db.prepare(`
    UPDATE quiz_attempts SET completed_at = datetime('now'), correct_count = ?, total_count = ?
    WHERE id = ?
  `).run(correctCount, totalCount, attemptId);

  // Write activity_log row (same type the self-rating path uses)
  db.prepare(`
    INSERT INTO activity_log (user_id, type, topic_id, amount, created_at)
    VALUES (1, 'revision_session', ?, ?, datetime('now'))
  `).run(attempt.topic_id, 1);

  // Apply spaced-repetition update based on score
  const scorePct = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
  let rating;
  if (scorePct >= 80) rating = 'got_it';
  else if (scorePct >= 40) rating = 'shaky';
  else rating = 'forgot';

  const topic = db.prepare("SELECT review_interval_days FROM topics WHERE id = ?").get(attempt.topic_id);
  let newInterval = topic ? (topic.review_interval_days || 1) : 1;
  if (rating === 'got_it') {
    newInterval = Math.min(30, newInterval * 2 + 1);
  } else if (rating === 'forgot') {
    newInterval = 1;
  }
  // 'shaky' keeps the interval unchanged

  db.prepare(`
    UPDATE topics SET last_reviewed_at = datetime('now'), review_interval_days = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(newInterval, attempt.topic_id);

  // Build full review payload
  const reviewQuestions = db.prepare(`
    SELECT qq.id, qq.scenario_id, qq.blank_number, qq.prompt, qq.options, qq.correct_index, qq.explanation, qq.order_index
    FROM quiz_questions qq
    WHERE qq.id IN (SELECT question_id FROM quiz_attempt_answers WHERE attempt_id = ?)
    ORDER BY qq.order_index
  `).all(attemptId);

  const scenarios = db.prepare(
    `SELECT id, text, order_index FROM quiz_scenarios WHERE topic_id = ? ORDER BY order_index`
  ).all(attempt.topic_id);

  // Map answers by question_id
  const answerMap = {};
  for (const a of answers) {
    answerMap[a.question_id] = a;
  }

  const review = reviewQuestions.map(q => ({
    id: q.id,
    scenario_id: q.scenario_id,
    blank_number: q.blank_number,
    prompt: q.prompt,
    options: JSON.parse(q.options),
    correct_index: q.correct_index,
    explanation: q.explanation,
    order_index: q.order_index,
    selected_index: answerMap[q.id] ? answerMap[q.id].selected_index : null,
    is_correct: answerMap[q.id] ? answerMap[q.id].is_correct : 0,
    time_taken_seconds: answerMap[q.id] ? answerMap[q.id].time_taken_seconds : null,
  }));

  res.json({
    attempt_id: attemptId,
    correct_count: correctCount,
    total_count: totalCount,
    score_percent: Math.round(scorePct),
    rating,
    scenarios,
    questions: review,
  });
});

export default router;
