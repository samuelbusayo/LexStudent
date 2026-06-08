import * as db from './db';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

const routes = {
  GET: [
    {
      pattern: /^\/auth\/me$/,
      handler: async () => db.getCurrentUser()
    },
    {
      pattern: /^\/courses$/,
      handler: async () => db.getCourses()
    },
    {
      pattern: /^\/courses\/(\d+)$/,
      handler: async (match) => db.getCourse(match[1])
    },
    {
      pattern: /^\/courses\/(\d+)\/topics$/,
      handler: async (match) => db.getTopics(match[1])
    },
    {
      pattern: /^\/goals$/,
      handler: async () => db.getGoals()
    },
    {
      pattern: /^\/progress\/overall$/,
      handler: async () => db.getOverallProgress()
    },
    {
      pattern: /^\/progress\/recent$/,
      handler: async () => db.getRecentProgress()
    },
    {
      pattern: /^\/progress\/streak$/,
      handler: async () => db.getStreak()
    },
    {
      pattern: /^\/progress\/gaps$/,
      handler: async () => db.getKnowledgeGaps()
    },
    {
      pattern: /^\/progress\/heatmap$/,
      handler: async () => db.getHeatmap()
    },
    {
      pattern: /^\/reminders$/,
      handler: async () => db.getReminders()
    },
    {
      pattern: /^\/cases$/,
      handler: async (match, config) => {
        const tag = config?.params?.tag;
        const allCases = await db.getCases();
        if (tag) {
          return allCases.filter(c => {
            let tags = [];
            try {
              tags = typeof c.tags === 'string' ? JSON.parse(c.tags || '[]') : c.tags;
            } catch (e) {}
            return Array.isArray(tags) && tags.includes(tag);
          });
        }
        return allCases;
      }
    },
    {
      pattern: /^\/cases\/featured$/,
      handler: async () => {
        const allCases = await db.getCases();
        return allCases.find(c => c.isFeatured === 1) || allCases[0] || null;
      }
    },
    {
      pattern: /^\/cases\/tags$/,
      handler: async () => {
        const allCases = await db.getCases();
        const tagSet = new Set();
        allCases.forEach(c => {
          try {
            const tags = typeof c.tags === 'string' ? JSON.parse(c.tags || '[]') : c.tags;
            if (Array.isArray(tags)) {
              tags.forEach(t => tagSet.add(t));
            }
          } catch (e) {}
        });
        return Array.from(tagSet);
      }
    },
    {
      pattern: /^\/badges$/,
      handler: async () => db.getBadges()
    },
    {
      pattern: /^\/badges\/quote$/,
      handler: async () => db.getQuote()
    },
    {
      pattern: /^\/badges\/milestone$/,
      handler: async () => {
        const milestones = await db.getMilestones();
        return milestones[0] || null;
      }
    },
    {
      pattern: /^\/quiz\/courses$/,
      handler: async () => db.getQuizCourses()
    },
    {
      pattern: /^\/quiz\/courses\/(\d+)\/topics$/,
      handler: async (match) => db.getQuizTopics(match[1])
    },
    {
      pattern: /^\/quiz\/topics\/(\d+)\/session$/,
      handler: async (match) => db.getQuizSession(match[1])
    },
    {
      pattern: /^\/study-notes\/(\d+)$/,
      handler: async (match) => db.getStudyNotes(match[1])
    },
    {
      pattern: /^\/materials\/(\d+)$/,
      handler: async (match) => db.getMaterials(match[1])
    },
    {
      pattern: /^\/summaries$/,
      handler: async () => db.getSummaries()
    }
  ],
  POST: [
    {
      pattern: /^\/auth\/login$/,
      handler: async (match, data) => db.loginUser(data.email, data.password)
    },
    {
      pattern: /^\/auth\/register$/,
      handler: async (match, data) => db.registerUser(data.name, data.email, data.password)
    },
    {
      pattern: /^\/courses\/(\d+)\/topics$/,
      handler: async (match, data) => db.createTopic(match[1], data.name)
    },
    {
      pattern: /^\/goals$/,
      handler: async (match, data) => db.createGoal(data)
    },
    {
      pattern: /^\/progress\/review$/,
      handler: async (match, data) => db.recordRevisionProgress(data.topicId, data.rating)
    },
    {
      pattern: /^\/badges\/milestone$/,
      handler: async (match, data) => db.createMilestone(data)
    },
    {
      pattern: /^\/quiz\/attempts$/,
      handler: async (match, data) => db.startQuizAttempt(data)
    },
    {
      pattern: /^\/quiz\/attempts\/(\d+)\/answer$/,
      handler: async (match, data) => db.submitQuizAnswer(match[1], data)
    },
    {
      pattern: /^\/quiz\/attempts\/(\d+)\/complete$/,
      handler: async (match) => db.completeQuizAttempt(match[1])
    },
    {
      pattern: /^\/study-notes\/(\d+)$/,
      handler: async (match, data) => db.createStudyNote(match[1], data)
    },
    {
      pattern: /^\/materials\/upload\/(\d+)$/,
      handler: async (match, data) => {
        const file = data.get('file');
        if (!file) throw new Error("No file uploaded");
        
        let filepath = '';
        if (Capacitor.isNativePlatform()) {
          const reader = new FileReader();
          const p = new Promise((resolve, reject) => {
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
              try {
                const base64Data = reader.result.split(',')[1];
                const fileName = `${Date.now()}-${file.name}`;
                const writeResult = await Filesystem.writeFile({
                  path: `materials/${fileName}`,
                  data: base64Data,
                  directory: Directory.Data,
                  recursive: true
                });
                resolve(writeResult.uri);
              } catch (err) {
                reject(err);
              }
            };
          });
          filepath = await p;
        } else {
          filepath = URL.createObjectURL(file);
        }

        return db.addMaterial(match[1], file.name, file.name, file.type, file.size, filepath);
      }
    }
  ],
  PUT: [
    {
      pattern: /^\/courses\/(\d+)\/topics\/(\d+)\/progress$/,
      handler: async (match, data) => db.updateTopicProgress(match[1], match[2], data)
    },
    {
      pattern: /^\/goals\/(\d+)$/,
      handler: async (match, data) => db.updateGoal(match[1], data)
    },
    {
      pattern: /^\/goals\/occurrences\/(\d+)$/,
      handler: async (match, data) => db.updateGoalOccurrence(match[1], data)
    },
    {
      pattern: /^\/reminders\/(\d+)\/toggle$/,
      handler: async (match) => db.toggleReminder(match[1])
    },
    {
      pattern: /^\/cases\/(\d+)\/bookmark$/,
      handler: async (match) => db.toggleBookmarkCase(match[1])
    },
    {
      pattern: /^\/badges\/milestone\/(\d+)$/,
      handler: async (match, data) => db.updateMilestone(match[1], data)
    },
    {
      pattern: /^\/study-notes\/(\d+)$/,
      handler: async (match, data) => db.updateStudyNote(match[1], data.text)
    }
  ],
  DELETE: [
    {
      pattern: /^\/courses\/(\d+)\/topics\/(\d+)$/,
      handler: async (match) => db.deleteTopic(match[1], match[2])
    },
    {
      pattern: /^\/goals\/(\d+)$/,
      handler: async (match) => db.deleteGoal(match[1])
    },
    {
      pattern: /^\/badges\/milestone\/(\d+)$/,
      handler: async (match) => db.deleteMilestone(match[1])
    },
    {
      pattern: /^\/study-notes\/(\d+)$/,
      handler: async (match) => db.deleteStudyNote(match[1])
    },
    {
      pattern: /^\/materials\/(\d+)$/,
      handler: async (match) => db.deleteMaterial(match[1])
    }
  ]
};

function resolveRoute(method, url) {
  const list = routes[method] || [];
  for (const r of list) {
    const m = url.match(r.pattern);
    if (m) {
      return { match: m, handler: r.handler };
    }
  }
  return null;
}

const api = {
  defaults: {
    headers: {
      common: {}
    }
  },
  async get(url, config) {
    const cleanedUrl = url.split('?')[0]; // Strip query params for matching
    const route = resolveRoute('GET', cleanedUrl);
    if (route) {
      const data = await route.handler(route.match, config);
      return { data };
    }
    throw new Error(`Offline Mock API Error: GET Route not found: ${url}`);
  },
  async post(url, data, config) {
    const route = resolveRoute('POST', url);
    if (route) {
      const result = await route.handler(route.match, data, config);
      return { data: result };
    }
    throw new Error(`Offline Mock API Error: POST Route not found: ${url}`);
  },
  async put(url, data, config) {
    const route = resolveRoute('PUT', url);
    if (route) {
      const result = await route.handler(route.match, data, config);
      return { data: result };
    }
    throw new Error(`Offline Mock API Error: PUT Route not found: ${url}`);
  },
  async delete(url, config) {
    const route = resolveRoute('DELETE', url);
    if (route) {
      const result = await route.handler(route.match, config);
      return { data: result };
    }
    throw new Error(`Offline Mock API Error: DELETE Route not found: ${url}`);
  }
};

export default api;
export { db };
