import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import LiveTrainingPlaceholder from './pages/LiveTrainingPlaceholder'
import NotFoundPage from './pages/NotFoundPage'
import PlanEditorPlaceholder from './pages/PlanEditorPlaceholder'
import ProfilePage from './pages/ProfilePage'
import RecordsPage from './pages/RecordsPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/plan/new" element={<PlanEditorPlaceholder />} />
        <Route path="/live/:planId" element={<LiveTrainingPlaceholder />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
