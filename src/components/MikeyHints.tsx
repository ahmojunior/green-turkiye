import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { GameState } from '../types';
import { TUNING, getNodeSeverity } from '../utils/gameLogic';
import { useLanguage } from '../contexts/language-context';
import { Mikey, type MikeyMood } from './Mikey';

// First-time hints. Each fires once per player (remembered in localStorage),
// only one is on screen at a time, and a tap closes it. The game never waits
// for a hint: it is never modal.

interface Hint {
    id: string;
    text: string;          // translation key
    mood: MikeyMood;
    target?: string;       // CSS selector Mikey points at and highlights
}

// Resting arm directions: right arm from (69,104) to (95,90), left mirrored.
const REST_R = Math.atan2(90 - 104, 95 - 69) * 180 / Math.PI;

// Swings the arm on the target's side so it points at screen angle `deg`
// (0 = right, 90 = down). Writes straight to the SVG, outside React's props.
function aimMikeyArm(svg: SVGSVGElement, deg: number) {
    const left = Math.abs(deg) > 90;
    svg.dataset.arm = left ? 'l' : 'r';
    svg.style.setProperty('--mikey-point', `${left ? deg - (180 - REST_R) : deg - REST_R}deg`);
}

const SEEN_KEY = 'greenTurkiye_hintsSeen';

// Storage can throw (private mode, blocked site data); hints then just repeat.
const readSeen = (): string[] => {
    try { return JSON.parse(localStorage.getItem(SEEN_KEY) ?? '[]'); } catch { return []; }
};
const writeSeen = (ids: string[]) => {
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(ids)); } catch { /* not persisted */ }
};
// Every hint whose trigger holds right now, in priority order.
function activeHints(s: GameState): Hint[] {
    const out: Hint[] = [];
    if (s.letters.some(l => l.kind === 'delayed' && !l.read)) {
        out.push({ id: 'delayed', text: 'hint.delayed', mood: 'think', target: '[data-hint="letter"][data-kind="delayed"]' });
    }
    if (s.cleanliness < TUNING.criticalStat) out.push({ id: 'lowCleanliness', text: 'hint.lowCleanliness', mood: 'sad', target: '[data-hint="stat-cleanliness"]' });
    if (s.happiness < TUNING.criticalStat) out.push({ id: 'lowHappiness', text: 'hint.lowHappiness', mood: 'sad', target: '[data-hint="stat-happiness"]' });
    if (s.budget < TUNING.criticalBudget) out.push({ id: 'lowBudget', text: 'hint.lowBudget', mood: 'sad', target: '[data-hint="stat-budget"]' });
    if (s.activeNodes.some(n => getNodeSeverity(n.spawnDay, s.day) >= 2)) {
        out.push({ id: 'nodeGrew', text: 'hint.nodeGrew', mood: 'alarmed', target: '[data-hint="node"][data-severity="2"], [data-hint="node"][data-severity="3"]' });
    }
    if (s.activeNodes.length > 0) out.push({ id: 'firstNode', text: 'hint.firstNode', mood: 'point', target: '[data-hint="node"]' });
    if (s.eventsSolved > 0 && s.budget < TUNING.startBudget) out.push({ id: 'tax', text: 'hint.tax', mood: 'point', target: '[data-hint="tax"]' });
    if (s.eventsSolved > 0) out.push({ id: 'endDay', text: 'hint.endDay', mood: 'point', target: '[data-hint="end-day"]' });
    return out;
}

export function MikeyHints({ state, muted }: { state: GameState; muted: boolean }) {
    const { t } = useLanguage();
    const [seen, setSeen] = useState(readSeen);
    // The hint on screen. It counts as seen the moment it shows, and stays only
    // while its trigger holds or until tapped, so it never comes back later.
    const [shownId, setShownId] = useState<string | null>(null);
    const boxRef = useRef<HTMLButtonElement>(null);

    // Hidden while a crisis card is open: it covers the screen anyway.
    const list = muted || state.activeEvent || state.isGameOver ? [] : activeHints(state);
    const hint = list.find(h => h.id === shownId) ?? list.find(h => !seen.includes(h.id));
    if (hint && hint.id !== shownId) {
        setShownId(hint.id);
        setSeen([...seen, hint.id]);
    }
    useEffect(() => writeSeen(seen), [seen]);

    // Highlight the target and aim Mikey's arm at it.
    useLayoutEffect(() => {
        if (!hint?.target) return;
        const el = document.querySelector<HTMLElement>(hint.target);
        const box = boxRef.current?.querySelector('svg');
        if (!el || !box) return;
        el.classList.add('hint-target');
        // shortcut: aimed once per hint, not on resize; fine while hints are short-lived.
        const a = el.getBoundingClientRect();
        const b = box.getBoundingClientRect();
        // Shoulder sits about two thirds down Mikey's body.
        aimMikeyArm(box, Math.atan2(a.top + a.height / 2 - (b.top + b.height * 0.68), a.left + a.width / 2 - (b.left + b.width / 2)) * 180 / Math.PI);
        return () => el.classList.remove('hint-target');
    }, [hint?.id, hint?.target]);

    if (!hint) return null;

    const dismiss = () => setShownId(null);

    return (
        <button
            ref={boxRef}
            key={hint.id}
            onClick={dismiss}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-40 flex items-center pointer-events-auto max-w-[min(90vw,360px)] text-left mobile-landscape:top-2"
        >
            <Mikey mood={hint.mood} className="w-16 h-[81px] shrink-0 mobile-landscape:w-12 mobile-landscape:h-[61px]" />
            <span className="mikey-bubble mobile-landscape:!text-lg" role="status">{t(hint.text)}</span>
        </button>
    );
}
