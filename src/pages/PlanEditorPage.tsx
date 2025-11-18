import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import AddActionModal from '../components/home/AddActionModal'
import ActionPickerModal from '../components/plan/ActionPickerModal'
import { seedActions, seedPlans } from '../data/seed'
import type { Action, WorkoutActionStep, WorkoutPlan } from '../types/models'
import { getActions, getPlans, saveActions, savePlans } from '../utils/storage'

type EditableStep = Omit<WorkoutActionStep, 'sets' | 'restSeconds'> & {
  uid: string
  sets: number | ''
  restSeconds: number | ''
}

const createDefaultStep = (actionId: string): EditableStep => ({
  uid: uuidv4(),
  actionId,
  weight: '',
  reps: '12次',
  sets: 3,
  restSeconds: 60,
})

const PlanEditorPage = () => {
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

  const initialPlans = (() => {
    const stored = getPlans()
    if (!stored.length) {
      savePlans(seedPlans)
      return seedPlans
    }
    return stored
  })()

  const initialPlan = planId ? initialPlans.find((p) => p.id === planId) ?? null : null

  const [availableActions, setAvailableActions] = useState<Action[]>(() => initialActions)
  const [plansState, setPlansState] = useState<WorkoutPlan[]>(() => initialPlans)
  const [planName, setPlanName] = useState(initialPlan?.name ?? '')
  const [steps, setSteps] = useState<EditableStep[]>(() =>
    initialPlan
      ? initialPlan.actions.map((step) => ({
          ...step,
          uid: uuidv4(),
        }))
      : []
  )
  const [showPicker, setShowPicker] = useState(false)
  const [showAddAction, setShowAddAction] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const isEdit = Boolean(planId)

  const actionsById = useMemo(() => {
    return availableActions.reduce<Record<string, Action>>((map, act) => {
      map[act.id] = act
      return map
    }, {})
  }, [availableActions])

  const handleAddFromPicker = (ids: string[]) => {
    const uniqueNew = ids.filter((id) => !steps.some((s) => s.actionId === id))
    const nextSteps = [...steps, ...uniqueNew.map((id) => createDefaultStep(id))]
    setSteps(nextSteps)
    setShowPicker(false)
  }

  const handleCreateAction = (action: Action) => {
    const nextActions = [...availableActions, action]
    setAvailableActions(nextActions)
    saveActions(nextActions)
    setShowAddAction(false)
    setToast('动作已添加，可从动作库选择')
    setTimeout(() => setToast(null), 2000)
  }

  const updateStep = (uid: string, patch: Partial<EditableStep>) => {
    setSteps((prev) => prev.map((s) => (s.uid === uid ? { ...s, ...patch } : s)))
  }

  const moveStep = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= steps.length || to >= steps.length) return
    const next = [...steps]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setSteps(next)
  }

  const handleDrag = (fromIndex: number, toIndex: number) => moveStep(fromIndex, toIndex)

  const handleSave = () => {
    const trimmedName = planName.trim()
    if (!trimmedName) {
      setToast('请输入计划名称')
      setTimeout(() => setToast(null), 2000)
      return
    }
    if (!steps.length) {
      setToast('请添加至少一个动作')
      setTimeout(() => setToast(null), 2000)
      return
    }

    const sanitizedSteps: WorkoutActionStep[] = steps.map((step) => ({
      actionId: step.actionId,
      weight: step.weight || '—',
      reps: step.reps || '10次',
      sets: Math.max(1, Number(step.sets) || 1),
      restSeconds: Math.max(10, Number(step.restSeconds) || 30),
    }))

    const newPlan: WorkoutPlan = {
      id: planId ?? uuidv4(),
      name: trimmedName,
      actions: sanitizedSteps,
    }

    const nextPlans = isEdit
      ? plansState.map((p) => (p.id === newPlan.id ? newPlan : p))
      : [newPlan, ...plansState]

    setPlansState(nextPlans)
    savePlans(nextPlans)

    setToast('计划已保存')
    setTimeout(() => setToast(null), 1500)
    setTimeout(() => navigate('/'), 300)
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary-light">
          {isEdit ? '编辑训练计划' : '创建新计划'}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary-light transition hover:bg-gray-100"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      </div>

      <div className="space-y-3 rounded-xl bg-white p-4 shadow-card">
        <label className="flex flex-col gap-2 text-sm font-medium text-text-primary-light">
          计划名称
          <input
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="rounded-xl border-gray-200 bg-gray-50 px-3 py-2 focus:border-primary focus:ring-primary"
            placeholder="如：周一胸部强化训练"
          />
        </label>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-base font-semibold text-text-primary-light">已选动作</p>
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 rounded-full bg-primary px-3 py-2 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
          >
            <span className="material-symbols-outlined text-base">add</span>
            从动作库添加
          </button>
        </div>
        <p className="mb-4 text-xs text-text-secondary-light">按住卡片可拖动调整顺序</p>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const action = actionsById[step.actionId]
            return (
              <div
                key={step.uid}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', String(index))
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const fromIndex = Number(e.dataTransfer.getData('text/plain'))
                  handleDrag(fromIndex, index)
                }}
                className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined cursor-grab text-text-secondary-light">
                    drag_indicator
                  </span>
                  <div className="h-14 w-14 overflow-hidden rounded-lg bg-white">
                    {action?.imageURL ? (
                      <img src={action.imageURL} alt={action.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-text-secondary-light">
                        无图
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-semibold text-text-primary-light">
                      {action?.name ?? '未知动作'}
                    </p>
                    <p className="text-xs text-text-secondary-light">{action?.targetPart ?? '—'}</p>
                  </div>
                  <button
                    onClick={() => setSteps((prev) => prev.filter((s) => s.uid !== step.uid))}
                    className="rounded-full p-1 text-text-secondary-light transition hover:bg-white"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-text-primary-light sm:grid-cols-4">
                  <label className="flex flex-col gap-2">
                    重量
                    <input
                      value={step.weight}
                      onChange={(e) => updateStep(step.uid, { weight: e.target.value })}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 focus:border-primary focus:ring-primary"
                      placeholder="如 40kg / 自重"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    次数
                    <input
                      value={step.reps}
                      onChange={(e) => updateStep(step.uid, { reps: e.target.value })}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 focus:border-primary focus:ring-primary"
                      placeholder="12次"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    组数
                    <input
                      type="number"
                      min={1}
                      value={step.sets === '' ? '' : step.sets}
                      onChange={(e) =>
                        updateStep(step.uid, { sets: e.target.value === '' ? '' : Number(e.target.value) })
                      }
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 focus:border-primary focus:ring-primary"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    休息(秒)
                    <input
                      type="number"
                      min={10}
                      value={step.restSeconds === '' ? '' : step.restSeconds}
                      onChange={(e) =>
                        updateStep(step.uid, {
                          restSeconds: e.target.value === '' ? '' : Number(e.target.value),
                        })
                      }
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 focus:border-primary focus:ring-primary"
                    />
                  </label>
                </div>
              </div>
            )
          })}
          {!steps.length && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center text-sm text-text-secondary-light">
              还没有动作，点击“从动作库添加”开始配置
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleSave}
          className="rounded-full bg-primary py-3 text-base font-semibold text-white shadow-card transition hover:opacity-90"
        >
          保存计划
        </button>
        <button
          onClick={() => setShowAddAction(true)}
          className="flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white py-3 text-sm font-semibold text-text-primary-light shadow-card transition hover:bg-gray-50"
        >
          <span className="material-symbols-outlined text-base text-primary">fitness_center</span>
          新建动作
        </button>
      </div>

      <ActionPickerModal
        open={showPicker}
        actions={availableActions}
        selectedIds={steps.map((s) => s.actionId)}
        onClose={() => setShowPicker(false)}
        onConfirm={handleAddFromPicker}
      />
      <AddActionModal open={showAddAction} onClose={() => setShowAddAction(false)} onSubmit={handleCreateAction} />

      <div
        className={clsx(
          'pointer-events-none fixed left-1/2 top-4 z-40 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-sm text-white transition opacity-0',
          toast && 'pointer-events-auto opacity-100'
        )}
      >
        {toast}
      </div>
    </div>
  )
}

export default PlanEditorPage
