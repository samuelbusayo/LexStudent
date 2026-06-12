// course_id -> ordered list of curriculum topic titles
const curriculumTopics = {
  // 5 = Property Law Practice
  5: [
    'WK 3-4: Overview of Property Law and Deed',
    'WK 5: Power of Attorney',
    'WK 6-7: Sale of Land',
    'WK 9-10: Leases I & II',
    'WK 11-13: Mortgages 1, 2 & 3',
    'WK 14: Billing and Accounting',
    'WK 15-17: Wills and Codicils I, II & III',
    'WK 18-19: Probate Practice, Assent and Personal Representatives',
    'WK 20: Property Law Taxation',
  ],
   // 3 = Civil Litigation
  3: [
    'WK 3: General Overview, Introductory matters and Courts with Civil Jurisdiction',
    'WK 4: Parties to a civil suit',
    'WK 5: Institution of action in Magistrate Court',
    'WK 6: Institution of action in High Court',
    'WK 7: Interlocutory application',
    'WK 8: Default and Summary Judgment Procedure',
    'WK 9: Pleadings',
    'WK 10: Pre-trial Issues and Pre-trial Proceedings',
    'WK 11: Trial Preparation and Evidence',
    'WK 12: Trial, Examination of Witnesses',
    'WK 13: Closing Address and Judgment',
    'WK 14: Enforcement of Judgment and Interlocutory Applications Pending Appeal',
    'WK 15: Civil Appeals',
    'WK 16: Recovery of Premises',
    'WK 17: Election Petition',
    'WK 18: Matrimonial Proceedings',
    'WK 19: Fundamental Rights Enforcement',
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
    'WK 3: Legal Regime and Regulatory Bodies in Corporate Practice',
    'WK 4-6: Choice of Business/Non-Business Organisation and Registration Documents',
    'WK 7: Promotion of Companies and Pre-incorporation Contracts',
    'WK 8: Foreign Participation in Nigerian Economy',
    'WK 9: Post Incorporation Matters',
    'WK 10-14: Corporate Governance I (Meetings, Directors, and Corporate Administration)',
    'WK 10-14: Corporate Governance II (Meetings, Financial Statements, and Minority Protection)',
    'WK 15-16: Company Securities I (Shares, Allotment, and Transfer)',
    'WK 15-16: Company Securities II (Debentures, Charges, Capital Market, and Bonds)',
    'WK 17-18: Corporate Restructuring (Mergers, Acquisitions, and Takeovers)',
    'WK 19: Companies Proceedings and Investment Disputes Resolution',
    'WK 20: Winding Up and Dissolution of Business/Non-Business Organisations',
  ],
};

export function seedDatabase(db) {
  const count = db.prepare('SELECT COUNT(*) as count FROM courses').get()
  if (count.count > 0) return // Already seeded

  const insert = db.transaction(() => {
    // Users — default account with no fake stats
    db.prepare(`INSERT INTO users (id, name, email, password_hash, streak, badge) VALUES (1, ?, ?, ?, ?, ?)`).run(
      'Alex Morgan', 'alex@example.com', '$2b$10$re6plNKw5nFzRlzZeMBhSuX007ln2q9MglYdlyWbwXX0Xu26o353m', 0, ''
    )
    // Reset sequence — INSERT OR REPLACE works even when row doesn't exist yet
    db.prepare(`INSERT OR REPLACE INTO sqlite_sequence (name, seq) VALUES ('users', 1)`).run()

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

    // Goals, progress, heatmap, activity_log, reminders, countdowns, cases
    // — all left empty so only real user data populates them.

    // Daily quotes
    db.prepare(`INSERT INTO daily_quotes (id, text, author) VALUES (1, ?, ?)`).run(
      'The Rule of Law requires that people should be able to rely on the law as a guide to their future conduct.',
      'Lord Bingham'
    )
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
