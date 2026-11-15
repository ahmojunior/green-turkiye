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
  // Crisis nodes and project sites are placed from the province geometry of the
  // region (see utils/geometry.ts), not from coordinates stored here.
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

/**
 * What a crisis is about. One scalar "cleanliness" bar cannot teach that burning
 * waste moves a problem from the soil to the air, so every event says which
 * medium it belongs to. The bars stay as they are for now; these tags are what
 * a multi-medium model, the map layers and the codex will all read later.
 */
export type PollutionTag =
  | 'air'
  | 'water'          // rivers, lakes, drinking water
  | 'marine'
  | 'groundwater'    // quantity as well as quality
  | 'soil'
  | 'waste'
  | 'biodiversity'
  | 'energy'
  | 'landuse'
  | 'hazard'         // floods, earthquakes, fire, frost
  | 'heritage'
  | 'noise'
  | 'light';

/**
 * Where a crisis happens. Province names must match the map data exactly, which
 * the event validator checks: this is what lets a node spawn on the province the
 * text is actually about instead of anywhere in the region.
 */
export interface EventLocation {
  provinces: string[];
  basin?: string;      // river basin or sea area, where the event is about one
  nationwide?: boolean; // policy events that belong to no single province
}

export interface EventTags {
  pollution: PollutionTag[];
  /** Named mechanisms (eutrophication, rebound-effect, ...) — codex hooks. */
  mechanisms?: string[];
}

/**
 * Where a figure or a claim in an event comes from. Every number shown to a
 * student has to be traceable, so an event that carries a claim carries its
 * source with it. Anything that cannot be sourced does not ship.
 */
export interface SourceRef {
  label: string;
  url: string;
  status: 'verified' | 'partly-verified';
}

/**
 * The "Ne oldu?" (What happened?) card shown after a decision: what followed,
 * and the causal chain that produced it. Feedback that only moves a number
 * verifies the answer without ever explaining it.
 */
export interface ChoiceOutcome {
  what: LocalizedText;
  why: LocalizedText;
}

export interface GameEvent {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  regionId?: string;
  location?: EventLocation;
  tags?: EventTags;
  sources?: SourceRef[];
  choices: EventChoice[];
}

export interface Effects {
  budget?: number;
  happiness?: number;
  cleanliness?: number;
}

/**
 * A consequence that lands days after the decision. Pollution is a stock, not
 * a flow: an aquifer keeps falling, mucilage comes back the next summer, waste
 * sent abroad becomes someone else's court case. Applying everything at the
 * moment of the click taught the opposite — that any damage can be bought back
 * immediately.
 */
export interface DelayedEffect {
  inDays: number;
  effects: Effects;
  message: LocalizedText;
}

export interface EventChoice {
  text: LocalizedText;
  effects: Effects;
  outcome?: ChoiceOutcome;
  delayed?: DelayedEffect[];
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

/** A consequence booked for a later day, with the line shown when it lands. */
export interface ScheduledEffect {
  dueDay: number;
  effects: Effects;
  message: LocalizedText;
}

/** Goal completions and delayed consequences share one notification queue. */
export interface Toast {
  text: LocalizedText;
  kind: 'quest' | 'delayed';
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
  // Set while the explainer for the choice just taken is still on screen.
  // The event stays active meanwhile, which is what keeps the clock paused.
  pendingOutcome: { eventId: string; choiceIndex: number } | null;
  eventsSolved: number;        // crisis events resolved this run (for goals)
  sustainDays: number;         // consecutive days both stats held above the win threshold
  quests: QuestState[];        // active goals
  toasts: Toast[];             // notifications waiting to be shown, oldest first
  scheduled: ScheduledEffect[]; // consequences booked by earlier decisions
  rngSeed: number;             // seeded RNG state: same seed + same inputs = same run
  usedEventIds: string[];      // events already drawn this cycle — spawn draws from the complement, reshuffling once exhausted
}
