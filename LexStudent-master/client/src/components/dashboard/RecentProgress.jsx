export default function RecentProgress({ recent }) {
  const dotClass = (type) => {
    if (type === 'READ' || type === 'completed') return 'bg-secondary';
    if (type === 'PENDING' || type === 'pending') return 'bg-[#002147]/20';
    return 'border border-outline';
  };

  return (
    <section className="bg-white rounded-xl p-stack-md border border-[#E0E0D0] flex flex-col gap-stack-md h-fit">
      <h3 className="font-h3 text-h3 text-primary-container">Recent Progress</h3>
      <div className="space-y-4">
        {(recent || []).slice(0, 3).map((item, i) => (
          <div key={item.id || i} className="flex items-start gap-stack-sm">
            <div className={`mt-1 w-2 h-2 rounded-full ${dotClass(item.type)}`}></div>
            <div>
              <p className="font-label-caps text-label-caps text-outline">{item.type}</p>
              <p className="font-body-md text-body-md text-primary-container">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-unit w-full py-3 bg-primary-container text-white rounded-xl font-button text-button hover:opacity-90 transition-opacity active:scale-95 duration-150">
        View Study History
      </button>
    </section>
  );
}
