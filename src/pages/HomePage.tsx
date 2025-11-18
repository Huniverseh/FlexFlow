import clsx from 'clsx'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddActionModal from '../components/home/AddActionModal'
import ImportModal from '../components/home/ImportModal'
import PlanCard from '../components/home/PlanCard'
import PlanDetailModal from '../components/home/PlanDetailModal'
import { seedActions, seedPlans } from '../data/seed'
import type { Action, WorkoutPlan } from '../types/models'
import { getActions, getPlans, saveActions, savePlans } from '../utils/storage'
import { v4 as uuidv4 } from 'uuid'

const HomePage = () => {
  const [actions, setActions] = useState<Action[]>(() => {
    const stored = getActions()
    if (!stored.length) {
      saveActions(seedActions)
      return seedActions
    }
    return stored
  })
  const [plans, setPlans] = useState<WorkoutPlan[]>(() => {
    const stored = getPlans()
    if (!stored.length) {
      savePlans(seedPlans)
      return seedPlans
    }
    return stored
  })
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showAddAction, setShowAddAction] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const navigate = useNavigate()

  const actionsById = useMemo(() => {
    return actions.reduce<Record<string, Action>>((map, act) => {
      map[act.id] = act
      return map
    }, {})
  }, [actions])

  const handleShare = async (plan: WorkoutPlan) => {
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify(plan)))
      const url = `${window.location.origin}/import?data=${encoded}`
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
      } else {
        window.prompt('复制以下链接', url)
      }
      setToast('已复制分享链接')
      setTimeout(() => setToast(null), 2000)
    } catch (err) {
      setToast('分享失败，请重试')
      setTimeout(() => setToast(null), 2000)
      console.error(err)
    }
  }

  const handleImport = (plan: WorkoutPlan) => {
    const mergedPlan = { ...plan, id: uuidv4() }
    const nextPlans = [mergedPlan, ...plans]
    setPlans(nextPlans)
    savePlans(nextPlans)
    setShowImport(false)
    setToast('导入成功！')
    setTimeout(() => setToast(null), 2000)
  }

  const handleAddAction = (action: Action) => {
    const next = [...actions, action]
    setActions(next)
    saveActions(next)
    setShowAddAction(false)
    setToast('已添加新动作')
    setTimeout(() => setToast(null), 2000)
  }

  const handleDeletePlan = (plan: WorkoutPlan) => {
    const confirmed = window.confirm(`确定删除训练计划「${plan.name}」吗？`)
    if (!confirmed) return
    const nextPlans = plans.filter((p) => p.id !== plan.id)
    setPlans(nextPlans)
    savePlans(nextPlans)
    if (selectedPlan?.id === plan.id) {
      setSelectedPlan(null)
    }
    setToast('计划已删除')
    setTimeout(() => setToast(null), 2000)
  }

  const handleStartPlan = (planId: string) => {
    setSelectedPlan(null)
    navigate(`/live/${planId}`)
  }

  const handleEditPlan = (planId: string) => {
    setSelectedPlan(null)
    navigate(`/plan/${planId}`)
  }

  return (
    <div className="space-y-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text-primary-light">我的训练计划</h1>
        <div className="relative">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setShowAddMenu((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-primary/10"
            >
              <span className="material-symbols-outlined text-3xl">add</span>
            </button>
            <button
              onClick={() => setShowImport(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary transition hover:bg-primary/10"
            >
              <span className="material-symbols-outlined text-3xl">more_horiz</span>
            </button>
          </div>
          {showAddMenu && (
            <div className="absolute right-0 top-12 z-10 w-44 rounded-xl bg-white shadow-card">
              <button
                onClick={() => {
                  setShowAddMenu(false)
                  navigate('/plan/new')
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-text-primary-light transition hover:bg-gray-50"
              >
                <span className="material-symbols-outlined text-base text-primary">edit_note</span>
                创建新计划
              </button>
              <button
                onClick={() => {
                  setShowAddMenu(false)
                  setShowAddAction(true)
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm text-text-primary-light transition hover:bg-gray-50"
              >
                <span className="material-symbols-outlined text-base text-primary">fitness_center</span>
                添加新动作
              </button>
            </div>
          )}
        </div>
      </header>

      <p className="text-sm text-text-secondary-light">
        创建、管理并开始你的训练计划。点击卡片查看详情并开始训练。
      </p>

      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onView={setSelectedPlan}
            onShare={handleShare}
            onDelete={handleDeletePlan}
          />
        ))}
        {!plans.length && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center text-sm text-text-secondary-light">
            还没有计划，点击右上角“+”创建一个吧
          </div>
        )}
      </div>

      <PlanDetailModal
        open={Boolean(selectedPlan)}
        plan={selectedPlan}
        actionsById={actionsById}
        onClose={() => setSelectedPlan(null)}
        onStart={handleStartPlan}
        onEdit={handleEditPlan}
      />
      {showAddAction && (
        <AddActionModal
          open={showAddAction}
          onClose={() => setShowAddAction(false)}
          onSubmit={handleAddAction}
        />
      )}
      {showImport && (
        <ImportModal open={showImport} onClose={() => setShowImport(false)} onImport={handleImport} />
      )}

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

export default HomePage
