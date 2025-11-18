import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from '../navigation/BottomNav'
import { getProfile } from '../../utils/storage'

const AppLayout = () => {
  useEffect(() => {
    const profile = getProfile()
    document.documentElement.dataset.theme = profile.theme
  }, [])

  return (
    <div className="min-h-screen bg-background-light text-text-primary-light">
      <div className="mx-auto flex min-h-screen max-w-screen-md flex-col pb-20">
        <main className="flex-1">{<Outlet />}</main>
      </div>
      <BottomNav />
    </div>
  )
}

export default AppLayout
