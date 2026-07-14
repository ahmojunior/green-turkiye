import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'
import { GameProvider } from './contexts/GameContext'
import { GameEffectsProvider } from './contexts/GameEffectsContext'
import { LanguageProvider } from './contexts/LanguageContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <GameProvider>
        <GameEffectsProvider>
          <App />
        </GameEffectsProvider>
      </GameProvider>
    </LanguageProvider>
  </StrictMode>,
)