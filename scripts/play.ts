// Headless player shared by the balance sim and the replay test. It drives the
// real reducer with simple policies, exactly as the UI would dispatch.
import { gameReducer, INITIAL_STATE } from '../src/reducers/gameReducer';
import { COUNTRIES } from '../src/data/countries';
import { getProjectsForRegion } from '../src/data/projects';
import { TaxRate } from '../src/types/enums';
import type { EventChoice, GameState } from '../src/types';

// Rough seconds a player spends per action, used only to estimate a run's length.
export const SECONDS = { decision: 15, endDay: 4, project: 8 };
const MAX_DAYS = 150;

export interface Policy {
    choose: (s: GameState, choices: EventChoice[]) => number;
    tax?: TaxRate;
    handle?: boolean; // false = never opens a crisis
}

const total = (c: EventChoice, withDelayed: boolean) => {
    const sum = { budget: c.effects.budget ?? 0, happiness: c.effects.happiness ?? 0, cleanliness: c.effects.cleanliness ?? 0 };
    if (withDelayed) for (const d of c.delayed ?? []) {
        sum.budget += d.effects.budget ?? 0;
        sum.happiness += d.effects.happiness ?? 0;
        sum.cleanliness += d.effects.cleanliness ?? 0;
    }
    return sum;
};
const argmax = (xs: number[]) => xs.indexOf(Math.max(...xs));

// Weighs each stat by how close it is to zero, delayed costs included.
const smart: Policy['choose'] = (s, cs) => argmax(cs.map(c => {
    const t = total(c, true);
    return t.budget / (s.budget < 200 ? 4 : 12) + t.happiness * (100 / Math.max(10, s.happiness)) + t.cleanliness * (100 / Math.max(10, s.cleanliness));
}));

export const POLICIES: Record<string, Policy> = {
    smart: { choose: smart },
    // Always takes the bribe when one is offered, otherwise the most money.
    bribe: { choose: (_s, cs) => { const b = cs.findIndex(c => c.bribe); return b >= 0 ? b : argmax(cs.map(c => total(c, true).budget)); } },
    // Never bribes; always the cleanest option.
    clean: { choose: (_s, cs) => argmax(cs.map(c => (c.bribe ? -Infinity : total(c, true).cleanliness))) },
    maxTax: { choose: smart, tax: TaxRate.HIGH },
    // Best immediate total, blind to anything that lands later.
    greedy: { choose: (_s, cs) => argmax(cs.map(c => { const t = total(c, false); return t.budget / 10 + t.happiness + t.cleanliness; })) },
    random: { choose: (s, cs) => Math.abs(s.rngSeed + s.day) % cs.length },
    idle: { choose: smart, handle: false },
};

export interface RunResult {
    state: GameState;
    win: boolean;
    days: number;
    seconds: number;
    timeout: boolean;
    eventsOpened: string[];
}

export function play(policy: Policy, seed: number): RunResult {
    const country = COUNTRIES[Math.abs(seed) % COUNTRIES.length];
    const region = country.regions[Math.abs(seed >> 3) % country.regions.length];
    let s = gameReducer(INITIAL_STATE, { type: 'START_GAME', payload: { country, region, startBudget: INITIAL_STATE.budget, seed } });
    if (policy.tax) s = gameReducer(s, { type: 'SET_TAX_RATE', payload: policy.tax });
    let seconds = 0;
    const eventsOpened: string[] = [];
    while (!s.isGameOver && s.day < MAX_DAYS) {
        if (policy.handle !== false) {
            for (const n of [...s.activeNodes]) {
                s = gameReducer(s, { type: 'OPEN_EVENT', payload: n.id });
                if (!s.activeEvent) continue;
                eventsOpened.push(s.activeEvent.id);
                s = gameReducer(s, { type: 'HANDLE_CHOICE', payload: policy.choose(s, s.activeEvent.choices) });
                s = gameReducer(s, { type: 'DISMISS_OUTCOME' });
                seconds += SECONDS.decision;
                if (s.isGameOver) break;
            }
            if (s.isGameOver) break;
            const owned = new Set([...s.completedProjectIds, ...s.activeProjects.map(p => p.id)]);
            const next = getProjectsForRegion(s.regionId).find(p => !owned.has(p.id) && s.budget - p.cost >= 150
                && (p.prerequisites ?? []).every(r => s.completedProjectIds.includes(r)));
            if (next) { s = gameReducer(s, { type: 'BUY_PROJECT', payload: next }); seconds += SECONDS.project; }
        }
        s = gameReducer(s, { type: 'TICK' });
        seconds += SECONDS.endDay;
    }
    return { state: s, win: s.isVictory, days: s.day, seconds, timeout: !s.isGameOver, eventsOpened };
}
