export default function Badges({ badges }) {
  return (
    <section className="bg-white rounded-xl p-stack-md border border-[#E0E0D0] flex flex-col gap-stack-md">
      <div className="flex justify-between items-center">
        <h3 className="font-h3 text-h3 text-primary-container">Badges</h3>
        <span className="material-symbols-outlined text-secondary">military_tech</span>
      </div>
      <div className="flex flex-wrap gap-stack-sm">
        {(badges || []).map((badge) =>
          badge.earned ? (
            <div
              key={badge.id}
              className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shadow-sm"
              title={badge.name}
            >
              <span className="material-symbols-outlined">{badge.icon}</span>
            </div>
          ) : (
            <div
              key={badge.id}
              className="w-12 h-12 rounded-full bg-surface-container border border-[#E0E0D0] flex items-center justify-center text-outline opacity-40 shadow-sm"
              title="Locked Achievement"
            >
              <span className="material-symbols-outlined">lock</span>
            </div>
          )
        )}
      </div>
    </section>
  );
}
