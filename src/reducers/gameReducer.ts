import type { GameState, Project, EventNode, Region } from '../types';
import { TaxRate } from '../types/enums';
import { calculateDailyTax, clampValue } from '../utils/gameLogic';
import { EVENTS } from '../data/events';
import { REGIONS } from '../data/regions';
import { PROJECTS } from '../data/projects';

export type GameAction =
    | { type: 'START_GAME'; payload: { region: Region; startBudget: number } }
    | { type: 'RESET_GAME' }
    | { type: 'TICK'; payload: { deltaTime: number } } // deltaTime in seconds (approx)
    | { type: 'SET_TAX_RATE'; payload: TaxRate }
    | { type: 'BUY_PROJECT'; payload: Project }
    | { type: 'OPEN_EVENT'; payload: string } // nodeId
    | { type: 'CLOSE_EVENT' }
    | { type: 'HANDLE_CHOICE'; payload: number } // choiceIndex
    | { type: 'DISMISS_NODE'; payload: string } // nodeId
    | { type: 'SET_PAUSED'; payload: boolean }; // New action

export const INITIAL_STATE: GameState = {
    regionId: null,
    budget: 500,
    happiness: 20,
    cleanliness: 20,
    taxRate: TaxRate.NORMAL,
    activeProjects: [],
    completedProjectIds: [],
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    isVictory: false,
    day: 1,
    activeNodes: [],
    activeEvent: null
};

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'START_GAME':
            return {
                ...INITIAL_STATE,
                budget: action.payload.startBudget,
                regionId: action.payload.region.id,
                isPlaying: true,
            };

        case 'RESET_GAME':
            return INITIAL_STATE;

        case 'SET_TAX_RATE':
            return { ...state, taxRate: action.payload };

        case 'SET_PAUSED':
            return { ...state, isPaused: action.payload };

        case 'BUY_PROJECT': {
            const project = action.payload;
            if (state.budget < project.cost) return state;

            // Check Prerequisites
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

        case 'DISMISS_NODE':
            return {
                ...state,
                activeNodes: state.activeNodes.filter(n => n.id !== action.payload)
            };

        case 'HANDLE_CHOICE': {
            if (!state.activeEvent) return state;
            const choice = state.activeEvent.choices[action.payload];

            const newBudget = state.budget + (choice.effects.budget || 0);
            const newHappiness = clampValue(state.happiness + (choice.effects.happiness || 0));
            const newCleanliness = clampValue(state.cleanliness + (choice.effects.cleanliness || 0));

            return {
                ...state,
                budget: newBudget,
                happiness: newHappiness,
                cleanliness: newCleanliness,
                activeEvent: null,
            };
        }

        case 'TICK': {
            // This is the core logic previously in useEffect
            // We assume TICK is called once per game-day or we track accumulation.
            // For simplicity, let's assume the hook triggers TICK when a day passes.
            // TODO: Logic needs to handle if TICK is called more frequently (frames).
            // But for now, let's keep the logic "per tick is a day" OR the hook controls the timing.
            // The instruction was to use requestAnimationFrame. 
            // If we use RAF, TICK might be called 60 times a second. 
            // We need to separate "Update Frame" from "Game Day Pass".
            // BUT, `useGameLoop` will likely handle the timing and only dispatch 'TICK' when a day should pass.

            const currentRegion = REGIONS.find(r => r.id === state.regionId);
            const modifiers = currentRegion?.modifiers;

            const { dailyBudgetChange, dailyHappinessChange } = calculateDailyTax(
                state.taxRate,
                state.completedProjectIds,
                PROJECTS,
                modifiers
            );

            let nextBudget = state.budget + dailyBudgetChange;
            let nextHappiness = state.happiness + dailyHappinessChange;
            let nextCleanliness = state.cleanliness;

            // Apply Modifiers to Happiness/Cleanliness Logic if we had base decay
            // For now, happiness logic assumes simple tax effect.
            // If we add modifiers for happiness, apply here:
            if (modifiers?.happinessMultiplier && dailyHappinessChange > 0) {
                nextHappiness += dailyHappinessChange * (modifiers.happinessMultiplier - 1);
            }

            // Projects
            const nextActiveProjects = [];
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

            nextHappiness = clampValue(nextHappiness);
            nextCleanliness = clampValue(nextCleanliness);

            // Win/Loss
            let isGameOver = false;
            let isVictory = false;

            if (nextBudget <= 0 || nextHappiness <= 0 || nextCleanliness <= 0) {
                isGameOver = true;
            } else if (nextHappiness >= 100 && nextCleanliness >= 100) {
                isVictory = true;
                isGameOver = true;
            }

            // Random Events Spawning
            const spawnChance = 0.3; // 30% per day
            let newNodes = [...state.activeNodes];
            // Check exisiting nodes expiry
            const nextDay = state.day + 1;
            const hasExpiredNode = newNodes.some(n => n.expiresAt < nextDay);
            if (hasExpiredNode) isGameOver = true; // Timeout failure

            // Spawn new
            if (!isGameOver && Math.random() < spawnChance && newNodes.length < 3) {
                const relevantEvents = EVENTS.filter(e => !e.regionId || e.regionId === state.regionId);
                if (relevantEvents.length > 0) {
                    const randomEvent = relevantEvents[Math.floor(Math.random() * relevantEvents.length)];
                    const currentRegion = REGIONS.find(r => r.id === state.regionId);
                    let spawnX = 50;
                    let spawnY = 50;

                    if (currentRegion?.spawnPoints && currentRegion.spawnPoints.length > 0) {
                        const randomPoint = currentRegion.spawnPoints[Math.floor(Math.random() * currentRegion.spawnPoints.length)];
                        spawnX = randomPoint.x + (Math.random() * 5 - 2.5);
                        spawnY = randomPoint.y + (Math.random() * 5 - 2.5);
                    }

                    const newNode: EventNode = {
                        id: Math.random().toString(36).substr(2, 9),
                        eventId: randomEvent.id,
                        x: spawnX,
                        y: spawnY,
                        expiresAt: nextDay + 8
                    };
                    newNodes.push(newNode);
                }
            }

            if (isGameOver) {
                // Should handle side effects like localStorage in a side-effect hook or middleware, 
                // but strict reducer shouldn't do side effects. 
                // For now, we'll keep side effects out of reducer.
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
                isPlaying: !isGameOver,
                isGameOver: isGameOver,
                isVictory: isVictory
            };
        }

        default:
            return state;
    }
}
