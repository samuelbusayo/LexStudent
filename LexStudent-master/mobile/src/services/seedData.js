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
  { id: 1, title: 'Morning Briefing', time: '8:00 AM Daily', enabled: 1 },
  { id: 2, title: 'Mock Exam Alert', time: '2 days before', enabled: 1 },
  { id: 3, title: 'Case Study Window', time: 'Weekends only', enabled: 0 }
];

export const cases = [
  { id: 1, name: 'Donoghue v Stevenson', citation: '[1932] UKHL 100', year: 1932, description: 'The "snail in the bottle" case established the modern law of negligence and the neighbor principle.', tags: '["Negligence","Tort Law"]', is_featured: 1, bookmarked: 1 },
  { id: 2, name: 'Marbury v Madison', citation: '5 U.S. (1 Cranch) 137', year: 1803, description: 'Established the principle of judicial review in the United States.', tags: '["Constitutional"]', is_featured: 0, bookmarked: 0 },
  { id: 3, name: 'Salomon v Salomon', citation: '[1897] AC 22', year: 1897, description: 'Upheld the doctrine of separate legal personality for companies.', tags: '["Company Law"]', is_featured: 0, bookmarked: 0 },
  { id: 4, name: 'Miranda v Arizona', citation: '384 U.S. 436', year: 1966, description: 'Specified the Miranda rights that must be read to criminal suspects.', tags: '["Criminal"]', is_featured: 0, bookmarked: 0 }
];

export const badges = [
  { id: 1, name: '7 Day Streak', icon: 'local_fire_department', earned: 1, description: 'Study 7 days in a row' },
  { id: 2, name: 'Case Expert', icon: 'menu_book', earned: 1, description: 'Complete 10 case analyses' },
  { id: 3, name: 'Night Owl', icon: 'dark_mode', earned: 1, description: 'Study past midnight 5 times' },
  { id: 4, name: 'Locked Achievement', icon: 'lock', earned: 0, description: 'Secret achievement' }
];

export const dailyQuote = {
  id: 1,
  text: 'The Rule of Law requires that people should be able to rely on the law as a guide to their future conduct.',
  author: 'Lord Bingham'
};
