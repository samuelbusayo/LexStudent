import { useBadges } from '../hooks/useBadges'
import Badge from '../components/ui/Badge'

export default function Badges() {
  const { data: badges, isLoading } = useBadges()

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-pulse text-on-surface-variant">Loading...</div></div>

  return (
    <div className="max-w-7xl mx-auto px-container-padding pt-stack-md space-y-stack-lg">
      <section className="flex justify-between items-end mb-4">
        <div>
          <h1 className="font-h1 text-h1 text-primary-container">Badges</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Achievements and milestones</p>
        </div>
        <span className="material-symbols-outlined text-secondary text-3xl">military_tech</span>
      </section>

      <section className="bg-white rounded-xl p-stack-lg border border-[#E0E0D0] shadow-sm">
        <div className="flex flex-wrap gap-stack-md">
          {badges?.map(badge => (
            <div key={badge.id} className="flex flex-col items-center gap-2 p-4">
              <Badge name={badge.name} icon={badge.icon} earned={badge.earned} />
              <p className="font-label-caps text-label-caps text-primary-container text-center mt-2">{badge.name}</p>
              <p className="text-[10px] text-on-surface-variant text-center max-w-[120px]">{badge.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
