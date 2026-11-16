// Replay test: a run's actionLog, replayed from INITIAL_STATE, must rebuild the
// exact same state. If it does not, something in the reducer is impure or an
// action is missing from the log, and "this was your choice on day N" cannot be
// trusted. Run: npm test
import assert from 'node:assert/strict';
import { gameReducer, INITIAL_STATE } from '../src/reducers/gameReducer';
import { POLICIES, play } from './play';

let runs = 0;
let causal = 0;
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
        runs++;
    }
}
console.log(`replay ok: ${runs} runs, ${causal} pending delayed effects traced to their choice`);
