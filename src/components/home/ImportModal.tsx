import type { FormEvent } from 'react'
import { useState, useEffect } from 'react'
import type { WorkoutPlan } from '../../types/models'

type Props = {
  open: boolean
  onClose: () => void
  onImport: (plan: WorkoutPlan) => void
}

const ImportModal = ({ open, onClose, onImport }: Props) => {
  const [link, setLink] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setLink('')
      setError(null)
    }
  }, [open])

  if (!open) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    try {
      const url = new URL(link.trim())
      const data = url.searchParams.get('data')
      if (!data) {
        throw new Error('链接缺少 data 参数')
      }
      const decoded = decodeURIComponent(atob(data))
      const plan = JSON.parse(decoded) as WorkoutPlan
      onImport(plan)
    } catch (err) {
      setError((err as Error).message || '链接不合法')
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary-light">从链接导入</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-text-secondary-light transition hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-text-primary-light">
            粘贴分享链接
            <textarea
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="min-h-[96px] rounded-xl border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary focus:ring-primary"
              placeholder="https://.../import?data=..."
              required
            />
          </label>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-gray-200 py-3 text-sm font-semibold text-text-primary-light transition hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
          >
            导入
          </button>
        </div>
      </form>
    </div>
  )
}

export default ImportModal
