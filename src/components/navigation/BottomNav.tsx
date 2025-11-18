import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: '主页', icon: 'home' },
  { to: '/records', label: '记录', icon: 'bar_chart' },
  { to: '/profile', label: '我的', icon: 'person' },
]

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-screen-md">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex flex-1 flex-col items-center justify-center gap-1 py-3 text-sm font-medium transition',
                isActive ? 'text-primary' : 'text-text-secondary-light'
              )
            }
          >
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
