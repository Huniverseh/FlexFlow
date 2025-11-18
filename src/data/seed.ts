import type { Action, WorkoutPlan } from '../types/models'

export const seedActions: Action[] = [
  {
    id: 'act-bench',
    name: '杠铃卧推',
    targetPart: '胸部',
    imageURL: '/action/卧推.webp',
  },
  {
    id: 'act-pushup',
    name: '俯卧撑',
    targetPart: '胸部',
    imageURL: '/action/俯卧撑.webp',
  },
  {
    id: 'act-curl',
    name: '二头哑铃弯举',
    targetPart: '手臂',
    imageURL: '/action/二头哑铃弯举.webp',
  },
  {
    id: 'act-row',
    name: '俯身哑铃划船',
    targetPart: '背部',
    imageURL: '/action/俯身哑铃划船.webp',
  },
  {
    id: 'act-squat',
    name: '深蹲',
    targetPart: '腿部',
    imageURL: '/action/深蹲.webp',
  },
  {
    id: 'act-deadlift',
    name: '硬拉',
    targetPart: '全身',
    imageURL: '/action/硬拉.webp',
  },
  {
    id: 'act-plank',
    name: '仰卧卷腹',
    targetPart: '核心',
    imageURL: '/action/仰卧卷腹.webp',
  },
]

export const seedPlans: WorkoutPlan[] = [
  {
    id: 'plan-chest',
    name: '周一胸部强化训练',
    actions: [
      { actionId: 'act-bench', weight: '50kg', reps: '12次', sets: 4, restSeconds: 60 },
      { actionId: 'act-pushup', weight: '自重', reps: '15次', sets: 3, restSeconds: 45 },
      { actionId: 'act-row', weight: '20kg', reps: '12次', sets: 4, restSeconds: 60 },
    ],
  },
  {
    id: 'plan-legs-core',
    name: '周三腿部与核心',
    actions: [
      { actionId: 'act-squat', weight: '60kg', reps: '10次', sets: 4, restSeconds: 90 },
      { actionId: 'act-deadlift', weight: '70kg', reps: '8次', sets: 3, restSeconds: 90 },
      { actionId: 'act-plank', weight: '—', reps: '20次', sets: 3, restSeconds: 45 },
    ],
  },
  {
    id: 'plan-full',
    name: '周五全身循环',
    actions: [
      { actionId: 'act-row', weight: '22kg', reps: '10次', sets: 3, restSeconds: 60 },
      { actionId: 'act-curl', weight: '12kg', reps: '12次', sets: 3, restSeconds: 45 },
      { actionId: 'act-squat', weight: '55kg', reps: '12次', sets: 3, restSeconds: 75 },
      { actionId: 'act-plank', weight: '—', reps: '25次', sets: 2, restSeconds: 45 },
    ],
  },
]
