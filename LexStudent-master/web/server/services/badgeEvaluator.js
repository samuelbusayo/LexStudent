// Badge evaluator — computes current progress for every badge criteria type
// against the activity_log and related tables, then upserts user_badges rows.
// Returns the list of badge codes that flipped from unearned -> earned during
// this evaluation so the API can surface them as toast notifications.

import { BAR_TOPICS } from './badgeCatalogue.js'

/**
 * Compute the current value for a single badge's criteria.
 * Returns a Number (progress so far) that is compared against badge.target.
 */
function computeProgress(db, userId, criteria) {
  switch (criteria.type) {
    case 'pages_read': {
      const row = db.prepare(
        `SELECT COALESCE(SUM(amount), 0) AS total
           FROM activity_log
          WHERE user_id = ? AND type = 'page_read'`
      ).get(userId)
      return row.total
    }

    case 'pages_single_session': {
      // Best single page_read event amount
      const row = db.prepare(
        `SELECT COALESCE(MAX(amount), 0) AS m
           FROM activity_log
          WHERE user_id = ? AND type = 'page_read'`
      ).get(userId)
      return row.m
    }

    case 'morning_sessions': {
      // SQLite stores datetime in UTC. We treat the stored hour as local for
      // simplicity — most users read in their own timezone, and the seed/data
      // already uses local-flavoured timestamps via datetime('now').
      const row = db.prepare(
        `SELECT COUNT(*) AS c FROM activity_log
          WHERE user_id = ? AND type = 'page_read'
            AND time(created_at) >= '05:00:00'
            AND time(created_at) <= '08:30:00'`
      ).get(userId)
      return row.c
    }

    case 'late_sessions': {
      // 9:00pm – 3:00am crosses midnight
      const row = db.prepare(
        `SELECT COUNT(*) AS c FROM activity_log
          WHERE user_id = ? AND type = 'page_read'
            AND (time(created_at) >= '21:00:00' OR time(created_at) < '03:00:00')`
      ).get(userId)
      return row.c
    }

    case 'streak': {
      const row = db.prepare('SELECT streak FROM users WHERE id = ?').get(userId)
      return row?.streak || 0
    }

    case 'topics_completed': {
      const row = db.prepare(
        `SELECT COUNT(*) AS c FROM topics
          WHERE total_pages > 0 AND pages_read >= total_pages`
      ).get()
      return row.c
    }

    case 'courses_completed': {
      const row = db.prepare(
        `SELECT COUNT(*) AS c FROM courses c
          WHERE EXISTS (SELECT 1 FROM topics WHERE course_id = c.id)
            AND NOT EXISTS (
              SELECT 1 FROM topics
               WHERE course_id = c.id
                 AND (total_pages = 0 OR pages_read < total_pages)
            )`
      ).get()
      return row.c
    }

    case 'quiz_attempts': {
      const row = db.prepare(
        `SELECT COUNT(*) AS c FROM quiz_attempts
          WHERE completed_at IS NOT NULL`
      ).get()
      return row.c
    }

    case 'quiz_perfect_scores': {
      const row = db.prepare(
        `SELECT COUNT(*) AS c FROM quiz_attempts
          WHERE completed_at IS NOT NULL AND total_count > 0
            AND correct_count = total_count`
      ).get()
      return row.c
    }

    case 'quiz_perfect_topics': {
      const row = db.prepare(
        `SELECT COUNT(DISTINCT topic_id) AS c FROM quiz_attempts
          WHERE completed_at IS NOT NULL AND total_count > 0
            AND correct_count = total_count`
      ).get()
      return row.c
    }

    case 'quiz_topics_passed': {
      // Pass threshold: >= 70% on at least one attempt for the topic
      const row = db.prepare(
        `SELECT COUNT(DISTINCT topic_id) AS c FROM quiz_attempts
          WHERE completed_at IS NOT NULL AND total_count > 0
            AND CAST(correct_count AS REAL) / total_count >= 0.7`
      ).get()
      return row.c
    }

    case 'quiz_failed_retake_pass': {
      // At least one topic has both a fail (<40%) and a later pass (>=70%)
      const row = db.prepare(`
        SELECT COUNT(DISTINCT topic_id) AS c FROM quiz_attempts a
         WHERE completed_at IS NOT NULL AND total_count > 0
           AND CAST(correct_count AS REAL) / total_count >= 0.7
           AND EXISTS (
             SELECT 1 FROM quiz_attempts b
              WHERE b.topic_id = a.topic_id
                AND b.completed_at IS NOT NULL AND b.total_count > 0
                AND CAST(b.correct_count AS REAL) / b.total_count < 0.4
                AND b.completed_at < a.completed_at
           )
      `).get()
      return row.c
    }

    case 'highlights': {
      const row = db.prepare(
        `SELECT COUNT(*) AS c FROM study_notes WHERE type = 'highlight'`
      ).get()
      return row.c
    }

    case 'summaries_written': {
      const row = db.prepare(
        `SELECT COUNT(*) AS c FROM topic_summaries
          WHERE body IS NOT NULL AND body != '' AND body != '[]'`
      ).get()
      return row.c
    }

    case 'ai_questions': {
      const row = db.prepare(
        `SELECT COUNT(*) AS c FROM activity_log
          WHERE user_id = ? AND type = 'ai_question'`
      ).get(userId)
      return row.c
    }

    case 'goals_created': {
      const row = db.prepare(
        `SELECT COUNT(*) AS c FROM goals`
      ).get()
      return row.c
    }

    case 'goals_completed': {
      const row = db.prepare(
        `SELECT COUNT(*) AS c FROM goal_occurrences WHERE status = 'completed'`
      ).get()
      return row.c
    }

    case 'goal_daily_streak': {
      // Consecutive distinct days with at least one completed goal occurrence
      const rows = db.prepare(
        `SELECT DISTINCT date FROM goal_occurrences
          WHERE status = 'completed'
          ORDER BY date DESC`
      ).all()
      if (rows.length === 0) return 0

      // Find the longest run of consecutive days ending at any date
      let longest = 1
      let current = 1
      for (let i = 1; i < rows.length; i++) {
        const prev = new Date(rows[i - 1].date)
        const cur = new Date(rows[i].date)
        const diff = Math.round((prev - cur) / (1000 * 60 * 60 * 24))
        if (diff === 1) {
          current++
          longest = Math.max(longest, current)
        } else {
          current = 1
        }
      }
      return longest
    }

    case 'signup': {
      return 1
    }

    case 'profile_complete': {
      const u = db.prepare(
        'SELECT name, email, program, campus FROM users WHERE id = ?'
      ).get(userId)
      if (!u) return 0
      return (u.name && u.email && u.program && u.campus) ? 1 : 0
    }

    case 'campus_set': {
      const u = db.prepare('SELECT campus FROM users WHERE id = ?').get(userId)
      const valid = ['Lagos Campus', 'Yola Campus', 'Enugu Campus', 'Kano Campus', 'Port Harcourt Campus', 'Abuja Campus']
      return u && valid.includes(u.campus) ? 1 : 0
    }

    case 'overall_progress': {
      const row = db.prepare(`
        SELECT
          COALESCE(SUM(pages_read), 0) AS read_total,
          COALESCE(SUM(total_pages), 0) AS total_total
        FROM topics
      `).get()
      if (!row.total_total) return 0
      return Math.round((row.read_total / row.total_total) * 100)
    }

    default:
      return 0
  }
}

/**
 * Re-evaluate every badge for the user.
 * Returns the list of badge `code`s that were earned for the first time in this run.
 */
export function evaluateAll(db, userId = 1) {
  const badges = db.prepare(
    "SELECT code, criteria, target FROM badges WHERE code IS NOT NULL"
  ).all()

  const newlyEarned = []
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19)

  const upsertProgress = db.prepare(`
    INSERT INTO user_badges (user_id, badge_code, progress, earned_at)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, badge_code) DO UPDATE SET
      progress  = excluded.progress,
      earned_at = COALESCE(user_badges.earned_at, excluded.earned_at)
  `)

  const evaluate = db.transaction(() => {
    for (const b of badges) {
      let criteria
      try { criteria = JSON.parse(b.criteria || '{}') } catch { criteria = {} }
      if (!criteria.type) continue

      const progress = computeProgress(db, userId, criteria)
      const target = b.target || criteria.threshold || 1

      // Check current earned state
      const existing = db.prepare(
        'SELECT progress, earned_at FROM user_badges WHERE user_id = ? AND badge_code = ?'
      ).get(userId, b.code)

      const wasEarned = !!existing?.earned_at
      const isEarned = progress >= target

      if (isEarned && !wasEarned) newlyEarned.push(b.code)

      upsertProgress.run(
        userId,
        b.code,
        Math.min(progress, target * 2), // cap to avoid runaway values
        isEarned ? (existing?.earned_at || now) : null
      )
    }
  })

  evaluate()
  return newlyEarned
}

/**
 * Light wrapper that swallows errors so badge evaluation never breaks the
 * main API request. Logs to stderr for visibility.
 */
export function safeEvaluate(db, userId = 1) {
  try {
    return evaluateAll(db, userId)
  } catch (err) {
    console.error('[badgeEvaluator] failed:', err.message)
    return []
  }
}
