// Curriculum topics by course_id
export const curriculumTopics = {
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
  // 1 = Professional Ethics
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

export const courses = [
  { id: 1, name: 'Professional Ethics', description: 'Comprehensive study of legal and moral obligations governing the legal profession.', type: 'CORE' },
  { id: 2, name: 'Criminal Litigation', description: 'Study of criminal procedure and litigation.', type: 'CORE' },
  { id: 3, name: 'Civil Litigation', description: 'Study of civil procedure and litigation.', type: 'CORE' },
  { id: 4, name: 'Corporate Law Practice', description: 'Study of corporate law and practice.', type: 'CORE' },
  { id: 5, name: 'Property Law Practice', description: 'Study of property law and practice.', type: 'CORE' }
];

export const activities = [
  { id: 1, type: 'READ', title: 'Donoghue v Stevenson Analysis', status: 'completed' },
  { id: 2, type: 'PENDING', title: 'Vicarious Liability Lecture', status: 'pending' },
  { id: 3, type: 'UPCOMING', title: 'Mock Exam: Equity & Trusts', status: 'upcoming' }
];

export const intensities = [4,0,3,5,1,4,5,5,0,0,4,4,4,2,0,0,1,4,5,0,3];

export const reminders = [
  { id: 1, title: 'Daily Reading Goal',    time: 'Notify at 8:00 AM if unread',        enabled: 1 },
  { id: 2, title: 'Revision Quiz',          time: 'Notify at 6:00 PM',                  enabled: 1 },
  { id: 3, title: 'AI Study Assistant',     time: 'Daily reminder to ask questions',    enabled: 0 },
  { id: 4, title: 'Streak Protector',       time: 'Alert if streak at risk',            enabled: 1 },
];

export const cases = [
  { id: 1, name: 'Donoghue v Stevenson', citation: '[1932] UKHL 100', year: 1932, description: 'The "snail in the bottle" case established the modern law of negligence and the neighbor principle.', tags: '["Negligence","Tort Law"]', is_featured: 1, bookmarked: 1 },
  { id: 2, name: 'Marbury v Madison', citation: '5 U.S. (1 Cranch) 137', year: 1803, description: 'Established the principle of judicial review in the United States.', tags: '["Constitutional"]', is_featured: 0, bookmarked: 0 },
  { id: 3, name: 'Salomon v Salomon', citation: '[1897] AC 22', year: 1897, description: 'Upheld the doctrine of separate legal personality for companies.', tags: '["Company Law"]', is_featured: 0, bookmarked: 0 },
  { id: 4, name: 'Miranda v Arizona', citation: '384 U.S. 436', year: 1966, description: 'Specified the Miranda rights that must be read to criminal suspects.', tags: '["Criminal"]', is_featured: 0, bookmarked: 0 }
];

export const badges = [
  // Reading
  { id:  1, code: 'first_page',         name: 'First Page',         icon: 'menu_book',            category: 'reading',     earned: 0, description: 'Read your very first page.' },
  { id:  2, code: 'bookworm_1',         name: 'Bookworm I',         icon: 'auto_stories',         category: 'reading',     earned: 0, description: 'Read 50 pages cumulative.' },
  { id:  3, code: 'bookworm_2',         name: 'Bookworm II',        icon: 'auto_stories',         category: 'reading',     earned: 0, description: 'Read 250 pages cumulative.' },
  { id:  4, code: 'bookworm_3',         name: 'Bookworm III',       icon: 'auto_stories',         category: 'reading',     earned: 0, description: 'Read 1,000 pages cumulative.' },
  { id:  5, code: 'topic_master',       name: 'Topic Master',       icon: 'task_alt',             category: 'reading',     earned: 0, description: 'Read 100% of one topic.' },
  { id:  6, code: 'course_conqueror',   name: 'Course Conqueror',   icon: 'workspace_premium',    category: 'reading',     earned: 0, description: 'Complete every topic in a course.' },
  { id:  7, code: 'bar_part_ii_scholar',name: 'Bar Part II Scholar',icon: 'school',               category: 'reading',     earned: 0, description: 'Complete all 14 Bar Part II topics.' },
  { id:  8, code: 'deep_reader',        name: 'Deep Reader',        icon: 'hourglass_top',        category: 'reading',     earned: 0, description: 'Read 30+ pages in a single session.' },
  { id:  9, code: 'early_bird_1',       name: 'Early Bird I',       icon: 'wb_sunny',             category: 'reading',     earned: 0, description: 'Read once between 5:00am and 8:30am.' },
  { id: 10, code: 'early_bird_2',       name: 'Early Bird II',      icon: 'wb_sunny',             category: 'reading',     earned: 0, description: 'Log 7 morning reading sessions.' },
  { id: 11, code: 'early_bird_3',       name: 'Early Bird III',     icon: 'wb_sunny',             category: 'reading',     earned: 0, description: 'Log 30 morning sessions.' },
  { id: 12, code: 'night_owl_1',        name: 'Night Owl I',        icon: 'dark_mode',            category: 'reading',     earned: 0, description: 'Read once between 9:00pm and 3:00am.' },
  { id: 13, code: 'night_owl_2',        name: 'Night Owl II',       icon: 'dark_mode',            category: 'reading',     earned: 0, description: 'Log 7 late-night sessions.' },
  { id: 14, code: 'night_owl_3',        name: 'Night Owl III',      icon: 'dark_mode',            category: 'reading',     earned: 0, description: 'Log 30 late-night sessions.' },
  // Consistency
  { id: 15, code: 'steady_1',           name: 'Steady I',           icon: 'local_fire_department',category: 'consistency', earned: 0, description: 'Study 3 days in a row.' },
  { id: 16, code: 'steady_2',           name: 'Steady II',          icon: 'local_fire_department',category: 'consistency', earned: 0, description: 'Study 7 days in a row.' },
  { id: 17, code: 'steady_3',           name: 'Steady III',         icon: 'local_fire_department',category: 'consistency', earned: 0, description: 'Study 14 days in a row.' },
  { id: 18, code: 'devoted',            name: 'Devoted',            icon: 'whatshot',             category: 'consistency', earned: 0, description: 'Study every day for a full month.' },
  { id: 19, code: 'unbreakable',        name: 'Unbreakable',        icon: 'rocket_launch',        category: 'consistency', earned: 0, description: 'A 100-day streak. Unstoppable.' },
  // Quiz
  { id: 20, code: 'first_quiz',         name: 'First Quiz',         icon: 'quiz',                 category: 'quiz',        earned: 0, description: 'Take your first quiz.' },
  { id: 21, code: 'quiz_apprentice_1',  name: 'Quiz Apprentice I',  icon: 'psychology',           category: 'quiz',        earned: 0, description: 'Complete 5 quiz attempts.' },
  { id: 22, code: 'quiz_apprentice_2',  name: 'Quiz Apprentice II', icon: 'psychology',           category: 'quiz',        earned: 0, description: 'Complete 25 quiz attempts.' },
  { id: 23, code: 'quiz_apprentice_3',  name: 'Quiz Apprentice III',icon: 'psychology',           category: 'quiz',        earned: 0, description: 'Complete 100 quiz attempts.' },
  { id: 24, code: 'sharp_mind',         name: 'Sharp Mind',         icon: 'bolt',                 category: 'quiz',        earned: 0, description: 'Score 100% on any quiz.' },
  { id: 25, code: 'perfectionist',      name: 'Perfectionist',      icon: 'star',                 category: 'quiz',        earned: 0, description: 'Score 100% across 5 different topics.' },
  { id: 26, code: 'resilient',          name: 'Resilient',          icon: 'replay',               category: 'quiz',        earned: 0, description: 'Fail a quiz, retake it, and pass.' },
  { id: 27, code: 'all_topics_master',  name: 'All Topics Master',  icon: 'all_inclusive',        category: 'quiz',        earned: 0, description: 'Pass quizzes for every Bar Part II topic.' },
  // Engagement
  { id: 28, code: 'annotator_1',        name: 'Annotator I',        icon: 'highlight',            category: 'engagement',  earned: 0, description: 'Create 10 highlights.' },
  { id: 29, code: 'annotator_2',        name: 'Annotator II',       icon: 'highlight',            category: 'engagement',  earned: 0, description: 'Create 50 highlights.' },
  { id: 30, code: 'annotator_3',        name: 'Annotator III',      icon: 'highlight',            category: 'engagement',  earned: 0, description: 'Create 200 highlights.' },
  { id: 31, code: 'note_taker',         name: 'Note Taker',         icon: 'edit_note',            category: 'engagement',  earned: 0, description: 'Write your first topic summary.' },
  // AI Chat
  { id: 32, code: 'ai_curious_mind',    name: 'Curious Mind',       icon: 'lightbulb',            category: 'ai_chat',     earned: 0, description: 'Ask the AI tutor 20 questions.' },
  { id: 33, code: 'ai_apprentice',      name: 'AI Apprentice',      icon: 'psychology_alt',       category: 'ai_chat',     earned: 0, description: '50 AI requests.' },
  { id: 34, code: 'ai_scholar',         name: 'AI Scholar',         icon: 'school',               category: 'ai_chat',     earned: 0, description: '100 AI requests.' },
  { id: 35, code: 'ai_power_user',      name: 'AI Power User',      icon: 'auto_awesome',         category: 'ai_chat',     earned: 0, description: '200 AI requests.' },
  { id: 36, code: 'ai_maestro',         name: 'AI Maestro',         icon: 'workspace_premium',    category: 'ai_chat',     earned: 0, description: '450 AI requests.' },
  // Goals
  { id: 37, code: 'goal_setter',        name: 'Goal Setter',        icon: 'flag',                 category: 'goals',       earned: 0, description: 'Create your first study goal.' },
  { id: 38, code: 'goal_crusher_1',     name: 'Goal Crusher I',     icon: 'task_alt',             category: 'goals',       earned: 0, description: 'Complete 10 daily goals.' },
  { id: 39, code: 'goal_crusher_2',     name: 'Goal Crusher II',    icon: 'task_alt',             category: 'goals',       earned: 0, description: 'Complete 50 daily goals.' },
  { id: 40, code: 'goal_crusher_3',     name: 'Goal Crusher III',   icon: 'task_alt',             category: 'goals',       earned: 0, description: 'Complete 200 daily goals.' },
  { id: 41, code: 'planner_pro',        name: 'Planner Pro',        icon: 'event_available',      category: 'goals',       earned: 0, description: 'Complete at least one goal every day for a week.' },
  // Bar Special
  { id: 42, code: 'welcome_counsel',    name: 'Welcome Counsel',    icon: 'how_to_reg',           category: 'special',     earned: 1, description: 'Welcome aboard, future Bar Counsel.' },
  { id: 43, code: 'profile_sealed',     name: 'Profile Sealed',     icon: 'verified',             category: 'special',     earned: 0, description: 'Complete all your profile details.' },
  { id: 44, code: 'campus_pride',       name: 'Campus Pride',       icon: 'location_on',          category: 'special',     earned: 0, description: 'Pick the Law School campus you call home.' },
  { id: 45, code: 'call_to_bar_ready',  name: 'Call to Bar Ready',  icon: 'gavel',                category: 'special',     earned: 0, description: 'Reach 90% overall progress across the curriculum.' },
];

export const dailyQuote = {
  id: 1,
  text: 'The Rule of Law requires that people should be able to rely on the law as a guide to their future conduct.',
  author: 'Lord Bingham'
};
