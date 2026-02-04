import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GameEffectsProvider } from './contexts/GameEffectsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameEffectsProvider>
      <App />
    </GameEffectsProvider>
  </StrictMode>,
)