// Replay test: a run's actionLog, replayed from INITIAL_STATE, must rebuild the
// exact same state. If it does not, something in the reducer is impure or an
// action is missing from the log, and "this was your choice on day N" cannot be
// trusted. Run: npm test
import assert from 'node:assert/strict';
import { gameReducer, INITIAL_STATE } from '../src/reducers/gameReducer';
import { POLICIES, play } from './play';
import { PROJECTS } from '../src/data/projects';
import { CHARACTERS, PROJECT_LETTERS } from '../src/data/story';
import { TUNING } from '../src/utils/gameLogic';

// Every regional project gets a letter, written by a citizen of that region.
for (const p of PROJECTS.filter(p => p.regionId)) {
    const from = PROJECT_LETTERS[p.id]?.from;
    assert.ok(CHARACTERS[p.regionId!]?.some(c => c.id === from), `${p.id}: no letter from a ${p.regionId} citizen`);
}
for (const id of Object.keys(PROJECT_LETTERS)) assert.ok(PROJECTS.some(p => p.id === id), `PROJECT_LETTERS: unknown project ${id}`);

let runs = 0;
let causal = 0;
let projectLetters = 0;
for (const [name, policy] of Object.entries(POLICIES)) {
    for (let i = 0; i < 30; i++) {
        const { state } = play(policy, (i * 2246822519) | 0);
        const replayed = state.actionLog.reduce(gameReducer, INITIAL_STATE);
        assert.deepEqual(replayed, state, `${name} seed #${i}: replay diverged`);
        // Every pending delayed effect must point at a real choice in the log.
        for (const item of state.scheduled) {
            const made = state.actionLog.some(a => a.type === 'HANDLE_CHOICE' && a.payload === item.choiceIndex);
            assert.ok(made && item.causeDay <= state.day, `${name} seed #${i}: delayed effect without its cause`);
            causal++;
        }
        // Letters about past decisions stay rare and spaced out.
        const past = state.letters.filter(l => l.kind === 'delayed' || l.kind === 'dirty');
        assert.ok(past.length <= TUNING.pastLetterMax, `${name} seed #${i}: too many past-decision letters`);
        past.forEach((l, j) => assert.ok(j === 0 || l.day - past[j - 1].day >= TUNING.pastLetterGapDays, `${name} seed #${i}: past-decision letters too close`));
        projectLetters += state.letters.filter(l => l.kind === 'project').length;
        runs++;
    }
}
console.log(`replay ok: ${runs} runs, ${causal} pending delayed effects traced to their choice, ${projectLetters} project letters`);
