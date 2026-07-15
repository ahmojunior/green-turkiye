import type { GameState, Project, ActiveProject, EventNode, Country, Region } from '../types';
import type { QuestState } from '../types/quest';
import { TaxRate } from '../types/enums';
import {
    calculateDailyTax,
    calculatePassiveIncome,
    evaluateQuests,
    getNodeSeverity,
    getNodeBleed,
    clampValue,
    TUNING,
} from '../utils/gameLogic';
import { generateId } from '../utils/id';
import { EVENTS } from '../data/events';
import { getRegion } from '../data/countries';
import { PROJECTS } from '../data/projects';
import { ALL_QUESTS } from '../data/quests';

export type GameAction =
    | { type: 'START_GAME'; payload: { country: Country; region: Region; startBudget: number } }
    | { type: 'RESET_GAME' }
    | { type: 'TICK' }
    | { type: 'SET_TAX_RATE'; payload: TaxRate }
    | { type: 'BUY_PROJECT'; payload: Project }
    | { type: 'OPEN_EVENT'; payload: string } // nodeId
    | { type: 'HANDLE_CHOICE'; payload: number } // choiceIndex
    | { type: 'SET_PAUSED'; payload: boolean }
    | { type: 'CLEAR_QUEST_TOAST' };

export const INITIAL_STATE: GameState = {
    countryId: null,
    regionId: null,
    budget: TUNING.startBudget,
    happiness: TUNING.startHappiness,
    cleanliness: TUNING.startCleanliness,
    taxRate: TaxRate.NORMAL,
    activeProjects: [],
    completedProjectIds: [],
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    day: 1,
    activeNodes: [],
    activeEvent: null,
    eventsSolved: 0,
    sustainDays: 0,
    quests: [],
    questToast: null,
};

const createInitialQuests = (): QuestState[] =>
    ALL_QUESTS.map(q => ({ id: q.id, progress: 0, isCompleted: false }));

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'START_GAME':
            return {
                ...INITIAL_STATE,
                budget: action.payload.startBudget,
                countryId: action.payload.country.id,
                regionId: action.payload.region.id,
                isPlaying: true,
                quests: createInitialQuests(),
            };

        case 'RESET_GAME':
            return INITIAL_STATE;

        case 'SET_TAX_RATE':
            return { ...state, taxRate: action.payload };

        case 'SET_PAUSED':
            return { ...state, isPaused: action.payload };

        case 'CLEAR_QUEST_TOAST':
            return { ...state, questToast: null };

        case 'BUY_PROJECT': {
            const project = action.payload;
            if (state.budget < project.cost) return state;

            if (project.prerequisites) {
                const hasPrereqs = project.prerequisites.every(pId => state.completedProjectIds.includes(pId));
                if (!hasPrereqs) return state;
            }

            return {
                ...state,
                budget: state.budget - project.cost,
                activeProjects: [
                    ...state.activeProjects,
                    { ...project, daysRemaining: project.duration }
                ]
            };
        }

        case 'OPEN_EVENT': {
            const node = state.activeNodes.find(n => n.id === action.payload);
            if (!node) return state;
            const event = EVENTS.find(e => e.id === node.eventId);
            if (!event) return state;

            return {
                ...state,
                activeEvent: event,
                activeNodes: state.activeNodes.filter(n => n.id !== action.payload) // Remove node on open
            };
        }

        case 'HANDLE_CHOICE': {
            if (!state.activeEvent) return state;
            const choice = state.activeEvent.choices[action.payload];

            const budget = state.budget + (choice.effects.budget || 0);
            const happiness = clampValue(state.happiness + (choice.effects.happiness || 0));
            const cleanliness = clampValue(state.cleanliness + (choice.effects.cleanliness || 0));
            const eventsSolved = state.eventsSolved + 1;

            // Resolving an event can push a stat past a goal threshold, or tick the
            // "events solved" counter over the line — so re-score goals here too.
            const result = evaluateQuests(state.quests, {
                budget, happiness, cleanliness, day: state.day, eventsSolved,
            });

            return {
                ...state,
                budget: budget + result.reward.budget,
                happiness: clampValue(happiness + result.reward.happiness),
                cleanliness: clampValue(cleanliness + result.reward.cleanliness),
                eventsSolved,
                quests: result.quests,
                questToast: result.completedTitle ?? state.questToast,
                activeEvent: null,
            };
        }

        case 'TICK': {
            // One TICK advances the game by a single day; useGameLoop handles the timing.
            const currentRegion = getRegion(state.countryId, state.regionId);
            const modifiers = currentRegion?.modifiers;

            const { dailyBudgetChange, dailyHappinessChange } = calculateDailyTax(state.taxRate, modifiers);
            const passive = calculatePassiveIncome(state.completedProjectIds, PROJECTS);

            // Daily decay is the core pressure — a region left alone slowly degrades.
            const happinessDecay = TUNING.happinessDecayPerDay * (modifiers?.happinessDecayMultiplier ?? 1);
            const cleanlinessDecay = TUNING.cleanlinessDecayPerDay * (modifiers?.cleanlinessDecayMultiplier ?? 1);

            let nextBudget = state.budget + dailyBudgetChange + passive.budget;
            let nextHappiness = state.happiness + dailyHappinessChange + passive.happiness - happinessDecay;
            let nextCleanliness = state.cleanliness + passive.cleanliness - cleanlinessDecay;

            // Advance projects; apply one-time effects for the ones that finish today.
            const nextActiveProjects: ActiveProject[] = [];
            const nextCompletedProjects = [...state.completedProjectIds];
            for (const p of state.activeProjects) {
                const remaining = p.daysRemaining - 1;
                if (remaining <= 0) {
                    nextCompletedProjects.push(p.id);
                    if (p.effects.happiness) nextHappiness += p.effects.happiness;
                    if (p.effects.cleanliness) nextCleanliness += p.effects.cleanliness;
                } else {
                    nextActiveProjects.push({ ...p, daysRemaining: remaining });
                }
            }

            const nextDay = state.day + 1;

            // Crisis nodes escalate the longer they're ignored: each active node
            // bleeds stats every day (more as it grows more severe), and a node left
            // until it erupts deals a big one-time hit before disappearing.
            const survivingNodes: EventNode[] = [];
            let eruptions = 0;
            for (const n of state.activeNodes) {
                if (nextDay - n.spawnDay >= TUNING.nodeEruptionDays) {
                    eruptions++;
                    continue;
                }
                const bleed = getNodeBleed(getNodeSeverity(n.spawnDay, nextDay));
                nextHappiness -= bleed.happiness;
                nextCleanliness -= bleed.cleanliness;
                survivingNodes.push(n);
            }
            if (eruptions > 0) {
                nextHappiness -= eruptions * TUNING.nodeEruptionHappinessPenalty;
                nextCleanliness -= eruptions * TUNING.nodeEruptionCleanlinessPenalty;
            }

            nextHappiness = clampValue(nextHappiness);
            nextCleanliness = clampValue(nextCleanliness);

            // Goals (day / passive-stat thresholds) may complete this tick.
            const result = evaluateQuests(state.quests, {
                budget: nextBudget, happiness: nextHappiness, cleanliness: nextCleanliness,
                day: nextDay, eventsSolved: state.eventsSolved,
            });
            nextBudget += result.reward.budget;
            nextHappiness = clampValue(nextHappiness + result.reward.happiness);
            nextCleanliness = clampValue(nextCleanliness + result.reward.cleanliness);

            // Victory is earned by *sustaining* both stats, not by a one-off spike.
            const holding = nextHappiness >= TUNING.sustainThreshold && nextCleanliness >= TUNING.sustainThreshold;
            const nextSustainDays = holding ? state.sustainDays + 1 : 0;

            let isGameOver = false;
            let isVictory = false;
            if (nextBudget <= 0 || nextHappiness <= 0 || nextCleanliness <= 0) {
                isGameOver = true;
            } else if (nextSustainDays >= TUNING.sustainGoalDays) {
                isVictory = true;
                isGameOver = true;
            }

            // Spawn a new crisis node (region frequency scales the odds).
            let newNodes = survivingNodes;
            if (!isGameOver) {
                const spawnChance = TUNING.baseSpawnChance * (modifiers?.eventFrequencyMultiplier ?? 1);
                if (Math.random() < spawnChance && newNodes.length < TUNING.maxNodes) {
                    const relevantEvents = EVENTS.filter(e => !e.regionId || e.regionId === state.regionId);
                    if (relevantEvents.length > 0) {
                        const randomEvent = relevantEvents[Math.floor(Math.random() * relevantEvents.length)];
                        let spawnX = 50;
                        let spawnY = 50;

                        if (currentRegion?.spawnPoints && currentRegion.spawnPoints.length > 0) {
                            const randomPoint = currentRegion.spawnPoints[Math.floor(Math.random() * currentRegion.spawnPoints.length)];
                            spawnX = randomPoint.x + (Math.random() * 5 - 2.5);
                            spawnY = randomPoint.y + (Math.random() * 5 - 2.5);
                        }

                        const newNode: EventNode = {
                            id: generateId(),
                            eventId: randomEvent.id,
                            x: spawnX,
                            y: spawnY,
                            spawnDay: nextDay
                        };
                        newNodes = [...newNodes, newNode];
                    }
                }
            }

            return {
                ...state,
                day: nextDay,
                budget: nextBudget,
                happiness: nextHappiness,
                cleanliness: nextCleanliness,
                activeProjects: nextActiveProjects,
                completedProjectIds: nextCompletedProjects,
                activeNodes: newNodes,
                sustainDays: nextSustainDays,
                quests: result.quests,
                questToast: result.completedTitle ?? state.questToast,
                isPlaying: !isGameOver,
                isGameOver,
                isVictory,
            };
        }

        default:
            return state;
    }
}
