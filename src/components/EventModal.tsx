import { useEffect, useMemo, useRef, useState } from 'react';
import type { GameEvent } from '../types';
import { AlertTriangle, Wallet, Smile, Leaf, Lightbulb, ExternalLink, HelpCircle, Check, X, Coins } from 'lucide-react';
import { useGameEffects } from '../contexts/game-effects-context';
import { useLanguage } from '../contexts/language-context';
import { sfx } from '../utils/sfx';
import { formatBudget } from '../utils/format';

interface EventModalProps {
  event: GameEvent;
  onChoice: (index: number) => void;
  /** Index of the choice just taken, while its explainer is waiting to be read. */
  outcomeChoiceIndex: number | null;
  onContinue: () => void;
  budget: number;
  happiness: number;
  cleanliness: number;
}

// Stat colours, shared by the choice buttons and the explainer. 400-weight
// shades: on the near-black modal the 600s fall below the WCAG AA contrast
// floor for small bold text.
const BUDGET_UP = '#eab308';
const HAPPINESS_UP = '#60a5fa';
const CLEANLINESS_UP = '#4ade80';
const DOWN = '#f87171';

// Budget shown as a tier instead of a figure. Keeping money visible is fair —
// a government knows what a policy costs before it decides — while the effect
// on people and environment is what the player has to work out from the
// evidence rather than read off the button.
const COST_TIERS = [
    { limit: 0, key: 'none' },
    { limit: 30, key: 'low' },
    { limit: 100, key: 'medium' },
    { limit: Infinity, key: 'high' },
];

const costTier = (budget: number | undefined) => {
    const amount = Math.abs(budget ?? 0);
    const tier = COST_TIERS.find(t => amount <= t.limit) ?? COST_TIERS[COST_TIERS.length - 1];
    return tier.key;
};

// Stable per-event order for the prediction options, so the right answer is not
// always in the same slot and a replay of the same event looks the same.
const shuffledIndices = (seed: string, count: number) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (Math.imul(hash, 31) + seed.charCodeAt(i)) | 0;
    return [...Array(count).keys()].sort(
        (a, b) => Math.abs(Math.imul(hash ^ a, 0x9e3779b1)) - Math.abs(Math.imul(hash ^ b, 0x9e3779b1))
    );
};

export function EventModal({
  event,
  onChoice,
  outcomeChoiceIndex,
  onContinue,
  budget,
  happiness,
  cleanliness,
}: EventModalProps) {
  const { showFloatingText } = useGameEffects();
  const { lang, t } = useLanguage();
  const dialogRef = useRef<HTMLDivElement>(null);

  const chosen = outcomeChoiceIndex === null ? null : event.choices[outcomeChoiceIndex];
  const outcome = chosen?.outcome ?? null;

  // Predict before the reveal. The options are the consequences written for the
  // event's own choices, so guessing right means knowing which policy leads to
  // which result — no extra content to author, and a wrong guess still teaches
  // more than reading the answer cold.
  // Keyed by event id, so a new crisis starts without a guess and no effect is
  // needed to clear it.
  const [guess, setGuess] = useState<{ eventId: string; index: number } | null>(null);
  const predicted = guess && guess.eventId === event.id ? guess.index : null;
  const canPredict = event.choices.length > 1 && event.choices.every(c => c.outcome);
  const order = useMemo(() => shuffledIndices(event.id, event.choices.length), [event.id, event.choices.length]);


  const asking = !!outcome && canPredict && predicted === null;

  // An event that explains itself afterwards can afford to hide its arithmetic
  // now: the numbers appear in the card, together with the reason for them. The
  // events still waiting for explainers keep showing effects, or they would ask
  // for a decision and never account for it.
  const hideEffects = canPredict;

  // Keyboard and screen-reader users need focus held inside the dialog while it
  // is open: the game behind it is paused and offers nothing until a choice is
  // made. Escape is swallowed on purpose — there is no way to cancel a crisis,
  // so a key that looks like it should close the dialog must not strand focus.
  // Re-runs when the explainer replaces the choices, so focus lands on Devam.
  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;

    const focusables = () => Array.from(node.querySelectorAll<HTMLButtonElement>('button:not([disabled])'));
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        return;
      }
      if (e.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const outside = !node.contains(active);

      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [event.id, outcomeChoiceIndex, predicted]);

  const handleChoiceClick = (e: React.MouseEvent, index: number) => {
    const choice = event.choices[index];
    const { clientX, clientY } = e;

    // Budget — colour matches the HUD icon for the same stat, so a stat reads
    // the same wherever it appears.
    if (choice.effects.budget) {
      showFloatingText(clientX, clientY,
        `${choice.effects.budget > 0 ? '+' : ''}${choice.effects.budget}`,
        choice.effects.budget > 0 ? BUDGET_UP : DOWN
      );
    }
    // Happiness (offset slightly)
    const happinessChange = choice.effects.happiness;
    if (happinessChange) {
      setTimeout(() => {
        showFloatingText(clientX + 20, clientY - 20,
          `${happinessChange > 0 ? '+' : ''}${happinessChange}`,
          happinessChange > 0 ? HAPPINESS_UP : DOWN
        );
      }, 100);
    }
    // Cleanliness
    const cleanlinessChange = choice.effects.cleanliness;
    if (cleanlinessChange) {
      setTimeout(() => {
        showFloatingText(clientX - 20, clientY - 20,
          `${cleanlinessChange > 0 ? '+' : ''}${cleanlinessChange}`,
          cleanlinessChange > 0 ? CLEANLINESS_UP : DOWN
        );
      }, 200);
    }

    const net = (choice.effects.budget ?? 0) / 50 + (choice.effects.happiness ?? 0) + (choice.effects.cleanliness ?? 0);
    if (net > 0.5) sfx.choiceGood();
    else if (net < -0.5) sfx.choiceBad();
    else sfx.choiceNeutral();

    onChoice(index);
  };

  const effectRow = (effects: { budget?: number; happiness?: number; cleanliness?: number }, size: 'sm' | 'xs') => {
    const { budget: b, happiness: h, cleanliness: c } = effects;
    if (!b && !h && !c) return null;
    const text = size === 'sm' ? 'text-sm' : 'text-xs';
    return (
      <div className={`flex items-center gap-3 ${text} font-bold mobile-landscape:gap-2 mobile-landscape:text-[10px]`}>
        {b ? (
          <span className="flex items-center gap-1" style={{ color: b > 0 ? BUDGET_UP : DOWN }}>
            <Wallet className="w-3.5 h-3.5 mobile-landscape:w-3 mobile-landscape:h-3" /> {b > 0 ? '+' : ''}{b}
          </span>
        ) : null}
        {h ? (
          <span className="flex items-center gap-1" style={{ color: h > 0 ? HAPPINESS_UP : DOWN }}>
            <Smile className="w-3.5 h-3.5 mobile-landscape:w-3 mobile-landscape:h-3" /> {h > 0 ? '+' : ''}{h}
          </span>
        ) : null}
        {c ? (
          <span className="flex items-center gap-1" style={{ color: c > 0 ? CLEANLINESS_UP : DOWN }}>
            <Leaf className="w-3.5 h-3.5 mobile-landscape:w-3 mobile-landscape:h-3" /> {c > 0 ? '+' : ''}{c}
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 mobile-landscape:p-2">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        aria-describedby={outcome ? 'event-modal-outcome' : 'event-modal-description'}
        className="bg-slate-950/70 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300 mobile-landscape:max-h-[92dvh] mobile-landscape:overflow-y-auto"
      >

        {/* Current stats — visible while deciding, not just on the HUD behind the backdrop */}
        <div className="flex items-center justify-around gap-2 px-4 py-2 mobile-landscape:px-3 mobile-landscape:py-1.5 bg-black/30 border-b border-white/10 text-xs mobile-landscape:text-[10px] font-bold">
          <span className="flex items-center gap-1 text-yellow-400">
            <Wallet className="w-3.5 h-3.5 mobile-landscape:w-3 mobile-landscape:h-3" /> {formatBudget(budget)}
          </span>
          <span className="flex items-center gap-1 text-blue-400">
            <Smile className="w-3.5 h-3.5 mobile-landscape:w-3 mobile-landscape:h-3" /> {Math.round(happiness)}%
          </span>
          <span className="flex items-center gap-1 text-green-400">
            <Leaf className="w-3.5 h-3.5 mobile-landscape:w-3 mobile-landscape:h-3" /> {Math.round(cleanliness)}%
          </span>
        </div>

        {/* Header — a crisis reads as an alarm, its explainer reads as a lesson. */}
        <div className={`p-6 mobile-landscape:p-3 border-b flex items-start gap-4 mobile-landscape:gap-2 ${asking ? 'bg-sky-900/20 border-sky-500/20' : outcome ? 'bg-emerald-900/20 border-emerald-500/20' : 'bg-red-900/20 border-red-500/20'}`}>
          <div className={`p-3 mobile-landscape:p-1.5 rounded-full ${asking ? 'bg-sky-500/20' : outcome ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
            {asking
              ? <HelpCircle className="w-8 h-8 mobile-landscape:w-5 mobile-landscape:h-5 text-sky-400" />
              : outcome
                ? <Lightbulb className="w-8 h-8 mobile-landscape:w-5 mobile-landscape:h-5 text-emerald-400" />
                : <AlertTriangle className="w-8 h-8 mobile-landscape:w-5 mobile-landscape:h-5 text-red-500" />}
          </div>
          <div>
            <h2 id="event-modal-title" className="text-2xl font-bold text-white mobile-landscape:text-base">{event.title[lang]}</h2>
            {outcome
              ? <p className="text-emerald-200/80 mt-1 mobile-landscape:text-xs mobile-landscape:mt-0.5">{chosen?.text[lang]}</p>
              : <p id="event-modal-description" className="text-red-200/80 mt-1 mobile-landscape:text-xs mobile-landscape:mt-0.5">{event.description[lang]}</p>}
          </div>
        </div>

        {asking ? (
          /* Predict-then-reveal: a guess, even a wrong one, makes the explainer
             land harder than reading it cold. */
          <div id="event-modal-outcome" className="p-6 mobile-landscape:p-3 grid gap-3 mobile-landscape:gap-1.5">
            <p className="text-xs font-black uppercase tracking-wider text-sky-400 mobile-landscape:text-[10px]">{t('event.predictPrompt')}</p>
            {order.map(i => (
              <button
                key={i}
                onClick={() => { sfx.click(); setGuess({ eventId: event.id, index: i }); }}
                className="text-left w-full p-4 mobile-landscape:p-2 rounded-xl border border-white/10 bg-white/5 hover:border-sky-400/50 hover:bg-sky-900/20 focus-visible:border-sky-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 transition-all"
              >
                <p className="text-white/90 leading-snug mobile-landscape:text-xs">{event.choices[i].outcome?.what[lang]}</p>
              </button>
            ))}
          </div>
        ) : outcome ? (
          /* "Ne oldu?" — the decision is already applied; this is the part that
             explains it. Verification alone ("your number went down") never
             tells a player why, so the causal chain and its source come with it. */
          <div id="event-modal-outcome" className="p-6 mobile-landscape:p-3 grid gap-4 mobile-landscape:gap-2">
            {predicted !== null && (
              <div className={`flex items-center gap-2 rounded-xl border px-4 py-2 mobile-landscape:px-3 mobile-landscape:py-1.5 text-sm font-bold mobile-landscape:text-xs ${predicted === outcomeChoiceIndex ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-300' : 'border-amber-400/40 bg-amber-500/10 text-amber-300'}`}>
                {predicted === outcomeChoiceIndex
                  ? <Check className="w-4 h-4 shrink-0" />
                  : <X className="w-4 h-4 shrink-0" />}
                {predicted === outcomeChoiceIndex ? t('event.predictCorrect') : t('event.predictWrong')}
              </div>
            )}

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-400 mobile-landscape:text-[10px]">{t('event.whatHappened')}</p>
              <p className="text-white/90 mt-1 leading-relaxed mobile-landscape:text-xs mobile-landscape:mt-0.5">{outcome.what[lang]}</p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-emerald-400 mobile-landscape:text-[10px]">{t('event.why')}</p>
              <p className="text-white/90 mt-1 leading-relaxed mobile-landscape:text-xs mobile-landscape:mt-0.5">{outcome.why[lang]}</p>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 mobile-landscape:px-3 mobile-landscape:py-2">
              <span className="text-xs text-slate-400 mobile-landscape:text-[10px]">{t('event.effectLabel')}</span>
              {effectRow(chosen?.effects ?? {}, 'sm')}
            </div>

            {event.sources && event.sources.length > 0 && (
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-400 mobile-landscape:text-[10px]">{t('event.sources')}</p>
                <ul className="mt-1 grid gap-1 mobile-landscape:mt-0.5">
                  {event.sources.map(source => (
                    <li key={source.url} className="text-xs leading-snug mobile-landscape:text-[10px]">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-300 hover:text-sky-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 inline-flex items-start gap-1"
                      >
                        <ExternalLink className="w-3 h-3 mt-0.5 shrink-0" />
                        <span className="underline underline-offset-2">{source.label}</span>
                      </a>
                      <span className="ml-1 text-slate-500">
                        ({source.status === 'verified' ? t('event.source.verified') : t('event.source.partly')})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => { sfx.click(); onContinue(); }}
              className="w-full rounded-xl bg-emerald-600/80 hover:bg-emerald-600 border border-emerald-400/40 px-4 py-3 mobile-landscape:py-2 font-bold text-white transition-all active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 mobile-landscape:text-xs"
            >
              {t('event.continue')}
            </button>
          </div>
        ) : (
          /* Choices */
          <div className="p-6 mobile-landscape:p-3 grid gap-3 mobile-landscape:gap-1.5">
            {event.choices.map((choice, index) => (
              <button
                key={index}
                onClick={(e) => handleChoiceClick(e, index)}
                className="text-left w-full p-4 mobile-landscape:p-2 rounded-xl border border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-900/20 focus-visible:border-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 transition-all group"
              >
                <p className="font-bold text-white mobile-landscape:text-xs">{choice.text[lang]}</p>
                <div className="mt-2 mobile-landscape:mt-1">
                  {hideEffects ? (
                    <span className="flex items-center gap-1 text-sm font-bold text-slate-400 mobile-landscape:text-[10px]">
                      <Coins className="w-3.5 h-3.5 mobile-landscape:w-3 mobile-landscape:h-3" />
                      {(choice.effects.budget ?? 0) > 0
                        ? `${t('event.gain')}: ${t(`event.tier.${costTier(choice.effects.budget)}`)}`
                        : `${t('event.cost')}: ${t(`event.tier.${costTier(choice.effects.budget)}`)}`}
                    </span>
                  ) : effectRow(choice.effects, 'sm')}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
