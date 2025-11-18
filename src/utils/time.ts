import type { WorkoutPlan } from '../types/models'

export const estimatePlanMinutes = (plan: WorkoutPlan): number => {
  const perRepSeconds = 3
  const setupSecondsPerSet = 20
  const totalSeconds = plan.actions.reduce((sum, step) => {
    const repsNumber = parseInt(step.reps.replace(/\D+/g, ''), 10) || 10
    const setsTime = step.sets * (repsNumber * perRepSeconds + setupSecondsPerSet)
    const rests = Math.max(step.sets - 1, 0) * step.restSeconds
    return sum + setsTime + rests
  }, 0)

  const minutes = Math.max(10, Math.round(totalSeconds / 60))
  return minutes
}
