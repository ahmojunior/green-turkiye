import { createContext, useContext } from 'react';

// Screen-level effects (floating stat numbers) that any component can trigger.
// Separate from the provider component so Fast Refresh keeps working there.
export interface GameEffectsContextType {
  showFloatingText: (x: number, y: number, text: string, color: string) => void;
}

export const GameEffectsContext = createContext<GameEffectsContextType | undefined>(undefined);

export function useGameEffects() {
  const context = useContext(GameEffectsContext);
  if (!context) {
    throw new Error('useGameEffects must be used within a GameEffectsProvider');
  }
  return context;
}
