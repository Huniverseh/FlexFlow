import type { Action } from '../../types/models'

type Props = {
  open: boolean
  actions: Action[]
  onClose: () => void
  onEdit: (action: Action) => void
  onDelete: (action: Action) => void
}

const ActionLibraryModal = ({ open, actions, onClose, onDelete, onEdit }: Props) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary-light">编辑动作库</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-text-secondary-light transition hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid max-h-[60vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-lg bg-white">
                  {action.imageURL ? (
                    <img src={action.imageURL} alt={action.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-text-secondary-light">
                      无图
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-sm font-semibold text-text-primary-light">{action.name}</p>
                  <p className="text-xs text-text-secondary-light">{action.targetPart}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(action)}
                  className="flex-1 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-text-primary-light transition hover:border-primary hover:bg-primary/5"
                >
                  编辑
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(action)}
                  className="flex-1 rounded-full border border-red-100 bg-white px-3 py-2 text-sm font-semibold text-red-500 transition hover:border-red-200 hover:bg-red-50"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
          {!actions.length && (
            <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-text-secondary-light">
              还没有动作，请先创建。
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActionLibraryModal
