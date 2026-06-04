// Quiz seed data — append new entries to quizSeed to add questions for more topics.
// Each topic is identified by (courseId, topicName) to map onto existing curriculum topics.
// The seed importer is idempotent: if a topic already has questions, it's skipped.

export const quizSeed = [
  {
    courseId: 1,
    topicName: 'WK 3: Overview of professional ethics and History of the Legal profession in Nigeria',
    scenarios: [
      {
        key: 'history-orientation',
        text:
          'On the first day of your orientation programme at the Nigerian Law School, you were given an assignment to conduct an extensive research on the history of the legal profession in Nigeria. Answer the following questions.\n\n' +
          'From your research, you discovered that the history of the legal profession in Nigeria can be divided into {{1}} stages. ' +
          'The first stage was between {{2}} and the categories of legal practitioners that practiced in Nigeria then did not include {{3}}. ' +
          'You discovered that the license that was given to local attorneys was for a period of {{4}}. ' +
          'There were {{5}} Inns of court in England into which lawyers were admitted which included all but one of the following {{6}}. ' +
          'You quickly listed the deficiencies which an English trained lawyer practicing in Nigeria then encountered being the under listed except {{7}}.\n\n' +
          'In the course of your research, you got to a part dealing with the Unsworth Committee which was established in the year {{8}}. ' +
          "Membership of the Committee did not include {{9}}. At the end of the Committee's deliberations, it came up with a total number of {{10}} recommendations.\n\n" +
          'You were so excited when you got to the part dealing with the Nigerian Law School. The Nigerian Law School was established in {{11}} and commenced activities in {{12}} but full academic course didn\'t take off until {{13}} and graduates from Nigerian Universities were admitted in {{14}}.',
      },
      {
        key: 'jackie-chan',
        text:
          'Professor Jackie Chan, a Chinese man who had taught law in the University of Wuhan for more than 15 years, was invited by Babcock University in January, 2015 as an expatriate to teach the University students International Trade Law. After spending 5 years in Nigeria, Professor Jackie Chan is considering the prospect of being able to practice as a legal practitioner in Nigeria and has called you, as one of his students, to advise him on his eligibility and the procedures he needs to follow to realise his aspirations.',
      },
      {
        key: 'three-practitioners',
        text:
          'Three legal practitioners, Funke Akindele, Olisa Metuh and Kemi Adetiba who are 10, 8 and 7 years respectively at the Bar, decided to set up a law firm and practice together. They rented a big office space at Sterling Towers, Marina Road, Lagos Island and started their law practice together.',
      },
    ],
    questions: [
      // Blank-style questions tied to scenario 'history-orientation'
      { scenario: 'history-orientation', blank: 1,
        options: ['3', '4', '2', '5'], correct: 0,
        explanation: 'The history of the development of the legal profession in Nigeria is divided into three stages: 1876–1914, 1914–1962, and 1962 till date.' },
      { scenario: 'history-orientation', blank: 2,
        options: ['1874 and 1914', '1876 and 1913', '1876 and 1914', '1873 and 1914'], correct: 2 },
      { scenario: 'history-orientation', blank: 3,
        options: ['Professionally trained lawyers', 'Lawyers called to the Nigerian Bar', 'Articled lawyers', 'Local attorneys'], correct: 1,
        explanation: 'There were three categories of lawyers that could practice in Nigeria between 1876 and 1914. During that period it was not possible to be called to a Nigerian Bar because there was no Nigerian Bar.' },
      { scenario: 'history-orientation', blank: 4,
        options: ['3 months renewable for another 3 months', '4 months renewable for another 4 months', '5 months renewable for another 5 months', '6 months renewable for another 6 months'], correct: 3,
        explanation: 'The license granted to local attorneys during the first stage was for 6 months, renewable for another 6 months.' },
      { scenario: 'history-orientation', blank: 5,
        options: ['3', '4', '5', '2'], correct: 1,
        explanation: "There are 4 Inns of Court in England: Lincoln's Inn, Gray's Inn, Inner Temple and Middle Temple." },
      { scenario: 'history-orientation', blank: 6,
        options: ["Queen's Inn", "Lincoln's Inn", 'Inner Temple', "Gray's Inn"], correct: 0 },
      { scenario: 'history-orientation', blank: 7,
        options: [
          'They studied under the Unitary system of government while Nigeria operated Federal system',
          'They studied English cases which were more binding in Nigerian courts',
          'There was lack of appreciation of the local laws in Nigeria',
          'In England, they were trained as either Barristers or solicitors, while there was fusion of both in Nigeria',
        ], correct: 1 },
      { scenario: 'history-orientation', blank: 8,
        options: ['1957', '1958', '1959', '1960'], correct: 2,
        explanation: 'The Unsworth Committee was set up in 1959. The Committee came up with a total of 28 recommendations.' },
      { scenario: 'history-orientation', blank: 9,
        options: ['Legal Secretary of Southern Cameroon', 'Solicitor General of the Federation', '6 distinguished legal practitioners', 'None of the above'], correct: 3 },
      { scenario: 'history-orientation', blank: 10,
        options: ['28', '24', '12', '15'], correct: 0 },
      { scenario: 'history-orientation', blank: 11,
        options: ['1960', '1961', '1962', '1963'], correct: 2 },
      { scenario: 'history-orientation', blank: 12,
        options: ['January 1963', 'March 1963', 'October 1963', 'January 1964'], correct: 0 },
      { scenario: 'history-orientation', blank: 13,
        options: ['1964', '1965', 'Later that same year', 'None of the above'], correct: 2 },
      { scenario: 'history-orientation', blank: 14,
        options: ['1963', '1964', '1965', '1966'], correct: 2 },

      // Scenario 'jackie-chan' full-prompt questions
      { scenario: 'jackie-chan',
        prompt: 'None of the following, except one, is correct:',
        options: [
          'Professor Jackie Chan, having taught law in Nigeria for more than 5 years, is qualified for total exemption from attending the Nigerian Law School',
          'Professor Jackie Chan, having been a professor of law for more than 15 years, is automatically entitled to practice law generally in Nigeria',
          'Professor Jackie Chan, having taught law in Nigeria for more than 5 years, qualifies for partial exemption in the Nigerian Law School',
          'Professor Jackie Chan, having taught law for just 5 years in Nigeria, is not qualified for any exemption from Nigerian Law School',
        ], correct: 3,
        explanation: 'As a foreigner from a non-common-law jurisdiction, he can only be entitled to partial exemption, and only after teaching law in a Nigerian University for more than 10 years.' },
      { scenario: 'jackie-chan',
        prompt: 'Assuming Professor Jackie Chan is a citizen of the United Kingdom, and has taught law for more than 20 years at the University of Cambridge before being invited to Nigeria as an Emeritus Professor to teach law at the University of Ibadan in 2015 and still desires to practice in Nigeria, then:',
        options: [
          'He will be qualified for total exemption from Nigerian Law School',
          'He will be qualified for partial exemption from Nigerian Law School',
          'He will be entitled to practice by virtue of his position as an Emeritus Professor of the Premier University',
          'He does not qualify for exemption from Nigerian Law School',
        ], correct: 1,
        explanation: 'He qualifies for partial exemption because the UK is a common-law jurisdiction and he has taught law in a Nigerian University for 5 years.' },
      { scenario: 'jackie-chan',
        prompt: 'Professor Jackie Chan was accused of raping one of his students and has been charged before the High Court of Oyo State. He seeks to bring in Mr. Harvey Specter, a senior lawyer in the UK, to represent him. Mr. Specter will be able to represent him when granted a warrant by:',
        options: ['The Attorney General of the Federation', 'The Minister of Internal Affairs', 'The President of the Federal Republic of Nigeria', 'The Chief Justice of Nigeria'],
        correct: 3, explanation: 'The warrant is that of the Chief Justice of Nigeria.' },
      { scenario: 'jackie-chan',
        prompt: 'One of the following is not a condition to be fulfilled before the warrant is granted:',
        options: [
          'Mr. Harvey must be qualified to practice in the United Kingdom',
          'The legal system in the United Kingdom must be similar to that of Nigeria',
          'Professor Jackie Chan must have paid the sum of ₦50,000 as application for warrant fee on behalf of Mr. Harvey Specter',
          'None of the above',
        ], correct: 2, explanation: 'The application fee is 50 kobo (₦0.50), not ₦50,000.' },

      // Scenario 'three-practitioners'
      { scenario: 'three-practitioners',
        prompt: 'The three legal practitioners qualified to practice the legal profession in Nigeria when:',
        options: ['They received their qualifying certificates', 'They received their call to bar certificates', 'They were called to the Nigerian Bar', 'They got their names enrolled at the Supreme Court'],
        correct: 3, explanation: "It is not enough to be called to the Nigerian Bar; one's name must also be enrolled to be able to practice generally in Nigeria (see the Legal Practitioners Act)." },
      { scenario: 'three-practitioners',
        prompt: 'The three legal practitioners are qualified to:',
        options: ['Practice generally in Nigeria', 'Practice in Nigeria for the purpose of a particular proceeding', 'Practice by virtue of their office', 'All of the above'],
        correct: 0, explanation: 'Anyone called to the Nigerian Bar and enrolled at the Supreme Court is entitled to practice generally in Nigeria.' },

      // Standalone (no scenario)
      { prompt: 'During dinner at the Nigerian Law School, the correct sitting order for members on the high table is:',
        options: [
          'Principal members of NLS on the first row, members of the Body of Benchers on the second row, other academic staff of NLS on the third row',
          'Principal members of NLS on the first row, other academic staff of NLS on the second row, members of the Body of Benchers on the third row',
          'Members of the Body of Benchers on the first row, principal members of NLS on the second row, other academic staff of NLS on the third row',
          'Members of the Body of Benchers on the first row, other academic staff of NLS on the second row, principal members of NLS on the third row',
        ], correct: 0 },
      { prompt: 'One of the following is not among the categories of persons entitled to practice law in Nigeria under the Legal Practitioners Act Cap L11 2004:',
        options: ['Those entitled to practice by virtue of their office', 'Those entitled to practice with leave of the Court', 'Those entitled to practice for the purpose of particular proceedings', 'Those entitled to practice generally'],
        correct: 1, explanation: 'Section 24 LPA.' },
      { prompt: 'One of the following is not a necessary condition to be fulfilled by aspirants to the Nigerian Bar:',
        options: ['Success at Law School Portfolio Assessment', 'Nigerian Citizenship', 'Good Conduct', 'Success at Bar Part II Examinations'],
        correct: 1, explanation: 'There are Ghanaians and other Africans called to the Nigerian Bar — Nigerian citizenship is not a condition precedent.' },
    ],
  },
];

/**
 * Idempotent quiz seed importer.
 * Looks up topics by (courseId, topicName); skips if not found or already has questions.
 */
export function seedQuizData(db) {
  for (const entry of quizSeed) {
    const topic = db.prepare(
      'SELECT id FROM topics WHERE course_id = ? AND name = ?'
    ).get(entry.courseId, entry.topicName);

    if (!topic) {
      console.warn(`[quiz_seed] Topic not found: "${entry.topicName}" in course ${entry.courseId} — skipping`);
      continue;
    }

    // Check if this topic already has questions (idempotent)
    const existingCount = db.prepare(
      'SELECT COUNT(*) as cnt FROM quiz_questions WHERE topic_id = ?'
    ).get(topic.id);
    if (existingCount.cnt > 0) {
      continue; // Already seeded
    }

    // Build a map of scenario key -> inserted scenario id
    const scenarioMap = {};
    if (entry.scenarios) {
      const insertScenario = db.prepare(
        'INSERT INTO quiz_scenarios (topic_id, text, order_index) VALUES (?, ?, ?)'
      );
      entry.scenarios.forEach((s, idx) => {
        const info = insertScenario.run(topic.id, s.text, idx);
        scenarioMap[s.key] = info.lastInsertRowid;
      });
    }

    // Insert questions
    const insertQuestion = db.prepare(
      `INSERT INTO quiz_questions (topic_id, scenario_id, blank_number, prompt, options, correct_index, explanation, order_index)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    entry.questions.forEach((q, idx) => {
      const scenarioId = q.scenario ? (scenarioMap[q.scenario] || null) : null;
      insertQuestion.run(
        topic.id,
        scenarioId,
        q.blank || null,
        q.prompt || null,
        JSON.stringify(q.options),
        q.correct,
        q.explanation || null,
        idx
      );
    });

    console.log(`[quiz_seed] Seeded ${entry.questions.length} questions for "${entry.topicName}"`);
  }
}
