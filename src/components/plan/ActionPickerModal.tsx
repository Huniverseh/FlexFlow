import { useState } from 'react'
import type { Action } from '../../types/models'

type Props = {
  open: boolean
  actions: Action[]
  selectedIds: string[]
  onClose: () => void
  onConfirm: (ids: string[]) => void
}

const ActionPickerModal = ({ open, actions, selectedIds, onClose, onConfirm }: Props) => {
  const [picked, setPicked] = useState<string[]>(() => selectedIds)

  if (!open) return null

  const toggle = (id: string) => {
    setPicked((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]))
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary-light">从动作库添加</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-text-secondary-light transition hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="max-h-[50vh] space-y-2 overflow-y-auto pr-1">
          {actions.map((action) => (
            <label
              key={action.id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-3 py-2 transition hover:border-primary"
            >
              <input
                type="checkbox"
                checked={picked.includes(action.id)}
                onChange={() => toggle(action.id)}
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-50">
                  {action.imageURL ? (
                    <img
                      src={action.imageURL}
                      alt={action.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-text-secondary-light">
                      无图
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-text-primary-light">{action.name}</p>
                  <p className="text-xs text-text-secondary-light">{action.targetPart}</p>
                </div>
              </div>
            </label>
          ))}
          {!actions.length && (
            <p className="text-center text-sm text-text-secondary-light">还没有动作，请先创建。</p>
          )}
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
            type="button"
            onClick={() => onConfirm(picked)}
            className="flex-1 rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
          >
            添加到计划
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActionPickerModal
