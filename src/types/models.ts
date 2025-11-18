export type Action = {
  id: string
  name: string
  targetPart: string
  imageURL?: string
}

export type WorkoutActionStep = {
  actionId: string
  weight: string
  reps: string
  sets: number
  restSeconds: number
}

export type WorkoutPlan = {
  id: string
  name: string
  actions: WorkoutActionStep[]
}

export type UserProfile = {
  height: number | null
  weight: number | null
  bodyFat: number | null
}

export type WorkoutRecord = {
  id: string
  planId: string
  planName: string
  date: string
}
