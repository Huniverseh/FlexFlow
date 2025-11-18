import type { ChangeEvent, DragEvent, FormEvent } from 'react'
import { useRef, useState } from 'react'
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
  const [imageData, setImageData] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!open) return null

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    const newAction: Action = {
      id: uuidv4(),
      name: name.trim(),
      targetPart: targetPart.trim() || '未设定',
      imageURL: imageData ?? undefined,
    }
    onSubmit(newAction)
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setImageError('请选择图片文件')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImageData(reader.result as string)
      setImageError(null)
    }
    reader.readAsDataURL(file)
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
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
          <div className="flex flex-col gap-2 text-sm font-medium text-text-primary-light">
            动作图片（可选）
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-text-secondary-light transition ${
                dragActive ? 'border-primary bg-primary/5' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {imageData ? (
                <div className="flex w-full flex-col items-center gap-2">
                  <img
                    src={imageData}
                    alt="动作预览"
                    className="max-h-40 w-full rounded-lg object-contain"
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-card transition hover:opacity-90"
                    >
                      更换图片
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageData(null)}
                      className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold text-text-primary-light transition hover:bg-gray-100"
                    >
                      移除
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-3xl text-primary">upload</span>
                  <p className="text-center text-text-secondary-light">点击选择或拖拽图片到此处</p>
                  <p className="text-xs text-text-secondary-light">支持本地图片文件</p>
                </div>
              )}
            </div>
            {imageError && <p className="text-xs text-red-500">{imageError}</p>}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
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
