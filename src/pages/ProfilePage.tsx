import { useEffect, useState } from 'react'
import type { ThemeStyle, UserProfile } from '../types/models'
import { getProfile, saveProfile } from '../utils/storage'

const ProfilePage = () => {
  const initial = getProfile()
  const [profile, setProfile] = useState<UserProfile>({
    ...initial,
    theme: initial.theme ?? 'default',
  })
  const [toast, setToast] = useState<string | null>(null)

  const handleChange = (key: 'height' | 'weight' | 'bodyFat', value: number | null) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const handleThemeChange = (value: ThemeStyle) => {
    setProfile((prev) => ({ ...prev, theme: value }))
  }

  useEffect(() => {
    document.documentElement.dataset.theme = profile.theme
  }, [profile.theme])

  const themeOptions: { value: ThemeStyle; label: string; hint: string }[] = [
    { value: 'default', label: '默认', hint: '简洁清爽，通用视觉' },
    { value: 'fresh', label: '清新', hint: '薄荷绿点缀，轻盈通透' },
    { value: 'calm', label: '沉稳', hint: '低饱和度，便于长时间使用' },
    { value: 'dark', label: '暗色', hint: '夜间友好，降低眩光' },
  ]

  const handleSave = () => {
    saveProfile(profile)
    setToast('已保存')
    setTimeout(() => setToast(null), 1500)
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold text-text-primary-light">我的</h1>
      <div className="space-y-4 rounded-xl bg-white p-4 shadow-card">
        <p className="text-sm font-semibold text-text-primary-light">身体数据</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-2 text-sm font-medium text-text-primary-light">
            身高 (cm)
            <input
              type="number"
              min={0}
              value={profile.height ?? ''}
              onChange={(e) => handleChange('height', e.target.value ? Number(e.target.value) : null)}
              className="rounded-xl border-gray-200 bg-gray-50 px-3 py-2 focus:border-primary focus:ring-primary"
              placeholder="170"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-text-primary-light">
            体重 (kg)
            <input
              type="number"
              min={0}
              value={profile.weight ?? ''}
              onChange={(e) => handleChange('weight', e.target.value ? Number(e.target.value) : null)}
              className="rounded-xl border-gray-200 bg-gray-50 px-3 py-2 focus:border-primary focus:ring-primary"
              placeholder="65"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-text-primary-light">
            体脂率 (%)
            <input
              type="number"
              min={0}
              value={profile.bodyFat ?? ''}
              onChange={(e) => handleChange('bodyFat', e.target.value ? Number(e.target.value) : null)}
              className="rounded-xl border-gray-200 bg-gray-50 px-3 py-2 focus:border-primary focus:ring-primary"
              placeholder="15"
            />
          </label>
        </div>
        <div className="space-y-2 rounded-xl bg-gray-50 p-3">
          <p className="text-sm font-semibold text-text-primary-light">界面风格</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleThemeChange(option.value)}
                className={`flex flex-col items-start gap-1 rounded-xl border px-4 py-3 text-left transition ${
                  profile.theme === option.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 bg-white text-text-primary-light hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <span className="text-sm font-semibold">{option.label}</span>
                <span className="text-xs text-text-secondary-light">{option.hint}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-text-secondary-light">
            选择你喜欢的主题风格，未来版本会根据此偏好调整整体配色。
          </p>
        </div>
        <button
          onClick={handleSave}
          className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
        >
          保存
        </button>
      </div>

      <div
        className={`pointer-events-none fixed left-1/2 top-4 z-40 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-sm text-white transition ${toast ? 'opacity-100' : 'opacity-0'}`}
      >
        {toast}
      </div>
    </div>
  )
}

export default ProfilePage
