export function seedDatabase(db) {
  const count = db.prepare('SELECT COUNT(*) as count FROM courses').get()
  if (count.count > 0) return // Already seeded

  const insert = db.transaction(() => {
    // Users
    db.prepare(`INSERT INTO users (id, name, email, password_hash, streak, badge) VALUES (1, ?, ?, ?, ?, ?)`).run(
      'Alex Morgan', 'alex@example.com', '$2b$10$re6plNKw5nFzRlzZeMBhSuX007ln2q9MglYdlyWbwXX0Xu26o353m', 12, 'Juris Master'
    )
    // Reset sequence
    db.prepare(`UPDATE sqlite_sequence SET seq = 1 WHERE name = 'users'`).run()

    // Courses
    const courses = [
      [1, 'Professional Ethics', 'Comprehensive study of legal and moral obligations governing the legal profession.', 'CORE'],
      [2, 'Criminal Litigation', 'Study of criminal procedure and litigation.', 'CORE'],
      [3, 'Civil Litigation', 'Study of civil procedure and litigation.', 'CORE'],
      [4, 'Corporate Law Practice', 'Study of corporate law and practice.', 'CORE'],
      [5, 'Property Law Practice', 'Study of property law and practice.', 'CORE'],
    ]
    const insertCourse = db.prepare(`INSERT INTO courses (id, name, description, type) VALUES (?, ?, ?, ?)`)
    courses.forEach(c => insertCourse.run(...c))

    // Topics for courses (varied mastery and review dates for demo)
    const topicsData = [
      [1, 'Legal Ethics Framework', '', 20, 14, null, null, null, '2026-05-25', 3],
      [1, 'Professional Conduct Rules', '', 15, 5, null, null, null, '2026-05-20', 1],
      [2, 'Mens Rea Elements', '', 18, 9, null, null, null, '2026-05-27', 7],
      [2, 'Hearsay Rule', '', 22, 5, null, null, null, null, 1],
      [3, 'Civil Procedure Overview', '', 25, 25, null, null, null, '2026-05-28', 14],
      [3, 'Adverse Possession', '', 16, 3, null, null, null, '2026-05-15', 1],
      [4, 'Company Formation', '', 20, 10, null, null, null, '2026-05-26', 3],
      [5, 'Land Registration', '', 18, 0, null, null, null, null, 1],
      [5, 'Easements and Covenants', '', 14, 8, null, null, null, '2026-05-22', 1],
    ]
    const insertTopic = db.prepare(
      `INSERT INTO topics (course_id, name, subtitle, total_pages, pages_read, material_file, material_type, selected_pages, last_reviewed_at, review_interval_days) VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, '[]'), ?, ?)`
    )
    topicsData.forEach(t => insertTopic.run(...t))

    // Goals table left empty — users create goals via the modal

    // Progress overall
    db.prepare(`INSERT INTO progress_overall (user_id, overall, streak, badge) VALUES (1, 48, 12, 'Juris Master')`).run()

    // Progress activities
    const activities = [
      [1, 'READ', 'Donoghue v Stevenson Analysis', 'completed'],
      [2, 'PENDING', 'Vicarious Liability Lecture', 'pending'],
      [3, 'UPCOMING', 'Mock Exam: Equity & Trusts', 'upcoming'],
    ]
    const insertActivity = db.prepare(`INSERT INTO progress_activities (id, type, title, status) VALUES (?, ?, ?, ?)`)
    activities.forEach(a => insertActivity.run(...a))

    // Knowledge gaps
    const gaps = [
      [1, 'Evidence', 'Hearsay Rule', 25, '4 days ago'],
      [2, 'Property Law', 'Adverse Possession', 33, '1 week ago'],
      [3, 'Criminal Law', 'Mens Rea', 50, '2 days ago'],
      [4, 'Constitutional', 'Commerce Clause', 20, 'Unread Topic'],
    ]
    const insertGap = db.prepare(`INSERT INTO knowledge_gaps (id, subject, topic, progress, last_reviewed) VALUES (?, ?, ?, ?, ?)`)
    gaps.forEach(g => insertGap.run(...g))

    // Heatmap
    const intensities = [4,0,3,5,1,4,5,5,0,0,4,4,4,2,0,0,1,4,5,0,3]
    const insertHeat = db.prepare(`INSERT INTO heatmap_data (day_index, intensity) VALUES (?, ?)`)
    intensities.forEach((val, i) => insertHeat.run(i, val))

    // Reminders
    const reminders = [
      [1, 'Morning Briefing', '8:00 AM Daily', 1],
      [2, 'Mock Exam Alert', '2 days before', 1],
      [3, 'Case Study Window', 'Weekends only', 0],
    ]
    const insertReminder = db.prepare(`INSERT INTO reminders (id, title, time, enabled) VALUES (?, ?, ?, ?)`)
    reminders.forEach(r => insertReminder.run(...r))

    // Summaries table left empty — Personal Summaries now sourced from study_notes

    // Cases
    const cases = [
      [1, 'Donoghue v Stevenson', '[1932] UKHL 100', 1932, 'The "snail in the bottle" case established the modern law of negligence and the neighbor principle.', '["Negligence","Tort Law"]', 1, 1],
      [2, 'Marbury v Madison', '5 U.S. (1 Cranch) 137', 1803, 'Established the principle of judicial review in the United States.', '["Constitutional"]', 0, 0],
      [3, 'Salomon v Salomon', '[1897] AC 22', 1897, 'Upheld the doctrine of separate legal personality for companies.', '["Company Law"]', 0, 0],
      [4, 'Miranda v Arizona', '384 U.S. 436', 1966, 'Specified the Miranda rights that must be read to criminal suspects.', '["Criminal"]', 0, 0],
    ]
    const insertCase = db.prepare(`INSERT INTO cases (id, name, citation, year, description, tags, is_featured, bookmarked) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    cases.forEach(c => insertCase.run(...c))

    // Badges
    const badges = [
      [1, '7 Day Streak', 'local_fire_department', 1, 'Study 7 days in a row'],
      [2, 'Case Expert', 'menu_book', 1, 'Complete 10 case analyses'],
      [3, 'Night Owl', 'dark_mode', 1, 'Study past midnight 5 times'],
      [4, 'Locked Achievement', 'lock', 0, 'Secret achievement'],
    ]
    const insertBadge = db.prepare(`INSERT INTO badges (id, name, icon, earned, description) VALUES (?, ?, ?, ?, ?)`)
    badges.forEach(b => insertBadge.run(...b))

    // Daily quotes
    db.prepare(`INSERT INTO daily_quotes (id, text, author) VALUES (1, ?, ?)`).run(
      'The Rule of Law requires that people should be able to rely on the law as a guide to their future conduct.',
      'Lord Bingham'
    )

    // Activity log (recent study events for demo streak/heatmap)
    const now = new Date()
    const activityRows = []
    for (let daysAgo = 0; daysAgo < 14; daysAgo++) {
      if (daysAgo === 5 || daysAgo === 10) continue // gap days to break streak demo
      const d = new Date(now)
      d.setDate(d.getDate() - daysAgo)
      const dateStr = d.toISOString().slice(0, 19).replace('T', ' ')
      const count = daysAgo === 0 ? 3 : Math.floor(Math.random() * 4) + 1
      for (let j = 0; j < count; j++) {
        activityRows.push(['page_read', 1 + (daysAgo % 9), null, 2 + j, dateStr])
      }
    }
    const insertActivity2 = db.prepare(
      `INSERT INTO activity_log (type, topic_id, goal_id, amount, created_at) VALUES (?, ?, ?, ?, ?)`
    )
    activityRows.forEach(r => insertActivity2.run(...r))

    // Countdown
    db.prepare(`INSERT INTO countdowns (id, title, days_remaining) VALUES (1, 'Bar Finals', 42)`).run()
  })

  insert()
  console.log('Database seeded successfully')
}
