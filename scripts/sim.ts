// Balance sim: plays 200 seeded runs per policy and writes scripts/sim-report.md
// (win rate, run length, dominant strategy, endings, how often each event shows up).
// Balance changes are made against these numbers, not by feel.
// Run: npm run sim
import { writeFileSync } from 'node:fs';
import { EVENTS } from '../src/data/events';
import { ENDINGS, getEnding } from '../src/data/story';
import { POLICIES, play, SECONDS } from './play';

const N = 200;
const pct = (xs: number[], p: number) => [...xs].sort((a, b) => a - b)[Math.floor(p * (xs.length - 1))];

const rows: string[] = [];
const winRates: [string, number][] = [];
const seen = new Map<string, number>(EVENTS.map(e => [e.id, 0]));
const endings = new Map<string, number>(ENDINGS.map(e => [e.id, 0]));

for (const [name, policy] of Object.entries(POLICIES)) {
    const runs = Array.from({ length: N }, (_, i) => play(policy, (i * 2654435761) | 0));
    const win = runs.filter(r => r.win).length / N;
    winRates.push([name, win]);
    for (const r of runs) for (const id of r.eventsOpened) seen.set(id, (seen.get(id) ?? 0) + 1);
    for (const r of runs) if (!r.timeout) { const id = getEnding(r.state).id; endings.set(id, (endings.get(id) ?? 0) + 1); }
    const days = runs.map(r => r.days);
    rows.push(`| ${name} | ${(win * 100).toFixed(0)}% | ${runs.filter(r => r.timeout).length} | ${pct(days, .25)} / ${pct(days, .5)} / ${pct(days, .75)} | ${(pct(runs.map(r => r.seconds), .5) / 60).toFixed(1)} |`);
}

const [best] = [...winRates].sort((a, b) => b[1] - a[1]);
const freq = [...seen.entries()].sort((a, b) => b[1] - a[1]);
const never = freq.filter(([, n]) => n === 0).map(([id]) => id);
const total = freq.reduce((a, [, n]) => a + n, 0);
const line = ([id, n]: [string, number]) => `| ${id} | ${n} | ${(100 * n / total).toFixed(1)}% |`;

const report = `# Sim report

${N} seeded runs per policy, all countries and regions. Minutes assume ${SECONDS.decision} s per decision, ${SECONDS.endDay} s per day and ${SECONDS.project} s per project; playtests calibrate these.

| Policy | Win | Timeout | Days p25 / p50 / p75 | Minutes p50 |
|---|---|---|---|---|
${rows.join('\n')}

**Dominant strategy:** ${best[0]} (${(best[1] * 100).toFixed(0)}% wins).

## Endings

How often each ending was reached across all policies. An ending at 0 is unreachable with these policies.

| Ending | Runs |
|---|---|
${[...endings.entries()].map(([id, n]) => `| ${id} | ${n} |`).join('\n')}

## Event frequency

${total} crises opened across all runs. ${never.length} of ${EVENTS.length} events never appeared${never.length ? `: ${never.join(', ')}` : ''}.

| Most frequent | Count | Share |
|---|---|---|
${freq.slice(0, 5).map(line).join('\n')}

| Least frequent (seen) | Count | Share |
|---|---|---|
${freq.filter(([, n]) => n > 0).slice(-5).reverse().map(line).join('\n')}
`;

// Run from the repo root (npm run sim); the bundle itself lives in node_modules/.cache.
writeFileSync('scripts/sim-report.md', report);
console.log(report);
