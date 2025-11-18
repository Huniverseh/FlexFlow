import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { getProfile } from './utils/storage'

// Apply saved theme before app renders to avoid flicker
const profile = getProfile()
if (profile?.theme) {
  document.documentElement.dataset.theme = profile.theme
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
