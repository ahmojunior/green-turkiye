import { createContext } from 'react';
import type { GameState, Country, Region, Project, TaxRate } from '../types';

// Shape of everything the game provider hands to the tree. Lives apart from the
// provider component so Fast Refresh can keep working on the provider file.
export interface GameContextType {
    gameState: GameState;
    startGame: (country: Country, region: Region) => void;
    resetGame: () => void;
    handleChoice: (choiceIndex: number) => void;
    dismissOutcome: () => void;
    handleNodeClick: (nodeId: string) => void;
    setTaxRate: (rate: TaxRate) => void;
    buyProject: (project: Project) => void;
    setPaused: (paused: boolean) => void;
    clearQuestToast: () => void;
}

export const GameContext = createContext<GameContextType | null>(null);
