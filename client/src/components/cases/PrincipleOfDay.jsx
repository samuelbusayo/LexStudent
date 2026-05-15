import React from 'react';

export default function PrincipleOfDay({ quote }) {
  return (
    <div className="bg-primary text-on-primary rounded-xl p-stack-md shadow-lg">
      <h3 className="font-h3 mb-4 text-secondary-fixed">Principle of the Day</h3>
      <p className="font-body-md mb-4 opacity-90 leading-relaxed text-sm">{quote?.text || 'The Rule of Law requires that people should be able to rely on the law as a guide to their future conduct.'}</p>
      <p className="font-label-caps text-secondary-fixed">&mdash; {quote?.author || 'Lord Bingham'}</p>
    </div>
  );
}
