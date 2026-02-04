import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

interface GameEffectsContextType {
  showFloatingText: (x: number, y: number, text: string, color: string) => void;
}

const GameEffectsContext = createContext<GameEffectsContextType | undefined>(undefined);

export function GameEffectsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FloatingText[]>([]);

  const showFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setItems(prev => [...prev, { id, x, y, text, color }]);

    setTimeout(() => {
      setItems(prev => prev.filter(item => item.id !== id));
    }, 1000);
  }, []);

  return (
    <GameEffectsContext.Provider value={{ showFloatingText }}>
      {children}
      {items.map(item => (
        <div
          key={item.id}
          className="fixed pointer-events-none z-[100] text-xl font-bold drop-shadow-md animate-float-up"
          style={{ 
            left: item.x, 
            top: item.y, 
            color: item.color,
          }}
        >
          {item.text}
        </div>
      ))}
    </GameEffectsContext.Provider>
  );
}

export function useGameEffects() {
  const context = useContext(GameEffectsContext);
  if (!context) {
    throw new Error('useGameEffects must be used within a GameEffectsProvider');
  }
  return context;
}
