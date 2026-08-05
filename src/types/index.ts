import { Difficulty, TaxRate } from './enums';
import type { QuestState } from './quest';

export type LocalizedText = { tr: string; en: string; de: string };

export interface RegionModifiers {
  budgetMultiplier?: number;           // scales daily tax income
  happinessDecayMultiplier?: number;   // scales daily happiness decay
  cleanlinessDecayMultiplier?: number; // scales daily cleanliness decay
  eventFrequencyMultiplier?: number;   // scales crisis-node spawn chance
}

export interface Region {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  difficulty: Difficulty;
  spawnPoints?: { x: number; y: number }[];
  // Fixed on-map plot per project id, where its building sprite lands once completed.
  buildSlots?: Record<string, { x: number; y: number }>;
  modifiers?: RegionModifiers;
}

export interface ProvincePath {
  name: string;
  region: string;
  d: string;
}

export interface Country {
  id: string;
  name: LocalizedText;
  icon: string; // filename under public/, e.g. 'tr-icon.png'
  viewBoxWidth: number;
  viewBoxHeight: number;
  provincePaths: ProvincePath[];
  regions: Region[];
}

export interface GameEvent {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  regionId?: string;
  choices: EventChoice[];
}

export interface EventChoice {
  text: LocalizedText;
  effects: {
    budget?: number;
    happiness?: number;
    cleanliness?: number;
  };
}

export interface Project {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  cost: number;
  duration: number;
  prerequisites?: string[]; // Project IDs
  effects: {
    // One-time bonuses applied when the project finishes
    happiness?: number;
    cleanliness?: number;
    // Passive income applied every day while the project stays completed
    budgetPerTurn?: number;
    happinessPerTurn?: number;
    cleanlinessPerTurn?: number;
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
  spawnDay: number; // Game day it appeared — drives severity/escalation
}

export interface GameState {
  countryId: string | null;
  regionId: string | null;
  budget: number;
  happiness: number;
  cleanliness: number;
  taxRate: TaxRate;
  activeProjects: ActiveProject[];
  completedProjectIds: string[];
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isVictory: boolean;
  day: number;
  activeNodes: EventNode[];
  activeEvent: GameEvent | null;
  eventsSolved: number;        // crisis events resolved this run (for goals)
  sustainDays: number;         // consecutive days both stats held above the win threshold
  quests: QuestState[];        // active goals
  questToast: LocalizedText | null;   // title of the most recently completed goal, for UI toast
  usedEventIds: string[];      // events already drawn this cycle — spawn draws from the complement, reshuffling once exhausted
}
