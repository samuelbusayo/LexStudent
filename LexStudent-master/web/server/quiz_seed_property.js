import { quizSeedPropertyWK34 } from './quiz_seed_property_wk34.js';
import { quizSeedPropertyWK5 } from './quiz_seed_property_wk5.js';
import { quizSeedPropertyWK67 } from './quiz_seed_property_wk67.js';
import { quizSeedPropertyWK910 } from './quiz_seed_property_wk910.js';
import { quizSeedPropertyWK1113 } from './quiz_seed_property_wk1113.js';
import { quizSeedPropertyWK14 } from './quiz_seed_property_wk14.js';
import { quizSeedPropertyWK1517 } from './quiz_seed_property_wk1517.js';
import { quizSeedPropertyWK1819 } from './quiz_seed_property_wk1819.js';
import { quizSeedPropertyWK20 } from './quiz_seed_property_wk20.js';

export const quizSeedProperty = [
  ...quizSeedPropertyWK34,
  ...quizSeedPropertyWK5,
  ...quizSeedPropertyWK67,
  ...quizSeedPropertyWK910,
  ...quizSeedPropertyWK1113,
  ...quizSeedPropertyWK14,
  ...quizSeedPropertyWK1517,
  ...quizSeedPropertyWK1819,
  ...quizSeedPropertyWK20,
];

import { seedOneTopic } from './quiz_seed.js';

export function seedQuizDataProperty(db) {
  for (const entry of quizSeedProperty) {
    const names = entry.topicNames || [entry.topicName];
    for (const name of names) {
      seedOneTopic(db, entry.courseId, name, entry.scenarios, entry.questions);
    }
  }
}
