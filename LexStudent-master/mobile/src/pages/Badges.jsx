import { useNavigate } from 'react-router-dom'
import { useBadges } from '../hooks/useBadges'
import Badge from '../components/ui/Badge'

export default function Badges() {
  const { data: badges, isLoading } = useBadges()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="space-y-stack-md">
        <div className="skeleton h-10 w-1/2 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="grid grid-cols-3 gap-stack-md mt-stack-lg">
          {Array(6).fill(0).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-stack-lg">
      {/* Header */}
      <section>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-on-surface-variant font-body-md text-sm mb-stack-sm active:opacity-60">
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-h1 text-h1 text-primary-container">Badges</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Achievements and milestones</p>
          </div>
          <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
        </div>
      </section>

      {/* Badges Grid */}
      <section className="bg-white rounded-xl p-stack-lg border border-[#E0E0D0] shadow-sm">
        <div className="grid grid-cols-3 gap-stack-md">
          {badges?.map(badge => (
            <div key={badge.id} className="flex flex-col items-center gap-2 p-3">
              <Badge name={badge.name} icon={badge.icon} earned={badge.earned} />
              <p className="font-label-caps text-label-caps text-primary-container text-center mt-1">{badge.name}</p>
              <p className="text-[10px] text-on-surface-variant text-center leading-tight">{badge.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
