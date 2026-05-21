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

    // Goals
    const goals = [
      [1, 'TORTS', 'Read 5 pages of Property Law', 'Focus on Easements and Covenants.', 60, 'in_progress'],
      [2, 'CONSTITUTIONAL', 'Review Commerce Clause Cases', 'Analyze Wickard v. Filburn summary.', 0, 'not_started'],
    ]
    const insertGoal = db.prepare(`INSERT INTO goals (id, subject_tag, title, note, progress, status) VALUES (?, ?, ?, ?, ?, ?)`)
    goals.forEach(g => insertGoal.run(...g))

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

    // Summaries
    const summaries = [
      [1, 'Torts', 'Duty of Care Elements', '"Foreseeability, Proximity, and whether it\'s fair/just to impose duty..."'],
      [2, 'Contracts', 'Promissory Estoppel', '"Detrimental reliance on a promise, even without formal consideration..."'],
      [3, 'Property', 'Easements in Gross', '"Personal right to use land, does not run with the dominant estate..."'],
    ]
    const insertSummary = db.prepare(`INSERT INTO summaries (id, subject, title, content) VALUES (?, ?, ?, ?)`)
    summaries.forEach(s => insertSummary.run(...s))

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

    // Countdown
    db.prepare(`INSERT INTO countdowns (id, title, days_remaining) VALUES (1, 'Bar Finals', 42)`).run()
  })

  insert()
  console.log('Database seeded successfully')
}
