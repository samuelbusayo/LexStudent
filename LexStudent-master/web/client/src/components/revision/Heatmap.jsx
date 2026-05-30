import React from 'react';
import { useHeatmap } from '../../hooks/useProgress';

const intensityClass = (v) => {
  if (v === 5) return 'bg-secondary';
  if (v === 4) return 'bg-secondary/80';
  if (v === 3) return 'bg-secondary/60';
  if (v === 2) return 'bg-secondary/40';
  if (v === 1) return 'bg-secondary/20';
  return 'bg-primary-container/5';
};

export default function Heatmap() {
  const { data } = useHeatmap();

  const intensities = data?.intensities || Array(21).fill(0);
  const targetMet = data?.targetMet ?? 0;
  const targetTotal = data?.targetTotal ?? 5;

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E0E0D0] flex flex-col justify-between">
      <div>
        <h3 className="font-h3 text-primary-container mb-4">Revision Intensity</h3>
        <div className="grid grid-cols-7 gap-2">
          {intensities.map((v, i) => (
            <div key={i} className={`aspect-square rounded-sm ${intensityClass(v)}`} />
          ))}
        </div>
      </div>
      <div className="pt-6 border-t border-[#E0E0D0] mt-6">
        <p className="text-body-md font-medium text-primary-container">Target Met</p>
        <p className="text-label-caps text-on-surface-variant">{targetMet}/{targetTotal} Days this week</p>
      </div>
    </div>
  );
}
