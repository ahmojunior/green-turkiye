import { Mail } from 'lucide-react';
import type { GameState, Letter } from '../types';
import { useLanguage } from '../contexts/language-context';
import { formatBudget } from '../utils/format';
import { letterText } from '../utils/storyText';
import { NewsTV } from './NewsTV';

// The short screen that closes each day: what the day did to the three stats,
// the letters that arrived and the evening news on TV. Tap to start the next day.
export function DaySummary({ state, onOpenLetter, onClose }: {
    state: GameState;
    onOpenLetter: (l: Letter) => void;
    onClose: () => void;
}) {
    const { lang, t } = useLanguage();
    const report = state.dayReport;
    if (!report) return null;
    const letters = state.letters.filter(l => l.day === state.day);
    const headlines = state.news.filter(n => n.day >= report.day);
    const delta = (v: number, fmt: (n: number) => string = n => `${Math.round(n)}`) =>
        <span className={v > 0.5 ? 'text-emerald-400' : v < -0.5 ? 'text-red-400' : 'text-slate-400'}>{v > 0 ? '+' : ''}{fmt(v)}</span>;

    return (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/50 p-4 animate-fade-in" onClick={onClose}>
            <section
                role="dialog"
                aria-modal="true"
                aria-label={t('day.ended').replace('{day}', String(report.day))}
                onClick={e => e.stopPropagation()}
                className={`glass-panel w-full max-h-[90dvh] overflow-y-auto p-5 text-white mobile-landscape:p-3 mobile-landscape:text-sm ${headlines.length ? 'max-w-sm mobile-landscape:max-w-2xl mobile-landscape:grid mobile-landscape:grid-cols-2 mobile-landscape:gap-3' : 'max-w-sm'}`}
            >
                {/* On a phone in landscape the TV sits left of the report. */}
                {headlines.length > 0 && <div className="mb-3 mobile-landscape:mb-0 mobile-landscape:row-span-4"><NewsTV news={headlines} /></div>}

                <h2 className="text-lg font-black mb-3 mobile-landscape:mb-1.5">{t('day.ended').replace('{day}', String(report.day))}</h2>
                <dl className="grid grid-cols-3 gap-2 text-center text-sm mb-3 mobile-landscape:mb-1.5">
                    <div><dt className="text-slate-400 text-xs">{t('hud.budget')}</dt><dd className="font-bold">{delta(report.budget, n => formatBudget(Math.round(n)))}</dd></div>
                    <div><dt className="text-slate-400 text-xs">{t('hud.happiness')}</dt><dd className="font-bold">{delta(report.happiness)}</dd></div>
                    <div><dt className="text-slate-400 text-xs">{t('hud.cleanliness')}</dt><dd className="font-bold">{delta(report.cleanliness)}</dd></div>
                </dl>

                {letters.length > 0 && (
                    <ul className="space-y-2 mb-2">
                        {letters.map(l => {
                            const text = letterText(l, lang);
                            return (
                                <li key={l.id}>
                                    <button onClick={() => onOpenLetter(l)} className="w-full text-left flex gap-2 items-start rounded-lg bg-white/5 hover:bg-white/10 p-2">
                                        <Mail className="w-4 h-4 mt-0.5 shrink-0 text-amber-300" />
                                        <span className="text-sm"><b>{text.name}</b>: <mark className="letter-mark">{text.highlight}</mark></span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <button onClick={onClose} autoFocus className="mt-2 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold py-2.5 transition-colors mobile-landscape:py-1.5">
                    {t('day.continue')}
                </button>
            </section>
        </div>
    );
}
