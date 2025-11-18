import { useState } from 'react'
import type { UserProfile } from '../types/models'
import { getProfile, saveProfile } from '../utils/storage'

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile>(() => getProfile())
  const [toast, setToast] = useState<string | null>(null)

  const handleChange = (key: keyof UserProfile, value: number | null) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

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
