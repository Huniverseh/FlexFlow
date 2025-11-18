import { Outlet } from 'react-router-dom'
import BottomNav from '../navigation/BottomNav'

const AppLayout = () => {
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
