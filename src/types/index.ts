import { Difficulty, TaxRate } from './enums';

export type Resource = 'budget' | 'happiness' | 'cleanliness';

export interface RegionModifiers {
  budgetMultiplier?: number;
  happinessMultiplier?: number;
  cleanlinessMultiplier?: number;
  eventFrequency?: number;
}

export interface Region {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  spawnPoints?: { x: number; y: number }[];
  modifiers?: RegionModifiers;
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
  prerequisites?: string[]; // Project IDs
  effects: {
    happiness?: number;
    cleanliness?: number;
    budgetPerTurn?: number;
  };
}

export interface ActiveProject extends Project {
  daysRemaining: number;
}

export { TaxRate };

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
  isVictory: boolean;
  day: number;
  activeNodes: EventNode[];
  activeEvent: GameEvent | null;
}
