import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { schemaSQL } from './schema';
import { courses, curriculumTopics, activities, intensities, reminders, cases, badges, dailyQuote } from './seedData';
import { quizSeed } from './quiz_seed';

// Key translation helper
function snakeToCamel(str) {
  return str.replace(/(_\w)/g, (m) => m[1].toUpperCase());
}

export function transformKeys(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(transformKeys);
  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = snakeToCamel(key);
      acc[camelKey] = transformKeys(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

// Canonical studied pages helper
function getStudiedPages(topic) {
  let sel = [];
  try {
    const parsed = typeof topic.selected_pages === 'string' 
      ? JSON.parse(topic.selected_pages || '[]') 
      : topic.selected_pages;
    if (Array.isArray(parsed)) sel = parsed;
  } catch {}
  return sel.length > 0 ? sel.length : (topic.total_pages || 0);
}

function safeJson(val, fallback = []) {
  if (!val) return fallback;
  try {
    const p = typeof val === 'string' ? JSON.parse(val) : val;
    return Array.isArray(p) ? p : fallback;
  } catch {
    return fallback;
  }
}

function enrichTopic(t) {
  if (!t) return t;
  return {
    ...t,
    selected_pages: safeJson(t.selected_pages),
    materials: safeJson(t.materials)
  };
}

function enrichCase(c) {
  if (!c) return c;
  return {
    ...c,
    tags: safeJson(c.tags)
  };
}

let dbInstance = null;
let sqliteConnection = null;
let useNative = false;

// Mock database state for web fallback
let mockDb = {
  users: [],
  courses: [],
  topics: [],
  goals: [],
  progress_overall: [],
  progress_activities: [],
  knowledge_gaps: [],
  heatmap_data: [],
  reminders: [],
  summaries: [],
  cases: [],
  badges: [],
  daily_quotes: [],
  milestones: [],
  materials: [],
  countdowns: [],
  study_notes: [],
  topic_summaries: [],
  activity_log: [],
  goal_occurrences: [],
  quiz_scenarios: [],
  quiz_questions: [],
  quiz_attempts: [],
  quiz_attempt_answers: []
};

// Web Mock DB localstorage helpers
function saveMockDb() {
  localStorage.setItem('lexscholar_db', JSON.stringify(mockDb));
}

function initMockDb() {
  const saved = localStorage.getItem('lexscholar_db');
  if (saved) {
    try {
      mockDb = JSON.parse(saved);
      return;
    } catch (e) {
      console.error("Failed to parse saved mock DB, re-initializing:", e);
    }
  }

  // Initial seeding of Mock DB
  mockDb.users = [{ id: 1, name: 'Alex Morgan', email: 'alex@example.com', password_hash: '', streak: 12, badge: 'Juris Master', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }];
  mockDb.courses = [...courses];
  
  let topicId = 1;
  for (const [courseIdStr, titles] of Object.entries(curriculumTopics)) {
    const courseId = Number(courseIdStr);
    for (const name of titles) {
      mockDb.topics.push({
        id: topicId++,
        course_id: courseId,
        name,
        subtitle: '',
        total_pages: 0,
        pages_read: 0,
        has_materials: 0,
        material_file: null,
        material_type: null,
        selected_pages: '[]',
        total_document_pages: 0,
        materials: '[]',
        last_reviewed_at: null,
        review_interval_days: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  }

  mockDb.progress_overall = [{ id: 1, user_id: 1, overall: 48, streak: 12, badge: 'Juris Master' }];
  mockDb.progress_activities = [...activities];
  mockDb.heatmap_data = intensities.map((intensity, i) => ({
    id: i + 1,
    user_id: 1,
    day_index: i,
    intensity,
    updated_at: new Date().toISOString()
  }));
  mockDb.reminders = [...reminders];
  mockDb.cases = [...cases];
  mockDb.badges = [...badges];
  mockDb.daily_quotes = [dailyQuote];
  mockDb.countdowns = [{ id: 1, title: 'Bar Finals', days_remaining: 42 }];

  // Seed quizzes in mock
  let scenarioId = 1;
  let questionId = 1;
  for (const entry of quizSeed) {
    const names = entry.topicNames || [entry.topicName];
    for (const topicName of names) {
      const topic = mockDb.topics.find(t => t.course_id === entry.courseId && t.name === topicName);
      if (!topic) continue;

      const scenarioMap = {};
      if (entry.scenarios) {
        entry.scenarios.forEach((s, idx) => {
          const sId = scenarioId++;
          mockDb.quiz_scenarios.push({
            id: sId,
            topic_id: topic.id,
            text: s.text,
            order_index: idx,
            created_at: new Date().toISOString()
          });
          scenarioMap[s.key] = sId;
        });
      }

      entry.questions.forEach((q, idx) => {
        const qId = questionId++;
        const sId = q.scenario ? (scenarioMap[q.scenario] || null) : null;
        mockDb.quiz_questions.push({
          id: qId,
          topic_id: topic.id,
          scenario_id: sId,
          blank_number: q.blank || null,
          prompt: q.prompt || null,
          options: JSON.stringify(q.options),
          correct_index: q.correct,
          explanation: q.explanation || null,
          order_index: idx,
          created_at: new Date().toISOString()
        });
      });
    }
  }

  saveMockDb();
  console.log("Mock database successfully initialized and seeded!");
}

// Native DB seeding
async function seedDatabaseNative(db) {
  const check = await db.query('SELECT COUNT(*) as count FROM courses');
  if (check.values && check.values[0] && check.values[0].count > 0) {
    return; // already seeded
  }

  await db.run('INSERT INTO users (id, name, email, password_hash, streak, badge) VALUES (?, ?, ?, ?, ?, ?)', 
    [1, 'Alex Morgan', 'alex@example.com', '', 12, 'Juris Master']);

  for (const c of courses) {
    await db.run('INSERT INTO courses (id, name, description, type) VALUES (?, ?, ?, ?)', 
      [c.id, c.name, c.description, c.type]);
  }

  for (const [courseIdStr, titles] of Object.entries(curriculumTopics)) {
    const courseId = Number(courseIdStr);
    for (const title of titles) {
      await db.run(
        `INSERT INTO topics (course_id, name, subtitle, total_pages, pages_read, selected_pages, total_document_pages, has_materials)
         VALUES (?, ?, '', 0, 0, '[]', 0, 0)`,
        [courseId, title]
      );
    }
  }

  await db.run('INSERT INTO progress_overall (user_id, overall, streak, badge) VALUES (1, 48, 12, ?)', ['Juris Master']);

  for (const a of activities) {
    await db.run('INSERT INTO progress_activities (id, type, title, status) VALUES (?, ?, ?, ?)', 
      [a.id, a.type, a.title, a.status]);
  }

  for (let i = 0; i < intensities.length; i++) {
    await db.run('INSERT INTO heatmap_data (day_index, intensity) VALUES (?, ?)', [i, intensities[i]]);
  }

  for (const r of reminders) {
    await db.run('INSERT INTO reminders (id, title, time, enabled) VALUES (?, ?, ?, ?)', 
      [r.id, r.title, r.time, r.enabled]);
  }

  for (const c of cases) {
    await db.run('INSERT INTO cases (id, name, citation, year, description, tags, is_featured, bookmarked) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [c.id, c.name, c.citation, c.year, c.description, c.tags, c.is_featured, c.bookmarked]);
  }

  for (const b of badges) {
    await db.run('INSERT INTO badges (id, name, icon, earned, description) VALUES (?, ?, ?, ?, ?)', 
      [b.id, b.name, b.icon, b.earned, b.description]);
  }

  await db.run('INSERT INTO daily_quotes (id, text, author) VALUES (1, ?, ?)', 
    [dailyQuote.text, dailyQuote.author]);

  await db.run("INSERT INTO countdowns (id, title, days_remaining) VALUES (1, 'Bar Finals', 42)");

  // Seed quizzes natively
  for (const entry of quizSeed) {
    const names = entry.topicNames || [entry.topicName];
    for (const name of names) {
      const topicRes = await db.query('SELECT id FROM topics WHERE course_id = ? AND name = ?', [entry.courseId, name]);
      if (!topicRes.values || topicRes.values.length === 0) continue;
      const topicId = topicRes.values[0].id;

      const scenarioMap = {};
      if (entry.scenarios) {
        for (let idx = 0; idx < entry.scenarios.length; idx++) {
          const s = entry.scenarios[idx];
          const res = await db.run('INSERT INTO quiz_scenarios (topic_id, text, order_index) VALUES (?, ?, ?)', 
            [topicId, s.text, idx]);
          // get insertion id
          const lastIdRes = await db.query('SELECT last_insert_rowid() as id');
          const lastId = lastIdRes.values[0].id;
          scenarioMap[s.key] = lastId;
        }
      }

      for (let idx = 0; idx < entry.questions.length; idx++) {
        const q = entry.questions[idx];
        const scenarioId = q.scenario ? (scenarioMap[q.scenario] || null) : null;
        await db.run(
          `INSERT INTO quiz_questions (topic_id, scenario_id, blank_number, prompt, options, correct_index, explanation, order_index)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            topicId,
            scenarioId,
            q.blank || null,
            q.prompt || null,
            JSON.stringify(q.options),
            q.correct,
            q.explanation || null,
            idx
          ]
        );
      }
    }
  }

  console.log("Database seeded successfully natively!");
}

// Initialize database
export async function initDbConnection() {
  if (dbInstance) return dbInstance;

  useNative = Capacitor.isNativePlatform();
  if (useNative) {
    try {
      if (!sqliteConnection) {
        sqliteConnection = new SQLiteConnection(CapacitorSQLite);
      }
      const isConn = (await sqliteConnection.isConnection('lexscholar', false)).result;
      
      let db;
      if (isConn) {
        db = await sqliteConnection.retrieveConnection('lexscholar', false);
      } else {
        db = await sqliteConnection.createConnection('lexscholar', false, 'no-encryption', 1, false);
      }
      
      await db.open();
      dbInstance = db;
      
      // Execute schema
      await db.execute(schemaSQL);
      
      // Seed data
      await seedDatabaseNative(db);
      
      return db;
    } catch (e) {
      console.error("SQLite initialization failed natively, falling back to mock database:", e);
      useNative = false;
      initMockDb();
    }
  } else {
    initMockDb();
  }
}

// API functions

export async function getCurrentUser() {
  await initDbConnection();
  if (useNative) {
    const res = await dbInstance.query('SELECT * FROM users LIMIT 1');
    return transformKeys(res.values[0] || null);
  } else {
    return transformKeys(mockDb.users[0] || null);
  }
}

export async function loginUser(email, password) {
  await initDbConnection();
  if (useNative) {
    const res = await dbInstance.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    const user = res.values[0];
    if (!user) throw new Error("User not found");
    return transformKeys({ user, token: 'mock-local-token' });
  } else {
    const user = mockDb.users.find(u => u.email === email);
    if (!user) throw new Error("User not found");
    return transformKeys({ user, token: 'mock-local-token' });
  }
}

export async function registerUser(name, email, password) {
  await initDbConnection();
  if (useNative) {
    await dbInstance.run('INSERT INTO users (name, email, streak, badge) VALUES (?, ?, 0, ?)', [name, email, 'Novice']);
    const res = await dbInstance.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return transformKeys({ user: res.values[0], token: 'mock-local-token' });
  } else {
    const user = { id: mockDb.users.length + 1, name, email, streak: 0, badge: 'Novice', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockDb.users.push(user);
    saveMockDb();
    return transformKeys({ user, token: 'mock-local-token' });
  }
}

export async function getCourses() {
  await initDbConnection();
  if (useNative) {
    const res = await dbInstance.query(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM topics t WHERE t.course_id = c.id) as total_topics,
        (SELECT COUNT(*) FROM topics t WHERE t.course_id = c.id AND t.pages_read >= t.total_pages AND t.total_pages > 0) as completed_topics
      FROM courses c
      ORDER BY c.id
    `);
    return transformKeys(res.values || []);
  } else {
    const res = mockDb.courses.map(c => {
      const topics = mockDb.topics.filter(t => t.course_id === c.id);
      const totalTopics = topics.length;
      const completedTopics = topics.filter(t => {
        const studied = getStudiedPages(t);
        return t.pages_read >= studied && studied > 0;
      }).length;
      return { ...c, total_topics: totalTopics, completed_topics: completedTopics };
    });
    return transformKeys(res);
  }
}

export async function getCourse(id) {
  await initDbConnection();
  const cid = Number(id);
  if (useNative) {
    const res = await dbInstance.query(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM topics t WHERE t.course_id = c.id) as total_topics,
        (SELECT COUNT(*) FROM topics t WHERE t.course_id = c.id AND t.pages_read >= t.total_pages AND t.total_pages > 0) as completed_topics
      FROM courses c WHERE c.id = ? LIMIT 1
    `, [cid]);
    return transformKeys(res.values[0] || null);
  } else {
    const c = mockDb.courses.find(x => x.id === cid);
    if (!c) return null;
    const topics = mockDb.topics.filter(t => t.course_id === c.id);
    const totalTopics = topics.length;
    const completedTopics = topics.filter(t => {
      const studied = getStudiedPages(t);
      return t.pages_read >= studied && studied > 0;
    }).length;
    return transformKeys({ ...c, total_topics: totalTopics, completed_topics: completedTopics });
  }
}

export async function getTopics(courseId) {
  await initDbConnection();
  const cid = Number(courseId);
  if (useNative) {
    const res = await dbInstance.query('SELECT * FROM topics WHERE course_id = ? ORDER BY id', [cid]);
    return transformKeys((res.values || []).map(enrichTopic));
  } else {
    const res = mockDb.topics.filter(t => t.course_id === cid).map(enrichTopic);
    return transformKeys(res);
  }
}

export async function createTopic(courseId, name) {
  await initDbConnection();
  const cid = Number(courseId);
  if (useNative) {
    const res = await dbInstance.run(
      `INSERT INTO topics (course_id, name, subtitle, total_pages, pages_read, selected_pages, total_document_pages, has_materials)
       VALUES (?, ?, '', 0, 0, '[]', 0, 0)`,
      [cid, name]
    );
    const lastIdRes = await dbInstance.query('SELECT last_insert_rowid() as id');
    const lastId = lastIdRes.values[0].id;
    const newTopic = await dbInstance.query('SELECT * FROM topics WHERE id = ?', [lastId]);
    return transformKeys(enrichTopic(newTopic.values[0]));
  } else {
    const newTopic = {
      id: mockDb.topics.length + 1,
      course_id: cid,
      name,
      subtitle: '',
      total_pages: 0,
      pages_read: 0,
      has_materials: 0,
      material_file: null,
      material_type: null,
      selected_pages: '[]',
      total_document_pages: 0,
      materials: '[]',
      last_reviewed_at: null,
      review_interval_days: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockDb.topics.push(newTopic);
    saveMockDb();
    return transformKeys(enrichTopic(newTopic));
  }
}

export async function deleteTopic(courseId, topicId) {
  await initDbConnection();
  const tid = Number(topicId);
  if (useNative) {
    await dbInstance.run('DELETE FROM topics WHERE id = ?', [tid]);
    return { success: true };
  } else {
    mockDb.topics = mockDb.topics.filter(t => t.id !== tid);
    saveMockDb();
    return { success: true };
  }
}

export async function updateTopicProgress(courseId, topicId, { pagesRead, totalPages, selectedPages, totalDocumentPages }) {
  await initDbConnection();
  const tid = Number(topicId);
  const selPagesStr = JSON.stringify(selectedPages || []);
  if (useNative) {
    await dbInstance.run(
      `UPDATE topics SET 
         pages_read = ?, 
         total_pages = ?, 
         selected_pages = ?, 
         total_document_pages = ?,
         updated_at = datetime('now')
       WHERE id = ?`,
      [pagesRead, totalPages, selPagesStr, totalDocumentPages || 0, tid]
    );
    // Log in activity_log
    await dbInstance.run(
      `INSERT INTO activity_log (user_id, type, topic_id, amount, created_at)
       VALUES (1, 'page_read', ?, ?, datetime('now'))`,
      [tid, 1]
    );
    const updated = await dbInstance.query('SELECT * FROM topics WHERE id = ?', [tid]);
    return transformKeys(enrichTopic(updated.values[0]));
  } else {
    const topic = mockDb.topics.find(t => t.id === tid);
    if (topic) {
      topic.pages_read = pagesRead;
      topic.total_pages = totalPages;
      topic.selected_pages = selPagesStr;
      topic.total_document_pages = totalDocumentPages || 0;
      topic.updated_at = new Date().toISOString();
      
      // Log activity
      mockDb.activity_log.push({
        id: mockDb.activity_log.length + 1,
        user_id: 1,
        type: 'page_read',
        topic_id: tid,
        goal_id: null,
        amount: 1,
        created_at: new Date().toISOString()
      });
      saveMockDb();
    }
    return transformKeys(enrichTopic(topic));
  }
}

export async function getGoals() {
  await initDbConnection();
  if (useNative) {
    const goalsRes = await dbInstance.query(`
      SELECT g.*, t.course_id, t.name as topic_name, t.selected_pages, t.pages_read, t.total_document_pages
      FROM goals g
      LEFT JOIN topics t ON g.topic_id = t.id
      ORDER BY g.id
    `);
    const goals = goalsRes.values || [];
    const enriched = [];
    for (const g of goals) {
      const occRes = await dbInstance.query('SELECT id, goal_id, date, status, progress FROM goal_occurrences WHERE goal_id = ? ORDER BY date', [g.id]);
      enriched.push({
        ...g,
        target_pages: safeJson(g.target_pages),
        selected_pages: safeJson(g.selected_pages),
        occurrences: occRes.values || []
      });
    }
    return transformKeys(enriched);
  } else {
    return transformKeys(mockDb.goals.map(g => {
      const topic = mockDb.topics.find(t => t.id === g.topic_id);
      const occurrences = mockDb.goal_occurrences.filter(o => o.goal_id === g.id);
      return {
        ...g,
        course_id: topic ? topic.course_id : null,
        topic_name: topic ? topic.name : null,
        selected_pages: topic ? safeJson(topic.selected_pages) : [],
        pages_read: topic ? topic.pages_read : 0,
        total_document_pages: topic ? topic.total_document_pages : 0,
        target_pages: safeJson(g.target_pages),
        occurrences
      };
    }));
  }
}

export async function createGoal(data) {
  await initDbConnection();
  const { subjectTag, title, note, topicId, targetPages, targetAmount, dates, date, status } = data;
  const tpArr = Array.isArray(targetPages) ? targetPages : [];
  const tpJson = JSON.stringify(tpArr);
  const amount = tpArr.length > 0 ? tpArr.length : (Number(targetAmount) || 0);
  const dateList = Array.isArray(dates) && dates.length > 0 ? dates : (date ? [date] : []);
  const firstDate = dateList[0] || '';

  // Get topic baseline
  let baseline = 0;
  if (topicId) {
    const tid = Number(topicId);
    if (useNative) {
      const topRes = await dbInstance.query('SELECT pages_read FROM topics WHERE id = ?', [tid]);
      if (topRes.values && topRes.values[0]) baseline = topRes.values[0].pages_read || 0;
    } else {
      const topic = mockDb.topics.find(t => t.id === tid);
      if (topic) baseline = topic.pages_read || 0;
    }
  }

  if (useNative) {
    await dbInstance.run(
      `INSERT INTO goals (subject_tag, title, note, progress, date, status, topic_id, target_amount, target_pages, baseline_pages_read)
       VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?)`,
      [subjectTag || '', title, note || '', firstDate, status || 'not_started', topicId || null, amount, tpJson, baseline]
    );
    const lastIdRes = await dbInstance.query('SELECT last_insert_rowid() as id');
    const goalId = lastIdRes.values[0].id;

    for (const d of dateList) {
      await dbInstance.run("INSERT INTO goal_occurrences (goal_id, user_id, date, status, progress) VALUES (?, 1, ?, 'not_started', 0)", [goalId, d]);
    }

    const gRes = await dbInstance.query(`
      SELECT g.*, t.course_id, t.name as topic_name, t.selected_pages, t.pages_read, t.total_document_pages
      FROM goals g LEFT JOIN topics t ON g.topic_id = t.id WHERE g.id = ? LIMIT 1
    `, [goalId]);
    
    const oRes = await dbInstance.query('SELECT id, goal_id, date, status, progress FROM goal_occurrences WHERE goal_id = ? ORDER BY date', [goalId]);
    return transformKeys({
      ...gRes.values[0],
      target_pages: safeJson(gRes.values[0].target_pages),
      selected_pages: safeJson(gRes.values[0].selected_pages),
      occurrences: oRes.values || []
    });
  } else {
    const goalId = mockDb.goals.length + 1;
    const newGoal = {
      id: goalId,
      user_id: 1,
      subject_tag: subjectTag || '',
      title,
      note: note || '',
      progress: 0,
      date: firstDate,
      status: status || 'not_started',
      topic_id: topicId || null,
      target_amount: amount,
      target_pages: tpJson,
      baseline_pages_read: baseline,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockDb.goals.push(newGoal);

    dateList.forEach(d => {
      mockDb.goal_occurrences.push({
        id: mockDb.goal_occurrences.length + 1,
        goal_id: goalId,
        user_id: 1,
        date: d,
        status: 'not_started',
        progress: 0,
        created_at: new Date().toISOString()
      });
    });

    saveMockDb();
    
    // Retrieve and enrich
    const topic = mockDb.topics.find(t => t.id === topicId);
    const occurrences = mockDb.goal_occurrences.filter(o => o.goal_id === goalId);
    return transformKeys({
      ...newGoal,
      course_id: topic ? topic.course_id : null,
      topic_name: topic ? topic.name : null,
      selected_pages: topic ? safeJson(topic.selected_pages) : [],
      pages_read: topic ? topic.pages_read : 0,
      total_document_pages: topic ? topic.total_document_pages : 0,
      target_pages: safeJson(newGoal.target_pages),
      occurrences
    });
  }
}

export async function updateGoal(id, data) {
  await initDbConnection();
  const gid = Number(id);
  const { subjectTag, title, note, progress, date, status, topicId, targetAmount, targetPages } = data;
  let tpJson = undefined;
  let amount = targetAmount;
  if (targetPages !== undefined) {
    const tpArr = Array.isArray(targetPages) ? targetPages : [];
    tpJson = JSON.stringify(tpArr);
    if (tpArr.length > 0) amount = tpArr.length;
  }

  if (useNative) {
    const oldRes = await dbInstance.query('SELECT * FROM goals WHERE id = ?', [gid]);
    const oldGoal = oldRes.values[0];
    
    await dbInstance.run(
      `UPDATE goals SET
        subject_tag = COALESCE(?, subject_tag),
        title = COALESCE(?, title),
        note = COALESCE(?, note),
        progress = COALESCE(?, progress),
        date = COALESCE(?, date),
        status = COALESCE(?, status),
        topic_id = COALESCE(?, topic_id),
        target_amount = COALESCE(?, target_amount),
        target_pages = COALESCE(?, target_pages),
        updated_at = datetime('now')
      WHERE id = ?`,
      [subjectTag ?? null, title ?? null, note ?? null, progress ?? null, date ?? null, status ?? null, topicId ?? null, amount ?? null, tpJson ?? null, gid]
    );

    const gRes = await dbInstance.query(`
      SELECT g.*, t.course_id, t.name as topic_name, t.selected_pages, t.pages_read, t.total_document_pages
      FROM goals g LEFT JOIN topics t ON g.topic_id = t.id WHERE g.id = ? LIMIT 1
    `, [gid]);
    const goal = gRes.values[0];

    const nowComplete = (goal.status === 'completed' || goal.progress >= 100) &&
                        (oldGoal.status !== 'completed' && oldGoal.progress < 100);
    if (nowComplete) {
      await dbInstance.run("INSERT INTO activity_log (user_id, type, goal_id, amount, created_at) VALUES (1, 'goal_completed', ?, 1, datetime('now'))", [gid]);
    }

    const oRes = await dbInstance.query('SELECT id, goal_id, date, status, progress FROM goal_occurrences WHERE goal_id = ? ORDER BY date', [gid]);
    return transformKeys({
      ...goal,
      target_pages: safeJson(goal.target_pages),
      selected_pages: safeJson(goal.selected_pages),
      occurrences: oRes.values || []
    });
  } else {
    const goal = mockDb.goals.find(g => g.id === gid);
    if (goal) {
      const wasComplete = goal.status === 'completed' || goal.progress >= 100;
      if (subjectTag !== undefined) goal.subject_tag = subjectTag;
      if (title !== undefined) goal.title = title;
      if (note !== undefined) goal.note = note;
      if (progress !== undefined) goal.progress = progress;
      if (date !== undefined) goal.date = date;
      if (status !== undefined) goal.status = status;
      if (topicId !== undefined) goal.topic_id = topicId;
      if (amount !== undefined) goal.target_amount = amount;
      if (tpJson !== undefined) goal.target_pages = tpJson;
      goal.updated_at = new Date().toISOString();

      const isComplete = goal.status === 'completed' || goal.progress >= 100;
      if (isComplete && !wasComplete) {
        mockDb.activity_log.push({
          id: mockDb.activity_log.length + 1,
          user_id: 1,
          type: 'goal_completed',
          goal_id: gid,
          topic_id: null,
          amount: 1,
          created_at: new Date().toISOString()
        });
      }
      saveMockDb();
    }
    const topic = mockDb.topics.find(t => t.id === goal.topic_id);
    const occurrences = mockDb.goal_occurrences.filter(o => o.goal_id === gid);
    return transformKeys({
      ...goal,
      course_id: topic ? topic.course_id : null,
      topic_name: topic ? topic.name : null,
      selected_pages: topic ? safeJson(topic.selected_pages) : [],
      pages_read: topic ? topic.pages_read : 0,
      total_document_pages: topic ? topic.total_document_pages : 0,
      target_pages: safeJson(goal.target_pages),
      occurrences
    });
  }
}

export async function updateGoalOccurrence(id, data) {
  await initDbConnection();
  const oid = Number(id);
  const { status, progress } = data;

  if (useNative) {
    const oldRes = await dbInstance.query('SELECT * FROM goal_occurrences WHERE id = ?', [oid]);
    const occ = oldRes.values[0];
    if (!occ) throw new Error("Occurrence not found");

    await dbInstance.run(
      "UPDATE goal_occurrences SET status = COALESCE(?, status), progress = COALESCE(?, progress) WHERE id = ?",
      [status ?? null, progress ?? null, oid]
    );

    const updatedRes = await dbInstance.query('SELECT * FROM goal_occurrences WHERE id = ?', [oid]);
    const updated = updatedRes.values[0];

    const nowComplete = (updated.status === 'completed' || updated.progress >= 100) &&
                        (occ.status !== 'completed' && occ.progress < 100);
    if (nowComplete) {
      await dbInstance.run("INSERT INTO activity_log (user_id, type, goal_id, amount, created_at) VALUES (1, 'goal_completed', ?, 1, datetime('now'))", [occ.goal_id]);
    }
    return transformKeys(updated);
  } else {
    const occ = mockDb.goal_occurrences.find(o => o.id === oid);
    if (!occ) throw new Error("Occurrence not found");
    const wasComplete = occ.status === 'completed' || occ.progress >= 100;
    
    if (status !== undefined) occ.status = status;
    if (progress !== undefined) occ.progress = progress;

    const isComplete = occ.status === 'completed' || occ.progress >= 100;
    if (isComplete && !wasComplete) {
      mockDb.activity_log.push({
        id: mockDb.activity_log.length + 1,
        user_id: 1,
        type: 'goal_completed',
        goal_id: occ.goal_id,
        topic_id: null,
        amount: 1,
        created_at: new Date().toISOString()
      });
    }
    saveMockDb();
    return transformKeys(occ);
  }
}

export async function deleteGoal(id) {
  await initDbConnection();
  const gid = Number(id);
  if (useNative) {
    await dbInstance.run('DELETE FROM goals WHERE id = ?', [gid]);
    return { success: true };
  } else {
    mockDb.goals = mockDb.goals.filter(g => g.id !== gid);
    mockDb.goal_occurrences = mockDb.goal_occurrences.filter(o => o.goal_id !== gid);
    saveMockDb();
    return { success: true };
  }
}

export async function getOverallProgress() {
  await initDbConnection();
  let overall = 0;
  let streak = 0;
  let badge = '';
  let coursesProg = [];

  if (useNative) {
    const topicsRes = await dbInstance.query('SELECT selected_pages, total_pages, pages_read FROM topics');
    const allTopics = topicsRes.values || [];
    let overallTotalPages = 0;
    let overallPagesRead = 0;
    for (const t of allTopics) {
      const studied = getStudiedPages(t);
      overallTotalPages += studied;
      overallPagesRead += Math.min(t.pages_read || 0, studied);
    }
    overall = overallTotalPages > 0 ? Math.round((overallPagesRead / overallTotalPages) * 100) : 0;

    const metaRes = await dbInstance.query('SELECT streak, badge FROM progress_overall WHERE user_id = 1');
    const meta = metaRes.values[0] || { streak: 0, badge: '' };
    streak = meta.streak;
    badge = meta.badge;

    const coursesRes = await dbInstance.query('SELECT id, name FROM courses ORDER BY id');
    const dbCourses = coursesRes.values || [];
    for (const c of dbCourses) {
      const topRes = await dbInstance.query("SELECT id, name, selected_pages, total_pages, pages_read FROM topics WHERE course_id = ?", [c.id]);
      const topics = topRes.values || [];
      
      const totalTopics = topics.length;
      let totalPagesSum = 0;
      let pagesReadSum = 0;
      let completedTopics = 0;

      const topicDetails = topics.map(t => {
        const studied = getStudiedPages(t);
        const read = Math.min(t.pages_read || 0, studied);
        totalPagesSum += studied;
        pagesReadSum += read;
        const completed = read >= studied && studied > 0;
        if (completed) completedTopics++;

        return {
          id: t.id,
          name: t.name,
          studiedPages: studied,
          pagesRead: read,
          pagesRemaining: Math.max(0, studied - read),
          progressPercent: studied > 0 ? Math.round((read / studied) * 100) : 0,
          completed
        };
      });

      const progressPercent = totalPagesSum > 0 ? Math.round((pagesReadSum / totalPagesSum) * 100) : 0;

      coursesProg.push({
        courseId: c.id,
        courseName: c.name,
        totalTopics,
        completedTopics,
        progressPercent,
        topics: topicDetails
      });
    }
  } else {
    // Mock
    let overallTotalPages = 0;
    let overallPagesRead = 0;
    for (const t of mockDb.topics) {
      const studied = getStudiedPages(t);
      overallTotalPages += studied;
      overallPagesRead += Math.min(t.pages_read || 0, studied);
    }
    overall = overallTotalPages > 0 ? Math.round((overallPagesRead / overallTotalPages) * 100) : 0;

    const meta = mockDb.progress_overall[0] || { streak: 0, badge: '' };
    streak = meta.streak;
    badge = meta.badge;

    coursesProg = mockDb.courses.map(c => {
      const topics = mockDb.topics.filter(t => t.course_id === c.id);
      const totalTopics = topics.length;
      let totalPagesSum = 0;
      let pagesReadSum = 0;
      let completedTopics = 0;

      const topicDetails = topics.map(t => {
        const studied = getStudiedPages(t);
        const read = Math.min(t.pages_read || 0, studied);
        totalPagesSum += studied;
        pagesReadSum += read;
        const completed = read >= studied && studied > 0;
        if (completed) completedTopics++;

        return {
          id: t.id,
          name: t.name,
          studiedPages: studied,
          pagesRead: read,
          pagesRemaining: Math.max(0, studied - read),
          progressPercent: studied > 0 ? Math.round((read / studied) * 100) : 0,
          completed
        };
      });

      const progressPercent = totalPagesSum > 0 ? Math.round((pagesReadSum / totalPagesSum) * 100) : 0;

      return {
        courseId: c.id,
        courseName: c.name,
        totalTopics,
        completedTopics,
        progressPercent,
        topics: topicDetails
      };
    });
  }

  return {
    overall,
    streak,
    badge,
    courses: coursesProg
  };
}

export async function getRecentProgress() {
  await initDbConnection();
  if (useNative) {
    const res = await dbInstance.query("SELECT type, title, status FROM progress_activities WHERE user_id = 1 ORDER BY id DESC LIMIT 5");
    return transformKeys(res.values || []);
  } else {
    const sorted = [...mockDb.progress_activities].reverse().slice(0, 5);
    return transformKeys(sorted);
  }
}

export async function getStreak() {
  await initDbConnection();
  const DAILY_TARGET = 5;
  let days = [];
  let todayActivitiesTotal = 0;
  let badge = '';

  if (useNative) {
    const daysRes = await dbInstance.query(`SELECT DISTINCT date(created_at) as day FROM activity_log WHERE user_id = 1 ORDER BY day DESC`);
    days = daysRes.values || [];

    const todayRes = await dbInstance.query(`SELECT COALESCE(SUM(amount), 0) as total FROM activity_log WHERE user_id = 1 AND date(created_at) = date('now')`);
    todayActivitiesTotal = todayRes.values[0] ? todayRes.values[0].total : 0;

    const metaRes = await dbInstance.query("SELECT badge FROM progress_overall WHERE user_id = 1");
    badge = metaRes.values[0] ? metaRes.values[0].badge : '';
  } else {
    // Mock
    const daySet = new Set();
    mockDb.activity_log.forEach(a => {
      if (a.created_at) {
        daySet.add(a.created_at.slice(0, 10));
      }
    });
    days = Array.from(daySet).sort().reverse().map(d => ({ day: d }));

    const todayStr = new Date().toISOString().slice(0, 10);
    todayActivitiesTotal = mockDb.activity_log
      .filter(a => a.created_at && a.created_at.slice(0, 10) === todayStr)
      .reduce((sum, a) => sum + (a.amount || 0), 0);

    const meta = mockDb.progress_overall[0] || { badge: '' };
    badge = meta.badge;
  }

  let streak = 0;
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  for (let i = 0; i < days.length; i++) {
    const expected = new Date(todayUTC);
    expected.setUTCDate(expected.getUTCDate() - i);
    const expectedStr = expected.toISOString().slice(0, 10);
    if (days[i].day === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  const ringPercent = Math.min(100, Math.round((todayActivitiesTotal / DAILY_TARGET) * 100));

  return { streak, badge, ringPercent, dailyTarget: DAILY_TARGET };
}

export async function getKnowledgeGaps() {
  await initDbConnection();
  let gaps = [];

  const now = new Date();
  let daysToExam = 42;

  if (useNative) {
    const countdownRes = await dbInstance.query("SELECT days_remaining FROM countdowns WHERE id = 1");
    if (countdownRes.values && countdownRes.values[0]) daysToExam = countdownRes.values[0].days_remaining;

    const topicsRes = await dbInstance.query(`
      SELECT t.id, t.name, t.selected_pages, t.total_pages, t.pages_read,
             t.last_reviewed_at, t.review_interval_days, c.name as course_name
      FROM topics t JOIN courses c ON t.course_id = c.id
    `);
    const topics = topicsRes.values || [];

    for (const t of topics) {
      const studied = getStudiedPages(t);
      const mastery = studied > 0 ? Math.min(t.pages_read || 0, studied) / studied : 0;
      const masteryPct = Math.round(mastery * 100);

      let daysOverdue = 0;
      let lastReviewedStr = 'Unread Topic';
      if (t.last_reviewed_at) {
        const lastDate = new Date(t.last_reviewed_at);
        const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
        daysOverdue = Math.max(0, diffDays - (t.review_interval_days || 1));
        if (diffDays === 0) lastReviewedStr = 'Today';
        else if (diffDays === 1) lastReviewedStr = '1 day ago';
        else if (diffDays < 7) lastReviewedStr = `${diffDays} days ago`;
        else if (diffDays < 14) lastReviewedStr = '1 week ago';
        else lastReviewedStr = `${Math.floor(diffDays / 7)} weeks ago`;
      }

      const isOverdue = t.last_reviewed_at ? daysOverdue > 0 : true;
      const isLowMastery = mastery < 0.7;

      if (!isLowMastery && !isOverdue) continue;

      const priority = (1 - mastery) * 40 + Math.min(daysOverdue, 30) * 1.5 + Math.max(0, (60 - daysToExam)) * 0.5;

      gaps.push({
        id: t.id,
        subject: t.course_name,
        topic: t.name,
        progress: masteryPct,
        lastReviewed: lastReviewedStr,
        priority,
        mastery,
        reviewIntervalDays: t.review_interval_days
      });
    }
  } else {
    // Mock
    const countdown = mockDb.countdowns.find(c => c.id === 1);
    if (countdown) daysToExam = countdown.days_remaining;

    for (const t of mockDb.topics) {
      const course = mockDb.courses.find(c => c.id === t.course_id);
      const studied = getStudiedPages(t);
      const mastery = studied > 0 ? Math.min(t.pages_read || 0, studied) / studied : 0;
      const masteryPct = Math.round(mastery * 100);

      let daysOverdue = 0;
      let lastReviewedStr = 'Unread Topic';
      if (t.last_reviewed_at) {
        const lastDate = new Date(t.last_reviewed_at);
        const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
        daysOverdue = Math.max(0, diffDays - (t.review_interval_days || 1));
        if (diffDays === 0) lastReviewedStr = 'Today';
        else if (diffDays === 1) lastReviewedStr = '1 day ago';
        else if (diffDays < 7) lastReviewedStr = `${diffDays} days ago`;
        else if (diffDays < 14) lastReviewedStr = '1 week ago';
        else lastReviewedStr = `${Math.floor(diffDays / 7)} weeks ago`;
      }

      const isOverdue = t.last_reviewed_at ? daysOverdue > 0 : true;
      const isLowMastery = mastery < 0.7;

      if (!isLowMastery && !isOverdue) continue;

      const priority = (1 - mastery) * 40 + Math.min(daysOverdue, 30) * 1.5 + Math.max(0, (60 - daysToExam)) * 0.5;

      gaps.push({
        id: t.id,
        subject: course ? course.name : '',
        topic: t.name,
        progress: masteryPct,
        lastReviewed: lastReviewedStr,
        priority,
        mastery,
        reviewIntervalDays: t.review_interval_days
      });
    }
  }

  gaps.sort((a, b) => b.priority - a.priority);
  return gaps;
}

export async function getHeatmap() {
  await initDbConnection();
  const DAILY_TARGET = 5;
  let intensitiesArr = [];
  let targetMet = 0;
  let targetTotal = 1;

  if (useNative) {
    const rowsRes = await dbInstance.query(`
      SELECT date(created_at) as day, SUM(amount) as total
      FROM activity_log WHERE user_id = 1
        AND date(created_at) >= date('now', '-20 days')
      GROUP BY date(created_at)
    `);
    const rows = rowsRes.values || [];

    const dayMap = {};
    for (const r of rows) dayMap[r.day] = r.total;

    const maxVal = Math.max(1, ...Object.values(dayMap));
    const today = new Date();

    for (let i = 20; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = dayMap[key] || 0;
      intensitiesArr.push(Math.round((count / maxVal) * 5));
    }

    const weekStart = new Date(today);
    const dayOfWeek = weekStart.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(weekStart.getDate() - mondayOffset);

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      if (d > today) break;
      const key = d.toISOString().slice(0, 10);
      if ((dayMap[key] || 0) >= DAILY_TARGET) targetMet++;
    }
    targetTotal = Math.min(7, mondayOffset + 1);
  } else {
    // Mock
    const dayMap = {};
    const todayStr = new Date().toISOString().slice(0, 10);
    mockDb.activity_log.forEach(a => {
      if (a.created_at) {
        const key = a.created_at.slice(0, 10);
        dayMap[key] = (dayMap[key] || 0) + (a.amount || 0);
      }
    });

    const maxVal = Math.max(1, ...Object.values(dayMap));
    const today = new Date();

    for (let i = 20; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = dayMap[key] || 0;
      intensitiesArr.push(Math.round((count / maxVal) * 5));
    }

    const weekStart = new Date(today);
    const dayOfWeek = weekStart.getDay();
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(weekStart.getDate() - mondayOffset);

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      if (d > today) break;
      const key = d.toISOString().slice(0, 10);
      if ((dayMap[key] || 0) >= DAILY_TARGET) targetMet++;
    }
    targetTotal = Math.min(7, mondayOffset + 1);
  }

  return { intensities: intensitiesArr, targetMet, targetTotal };
}

export async function recordRevisionProgress(topicId, rating) {
  await initDbConnection();
  const tid = Number(topicId);

  if (useNative) {
    const topRes = await dbInstance.query('SELECT review_interval_days FROM topics WHERE id = ?', [tid]);
    const topic = topRes.values[0];
    if (!topic) throw new Error("Topic not found");

    let newInterval = topic.review_interval_days || 1;
    if (rating === 'got_it') {
      newInterval = Math.min(30, newInterval * 2 + 1);
    } else if (rating === 'forgot') {
      newInterval = 1;
    }

    await dbInstance.run(
      `UPDATE topics SET last_reviewed_at = datetime('now'), review_interval_days = ?, updated_at = datetime('now') WHERE id = ?`,
      [newInterval, tid]
    );

    await dbInstance.run(
      `INSERT INTO activity_log (user_id, type, topic_id, amount, created_at) VALUES (1, 'topic_reviewed', ?, 1, datetime('now'))`,
      [tid]
    );

    const updated = await dbInstance.query('SELECT * FROM topics WHERE id = ?', [tid]);
    return transformKeys(updated.values[0]);
  } else {
    const topic = mockDb.topics.find(t => t.id === tid);
    if (!topic) throw new Error("Topic not found");

    let newInterval = topic.review_interval_days || 1;
    if (rating === 'got_it') {
      newInterval = Math.min(30, newInterval * 2 + 1);
    } else if (rating === 'forgot') {
      newInterval = 1;
    }

    topic.review_interval_days = newInterval;
    topic.last_reviewed_at = new Date().toISOString();
    topic.updated_at = new Date().toISOString();

    mockDb.activity_log.push({
      id: mockDb.activity_log.length + 1,
      user_id: 1,
      type: 'topic_reviewed',
      topic_id: tid,
      goal_id: null,
      amount: 1,
      created_at: new Date().toISOString()
    });

    saveMockDb();
    return transformKeys(topic);
  }
}

export async function getReminders() {
  await initDbConnection();
  if (useNative) {
    const res = await dbInstance.query('SELECT * FROM reminders ORDER BY id');
    return transformKeys(res.values || []);
  } else {
    return transformKeys(mockDb.reminders);
  }
}

export async function toggleReminder(id) {
  await initDbConnection();
  const rid = Number(id);
  if (useNative) {
    await dbInstance.run('UPDATE reminders SET enabled = 1 - enabled WHERE id = ?', [rid]);
    const res = await dbInstance.query('SELECT * FROM reminders WHERE id = ?', [rid]);
    return transformKeys(res.values[0]);
  } else {
    const reminder = mockDb.reminders.find(r => r.id === rid);
    if (reminder) {
      reminder.enabled = reminder.enabled === 1 ? 0 : 1;
      saveMockDb();
    }
    return transformKeys(reminder);
  }
}

export async function getCases() {
  await initDbConnection();
  if (useNative) {
    const res = await dbInstance.query('SELECT * FROM cases ORDER BY id');
    return transformKeys((res.values || []).map(enrichCase));
  } else {
    return transformKeys(mockDb.cases.map(enrichCase));
  }
}

export async function toggleBookmarkCase(id) {
  await initDbConnection();
  const cid = Number(id);
  if (useNative) {
    await dbInstance.run('UPDATE cases SET bookmarked = 1 - bookmarked WHERE id = ?', [cid]);
    const res = await dbInstance.query('SELECT * FROM cases WHERE id = ?', [cid]);
    return transformKeys(enrichCase(res.values[0]));
  } else {
    const c = mockDb.cases.find(x => x.id === cid);
    if (c) {
      c.bookmarked = c.bookmarked === 1 ? 0 : 1;
      saveMockDb();
    }
    return transformKeys(enrichCase(c));
  }
}

export async function getBadges() {
  await initDbConnection();
  if (useNative) {
    const res = await dbInstance.query('SELECT * FROM badges ORDER BY id');
    return transformKeys(res.values || []);
  } else {
    return transformKeys(mockDb.badges);
  }
}

export async function getQuote() {
  await initDbConnection();
  if (useNative) {
    const res = await dbInstance.query('SELECT * FROM daily_quotes LIMIT 1');
    return transformKeys(res.values[0] || null);
  } else {
    return transformKeys(mockDb.daily_quotes[0] || null);
  }
}

export async function getMilestones() {
  await initDbConnection();
  if (useNative) {
    const res = await dbInstance.query('SELECT * FROM milestones ORDER BY target_date');
    return transformKeys(res.values || []);
  } else {
    return transformKeys(mockDb.milestones);
  }
}

export async function createMilestone(data) {
  await initDbConnection();
  const { title, targetDate, description } = data;
  if (useNative) {
    await dbInstance.run('INSERT INTO milestones (title, target_date, description) VALUES (?, ?, ?)', [title, targetDate, description || '']);
    const lastIdRes = await dbInstance.query('SELECT last_insert_rowid() as id');
    const lastId = lastIdRes.values[0].id;
    const res = await dbInstance.query('SELECT * FROM milestones WHERE id = ?', [lastId]);
    return transformKeys(res.values[0]);
  } else {
    const milestone = {
      id: mockDb.milestones.length + 1,
      user_id: 1,
      title,
      target_date: targetDate,
      description: description || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockDb.milestones.push(milestone);
    saveMockDb();
    return transformKeys(milestone);
  }
}

export async function updateMilestone(id, data) {
  await initDbConnection();
  const mid = Number(id);
  const { title, targetDate, description } = data;
  if (useNative) {
    await dbInstance.run(
      'UPDATE milestones SET title = COALESCE(?, title), target_date = COALESCE(?, target_date), description = COALESCE(?, description), updated_at = datetime("now") WHERE id = ?',
      [title ?? null, targetDate ?? null, description ?? null, mid]
    );
    const res = await dbInstance.query('SELECT * FROM milestones WHERE id = ?', [mid]);
    return transformKeys(res.values[0]);
  } else {
    const milestone = mockDb.milestones.find(m => m.id === mid);
    if (milestone) {
      if (title !== undefined) milestone.title = title;
      if (targetDate !== undefined) milestone.target_date = targetDate;
      if (description !== undefined) milestone.description = description;
      milestone.updated_at = new Date().toISOString();
      saveMockDb();
    }
    return transformKeys(milestone);
  }
}

export async function deleteMilestone(id) {
  await initDbConnection();
  const mid = Number(id);
  if (useNative) {
    await dbInstance.run('DELETE FROM milestones WHERE id = ?', [mid]);
    return { success: true };
  } else {
    mockDb.milestones = mockDb.milestones.filter(m => m.id !== mid);
    saveMockDb();
    return { success: true };
  }
}

export async function getQuizCourses() {
  await initDbConnection();
  if (useNative) {
    const res = await dbInstance.query(`
      SELECT c.id, c.name, c.type, c.color, c.icon,
             (SELECT COUNT(DISTINCT qq.topic_id) FROM quiz_questions qq WHERE qq.topic_id IN (
                SELECT t.id FROM topics t WHERE t.course_id = c.id
             )) as question_topic_count
      FROM courses c
      ORDER BY c.id
    `);
    return transformKeys(res.values || []);
  } else {
    const coursesRes = mockDb.courses.map(c => {
      const topicIds = mockDb.topics.filter(t => t.course_id === c.id).map(t => t.id);
      const questionTopicCount = new Set(mockDb.quiz_questions.filter(q => topicIds.includes(q.topic_id)).map(q => q.topic_id)).size;
      return {
        ...c,
        question_topic_count: questionTopicCount
      };
    });
    return transformKeys(coursesRes);
  }
}

export async function getQuizTopics(courseId) {
  await initDbConnection();
  const cid = Number(courseId);
  if (useNative) {
    const res = await dbInstance.query(`
      SELECT t.id, t.name,
             (SELECT COUNT(*) FROM quiz_questions qq WHERE qq.topic_id = t.id) as question_count
      FROM topics t
      WHERE t.course_id = ?
      ORDER BY t.id
    `, [cid]);
    return transformKeys(res.values || []);
  } else {
    const res = mockDb.topics.filter(t => t.course_id === cid).map(t => {
      const questionCount = mockDb.quiz_questions.filter(q => q.topic_id === t.id).length;
      return {
        id: t.id,
        name: t.name,
        question_count: questionCount
      };
    });
    return transformKeys(res);
  }
}

export async function getQuizSession(topicId) {
  await initDbConnection();
  const tid = Number(topicId);
  if (useNative) {
    const scenariosRes = await dbInstance.query('SELECT id, text, order_index FROM quiz_scenarios WHERE topic_id = ? ORDER BY order_index', [tid]);
    const questionsRes = await dbInstance.query('SELECT id, scenario_id, blank_number, prompt, options, order_index FROM quiz_questions WHERE topic_id = ? ORDER BY order_index', [tid]);
    
    const safeQuestions = (questionsRes.values || []).map(q => ({
      id: q.id,
      scenario_id: q.scenario_id,
      blank_number: q.blank_number,
      prompt: q.prompt,
      options: safeJson(q.options),
      order_index: q.order_index
    }));

    return transformKeys({ scenarios: scenariosRes.values || [], questions: safeQuestions });
  } else {
    const scenarios = mockDb.quiz_scenarios.filter(s => s.topic_id === tid).sort((a, b) => a.order_index - b.order_index);
    const questions = mockDb.quiz_questions.filter(q => q.topic_id === tid).sort((a, b) => a.order_index - b.order_index).map(q => ({
      id: q.id,
      scenario_id: q.scenario_id,
      blank_number: q.blank_number,
      prompt: q.prompt,
      options: safeJson(q.options),
      order_index: q.order_index
    }));

    return transformKeys({ scenarios, questions });
  }
}

export async function startQuizAttempt(data) {
  await initDbConnection();
  const { topicId, secondsPerQuestion, questionOrder, numQuestions } = data;
  const tid = Number(topicId);
  const seconds = Math.min(30, Math.max(10, secondsPerQuestion || 20));
  const order = questionOrder === 'shuffled' ? 'shuffled' : 'sequential';

  let questionIds = [];
  let courseId = 0;

  if (useNative) {
    const topicRes = await dbInstance.query("SELECT course_id FROM topics WHERE id = ?", [tid]);
    if (!topicRes.values || !topicRes.values[0]) throw new Error("Topic not found");
    courseId = topicRes.values[0].course_id;

    const questionsRes = await dbInstance.query("SELECT id FROM quiz_questions WHERE topic_id = ? ORDER BY order_index", [tid]);
    questionIds = (questionsRes.values || []).map(q => q.id);
  } else {
    const topic = mockDb.topics.find(t => t.id === tid);
    if (!topic) throw new Error("Topic not found");
    courseId = topic.course_id;

    questionIds = mockDb.quiz_questions.filter(q => q.topic_id === tid).sort((a, b) => a.order_index - b.order_index).map(q => q.id);
  }

  if (questionIds.length === 0) {
    throw new Error("No questions available for this topic");
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

  if (useNative) {
    await dbInstance.run(`
      INSERT INTO quiz_attempts (user_id, topic_id, course_id, seconds_per_question, question_order, num_questions, total_count)
      VALUES (1, ?, ?, ?, ?, ?, ?)
    `, [tid, courseId, seconds, order, cap, cap]);
    
    const lastIdRes = await dbInstance.query('SELECT last_insert_rowid() as id');
    const attemptId = lastIdRes.values[0].id;

    return transformKeys({
      attempt_id: attemptId,
      question_ids: questionIds,
      seconds_per_question: seconds
    });
  } else {
    const attemptId = mockDb.quiz_attempts.length + 1;
    const attempt = {
      id: attemptId,
      user_id: 1,
      topic_id: tid,
      course_id: courseId,
      seconds_per_question: seconds,
      question_order: order,
      num_questions: cap,
      correct_count: 0,
      total_count: cap,
      started_at: new Date().toISOString(),
      completed_at: null
    };
    mockDb.quiz_attempts.push(attempt);
    saveMockDb();

    return transformKeys({
      attempt_id: attemptId,
      question_ids: questionIds,
      seconds_per_question: seconds
    });
  }
}

export async function submitQuizAnswer(attemptId, data) {
  await initDbConnection();
  const aid = Number(attemptId);
  const { questionId, selectedIndex, timeTakenSeconds } = data;
  const qid = Number(questionId);

  let correctIndex = 0;
  if (useNative) {
    const attemptRes = await dbInstance.query("SELECT id, completed_at FROM quiz_attempts WHERE id = ?", [aid]);
    if (!attemptRes.values || !attemptRes.values[0]) throw new Error("Attempt not found");
    if (attemptRes.values[0].completed_at) throw new Error("Attempt already completed");

    const questionRes = await dbInstance.query("SELECT correct_index FROM quiz_questions WHERE id = ?", [qid]);
    if (!questionRes.values || !questionRes.values[0]) throw new Error("Question not found");
    correctIndex = questionRes.values[0].correct_index;

    const isCorrect = selectedIndex !== null && selectedIndex !== undefined && selectedIndex === correctIndex ? 1 : 0;

    await dbInstance.run(`
      INSERT INTO quiz_attempt_answers (attempt_id, question_id, selected_index, is_correct, time_taken_seconds)
      VALUES (?, ?, ?, ?, ?)
    `, [aid, qid, selectedIndex ?? null, isCorrect, timeTakenSeconds ?? null]);

  } else {
    const attempt = mockDb.quiz_attempts.find(a => a.id === aid);
    if (!attempt) throw new Error("Attempt not found");
    if (attempt.completed_at) throw new Error("Attempt already completed");

    const question = mockDb.quiz_questions.find(q => q.id === qid);
    if (!question) throw new Error("Question not found");
    correctIndex = question.correct_index;

    const isCorrect = selectedIndex !== null && selectedIndex !== undefined && selectedIndex === correctIndex ? 1 : 0;

    mockDb.quiz_attempt_answers.push({
      id: mockDb.quiz_attempt_answers.length + 1,
      attempt_id: aid,
      question_id: qid,
      selected_index: selectedIndex ?? null,
      is_correct: isCorrect,
      time_taken_seconds: timeTakenSeconds ?? null
    });
    saveMockDb();
  }

  return { recorded: true };
}

export async function completeQuizAttempt(attemptId) {
  await initDbConnection();
  const aid = Number(attemptId);

  let attempt = null;
  let answers = [];
  if (useNative) {
    const attRes = await dbInstance.query("SELECT * FROM quiz_attempts WHERE id = ?", [aid]);
    attempt = attRes.values[0];
    if (!attempt) throw new Error("Attempt not found");
    if (attempt.completed_at) throw new Error("Attempt already completed");

    const ansRes = await dbInstance.query("SELECT * FROM quiz_attempt_answers WHERE attempt_id = ? ORDER BY id", [aid]);
    answers = ansRes.values || [];
  } else {
    attempt = mockDb.quiz_attempts.find(a => a.id === aid);
    if (!attempt) throw new Error("Attempt not found");
    if (attempt.completed_at) throw new Error("Attempt already completed");

    answers = mockDb.quiz_attempt_answers.filter(ans => ans.attempt_id === aid).sort((a, b) => a.id - b.id);
  }

  const correctCount = answers.filter(a => a.is_correct === 1).length;
  const totalCount = answers.length;
  const scorePct = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
  
  let rating;
  if (scorePct >= 80) rating = 'got_it';
  else if (scorePct >= 40) rating = 'shaky';
  else rating = 'forgot';

  if (useNative) {
    await dbInstance.run(`
      UPDATE quiz_attempts SET completed_at = datetime('now'), correct_count = ?, total_count = ?
      WHERE id = ?
    `, [correctCount, totalCount, aid]);

    await dbInstance.run(`
      INSERT INTO activity_log (user_id, type, topic_id, amount, created_at)
      VALUES (1, 'revision_session', ?, 1, datetime('now'))
    `, [attempt.topic_id]);

    const topicRes = await dbInstance.query("SELECT review_interval_days FROM topics WHERE id = ?", [attempt.topic_id]);
    const topic = topicRes.values[0];
    let newInterval = topic ? (topic.review_interval_days || 1) : 1;
    if (rating === 'got_it') {
      newInterval = Math.min(30, newInterval * 2 + 1);
    } else if (rating === 'forgot') {
      newInterval = 1;
    }

    await dbInstance.run(`
      UPDATE topics SET last_reviewed_at = datetime('now'), review_interval_days = ?, updated_at = datetime('now')
      WHERE id = ?
    `, [newInterval, attempt.topic_id]);

    // Build review payload
    const reviewQuestionsRes = await dbInstance.query(`
      SELECT qq.id, qq.scenario_id, qq.blank_number, qq.prompt, qq.options, qq.correct_index, qq.explanation, qq.order_index
      FROM quiz_questions qq
      WHERE qq.id IN (SELECT question_id FROM quiz_attempt_answers WHERE attempt_id = ?)
      ORDER BY qq.order_index
    `, [aid]);

    const scenariosRes = await dbInstance.query(`
      SELECT id, text, order_index FROM quiz_scenarios WHERE topic_id = ? ORDER BY order_index
    `, [attempt.topic_id]);

    const answerMap = {};
    for (const a of answers) answerMap[a.question_id] = a;

    const questionsReview = (reviewQuestionsRes.values || []).map(q => ({
      id: q.id,
      scenario_id: q.scenario_id,
      blank_number: q.blank_number,
      prompt: q.prompt,
      options: safeJson(q.options),
      correct_index: q.correct_index,
      explanation: q.explanation,
      order_index: q.order_index,
      selected_index: answerMap[q.id] ? answerMap[q.id].selected_index : null,
      is_correct: answerMap[q.id] ? answerMap[q.id].is_correct : 0,
      time_taken_seconds: answerMap[q.id] ? answerMap[q.id].time_taken_seconds : null
    }));

    return transformKeys({
      attempt_id: aid,
      correct_count: correctCount,
      total_count: totalCount,
      score_percent: Math.round(scorePct),
      rating,
      scenarios: scenariosRes.values || [],
      questions: questionsReview
    });
  } else {
    // Mock
    attempt.completed_at = new Date().toISOString();
    attempt.correct_count = correctCount;
    attempt.total_count = totalCount;

    mockDb.activity_log.push({
      id: mockDb.activity_log.length + 1,
      user_id: 1,
      type: 'revision_session',
      topic_id: attempt.topic_id,
      goal_id: null,
      amount: 1,
      created_at: new Date().toISOString()
    });

    const topic = mockDb.topics.find(t => t.id === attempt.topic_id);
    let newInterval = topic ? (topic.review_interval_days || 1) : 1;
    if (rating === 'got_it') {
      newInterval = Math.min(30, newInterval * 2 + 1);
    } else if (rating === 'forgot') {
      newInterval = 1;
    }
    if (topic) {
      topic.review_interval_days = newInterval;
      topic.last_reviewed_at = new Date().toISOString();
      topic.updated_at = new Date().toISOString();
    }

    const scenarios = mockDb.quiz_scenarios.filter(s => s.topic_id === attempt.topic_id).sort((a, b) => a.order_index - b.order_index);
    const qids = answers.map(a => a.question_id);
    const reviewQuestions = mockDb.quiz_questions.filter(q => qids.includes(q.id)).sort((a, b) => a.order_index - b.order_index);

    const answerMap = {};
    for (const a of answers) answerMap[a.question_id] = a;

    const questionsReview = reviewQuestions.map(q => ({
      id: q.id,
      scenario_id: q.scenario_id,
      blank_number: q.blank_number,
      prompt: q.prompt,
      options: safeJson(q.options),
      correct_index: q.correct_index,
      explanation: q.explanation,
      order_index: q.order_index,
      selected_index: answerMap[q.id] ? answerMap[q.id].selected_index : null,
      is_correct: answerMap[q.id] ? answerMap[q.id].is_correct : 0,
      time_taken_seconds: answerMap[q.id] ? answerMap[q.id].time_taken_seconds : null
    }));

    saveMockDb();

    return transformKeys({
      attempt_id: aid,
      correct_count: correctCount,
      total_count: totalCount,
      score_percent: Math.round(scorePct),
      rating,
      scenarios,
      questions: questionsReview
    });
  }
}

export async function getStudyNotes(topicId) {
  await initDbConnection();
  const tid = Number(topicId);
  if (useNative) {
    const res = await dbInstance.query('SELECT * FROM study_notes WHERE topic_id = ? ORDER BY id', [tid]);
    return transformKeys(res.values || []);
  } else {
    return transformKeys(mockDb.study_notes.filter(sn => sn.topic_id === tid));
  }
}

export async function createStudyNote(topicId, data) {
  await initDbConnection();
  const tid = Number(topicId);
  const { type, page, text, color, paragraph, anchorText } = data;

  if (useNative) {
    await dbInstance.run(
      `INSERT INTO study_notes (topic_id, type, page, text, color, paragraph, anchor_text)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [tid, type || 'note', page || 1, text, color || '', paragraph ?? null, anchorText || '']
    );
    const lastIdRes = await dbInstance.query('SELECT last_insert_rowid() as id');
    const lastId = lastIdRes.values[0].id;
    const res = await dbInstance.query('SELECT * FROM study_notes WHERE id = ?', [lastId]);
    return transformKeys(res.values[0]);
  } else {
    const newNote = {
      id: mockDb.study_notes.length + 1,
      topic_id: tid,
      user_id: 1,
      type: type || 'note',
      page: page || 1,
      text,
      color: color || '',
      paragraph: paragraph ?? null,
      anchor_text: anchorText || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockDb.study_notes.push(newNote);
    saveMockDb();
    return transformKeys(newNote);
  }
}

export async function updateStudyNote(id, text) {
  await initDbConnection();
  const nid = Number(id);
  if (useNative) {
    await dbInstance.run('UPDATE study_notes SET text = ?, updated_at = datetime("now") WHERE id = ?', [text, nid]);
    const res = await dbInstance.query('SELECT * FROM study_notes WHERE id = ?', [nid]);
    return transformKeys(res.values[0]);
  } else {
    const note = mockDb.study_notes.find(n => n.id === nid);
    if (note) {
      note.text = text;
      note.updated_at = new Date().toISOString();
      saveMockDb();
    }
    return transformKeys(note);
  }
}

export async function deleteStudyNote(id) {
  await initDbConnection();
  const nid = Number(id);
  if (useNative) {
    await dbInstance.run('DELETE FROM study_notes WHERE id = ?', [nid]);
    return { success: true };
  } else {
    mockDb.study_notes = mockDb.study_notes.filter(n => n.id !== nid);
    saveMockDb();
    return { success: true };
  }
}

export async function getMaterials(topicId) {
  await initDbConnection();
  const tid = Number(topicId);
  if (useNative) {
    const res = await dbInstance.query('SELECT * FROM materials WHERE topic_id = ? ORDER BY id DESC', [tid]);
    // Convert paths to web URLs if native
    const mats = (res.values || []).map(m => ({
      ...m,
      filepath: m.filepath ? Capacitor.convertFileSrc(m.filepath) : ''
    }));
    return transformKeys(mats);
  } else {
    return transformKeys(mockDb.materials.filter(m => m.topic_id === tid));
  }
}

export async function addMaterial(topicId, originalName, storedName, mimeType, sizeBytes, filepath) {
  await initDbConnection();
  const tid = Number(topicId);
  if (useNative) {
    await dbInstance.run(
      `INSERT INTO materials (topic_id, original_name, stored_name, mime_type, size_bytes, filepath)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tid, originalName, storedName, mimeType, sizeBytes, filepath]
    );
    await dbInstance.run("UPDATE topics SET has_materials = 1, updated_at = datetime('now') WHERE id = ?", [tid]);
    const lastIdRes = await dbInstance.query('SELECT last_insert_rowid() as id');
    const lastId = lastIdRes.values[0].id;
    const res = await dbInstance.query('SELECT * FROM materials WHERE id = ?', [lastId]);
    const m = res.values[0];
    return transformKeys({
      ...m,
      filepath: m.filepath ? Capacitor.convertFileSrc(m.filepath) : ''
    });
  } else {
    const newMat = {
      id: mockDb.materials.length + 1,
      topic_id: tid,
      user_id: 1,
      original_name: originalName,
      stored_name: storedName,
      mime_type: mimeType,
      size_bytes: sizeBytes,
      filepath: filepath,
      created_at: new Date().toISOString()
    };
    mockDb.materials.push(newMat);
    const topic = mockDb.topics.find(t => t.id === tid);
    if (topic) {
      topic.has_materials = 1;
      topic.updated_at = new Date().toISOString();
    }
    saveMockDb();
    return transformKeys(newMat);
  }
}

export async function deleteMaterial(id) {
  await initDbConnection();
  const mid = Number(id);
  if (useNative) {
    const matRes = await dbInstance.query('SELECT * FROM materials WHERE id = ?', [mid]);
    const mat = matRes.values[0];
    if (mat) {
      // Delete local file if it exists
      try {
        if (mat.filepath) {
          const pathOnly = mat.filepath.replace('file://', '');
          await Filesystem.deleteFile({
            path: pathOnly
          });
        }
      } catch (e) {
        console.warn("Could not delete physical file:", e);
      }
      await dbInstance.run('DELETE FROM materials WHERE id = ?', [mid]);
      // Update has_materials if no materials left
      const leftRes = await dbInstance.query('SELECT COUNT(*) as cnt FROM materials WHERE topic_id = ?', [mat.topic_id]);
      if (leftRes.values[0].cnt === 0) {
        await dbInstance.run("UPDATE topics SET has_materials = 0 WHERE id = ?", [mat.topic_id]);
      }
    }
    return { success: true };
  } else {
    const mat = mockDb.materials.find(m => m.id === mid);
    if (mat) {
      mockDb.materials = mockDb.materials.filter(m => m.id !== mid);
      const left = mockDb.materials.filter(m => m.topic_id === mat.topic_id);
      if (left.length === 0) {
        const topic = mockDb.topics.find(t => t.id === mat.topic_id);
        if (topic) topic.has_materials = 0;
      }
      saveMockDb();
    }
    return { success: true };
  }
}

export async function getSummaries() {
  await initDbConnection();
  // personal summaries are derived from study_notes of type='summary' or similar, OR summaries table
  // Original web endpoint: GET /summaries
  // Sourced from study_notes + topics
  if (useNative) {
    const res = await dbInstance.query(`
      SELECT sn.topic_id, t.name as topic_name, c.name as course_name, c.id as course_id,
             sn.text as summary_body, COUNT(sn.id) as highlight_count
      FROM study_notes sn
      JOIN topics t ON sn.topic_id = t.id
      JOIN courses c ON t.course_id = c.id
      WHERE sn.type = 'summary' OR sn.type = 'note'
      GROUP BY sn.topic_id
    `);
    return transformKeys(res.values || []);
  } else {
    // Mock derivation
    const notesByTopic = {};
    mockDb.study_notes.forEach(n => {
      if (!notesByTopic[n.topic_id]) notesByTopic[n.topic_id] = [];
      notesByTopic[n.topic_id].push(n);
    });

    const summariesList = [];
    for (const [topicIdStr, notes] of Object.entries(notesByTopic)) {
      const topicId = Number(topicIdStr);
      const topic = mockDb.topics.find(t => t.id === topicId);
      if (!topic) continue;
      const course = mockDb.courses.find(c => c.id === topic.course_id);

      summariesList.push({
        topic_id: topicId,
        topic_name: topic.name,
        course_name: course ? course.name : '',
        course_id: topic.course_id,
        summary_body: notes[0] ? notes[0].text : '',
        highlight_count: notes.length
      });
    }
    return transformKeys(summariesList);
  }
}
