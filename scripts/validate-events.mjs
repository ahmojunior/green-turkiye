// ---------------------------------------------------------------------------
// Event data validator. Run by `npm run validate:events`, and in CI before the
// build.
//
// The game is used by students, so the bar is: an event may not make a factual
// claim the repository cannot back up, and it may not sit on the map in a place
// that does not exist. This script enforces that mechanically, because 120
// hand-written objects in three languages are not reviewable by eye.
// ---------------------------------------------------------------------------
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const LANGS = ['tr', 'en', 'de'];

const POLLUTION_TAGS = [
    'air', 'water', 'marine', 'groundwater', 'soil', 'waste',
    'biodiversity', 'energy', 'landuse', 'hazard', 'heritage', 'noise', 'light',
];

const SOURCE_STATUSES = ['verified', 'partly-verified'];

const TURKEY_REGIONS = [
    'marmara', 'blacksea', 'aegean', 'anatolian', 'mediterranean', 'eastern', 'southeastern',
];

// The data files are TypeScript, so transpile them in memory and import the
// result. They only ever `import type`, which transpiling strips.
async function loadModule(relativePath) {
    const source = fs.readFileSync(relativePath, 'utf8');
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    });
    const file = path.join(
        fs.mkdtempSync(path.join(os.tmpdir(), 'gt-validate-')),
        path.basename(relativePath).replace(/\.ts$/, '.mjs')
    );
    fs.writeFileSync(file, outputText);
    return import(pathToFileURL(file).href);
}

const errors = [];
const warnings = [];

const fail = (id, message) => errors.push(`${id}: ${message}`);
const warn = (id, message) => warnings.push(`${id}: ${message}`);

const checkText = (id, field, value) => {
    if (!value || typeof value !== 'object') {
        fail(id, `${field} is missing`);
        return;
    }
    for (const lang of LANGS) {
        if (typeof value[lang] !== 'string' || value[lang].trim() === '') {
            fail(id, `${field}.${lang} is empty`);
        }
    }
};

const { EVENTS } = await loadModule('src/data/events.ts');
const { TURKEY_PROVINCE_PATHS } = await loadModule('src/data/countries/turkey/provincePaths.ts');
const provinceNames = new Set(TURKEY_PROVINCE_PATHS.map(p => p.name));
const provinceRegion = new Map(TURKEY_PROVINCE_PATHS.map(p => [p.name, p.region]));

const ids = new Set();
let sourced = 0;
let unsourced = 0;

for (const event of EVENTS) {
    const id = event.id ?? '(no id)';
    if (ids.has(id)) fail(id, 'duplicate event id');
    ids.add(id);

    // Every event in every country has to be readable in all three languages.
    checkText(id, 'title', event.title);
    checkText(id, 'description', event.description);
    if (!Array.isArray(event.choices) || event.choices.length < 2) {
        fail(id, 'needs at least two choices');
        continue;
    }
    event.choices.forEach((choice, i) => checkText(id, `choices[${i}].text`, choice.text));

    // Delayed consequences: a message the player can tie back to the decision,
    // a day it lands on, and something to actually apply when it does.
    event.choices.forEach((choice, i) => {
        for (const [d, delayed] of (choice.delayed ?? []).entries()) {
            const where = `choices[${i}].delayed[${d}]`;
            if (!Number.isInteger(delayed.inDays) || delayed.inDays < 1 || delayed.inDays > 60) {
                fail(id, `${where}.inDays must be a whole number of days between 1 and 60`);
            }
            const effects = delayed.effects ?? {};
            if (!effects.budget && !effects.happiness && !effects.cleanliness) {
                fail(id, `${where}.effects does nothing`);
            }
            checkText(id, `${where}.message`, delayed.message);
        }
    });

    const isTurkish = !event.regionId || TURKEY_REGIONS.includes(event.regionId);
    if (!isTurkish) continue;

    // --- Türkiye content: location and medium are required -------------------
    if (!event.location) {
        fail(id, 'missing location (which provinces is this crisis in?)');
    } else {
        const { provinces, nationwide } = event.location;
        if (!Array.isArray(provinces)) {
            fail(id, 'location.provinces must be an array');
        } else if (provinces.length === 0 && !nationwide) {
            fail(id, 'location needs provinces, or nationwide: true for a policy event');
        } else {
            for (const name of provinces) {
                if (!provinceNames.has(name)) {
                    fail(id, `location.provinces has "${name}", which is not a province on the map`);
                }
            }
            // A regional event has to name at least one province of its own region,
            // otherwise its node can never spawn where the text says it happens.
            if (event.regionId && provinces.length > 0) {
                const own = provinces.filter(name => provinceRegion.get(name) === event.regionId);
                if (own.length === 0) {
                    fail(id, `is in region "${event.regionId}" but names no province of it`);
                }
            }
        }
    }

    if (!event.tags || !Array.isArray(event.tags.pollution) || event.tags.pollution.length === 0) {
        fail(id, 'missing tags.pollution (which medium does this belong to?)');
    } else {
        for (const tag of event.tags.pollution) {
            if (!POLLUTION_TAGS.includes(tag)) fail(id, `unknown pollution tag "${tag}"`);
        }
    }

    // --- Sources and explainers go together ---------------------------------
    const hasSources = Array.isArray(event.sources) && event.sources.length > 0;
    const withOutcome = event.choices.filter(c => c.outcome).length;

    if (hasSources) {
        sourced++;
        for (const [i, source] of event.sources.entries()) {
            if (!source.label || typeof source.label !== 'string') fail(id, `sources[${i}].label is empty`);
            if (!/^https:\/\//.test(source.url ?? '')) fail(id, `sources[${i}].url must be an https URL`);
            if (!SOURCE_STATUSES.includes(source.status)) {
                fail(id, `sources[${i}].status must be one of ${SOURCE_STATUSES.join(', ')}`);
            }
        }
        // A sourced event is a finished event: every choice explains itself.
        if (withOutcome !== event.choices.length) {
            fail(id, `has sources but only ${withOutcome}/${event.choices.length} choices carry an outcome`);
        }
        event.choices.forEach((choice, i) => {
            if (!choice.outcome) return;
            checkText(id, `choices[${i}].outcome.what`, choice.outcome.what);
            checkText(id, `choices[${i}].outcome.why`, choice.outcome.why);
        });
    } else {
        unsourced++;
        if (withOutcome > 0) {
            fail(id, 'has an outcome explainer but no source to back it');
        }
        warn(id, 'no sources yet (location and tags only)');
    }

    // --- Balance smell: an option nobody can argue against -------------------
    const effects = event.choices.map(c => ({
        h: c.effects?.happiness ?? 0,
        c: c.effects?.cleanliness ?? 0,
        b: c.effects?.budget ?? 0,
    }));
    if (effects.some(a => effects.every(b => a.h >= b.h && a.c >= b.c))) {
        warn(id, 'one choice is at least as good as every other for both people and environment');
    }
}

const dominated = warnings.filter(w => w.includes('at least as good')).length;

console.log(`Checked ${EVENTS.length} events (${sourced} sourced, ${unsourced} awaiting sources).`);
console.log(`${dominated} Türkiye events still have a choice that dominates on both people and environment.`);

if (warnings.length > 0) {
    console.log(`\n${warnings.length} warnings:`);
    for (const w of warnings) console.log('  - ' + w);
}

if (errors.length > 0) {
    console.error(`\n${errors.length} errors:`);
    for (const e of errors) console.error('  x ' + e);
    process.exit(1);
}

console.log('\nNo errors.');
