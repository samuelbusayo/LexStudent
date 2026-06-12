// Canonical badge catalogue. Each entry is a stable record — the `code` is the
// permanent identifier; renaming or removing rows here will surface in the UI on
// the next server start. db.js reconciles this list into the badges table.
//
// criteria.type values are interpreted by services/badgeEvaluator.js.

export const CATEGORIES = [
  { id: 'reading',     label: 'Reading',     icon: 'auto_stories' },
  { id: 'consistency', label: 'Consistency', icon: 'local_fire_department' },
  { id: 'quiz',        label: 'Quiz',        icon: 'quiz' },
  { id: 'engagement',  label: 'Engagement',  icon: 'edit_note' },
  { id: 'ai_chat',     label: 'AI Chat',     icon: 'smart_toy' },
  { id: 'goals',       label: 'Goals',       icon: 'flag' },
  { id: 'special',     label: 'Bar Special', icon: 'gavel' },
]

const BAR_TOPICS = [
  'Professional Ethics',
  'Corporate Law Practice',
  'Civil Litigation',
  'Criminal Litigation',
  'Property Law Practice',
]

function tiered(prefix, name, icon, category, criteriaType, thresholds, descriptions) {
  return thresholds.map((t, i) => ({
    code: `${prefix}_${i + 1}`,
    name: `${name} ${['I', 'II', 'III'][i] || ''}`.trim(),
    icon,
    category,
    tier: i + 1,
    target: t,
    criteria: { type: criteriaType, threshold: t },
    description: descriptions[i],
  }))
}

export const BADGES = [
  // ── READING ──
  { code: 'first_page', name: 'First Page', icon: 'menu_book', category: 'reading',
    tier: 0, target: 1, criteria: { type: 'pages_read', threshold: 1 },
    description: 'Read your very first page.' },

  ...tiered('bookworm', 'Bookworm', 'auto_stories', 'reading', 'pages_read',
    [50, 250, 1000],
    [
      'Read 50 pages cumulative.',
      'Read 250 pages cumulative.',
      'Read 1,000 pages cumulative — you live in the books.',
    ]),

  { code: 'topic_master', name: 'Topic Master', icon: 'task_alt', category: 'reading',
    tier: 0, target: 1, criteria: { type: 'topics_completed', threshold: 1 },
    description: 'Read 100% of one topic.' },

  { code: 'course_conqueror', name: 'Course Conqueror', icon: 'workspace_premium', category: 'reading',
    tier: 0, target: 1, criteria: { type: 'courses_completed', threshold: 1 },
    description: 'Complete every topic in a course.' },

  { code: 'bar_part_ii_scholar', name: 'Bar Part II Scholar', icon: 'school', category: 'reading',
    tier: 0, target: 14, criteria: { type: 'topics_completed', threshold: 14 },
    description: 'Complete all 14 Bar Part II topics.' },

  { code: 'deep_reader', name: 'Deep Reader', icon: 'hourglass_top', category: 'reading',
    tier: 0, target: 30, criteria: { type: 'pages_single_session', threshold: 30 },
    description: 'Read 30+ pages in a single session.' },

  // Time-of-day badges
  ...tiered('early_bird', 'Early Bird', 'wb_sunny', 'reading', 'morning_sessions',
    [1, 7, 30],
    [
      'Read once between 5:00am and 8:30am.',
      'Log 7 morning reading sessions (5:00am – 8:30am).',
      'Log 30 morning sessions — sunrise belongs to you.',
    ]),

  ...tiered('night_owl', 'Night Owl', 'dark_mode', 'reading', 'late_sessions',
    [1, 7, 30],
    [
      'Read once between 9:00pm and 3:00am.',
      'Log 7 late-night sessions (9:00pm – 3:00am).',
      'Log 30 late-night sessions — the lamp never goes out.',
    ]),

  // ── CONSISTENCY ──
  ...tiered('steady', 'Steady', 'local_fire_department', 'consistency', 'streak',
    [3, 7, 14],
    [
      'Study 3 days in a row.',
      'Study 7 days in a row.',
      'Study 14 days in a row.',
    ]),
  { code: 'devoted', name: 'Devoted', icon: 'whatshot', category: 'consistency',
    tier: 0, target: 30, criteria: { type: 'streak', threshold: 30 },
    description: 'Study every day for a full month.' },
  { code: 'unbreakable', name: 'Unbreakable', icon: 'rocket_launch', category: 'consistency',
    tier: 0, target: 100, criteria: { type: 'streak', threshold: 100 },
    description: 'A 100-day streak. Unstoppable.' },

  // ── QUIZ ──
  { code: 'first_quiz', name: 'First Quiz', icon: 'quiz', category: 'quiz',
    tier: 0, target: 1, criteria: { type: 'quiz_attempts', threshold: 1 },
    description: 'Take your first quiz.' },

  ...tiered('quiz_apprentice', 'Quiz Apprentice', 'psychology', 'quiz', 'quiz_attempts',
    [5, 25, 100],
    [
      'Complete 5 quiz attempts.',
      'Complete 25 quiz attempts.',
      'Complete 100 quiz attempts.',
    ]),

  { code: 'sharp_mind', name: 'Sharp Mind', icon: 'bolt', category: 'quiz',
    tier: 0, target: 1, criteria: { type: 'quiz_perfect_scores', threshold: 1 },
    description: 'Score 100% on any quiz.' },

  { code: 'perfectionist', name: 'Perfectionist', icon: 'star', category: 'quiz',
    tier: 0, target: 5, criteria: { type: 'quiz_perfect_topics', threshold: 5 },
    description: 'Score 100% across 5 different topics.' },

  { code: 'resilient', name: 'Resilient', icon: 'replay', category: 'quiz',
    tier: 0, target: 1, criteria: { type: 'quiz_failed_retake_pass', threshold: 1 },
    description: 'Fail a quiz, retake it, and pass.' },

  { code: 'all_topics_master', name: 'All Topics Master', icon: 'all_inclusive', category: 'quiz',
    tier: 0, target: 14, criteria: { type: 'quiz_topics_passed', threshold: 14 },
    description: 'Pass quizzes for every Bar Part II topic.' },

  // ── ENGAGEMENT ──
  ...tiered('annotator', 'Annotator', 'highlight', 'engagement', 'highlights',
    [10, 50, 200],
    [
      'Create 10 highlights.',
      'Create 50 highlights.',
      'Create 200 highlights.',
    ]),

  { code: 'note_taker', name: 'Note Taker', icon: 'edit_note', category: 'engagement',
    tier: 0, target: 1, criteria: { type: 'summaries_written', threshold: 1 },
    description: 'Write your first topic summary.' },

  // ── AI CHAT ──
  { code: 'ai_curious_mind', name: 'Curious Mind', icon: 'lightbulb', category: 'ai_chat',
    tier: 1, target: 20, criteria: { type: 'ai_questions', threshold: 20 },
    description: 'Ask the AI tutor 20 questions.' },
  { code: 'ai_apprentice', name: 'AI Apprentice', icon: 'psychology_alt', category: 'ai_chat',
    tier: 2, target: 50, criteria: { type: 'ai_questions', threshold: 50 },
    description: '50 AI requests — learning to ask the right questions.' },
  { code: 'ai_scholar', name: 'AI Scholar', icon: 'school', category: 'ai_chat',
    tier: 3, target: 100, criteria: { type: 'ai_questions', threshold: 100 },
    description: '100 AI requests — the tutor is part of your routine.' },
  { code: 'ai_power_user', name: 'AI Power User', icon: 'auto_awesome', category: 'ai_chat',
    tier: 4, target: 200, criteria: { type: 'ai_questions', threshold: 200 },
    description: "200 AI requests — you've talked through every corner of the syllabus." },
  { code: 'ai_maestro', name: 'AI Maestro', icon: 'workspace_premium', category: 'ai_chat',
    tier: 5, target: 450, criteria: { type: 'ai_questions', threshold: 450 },
    description: '450 AI requests — Maestro status. The tutor is yours.' },

  // ── GOALS ──
  { code: 'goal_setter', name: 'Goal Setter', icon: 'flag', category: 'goals',
    tier: 0, target: 1, criteria: { type: 'goals_created', threshold: 1 },
    description: 'Create your first study goal.' },

  ...tiered('goal_crusher', 'Goal Crusher', 'task_alt', 'goals', 'goals_completed',
    [10, 50, 200],
    [
      'Complete 10 daily goals.',
      'Complete 50 daily goals.',
      'Complete 200 daily goals.',
    ]),

  { code: 'planner_pro', name: 'Planner Pro', icon: 'event_available', category: 'goals',
    tier: 0, target: 7, criteria: { type: 'goal_daily_streak', threshold: 7 },
    description: 'Complete at least one goal every day for a week.' },

  // ── BAR PART II SPECIAL ──
  { code: 'welcome_counsel', name: 'Welcome Counsel', icon: 'how_to_reg', category: 'special',
    tier: 0, target: 1, criteria: { type: 'signup', threshold: 1 },
    description: 'Welcome aboard, future Bar Counsel.' },
  { code: 'profile_sealed', name: 'Profile Sealed', icon: 'verified', category: 'special',
    tier: 0, target: 1, criteria: { type: 'profile_complete', threshold: 1 },
    description: 'Complete all your profile details.' },
  { code: 'campus_pride', name: 'Campus Pride', icon: 'location_on', category: 'special',
    tier: 0, target: 1, criteria: { type: 'campus_set', threshold: 1 },
    description: 'Pick the Law School campus you call home.' },
  { code: 'call_to_bar_ready', name: 'Call to Bar Ready', icon: 'gavel', category: 'special',
    tier: 0, target: 90, criteria: { type: 'overall_progress', threshold: 90 },
    description: 'Reach 90% overall progress across the curriculum.' },
]

export { BAR_TOPICS }

/**
 * Reconcile the badges table with the canonical catalogue.
 * - Inserts new badges
 * - Updates existing badges' display fields (name/icon/description/category/tier/target/criteria)
 * - Never deletes — preserves legacy rows so old user_badges references remain valid
 */
export function reconcileBadgeCatalogue(db) {
  const existing = new Map(
    db.prepare('SELECT code, id FROM badges WHERE code IS NOT NULL').all()
      .map(r => [r.code, r.id])
  )

  const upsert = db.transaction(() => {
    // 1. Hard-delete any legacy rows with NULL code. These were seeded before
    //    the catalogue refactor and never referenced by user_badges (which
    //    keys off badge_code, not badge id), so removing them is safe and
    //    keeps the catalogue clean across restarts.
    db.prepare("DELETE FROM badges WHERE code IS NULL OR code = ''").run()

    // 2. Upsert canonical rows
    for (const b of BADGES) {
      const criteriaJson = JSON.stringify(b.criteria)
      if (existing.has(b.code)) {
        db.prepare(
          `UPDATE badges
             SET name = ?, icon = ?, description = ?, category = ?, tier = ?,
                 target = ?, criteria = ?
           WHERE code = ?`
        ).run(b.name, b.icon, b.description, b.category, b.tier, b.target, criteriaJson, b.code)
      } else {
        db.prepare(
          `INSERT INTO badges (code, name, icon, description, category, tier, target, criteria, earned)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`
        ).run(b.code, b.name, b.icon, b.description, b.category, b.tier, b.target, criteriaJson)
      }
    }
  })

  upsert()
  const count = db.prepare('SELECT COUNT(*) AS c FROM badges WHERE code IS NOT NULL').get().c
  console.log(`[badges] Catalogue reconciled — ${count} badges in registry`)
}
