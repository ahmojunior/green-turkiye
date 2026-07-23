import { TaxRate } from '../types/enums';
import type { LocalizedText, Project, RegionModifiers } from '../types';
import type { QuestState } from '../types/quest';
import { ALL_QUESTS } from '../data/quests';

// ---------------------------------------------------------------------------
// Central balance tuning. Keeping every magic number here makes the game easy
// to rebalance without hunting through the reducer.
// ---------------------------------------------------------------------------
export const TUNING = {
    // Starting stats — a little breathing room before decay bites.
    startBudget: 500,
    startHappiness: 40,
    startCleanliness: 40,

    // Daily passive decay. Cleanliness rots faster than morale (pollution theme).
    happinessDecayPerDay: 1,
    cleanlinessDecayPerDay: 2,

    // Victory: hold BOTH stats at/above the threshold for N consecutive days.
    sustainThreshold: 85,
    sustainGoalDays: 12,

    // Crisis nodes. Instead of a hard timeout, a node escalates the longer it is
    // ignored: it bleeds stats every day, gets more severe every few days, and
    // finally erupts for a big one-time hit. This forces triage over reflex-clicking.
    baseSpawnChance: 0.45,
    maxNodes: 3,
    nodeEscalationDays: 4,   // every N unhandled days, severity rises by 1
    nodeMaxSeverity: 3,
    nodeEruptionDays: 12,    // a node this old erupts and is removed
    nodeEruptionHappinessPenalty: 12,
    nodeEruptionCleanlinessPenalty: 15,
} as const;

// A node's severity (1..max) grows with how long it has gone unhandled.
export const getNodeSeverity = (spawnDay: number, currentDay: number): number => {
    const age = currentDay - spawnDay;
    return Math.min(TUNING.nodeMaxSeverity, 1 + Math.floor(age / TUNING.nodeEscalationDays));
};

// Per-day stat bleed inflicted by an active node, scaled by its severity.
// Fresh (severity 1) crises are a grace-period warning that costs nothing yet —
// the pressure ramps up as they escalate, and the real punishment is eruption.
export const getNodeBleed = (severity: number): { happiness: number; cleanliness: number } => {
    switch (severity) {
        case 3: return { happiness: 3, cleanliness: 3 };
        case 2: return { happiness: 1, cleanliness: 1 };
        default: return { happiness: 0, cleanliness: 0 };
    }
};

// Daily budget/happiness change from the chosen tax rate, scaled by the region's
// tax base. Higher tax funds projects but erodes morale — a real trade-off now
// that happiness also decays every day.
export const calculateDailyTax = (
    rate: TaxRate,
    modifiers?: RegionModifiers
) => {
    let dailyBudgetChange = 0;
    let dailyHappinessChange = 0;

    if (rate === TaxRate.LOW) {
        dailyBudgetChange -= 2;
        dailyHappinessChange += 2;
    } else if (rate === TaxRate.NORMAL) {
        dailyBudgetChange += 8;
    } else if (rate === TaxRate.HIGH) {
        dailyBudgetChange += 18;
        dailyHappinessChange -= 2;
    }

    if (modifiers?.budgetMultiplier) {
        dailyBudgetChange *= modifiers.budgetMultiplier;
    }

    return { dailyBudgetChange, dailyHappinessChange };
};

// Passive per-turn income from every completed project.
export const calculatePassiveIncome = (
    completedProjectIds: string[],
    projects: Project[]
) => {
    let budget = 0;
    let happiness = 0;
    let cleanliness = 0;

    for (const pId of completedProjectIds) {
        const proj = projects.find(p => p.id === pId);
        if (!proj) continue;
        budget += proj.effects.budgetPerTurn ?? 0;
        happiness += proj.effects.happinessPerTurn ?? 0;
        cleanliness += proj.effects.cleanlinessPerTurn ?? 0;
    }

    return { budget, happiness, cleanliness };
};

export const clampValue = (value: number, min: number = 0, max: number = 100) => {
    return Math.max(min, Math.min(max, value));
};

export interface QuestEvaluation {
    quests: QuestState[];
    reward: { budget: number; happiness: number; cleanliness: number };
    // Title of a goal completed during this evaluation, for the UI toast (last one wins).
    completedTitle: LocalizedText | null;
}

// Re-scores every active goal against the current stats. Newly completed goals
// contribute their reward, which the reducer then applies to the player's stats.
export const evaluateQuests = (
    questStates: QuestState[],
    stats: { budget: number; happiness: number; cleanliness: number; day: number; eventsSolved: number; sustainDays: number }
): QuestEvaluation => {
    let changed = false;
    const reward = { budget: 0, happiness: 0, cleanliness: 0 };
    let completedTitle: LocalizedText | null = null;

    const quests = questStates.map(qs => {
        if (qs.isCompleted) return qs;

        const def = ALL_QUESTS.find(q => q.id === qs.id);
        if (!def) return qs;

        const progress = stats[def.stat];

        if (progress >= def.target) {
            changed = true;
            reward.budget += def.reward.budget ?? 0;
            reward.happiness += def.reward.happiness ?? 0;
            reward.cleanliness += def.reward.cleanliness ?? 0;
            completedTitle = def.title;
            return { ...qs, progress: def.target, isCompleted: true };
        }

        if (progress !== qs.progress) {
            changed = true;
            return { ...qs, progress };
        }

        return qs;
    });

    return { quests: changed ? quests : questStates, reward, completedTitle };
};
