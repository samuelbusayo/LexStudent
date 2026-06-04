# Quiz Content Implementation Guide

> Handoff document for adding MCQ quiz content to additional topics in LexStudent.

## Architecture Overview

```
web/server/quiz_seed.js          ← ALL quiz content lives here (single source of truth)
web/server/routes/quiz.js        ← API routes (DO NOT modify for content additions)
web/server/schema.sql            ← Tables already created (DO NOT modify)
web/client/src/pages/QuizFlow.jsx ← Quiz UI (DO NOT modify for content additions)
web/client/src/hooks/useQuiz.js   ← React hooks (DO NOT modify for content additions)
desktop/src/pages/QuizFlow.tsx    ← Desktop mirror (DO NOT modify for content additions)
desktop/src/hooks/useQuiz.ts      ← Desktop hooks (DO NOT modify for content additions)
```

**To add quiz questions for a new topic, you ONLY edit `web/server/quiz_seed.js`.**
No code changes, no schema changes, no route changes, no UI changes.

---

## Critical Constraints

1. **DO NOT modify** any recording/AI files: Rust core, Python sidecar, `tauri-api.ts`, `LiveLectureRecording.tsx`, `LectureNoteEditor.tsx`, `components/recording/*`, `AISettings.tsx`, `FirstRunSetup.tsx`, `MaterialsManager.tsx`, `Settings.tsx`, `AuthContext.tsx`, and `/recording`, `/notes/:noteId`, `/settings` routes.
2. **Keep `user_id = 1`** hardcoded in all queries.
3. **Idempotent seed** — the seeder skips any topic that already has questions in `quiz_questions`. Never delete existing data.
4. **4 options per question** (A/B/C/D) — always exactly 4 strings in the `options` array.
5. **`correct` is a 0-based index** (0 = first option, 3 = last option).
6. **Scenario keys must be unique** within each topic entry.
7. **Topic matching** is by `(courseId, topicName)` — the `topicName` must match the exact string in the `topics` table (from `seed.js`'s `curriculumTopics` map).

---

## How to Add a New Topic's Questions

### Step 1: Find the exact topic name and courseId

Open `web/server/seed.js` and look at the `curriculumTopics` object:

```js
const curriculumTopics = {
  1: [  // courseId 1 = Professional Ethics
    'WK 3: Overview of professional ethics and History of the Legal profession in Nigeria',
    'WK 4: Regulatory Bodies in the Legal profession',
    ...
  ],
  2: [  // courseId 2 = Criminal Litigation
    'WK 3: Introduction to criminal litigation',
    ...
  ],
  3: [  // courseId 3 = Civil Litigation  ...],
  4: [  // courseId 4 = Corporate Law Practice  ...],
  5: [  // courseId 5 = Property Law Practice  ...],
};
```

Copy the **exact** topic name string. Any typo means the seeder won't find the topic and will skip it with a console warning.

### Step 2: Add an entry to the `quizSeed` array

Open `web/server/quiz_seed.js`. The `quizSeed` array has one object per topic. Append a new object:

```js
export const quizSeed = [
  // ... existing entries ...

  {
    courseId: 2,  // Must match the key in curriculumTopics
    topicName: 'WK 3: Introduction to criminal litigation',  // EXACT match

    // Scenarios are OPTIONAL. Omit or use empty array if all questions are standalone.
    scenarios: [
      {
        key: 'arrest-scenario',           // Unique within this topic entry
        text: 'Officer Bello arrested...\n\nThe suspect was held for {{1}} hours before being charged. The arresting officer failed to {{2}} the suspect...',
      },
    ],

    questions: [
      // ── Blank-fill questions (tied to a scenario) ──
      {
        scenario: 'arrest-scenario',      // Must match a scenario key above
        blank: 1,                         // Which {{N}} this question fills
        options: ['24', '48', '72', '12'],// Exactly 4 strings
        correct: 0,                       // 0-based index → '24' is correct
        explanation: 'Section 35(4)...',  // Optional — omit or set to null
      },
      {
        scenario: 'arrest-scenario',
        blank: 2,
        options: ['Inform', 'Caution', 'Search', 'Detain'],
        correct: 1,
      },

      // ── Scenario-linked prompt questions (full question text, tied to a scenario) ──
      {
        scenario: 'arrest-scenario',
        prompt: 'If Officer Bello had obtained a warrant, which of the following would NOT be required?',
        options: ['Sworn information on oath', 'Signature of a magistrate', 'Payment of ₦5,000 fee', 'Reasonable suspicion'],
        correct: 2,
        explanation: 'No fee is required for a warrant.',
      },

      // ── Standalone questions (no scenario) ──
      {
        prompt: 'The maximum period of detention without charge under the Constitution is:',
        options: ['24 hours', '48 hours', '72 hours', 'Indefinite with court order'],
        correct: 1,
        explanation: 'Section 35(5) of the 1999 Constitution.',
      },
    ],
  },
];
```

### Step 3: Restart the server

```bash
cd web && npm run dev
```

The seed runs on startup. Check the console for:
```
[quiz_seed] Seeded 4 questions for "WK 3: Introduction to criminal litigation"
```

If you see a warning like:
```
[quiz_seed] Topic not found: "..." in course 2 — skipping
```
→ The `topicName` doesn't match. Check for typos.

If you see nothing for the topic → it was already seeded (idempotent skip).

### Step 4: Verify via API

```bash
# Check the topic now has questions
curl http://localhost:3001/api/quiz/courses/2/topics

# Check the session data
curl http://localhost:3001/api/quiz/topics/<TOPIC_ID>/session
```

### Step 5: Desktop parity

**No desktop changes needed.** The desktop app uses the same bundled Express server, so new seed data is automatically available. The quiz UI is already fully implemented in `desktop/src/pages/QuizFlow.tsx`.

---

## Question Types Reference

### Type 1: Blank-fill (scenario required)

Fills a `{{N}}` placeholder in a scenario passage. The quiz UI shows "Select the value for blank [N] above." with the corresponding blank chip highlighted in amber.

```js
{
  scenario: 'scenario-key',  // Required — must match a scenario key
  blank: 3,                  // Required — which {{N}} to fill
  options: ['A', 'B', 'C', 'D'],
  correct: 0,                // 0-based index
  explanation: '...',         // Optional
}
```

### Type 2: Scenario-linked prompt

A full question tied to a scenario. The scenario text is displayed alongside.

```js
{
  scenario: 'scenario-key',  // Required
  prompt: 'Which of the following is correct regarding...?',  // Required
  options: ['A', 'B', 'C', 'D'],
  correct: 2,
  explanation: '...',         // Optional
}
```

### Type 3: Standalone

A self-contained question with no scenario.

```js
{
  prompt: 'The purpose of the Legal Practitioners Act is:',  // Required
  options: ['A', 'B', 'C', 'D'],
  correct: 1,
  explanation: '...',         // Optional
}
```

---

## Scenario Text Format

- Use `{{1}}`, `{{2}}`, etc. for blanks. Number them sequentially starting from 1.
- Use `\n\n` for paragraph breaks (the UI renders `whitespace-pre-line`).
- The scenario panel is **sticky** on desktop and **collapsible** on mobile.
- The current blank's chip `[N]` is highlighted in amber with a ring.
- Scenarios without any blanks are valid — they serve as context passages for prompt-style questions.

---

## Ordering Rules

- **Scenarios** are inserted in array order with `order_index = 0, 1, 2, ...`
- **Questions** are inserted in array order with `order_index = 0, 1, 2, ...`
- When the user picks "Sequential" order in the quiz options, questions appear in `order_index` order.
- When the user picks "Shuffled", the server randomizes on attempt creation.
- **Recommendation**: Group blank-fill questions for a scenario together in order (blank 1, blank 2, ...) so sequential mode reads naturally with the passage.

---

## Scoring & Spaced Repetition

On quiz completion, the server automatically:
1. Writes an `activity_log` row of type `revision_session` (feeds streak/heatmap).
2. Maps score to a self-rating equivalent:
   - **≥ 80%** → `got_it` → interval doubles + 1 (capped at 30 days)
   - **40–79%** → `shaky` → interval stays the same
   - **< 40%** → `forgot` → interval resets to 1 day
3. Updates `topics.last_reviewed_at` and `topics.review_interval_days`.

No code changes needed for this — it's all in `POST /quiz/attempts/:id/complete`.

---

## Database Tables (already created — DO NOT modify)

| Table | Purpose |
|---|---|
| `quiz_scenarios` | Passage text with `{{N}}` blanks, linked to `topics(id)` |
| `quiz_questions` | MCQ question: options (JSON array of 4 strings), correct_index, optional scenario/blank link |
| `quiz_attempts` | One per quiz session: settings, score, timestamps |
| `quiz_attempt_answers` | Per-question answer: selected_index, is_correct, time_taken |

---

## Full Course/Topic Reference

| courseId | Course Name | Topics (from seed.js) |
|---|---|---|
| 1 | Professional Ethics | WK 3 through Wk 15 (13 topics) |
| 2 | Criminal Litigation | WK 3 through Wk 17 (15 topics) |
| 3 | Civil Litigation | WK 3 through Wk 17 (15 topics) |
| 4 | Corporate Law Practice | WK 3 through Wk 16 (14 topics) |
| 5 | Property Law Practice | WK 3 through Wk 15 (13 topics) |

Currently seeded with questions: **Course 1, WK 3** only (23 questions, 3 scenarios).

---

## Checklist for Each New Topic

- [ ] `courseId` matches the numeric key in `seed.js`'s `curriculumTopics`
- [ ] `topicName` is an **exact string match** (copy-paste from `seed.js`)
- [ ] Each scenario has a unique `key` string within the entry
- [ ] Blank numbers in scenario text (`{{1}}`, `{{2}}`) match the `blank` field in questions
- [ ] Every question has exactly 4 options
- [ ] `correct` is a valid 0-based index (0, 1, 2, or 3)
- [ ] Server restart shows `[quiz_seed] Seeded N questions for "..."` in console
- [ ] `GET /quiz/courses/<id>/topics` shows the topic with the correct `question_count`
- [ ] Re-running the server a second time does NOT duplicate questions (idempotent check)
- [ ] The quiz is playable end-to-end in the browser: options → quiz → results
