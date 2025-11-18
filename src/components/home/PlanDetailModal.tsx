import type { Action, WorkoutPlan } from '../../types/models'
import { estimatePlanMinutes } from '../../utils/time'
import clsx from 'clsx'

type Props = {
  open: boolean
  plan: WorkoutPlan | null
  actionsById: Record<string, Action | undefined>
  onClose: () => void
  onStart: (planId: string) => void
  onEdit?: (planId: string) => void
}

const PlanDetailModal = ({ open, plan, actionsById, onClose, onStart, onEdit }: Props) => {
  if (!open || !plan) return null
  const minutes = estimatePlanMinutes(plan)

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 px-4 pb-6">
      <div className="w-full max-w-screen-md translate-y-0 rounded-2xl bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-text-primary-light">{plan.name}</p>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(plan.id)}
                className="rounded-full px-3 py-1 text-sm font-semibold text-primary transition hover:bg-primary/10"
              >
                编辑
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-full p-1 text-text-secondary-light transition hover:bg-gray-100"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-3 text-sm text-text-secondary-light">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">timer</span>
            <span>预计约{minutes}分钟</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">list_alt</span>
            <span>{plan.actions.length} 个动作</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {plan.actions.map((step, index) => {
            const action = actionsById[step.actionId]
            return (
              <div
                key={`${step.actionId}-${index}`}
                className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2"
              >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-lg bg-white">
                  {action?.imageURL ? (
                    <img
                      src={action.imageURL}
                      alt={action.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-text-secondary-light">无图</span>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-sm font-semibold text-text-primary-light">
                    {action?.name ?? '未知动作'}
                  </p>
                  <p className="text-xs text-text-secondary-light">{action?.targetPart ?? '—'}</p>
                </div>
                <div className="flex flex-col items-end text-xs text-text-secondary-light">
                  <span>{step.weight}</span>
                  <span>{step.reps} × {step.sets}组</span>
                  <span className={clsx('rounded-full px-2 py-0.5 text-[11px] text-primary')}>
                    休息 {step.restSeconds}s
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4">
          <button
            onClick={() => onStart(plan.id)}
            className="flex w-full justify-center rounded-full bg-primary py-3 text-base font-semibold text-white shadow-card transition hover:opacity-90"
          >
            开始训练
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlanDetailModal
