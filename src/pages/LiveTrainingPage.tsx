import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { seedActions, seedPlans } from '../data/seed'
import type { Action, WorkoutPlan, WorkoutRecord } from '../types/models'
import {
  getActions,
  getPlans,
  getProfile,
  getRecords,
  saveActions,
  savePlans,
  saveRecords,
} from '../utils/storage'
import { playBeep } from '../utils/sound'

type Status = 'work' | 'rest' | 'finished'

const formatSeconds = (value: number) => {
  const safe = Math.max(0, Math.round(value))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const LiveTrainingPage = () => {
  const { planId } = useParams()
  const navigate = useNavigate()

  const initialActions = (() => {
    const stored = getActions()
    if (!stored.length) {
      saveActions(seedActions)
      return seedActions
    }
    return stored
  })()

  const plansList = (() => {
    const stored = getPlans()
    if (!stored.length) {
      savePlans(seedPlans)
      return seedPlans
    }
    return stored
  })()

  const initialPlan = plansList.find((p) => p.id === planId) ?? null

  const [actions] = useState<Action[]>(() => initialActions)
  const [plan] = useState<WorkoutPlan | null>(() => initialPlan)
  const [actionIndex, setActionIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [status, setStatus] = useState<Status>('work')
  const [restRemaining, setRestRemaining] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)
  const [recordSaved, setRecordSaved] = useState(false)

  const actionsById = useMemo(() => {
    return actions.reduce<Record<string, Action>>((map, act) => {
      map[act.id] = act
      return map
    }, {})
  }, [actions])

  const currentStep = plan?.actions[actionIndex]
  const currentAction = currentStep ? actionsById[currentStep.actionId] : null
  const nextStep = plan?.actions[actionIndex + 1]
  const nextAction = nextStep ? actionsById[nextStep.actionId] : null

  const isLastSet = currentStep ? currentSet >= currentStep.sets : false
  const isLastAction = plan ? actionIndex >= plan.actions.length - 1 : false

  useEffect(() => {
    const profile = getProfile()
    document.documentElement.dataset.theme = profile.theme
  }, [])

  useEffect(() => {
    if (status !== 'rest') return
    if (restRemaining <= 0) return
    const t = window.setTimeout(() => {
      const next = restRemaining - 1
      setRestRemaining(next)
      if (next <= 0) {
        playBeep()
        setShowConfirm(true)
      }
    }, 1000)
    return () => window.clearTimeout(t)
  }, [restRemaining, status])

  const handleCompleteSet = () => {
    if (!currentStep || !plan) return
    // last set of last action -> finish immediately
    if (isLastSet && isLastAction) {
      finishPlan()
      return
    }
    playBeep()
    setStatus('rest')
    setRestRemaining(currentStep.restSeconds)
  }

  const goNextWork = () => {
    if (!currentStep || !plan) return
    setShowConfirm(false)
    if (!isLastSet) {
      setCurrentSet((s) => s + 1)
    } else {
      setActionIndex((i) => i + 1)
      setCurrentSet(1)
    }
    setStatus('work')
    setRestRemaining(0)
  }

  const finishPlan = () => {
    setStatus('finished')
    if (!plan || recordSaved) return
    const records = getRecords()
    const newRecord: WorkoutRecord = {
      id: uuidv4(),
      planId: plan.id,
      planName: plan.name,
      date: dayjs().format('YYYY-MM-DD'),
    }
    saveRecords([newRecord, ...records])
    setRecordSaved(true)
    playBeep()
  }

  if (!plan) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f8f8] p-6 text-center text-text-primary-light">
        <p className="text-lg font-semibold">未找到对应的训练计划</p>
        <button
          onClick={() => navigate('/')}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
        >
          返回主页
        </button>
      </div>
    )
  }

  if (status === 'finished') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f8f8] p-6 text-center text-text-primary-light">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-3xl text-primary">
          <span className="material-symbols-outlined">celebration</span>
        </div>
        <p className="text-2xl font-bold">恭喜完成训练！</p>
        <p className="text-sm text-text-secondary-light">记录已保存，可在“记录”页查看。</p>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/records')}
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
          >
            去记录
          </button>
          <button
            onClick={() => navigate('/')}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-text-primary-light shadow-card transition hover:bg-gray-50"
          >
            返回主页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f8f8] text-text-primary-light">
      <div className="relative flex flex-1 flex-col px-5 pb-10 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-8 rounded-full p-2 text-gray-800 transition hover:bg-black/5"
        >
          <span className="material-symbols-outlined text-3xl">arrow_back_ios_new</span>
        </button>

        <div className="mt-2 flex flex-col items-center gap-2">
          <p className="text-3xl font-bold leading-tight">{currentAction?.name ?? '未知动作'}</p>
          <p className="text-lg text-text-secondary-light">{currentStep?.weight ?? '—'}</p>
        </div>

        <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-8">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-gray-200 shadow-inner">
            {currentAction?.imageURL ? (
              <img
                src={currentAction.imageURL}
                alt={currentAction.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center text-sm text-text-secondary-light">
                无图
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-base text-text-secondary-light">
              第 {currentSet} / {currentStep?.sets ?? 0} 组 · {currentStep?.reps} ·{' '}
              {currentStep?.weight}
            </p>
            <p className="text-sm text-text-secondary-light">
              目标部位：{currentAction?.targetPart ?? '—'}
            </p>
          </div>

          {status === 'work' ? (
            <button
              onClick={handleCompleteSet}
              className="mt-2 flex h-16 w-full max-w-sm items-center justify-center rounded-full bg-primary text-lg font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              完成本组
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-48 w-48">
                <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
                <div className="absolute inset-3 rounded-full border-[10px] border-primary/30" />
                <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white shadow-inner">
                  <p className="text-5xl font-black leading-none tracking-tight text-primary">
                    {formatSeconds(restRemaining)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-text-secondary-light">倒计时归零将提示进入下一组</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-base text-text-secondary-light">
            下一项：{nextAction ? `${nextAction.name} (${nextStep?.weight ?? '—'})` : '完成训练'}
          </p>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-lg font-semibold text-text-primary-light">准备好！</p>
            <p className="mt-2 text-sm text-text-secondary-light">
              {isLastSet ? '下一动作' : '下一组'}：
              {isLastSet ? nextAction?.name ?? '下一动作' : currentAction?.name ?? '本动作'}
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setRestRemaining((prev) => Math.max(prev, 10))
                  setStatus('rest')
                }}
                className="flex-1 rounded-full border border-gray-200 py-3 text-sm font-semibold text-text-primary-light transition hover:bg-gray-50"
              >
                再休息一下
              </button>
              <button
                onClick={goNextWork}
                className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
              >
                开始
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveTrainingPage
