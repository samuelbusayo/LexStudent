// course_id -> ordered list of curriculum topic titles
const curriculumTopics = {
  // 5 = Property Law Practice
  5: [
    'WK 3: General Overview and Applicable laws',
    'WK 4: Deeds and Power of Attorney',
    'WK 5: Sale of Land 1',
    'WK 6: Sale of Land 2',
    'WK 7: Leases and Tenancies Part 1',
    'WK 8: Leases and Covenants 2',
    'WK 9: Mortgages',
    'WK 10: Mortgages 2',
    'WK 11: Land Registration law Lagos and taxation in property law',
    'Wk 12: Wills and Codicils I',
    'Wk 13: Wills and Codicils II',
    'Wk 14: Probate practice',
    'Wk 15: Personal Representatives and Assent',
  ],
  // 3 = Civil Litigation
  3: [
    'WK 3: General Overview, Introductory matters and Courts with Civil Jurisdiction',
    'WK 4: Parties to a civil suit',
    'WK 5: Institution of action in Magistrate Court',
    'WK 6: Institution of action in High Court',
    'WK 7: Interlocutory application',
    'WK 8: Summary Judgement',
    'WK 9: Pleadings',
    'Wk 10: Pre trial Proceedings, trial preparation and Evidence',
    'Wk 11: Trial and Examination of Witnesses',
    'Wk 12: Closing address, Judgement and Enforcement of Judgement',
    'Wk 13: Applications pending Appeals and Appeals',
    'Wk 14: Recovery of Premises',
    'Wk 15: Election Petition',
    'Wk 16: Matrimonial Causes',
    'Wk 17: Fundamental Right Enforcement',
  ],
  // 1 = Professional Ethics (Professional Ethics and Skills)
  1: [
    'WK 3: Overview of professional ethics and History of the Legal profession in Nigeria',
    'WK 4: Regulatory Bodies in the Legal profession',
    'WK 5: Duties of Counsel to client',
    'WK 6: Duties of Counsel to court, state, colleagues, and profession',
    'WK 7: Lawyers Duties on Anti Money Laundering and Corruption',
    'WK 8: Appointment and Discipline of Judicial Officers and Legal Practitioners',
    'WK 9: Basic Drafting Principles and Stages of Drafting',
    'Wk 10: Drafting II',
    'Wk 11: Improper attraction of business and interviewing and counseling skills',
    'Wk 12: Legal Research, use of AI in legal research and closing of files',
    'Wk 13: Arbitration I : Negotiation, conciliation, mediation, online ADR',
    'Wk 14: Arbitration practice',
    'Wk 15: Law office Management, use of ICT in law office management and Lagos multi door court house',
    'Contempt of Court',
    'Rules of Interpretation of Statutes',
    'Trial Advocacy',
    'Legal Practitioners Remuneration',
    'Legal Practitioners Account Rules',
  ],
  // 2 = Criminal Litigation
  2: [
    'WK 3: Introduction to criminal litigation',
    'WK 4: Arrest, searches, and constitutional rights',
    'WK 5: Pre-trial investigation and Police interviews',
    'WK 6: Jurisdiction and Venue of criminal trials',
    'WK 7: Institution of Criminal Proceedings',
    'WK 8: Charges 1',
    'WK 9: Charges 2',
    'WK 10: Bail Pending Trial',
    'Wk 11: Constitutional Safeguards',
    'Wk 12: Trial 1: Attendance of parties and Arraignment',
    'Wk 13: Trial II: Trial Preparation and Evidence',
    'Wk 14: Trial III: Examination of Witnesses',
    'Wk 15: Trial IV: Presentation of the case of the defense',
    'Wk 16: Judgement and sentencing',
    'Wk 17: Appeals',
  ],
  // 4 = Corporate Law Practice
  4: [
    'WK 3: Overview of legal framework and regulatory bodies on corporate law practice in Nigeria',
    'WK 4: Formation and Registration of Business names, Partnerships and Incorporated Trustees',
    'WK 5: Post-incorporation matters in Business and Non-Business organizations',
    'WK 6: Foreign Participation and Corporate contracts',
    'WK 7: Corporate Governance 1',
    'WK 8: Corporate Governance 2',
    'WK 9: Financial statement, audits, and annual returns',
    'Wk 10: Majority Rule, Minority Protection and Investigation of Companies',
    'Wk 11: Equity Capital and Collective Investment Schemes',
    'Wk 12: Corporate finance II Debt capital - bonds and debentures',
    'Wk 13: Corporate Restructuring I',
    'Wk 14: Corporate Restructuring II',
    'Wk 15: Corporate Insolvency',
    'Wk 16: Introduction to intellectual property rights, registration, intellectual property of generative artificial intelligence',
  ],
};

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

    // Curriculum topics (empty shells ready for material upload)
    const insertTopic = db.prepare(
      `INSERT INTO topics (course_id, name, subtitle, total_pages, pages_read, selected_pages, total_document_pages, has_materials)
       VALUES (?, ?, '', 0, 0, '[]', 0, 0)`
    )
    for (const [courseId, titles] of Object.entries(curriculumTopics)) {
      for (const name of titles) {
        insertTopic.run(Number(courseId), name)
      }
    }

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

/**
 * Idempotent sync: inserts any missing curriculum topics per course.
 * Safe to run repeatedly — never deletes user-created topics.
 * Matches on (course_id, name) to avoid duplicates.
 */
export function syncCurriculumTopics(db) {
  const exists = db.prepare('SELECT 1 FROM topics WHERE course_id = ? AND name = ?')
  const insert = db.prepare(
    `INSERT INTO topics (course_id, name, subtitle, total_pages, pages_read, selected_pages, total_document_pages, has_materials)
     VALUES (?, ?, '', 0, 0, '[]', 0, 0)`
  )
  const tx = db.transaction(() => {
    for (const [courseId, titles] of Object.entries(curriculumTopics)) {
      for (const name of titles) {
        if (!exists.get(Number(courseId), name)) insert.run(Number(courseId), name)
      }
    }
  })
  tx()
  console.log('Curriculum topics synced')
}
