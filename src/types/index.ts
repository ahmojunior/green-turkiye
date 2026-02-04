export type Resource = 'budget' | 'happiness' | 'cleanliness';

export interface Region {
  id: string;
  name: string;
  description: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor'; // Localized difficulty
  spawnPoints?: { x: number; y: number }[];
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  regionId?: string;
  choices: EventChoice[];
}

export interface EventChoice {
  text: string;
  effects: {
    budget?: number;
    happiness?: number;
    cleanliness?: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
  effects: {
    happiness?: number;
    cleanliness?: number;
    budgetPerTurn?: number;
  };
}

export interface ActiveProject extends Project {
  daysRemaining: number;
}

export type TaxRate = 'low' | 'normal' | 'high';

export interface EventNode {
  id: string;
  eventId: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  expiresAt: number; // Game day when it disappears
}

export interface GameState {
  regionId: string | null;
  budget: number;
  happiness: number;
  cleanliness: number;
  taxRate: TaxRate;
  activeProjects: ActiveProject[];
  completedProjectIds: string[];
  isPlaying: boolean;
  isGameOver: boolean;
  isVictory: boolean; // New win condition
  day: number;
  activeNodes: EventNode[]; // Map bubbles
  activeEvent: GameEvent | null; // Currently open modal
}
