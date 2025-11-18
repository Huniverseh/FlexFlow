import type { Action, ThemeStyle, UserProfile, WorkoutPlan, WorkoutRecord } from '../types/models'

const STORAGE_KEYS = {
  actions: 'flexflow_actions',
  plans: 'flexflow_plans',
  records: 'flexflow_records',
  profile: 'flexflow_profile',
} as const

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

const memoryStore = new Map<StorageKey, string>()

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const readRaw = (key: StorageKey): string | null => {
  if (isBrowser) {
    return window.localStorage.getItem(key)
  }
  return memoryStore.get(key) ?? null
}

const writeRaw = (key: StorageKey, value: string) => {
  if (isBrowser) {
    window.localStorage.setItem(key, value)
  } else {
    memoryStore.set(key, value)
  }
}

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

const readList = <T>(key: StorageKey): T[] => safeParse<T[]>(readRaw(key), [])
const writeList = <T>(key: StorageKey, list: T[]) => writeRaw(key, JSON.stringify(list))

export const getActions = (): Action[] => readList<Action>(STORAGE_KEYS.actions)
export const saveActions = (actions: Action[]) => writeList(STORAGE_KEYS.actions, actions)

export const getPlans = (): WorkoutPlan[] => readList<WorkoutPlan>(STORAGE_KEYS.plans)
export const savePlans = (plans: WorkoutPlan[]) => writeList(STORAGE_KEYS.plans, plans)

export const getRecords = (): WorkoutRecord[] => readList<WorkoutRecord>(STORAGE_KEYS.records)
export const saveRecords = (records: WorkoutRecord[]) => writeList(STORAGE_KEYS.records, records)

export const getProfile = (): UserProfile => {
  const parsed = safeParse<Partial<UserProfile>>(readRaw(STORAGE_KEYS.profile), {
    height: null,
    weight: null,
    bodyFat: null,
    theme: 'default' as ThemeStyle,
  })
  return {
    height: parsed.height ?? null,
    weight: parsed.weight ?? null,
    bodyFat: parsed.bodyFat ?? null,
    theme: parsed.theme ?? 'default',
  }
}

export const saveProfile = (profile: UserProfile) =>
  writeRaw(STORAGE_KEYS.profile, JSON.stringify(profile))
