import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import LiveTrainingPage from './pages/LiveTrainingPage'
import ImportLandingPage from './pages/ImportLandingPage'
import NotFoundPage from './pages/NotFoundPage'
import PlanEditorPage from './pages/PlanEditorPage'
import ProfilePage from './pages/ProfilePage'
import RecordsPage from './pages/RecordsPage'

const PlanEditorRoute = () => {
  const { planId } = useParams()
  return <PlanEditorPage key={planId ?? 'new'} />
}

const LiveTrainingRoute = () => {
  const { planId } = useParams()
  return <LiveTrainingPage key={planId ?? 'live'} />
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/records" element={<RecordsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/plan/new" element={<PlanEditorRoute />} />
        <Route path="/plan/:planId" element={<PlanEditorRoute />} />
        <Route path="/import" element={<ImportLandingPage />} />
      </Route>
      <Route path="/live/:planId" element={<LiveTrainingRoute />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
