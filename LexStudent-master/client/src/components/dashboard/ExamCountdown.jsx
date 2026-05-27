export default function ExamCountdown({ countdown }) {
  return (
    <section className="md:col-span-12 bg-white rounded-xl p-stack-lg border border-[#E0E0D0] shadow-[0_4px_6px_-1px_rgba(0,33,71,0.08)] flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
      <div className="z-10 text-center md:text-left">
        <p className="font-label-caps text-label-caps text-secondary mb-unit">UPCOMING MILESTONE</p>
        <h2 className="font-h1 text-h1 text-primary-container mb-unit">{countdown?.title || 'Bar Finals'}</h2>
        <p className="font-body-md text-body-md text-outline">Intensive preparation phase active</p>
      </div>
      <div className="mt-stack-md md:mt-0 z-10 flex flex-col items-center">
        <span className="font-h1 text-[64px] leading-none font-extrabold text-secondary tracking-tighter">{countdown?.daysRemaining ?? 42}</span>
        <span className="font-label-caps text-label-caps text-primary-container">DAYS REMAINING</span>
      </div>
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>
    </section>
  );
}
