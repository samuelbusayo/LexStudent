import React from 'react';

export default function Tag({ label }) {
  return (
    <span className="inline-block px-2 py-0.5 bg-primary/5 text-primary uppercase text-[10px] font-bold rounded-full">
      {label}
    </span>
  );
}
