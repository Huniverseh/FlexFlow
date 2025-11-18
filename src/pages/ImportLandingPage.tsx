import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import type { WorkoutPlan } from '../types/models'
import { getPlans, savePlans } from '../utils/storage'

const ImportLandingPage = () => {
  const navigate = useNavigate()
  const { search } = useLocation()

  const { ok, message } = useMemo(() => {
    const params = new URLSearchParams(search)
    const data = params.get('data')
    if (!data) {
      return { ok: false, message: '缺少 data 参数，无法导入' }
    }
    try {
      const decoded = decodeURIComponent(atob(data))
      const plan = JSON.parse(decoded) as WorkoutPlan
      const nextPlan: WorkoutPlan = { ...plan, id: uuidv4() }
      const list = [nextPlan, ...getPlans()]
      savePlans(list)
      return { ok: true, message: '导入成功！' }
    } catch (err) {
      console.error(err)
      return { ok: false, message: '链接无效或数据解析失败' }
    }
  }, [search])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background-light px-4 text-center text-text-primary-light">
      <span className="material-symbols-outlined text-4xl text-primary">
        {ok ? 'task_alt' : 'sync'}
      </span>
      <p className="text-lg font-semibold">{message}</p>
      <p className="text-sm text-text-secondary-light">你可以返回主页查看计划列表。</p>
      <button
        onClick={() => navigate('/')}
        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
      >
        返回主页
      </button>
    </div>
  )
}

export default ImportLandingPage
