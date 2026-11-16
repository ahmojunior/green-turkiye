import type { GameState, Project, ActiveProject, EventNode, Country, Region, ScheduledEffect, Letter, LetterKind, NewsItem, StatKey } from '../types';
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
import { nextRandom } from '../utils/rng';
import { getProvinceSpawnPoints, getRegionSpawnPoints } from '../utils/geometry';
import { EVENTS } from '../data/events';
import { getRegion } from '../data/countries';
import { PROJECTS } from '../data/projects';
import { ALL_QUESTS } from '../data/quests';
import { CHARACTERS, isCleanChoice, isDirtyDeal } from '../data/story';

export type GameAction =
    | { type: 'START_GAME'; payload: { country: Country; region: Region; startBudget: number; seed: number } }
    | { type: 'RESET_GAME' }
    | { type: 'TICK' }
    | { type: 'SET_TAX_RATE'; payload: TaxRate }
    | { type: 'BUY_PROJECT'; payload: Project }
    | { type: 'OPEN_EVENT'; payload: string } // nodeId
    | { type: 'HANDLE_CHOICE'; payload: number } // choiceIndex
    | { type: 'DISMISS_OUTCOME' }
    | { type: 'CLEAR_QUEST_TOAST' }
    | { type: 'READ_LETTER'; payload: string }; // letterId

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
    isGameOver: false,
    isVictory: false,
    day: 1,
    activeNodes: [],
    activeEvent: null,
    pendingOutcome: null,
    eventsSolved: 0,
    sustainDays: 0,
    quests: [],
    toasts: [],
    scheduled: [],
    rngSeed: 0,
    usedEventIds: [],
    actionLog: [],
    decisions: [],
    holdingTier: 0,
    coopTier: 0,
    cleanChoices: 0,
    letters: [],
    news: [],
    firstCritical: null,
    dayReport: null,
};

// The first stat to cross the critical line stays recorded for the debrief.
const markCritical = (
    prev: GameState['firstCritical'],
    s: Record<StatKey, number>,
    day: number,
): GameState['firstCritical'] => {
    if (prev) return prev;
    if (s.cleanliness < TUNING.criticalStat) return { stat: 'cleanliness', day };
    if (s.happiness < TUNING.criticalStat) return { stat: 'happiness', day };
    if (s.budget < TUNING.criticalBudget) return { stat: 'budget', day };
    return null;
};

// Adds a letter from one of the region's citizens. They take turns, so each
// character keeps writing over the run and can bring up what they saw earlier.
const addLetter = (
    letters: Letter[],
    regionId: string | null,
    kind: LetterKind,
    day: number,
    extra: Partial<Letter> = {},
): Letter[] => {
    const cast = CHARACTERS[regionId ?? ''] ?? [];
    if (cast.length === 0) return letters;
    return [...letters, {
        id: `letter-${day}-${letters.length}`,
        day, kind, read: false,
        characterId: cast[letters.length % cast.length].id,
        ...extra,
    }];
};

const createInitialQuests = (): QuestState[] =>
    ALL_QUESTS.map(q => ({ id: q.id, progress: 0, isCompleted: false }));

// Rolls for one new crisis node on `day`; with `force` it skips the roll.
// Until the first crisis is solved only one node may be open, so a new player
// meets a single decision at a time.
function spawnNode(state: GameState, day: number, force: boolean): Pick<GameState, 'activeNodes' | 'usedEventIds' | 'rngSeed'> {
    const modifiers = getRegion(state.countryId, state.regionId)?.modifiers;
    let newNodes = state.activeNodes;
    let newUsedEventIds = state.usedEventIds;
    // Every random draw threads the seed through state, so a run with the
    // same seed and the same inputs always plays out identically.
    let rngSeed = state.rngSeed;
    const spawnChance = TUNING.baseSpawnChance * (modifiers?.eventFrequencyMultiplier ?? 1);
    const spawnRoll = nextRandom(rngSeed);
    rngSeed = spawnRoll.seed;
    const cap = state.eventsSolved === 0 ? 1 : TUNING.maxNodes;
    if ((force || spawnRoll.value < spawnChance) && newNodes.length < cap) {
        const relevantEvents = EVENTS.filter(e => (!e.regionId || e.regionId === state.regionId)
            && (!e.requiresHolding || state.holdingTier >= e.requiresHolding));
        // Draw from the events not yet seen this cycle so the same crisis can't
        // resurface right away; once every relevant event has been drawn, the
        // bag reshuffles (starting fresh with just this draw) instead of the
        // pool going dry and starving the player of new content. The just-drawn
        // event is excluded from the reshuffled bag too, so a cycle boundary
        // can't produce the exact back-to-back repeat this is meant to prevent.
        const lastDrawnId = state.usedEventIds[state.usedEventIds.length - 1];
        const unseen = relevantEvents.filter(e => !state.usedEventIds.includes(e.id));
        const reshuffled = relevantEvents.filter(e => e.id !== lastDrawnId);
        const pool = unseen.length > 0 ? unseen : (reshuffled.length > 0 ? reshuffled : relevantEvents);
        if (pool.length > 0) {
            const eventDraw = nextRandom(rngSeed);
            rngSeed = eventDraw.seed;
            const randomEvent = pool[Math.floor(eventDraw.value * pool.length)];
            newUsedEventIds = unseen.length > 0
                ? [...state.usedEventIds, randomEvent.id]
                : [randomEvent.id];
            // A crisis lands on a spot measured inside a province of this
            // region, so it can no longer appear in a neighbouring region,
            // across a border or out at sea. Where the event names the
            // provinces it is actually about, it spawns on one of those:
            // the Konya sinkhole appears on Konya, not wherever the region
            // happens to have room. Spots already taken are skipped, so two
            // nodes cannot hide each other.
            const located = getProvinceSpawnPoints(state.countryId, state.regionId, randomEvent.location?.provinces);
            const spawnPoints = located.length > 0
                ? located
                : getRegionSpawnPoints(state.countryId, state.regionId);
            const free = spawnPoints.filter(
                p => !newNodes.some(n => n.x === p.x && n.y === p.y)
            );
            const usable = free.length > 0 ? free : spawnPoints;
            let spawnX = 50;
            let spawnY = 50;

            if (usable.length > 0) {
                const placeDraw = nextRandom(rngSeed);
                rngSeed = placeDraw.seed;
                const point = usable[Math.floor(placeDraw.value * usable.length)];
                spawnX = point.x;
                spawnY = point.y;
            }

            const newNode: EventNode = {
                // One spawn per tick, so the day is a stable unique id.
                id: `node-${day}`,
                eventId: randomEvent.id,
                x: spawnX,
                y: spawnY,
                spawnDay: day
            };
            newNodes = [...newNodes, newNode];
        }
    }
    return { activeNodes: newNodes, usedEventIds: newUsedEventIds, rngSeed };
}

// Wraps the reducer so every action that changes state is recorded. A no-op
// (e.g. buying without money) leaves no trace, and replaying the log rebuilds
// the same state. RESET_GAME clears it with the rest of the run.
export function gameReducer(state: GameState, action: GameAction): GameState {
    const next = reduce(state, action);
    if (next === state || action.type === 'RESET_GAME') return next;
    return { ...next, actionLog: [...next.actionLog, action] };
}

function reduce(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case 'START_GAME': {
            const started: GameState = {
                ...INITIAL_STATE,
                budget: action.payload.startBudget,
                countryId: action.payload.country.id,
                regionId: action.payload.region.id,
                rngSeed: action.payload.seed,
                isPlaying: true,
                quests: createInitialQuests(),
            };
            // The first crisis is on the map from the start, so the first
            // decision comes before the player has to learn "End Day".
            return { ...started, ...spawnNode(started, started.day, true) };
        }

        case 'RESET_GAME':
            return INITIAL_STATE;

        case 'SET_TAX_RATE':
            return { ...state, taxRate: action.payload };

        case 'READ_LETTER': {
            if (!state.letters.some(l => l.id === action.payload && !l.read)) return state;
            return { ...state, letters: state.letters.map(l => (l.id === action.payload ? { ...l, read: true } : l)) };
        }

        case 'CLEAR_QUEST_TOAST':
            // Drops the toast on screen and lets the next queued one through.
            return { ...state, toasts: state.toasts.slice(1) };

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
                pendingOutcome: null,
                activeNodes: state.activeNodes.filter(n => n.id !== action.payload) // Remove node on open
            };
        }

        case 'DISMISS_OUTCOME':
            return { ...state, activeEvent: null, pendingOutcome: null };

        case 'HANDLE_CHOICE': {
            if (!state.activeEvent || state.pendingOutcome) return state;
            const choice = state.activeEvent.choices[action.payload];
            const eventId = state.activeEvent.id;

            const budget = state.budget + (choice.effects.budget || 0);
            const happiness = clampValue(state.happiness + (choice.effects.happiness || 0));
            const cleanliness = clampValue(state.cleanliness + (choice.effects.cleanliness || 0));
            const eventsSolved = state.eventsSolved + 1;

            // Resolving an event can push a stat past a goal threshold, or tick the
            // "events solved" counter over the line — so re-score goals here too.
            const result = evaluateQuests(state.quests, {
                budget, happiness, cleanliness, day: state.day, eventsSolved,
                sustainDays: state.sustainDays,
            });

            const nextBudget = budget + result.reward.budget;
            const nextHappiness = clampValue(happiness + result.reward.happiness);
            const nextCleanliness = clampValue(cleanliness + result.reward.cleanliness);

            // A choice can bankrupt the region outright, so the run ends here.
            // Deferring the check to the next TICK let the player keep playing on
            // stats that were already fatal, and even recover from them.
            const isGameOver = nextBudget <= 0 || nextHappiness <= 0 || nextCleanliness <= 0;

            // Where the choice carries an explainer, the modal stays open on it:
            // the effect is already applied, and the card is the only place the
            // player is told *why* it happened. A run that just ended skips it,
            // because the game-over screen takes the screen anyway.
            const explain = !!choice.outcome && !isGameOver;

            // Dirty deals grow Kara Holding one step each; every second clean
            // choice grows the co-op. Both make the news the same moment.
            const dirty = isDirtyDeal(choice);
            const cleanChoices = state.cleanChoices + (isCleanChoice(choice) ? 1 : 0);
            const holdingTier = dirty ? Math.min(5, state.holdingTier + 1) : state.holdingTier;
            const coopTier = Math.min(5, Math.floor(cleanChoices / 2));
            const news: NewsItem[] = [...state.news];
            if (holdingTier > state.holdingTier) news.push({ day: state.day, key: `holding${holdingTier}` });
            if (coopTier > state.coopTier) news.push({ day: state.day, key: `coop${coopTier}` });

            return {
                ...state,
                budget: nextBudget,
                happiness: nextHappiness,
                cleanliness: nextCleanliness,
                eventsSolved,
                decisions: [...state.decisions, { day: state.day, eventId, choiceIndex: action.payload, dirty }],
                holdingTier, coopTier, cleanChoices, news,
                firstCritical: markCritical(state.firstCritical, { budget: nextBudget, happiness: nextHappiness, cleanliness: nextCleanliness }, state.day),
                quests: result.quests,
                toasts: [...state.toasts, ...result.completedTitles.map(text => ({ text, kind: 'quest' as const }))],
                // Consequences this choice books for later. They land on their own
                // day, long after the modal is closed and forgotten.
                scheduled: [
                    ...state.scheduled,
                    ...(choice.delayed ?? []).map(d => ({
                        dueDay: state.day + d.inDays, effects: d.effects, message: d.message,
                        causeDay: state.day, eventId, choiceIndex: action.payload,
                    })),
                ],
                activeEvent: explain ? state.activeEvent : null,
                pendingOutcome: explain
                    ? { eventId: state.activeEvent.id, choiceIndex: action.payload }
                    : null,
                isPlaying: !isGameOver,
                isGameOver,
            };
        }

        case 'TICK': {
            // One TICK advances the game by a single day. The player ends the day
            // themselves, but never with a crisis card still open.
            if (!state.isPlaying || state.activeEvent) return state;
            const currentRegion = getRegion(state.countryId, state.regionId);
            const modifiers = currentRegion?.modifiers;

            const { dailyBudgetChange, dailyHappinessChange } = calculateDailyTax(state.taxRate, modifiers);
            const passive = calculatePassiveIncome(state.completedProjectIds, PROJECTS);

            // Daily decay is the core pressure — a region left alone slowly degrades.
            const happinessDecay = TUNING.happinessDecayPerDay * (modifiers?.happinessDecayMultiplier ?? 1);
            const cleanlinessDecay = TUNING.cleanlinessDecayPerDay * (modifiers?.cleanlinessDecayMultiplier ?? 1);

            let nextBudget = state.budget + dailyBudgetChange + passive.budget;
            let nextHappiness = state.happiness + dailyHappinessChange + passive.happiness - happinessDecay;
            // Kara Holding's plants pollute every day; the co-op cleans a little.
            let nextCleanliness = state.cleanliness + passive.cleanliness - cleanlinessDecay
                - TUNING.holdingDecayPerTier * state.holdingTier + TUNING.coopCleanPerTier * state.coopTier;

            // Consequences booked days ago come due. Using <= rather than === so a
            // scheduled item can never be skipped.
            const dueToday: ScheduledEffect[] = [];
            const stillPending: ScheduledEffect[] = [];
            for (const item of state.scheduled) {
                (item.dueDay <= state.day + 1 ? dueToday : stillPending).push(item);
            }
            for (const item of dueToday) {
                nextBudget += item.effects.budget ?? 0;
                nextHappiness += item.effects.happiness ?? 0;
                nextCleanliness += item.effects.cleanliness ?? 0;
            }

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

            // Victory is earned by *sustaining* both stats, not by a one-off spike.
            // Computed here (before evaluateQuests) so a sustainDays-based goal sees
            // the correct value for the day that just ticked, not a stale one.
            const holding = nextHappiness >= TUNING.sustainThreshold && nextCleanliness >= TUNING.sustainThreshold;
            const nextSustainDays = holding ? state.sustainDays + 1 : 0;

            // Goals (day / passive-stat thresholds) may complete this tick.
            const result = evaluateQuests(state.quests, {
                budget: nextBudget, happiness: nextHappiness, cleanliness: nextCleanliness,
                day: nextDay, eventsSolved: state.eventsSolved, sustainDays: nextSustainDays,
            });
            nextBudget += result.reward.budget;
            nextHappiness = clampValue(nextHappiness + result.reward.happiness);
            nextCleanliness = clampValue(nextCleanliness + result.reward.cleanliness);

            let isGameOver = false;
            let isVictory = false;
            if (nextBudget <= 0 || nextHappiness <= 0 || nextCleanliness <= 0) {
                isGameOver = true;
            } else if (nextSustainDays >= TUNING.sustainGoalDays) {
                isVictory = true;
                isGameOver = true;
            }

            // Letters: delayed costs arrive by mail, dirty deals are remembered a
            // few days later, and each mood letter comes at most once per run.
            let letters = state.letters;
            for (const item of dueToday) {
                letters = addLetter(letters, state.regionId, 'delayed', nextDay, {
                    eventId: item.eventId, causeDay: item.causeDay, message: item.message, effects: item.effects,
                });
            }
            for (const d of state.decisions) {
                if (d.dirty && d.day + TUNING.dirtyLetterDays === nextDay) {
                    letters = addLetter(letters, state.regionId, 'dirty', nextDay, { eventId: d.eventId, causeDay: d.day });
                }
            }
            const sent = (k: LetterKind) => letters.some(l => l.kind === k);
            const mood: LetterKind | null =
                nextCleanliness < 30 && !sent('cleanBad') ? 'cleanBad'
                : nextHappiness < 30 && !sent('happyBad') ? 'happyBad'
                : nextCleanliness >= 70 && !sent('cleanGood') ? 'cleanGood'
                : null;
            if (mood) letters = addLetter(letters, state.regionId, mood, nextDay);

            const news: NewsItem[] = [...state.news];
            for (const id of nextCompletedProjects.slice(state.completedProjectIds.length)) {
                news.push({ day: nextDay, key: 'project', params: { project: id } });
            }
            if (nextSustainDays > 0 && nextSustainDays % 5 === 0) news.push({ day: nextDay, key: 'sustain', params: { days: nextSustainDays } });

            // Spawn a new crisis node (region frequency scales the odds).
            const spawned = isGameOver
                ? { activeNodes: survivingNodes, usedEventIds: state.usedEventIds, rngSeed: state.rngSeed }
                : spawnNode({ ...state, activeNodes: survivingNodes }, nextDay, false);
            const newNodes = spawned.activeNodes;
            const newUsedEventIds = spawned.usedEventIds;
            const rngSeed = spawned.rngSeed;

            return {
                ...state,
                day: nextDay,
                budget: nextBudget,
                happiness: nextHappiness,
                cleanliness: nextCleanliness,
                activeProjects: nextActiveProjects,
                completedProjectIds: nextCompletedProjects,
                activeNodes: newNodes,
                usedEventIds: newUsedEventIds,
                rngSeed,
                sustainDays: nextSustainDays,
                scheduled: stillPending,
                quests: result.quests,
                toasts: [...state.toasts, ...result.completedTitles.map(text => ({ text, kind: 'quest' as const }))],
                letters, news,
                firstCritical: markCritical(state.firstCritical, { budget: nextBudget, happiness: nextHappiness, cleanliness: nextCleanliness }, nextDay),
                dayReport: {
                    day: state.day,
                    budget: nextBudget - state.budget,
                    happiness: nextHappiness - state.happiness,
                    cleanliness: nextCleanliness - state.cleanliness,
                },
                isPlaying: !isGameOver,
                isGameOver,
                isVictory,
            };
        }

        default:
            return state;
    }
}
