import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import type { GameState } from '../types';
import { useLanguage } from '../contexts/language-context';
import { ENDINGS, getEnding } from '../data/story';
import { EVENTS } from '../data/events';
import { Mikey } from './Mikey';

const ENDINGS_KEY = 'greenTurkiye_endingsFound';

// Storage can throw (private mode, blocked site data); the collection is then
// just this run.
const readFound = (): string[] => {
  try { return JSON.parse(localStorage.getItem(ENDINGS_KEY) ?? '[]'); } catch { return []; }
};

interface GameOverProps {
  state: GameState;
  onRestart: () => void;
}

// The end of a run: the ending's headline read by Mikey, a one-line diagnosis
// and up to three debrief cards. Every card is built only from what the run
// recorded (decisions, letters, projects), so none of them can blame the
// wrong decision. Restart sits at the top, visible without scrolling.
export function GameOver({ state, onRestart }: GameOverProps) {
  const { lang, t } = useLanguage();
  const ending = getEnding(state);
  const [found] = useState(() => [...new Set([...readFound(), ending.id])]);
  useEffect(() => {
    try { localStorage.setItem(ENDINGS_KEY, JSON.stringify(found)); } catch { /* not persisted */ }
  }, [found]);

  const fill = (key: string, p: Record<string, string | number>) =>
    t(key).replace(/\{(\w+)\}/g, (m, k) => (k in p ? String(p[k]) : m));

  const diagnosis = state.firstCritical
    ? fill('debrief.firstCritical', { stat: t(`hud.${state.firstCritical.stat}`), day: state.firstCritical.day })
    : t('debrief.noCritical');

  const cards: string[] = [];
  const delayed = state.letters.find(l => l.kind === 'delayed');
  if (delayed) {
    cards.push(fill('debrief.delayed', {
      cause: delayed.causeDay ?? 0, day: delayed.day,
      event: EVENTS.find(e => e.id === delayed.eventId)?.title[lang] ?? '',
    }));
  }
  const dirty = state.decisions.filter(d => d.dirty).length;
  if (dirty > 0) cards.push(fill('debrief.dirty', { n: dirty, tier: state.holdingTier }));
  if (state.coopTier > 0) cards.push(fill('debrief.coop', { n: state.cleanChoices, tier: state.coopTier }));
  if (state.completedProjectIds.length > 0) cards.push(fill('debrief.projects', { n: state.completedProjectIds.length }));
  cards.push(fill('debrief.decisions', { n: state.decisions.length, days: state.day }));

  return (
    <div className="fixed inset-0 z-[70] flex justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-md w-full my-auto flex flex-col gap-3 animate-fade-in">
        <button
          onClick={onRestart}
          autoFocus
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-lg transition-colors shadow-lg mobile-landscape:py-2 mobile-landscape:text-base"
        >
          <RotateCcw className="w-5 h-5" /> {t('gameOver.restart')}
        </button>

        <div className="flex items-center">
          <Mikey mood={ending.happy ? 'happy' : 'sad'} className="w-16 h-[81px] shrink-0 mobile-landscape:w-12 mobile-landscape:h-[61px]" />
          <p className="mikey-bubble" role="status">{ending.headline[lang]}</p>
        </div>

        <p className={`text-sm font-bold ${state.firstCritical ? 'text-red-300' : 'text-emerald-300'}`}>{diagnosis}</p>

        <ul className="flex flex-col gap-2">
          {cards.slice(0, 3).map(text => (
            <li key={text} className="glass-panel !rounded-xl px-4 py-3 text-sm text-slate-100">{text}</li>
          ))}
        </ul>

        <p className="text-xs text-slate-400 text-center">
          {fill('gameOver.endingsFound', { n: found.length, total: ENDINGS.length })}
        </p>
      </div>
    </div>
  );
}
