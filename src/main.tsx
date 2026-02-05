import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GameProvider } from './contexts/GameContext'
import { GameEffectsProvider } from './contexts/GameEffectsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider>
      <GameEffectsProvider>
        <App />
      </GameEffectsProvider>
    </GameProvider>
  </StrictMode>,
)