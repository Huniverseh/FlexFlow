import type { WorkoutPlan } from '../../types/models'
import { estimatePlanMinutes } from '../../utils/time'

type Props = {
  plan: WorkoutPlan
  onView: (plan: WorkoutPlan) => void
  onShare: (plan: WorkoutPlan) => void
  onDelete: (plan: WorkoutPlan) => void
}

const PlanCard = ({ plan, onView, onShare, onDelete }: Props) => {
  const minutes = estimatePlanMinutes(plan)

  return (
    <button
      onClick={() => onView(plan)}
      className="flex w-full flex-col gap-3 rounded-xl bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <p className="text-lg font-bold text-text-primary-light">{plan.name}</p>
        <div className="flex items-center gap-2">
          <span
            onClick={(e) => {
              e.stopPropagation()
              onShare(plan)
            }}
            className="cursor-pointer rounded-full p-1 text-primary transition hover:bg-primary/10 hover:scale-105"
            aria-label="分享"
          >
            <span className="material-symbols-outlined">ios_share</span>
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation()
              onDelete(plan)
            }}
            className="cursor-pointer rounded-full p-1 text-red-500 transition hover:bg-red-50 hover:scale-105"
            aria-label="删除计划"
          >
            <span className="material-symbols-outlined">delete</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-sm text-text-secondary-light">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base">list_alt</span>
          <p>包含动作：{plan.actions.length}个</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base">timer</span>
          <p>预计时长：约{minutes}分钟</p>
        </div>
      </div>
    </button>
  )
}

export default PlanCard
