import type { FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Action } from '../../types/models'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (action: Action) => void
}

const AddActionModal = ({ open, onClose, onSubmit }: Props) => {
  const [name, setName] = useState('')
  const [targetPart, setTargetPart] = useState('')
  const [imageURL, setImageURL] = useState('')

  useEffect(() => {
    if (open) {
      setName('')
      setTargetPart('')
      setImageURL('')
    }
  }, [open])

  if (!open) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const newAction: Action = {
      id: uuidv4(),
      name: name.trim(),
      targetPart: targetPart.trim() || '未设定',
      imageURL: imageURL.trim() || undefined,
    }
    onSubmit(newAction)
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary-light">添加新动作</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-text-secondary-light transition hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <label className="flex flex-col gap-2 text-sm font-medium text-text-primary-light">
            动作名称
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-gray-200 bg-gray-50 px-3 py-2 focus:border-primary focus:ring-primary"
              placeholder="例如：哑铃推肩"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-text-primary-light">
            目标部位
            <input
              value={targetPart}
              onChange={(e) => setTargetPart(e.target.value)}
              className="rounded-xl border-gray-200 bg-gray-50 px-3 py-2 focus:border-primary focus:ring-primary"
              placeholder="胸部/背部/腿部..."
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-text-primary-light">
            图片 URL（可选）
            <input
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              className="rounded-xl border-gray-200 bg-gray-50 px-3 py-2 focus:border-primary focus:ring-primary"
              placeholder="https://..."
            />
          </label>
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
            保存
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddActionModal
