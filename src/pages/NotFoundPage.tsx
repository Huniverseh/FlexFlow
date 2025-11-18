import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background-light px-4 text-center text-text-primary-light">
      <p className="text-6xl font-bold text-primary">404</p>
      <p className="text-lg font-medium">页面走丢了</p>
      <p className="text-sm text-text-secondary-light">返回主页继续规划你的训练。</p>
      <Link
        to="/"
        className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:opacity-90"
      >
        回到主页
      </Link>
    </div>
  )
}

export default NotFoundPage
