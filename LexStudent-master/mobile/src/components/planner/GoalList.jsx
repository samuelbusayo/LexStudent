import React from 'react';
import GoalCard from './GoalCard';

export default function GoalList({ goals }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
      {(goals || []).map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </div>
  );
}
