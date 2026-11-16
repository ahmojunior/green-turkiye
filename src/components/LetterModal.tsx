import type { Letter } from '../types';
import { useLanguage } from '../contexts/language-context';
import { letterText } from '../utils/storyText';

// A citizen's letter on paper. It can be long and ordinary; the one sentence
// that matters is marked like a highlighter pen, for players who skim.
export function LetterModal({ letter, onClose }: { letter: Letter; onClose: () => void }) {
    const { lang, t } = useLanguage();
    const l = letterText(letter, lang);
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <article
                role="dialog"
                aria-modal="true"
                aria-label={`${t('letter.from')} ${l.name}`}
                onClick={e => e.stopPropagation()}
                className="max-w-md w-full max-h-[90dvh] overflow-y-auto rounded-lg bg-[#fbf7ea] text-[#2A2622] shadow-2xl p-6 mobile-landscape:p-4 mobile-landscape:text-sm"
            >
                <p className="text-xs text-[#6b6150] mb-3">{t('letter.dayLabel').replace('{day}', String(letter.day))}</p>
                <p className="mb-2">{t('letter.greeting')}</p>
                <p className="leading-relaxed">
                    {l.body}{' '}
                    <mark className="letter-mark">{l.highlight}</mark>
                </p>
                <p className="mt-4 text-right italic">— {l.name}, {l.role}, {l.province}</p>
                <button
                    onClick={onClose}
                    autoFocus
                    className="mt-5 w-full rounded-xl bg-[#2A2622] text-[#fbf7ea] font-bold py-2.5 hover:bg-black transition-colors"
                >
                    {t('letter.close')}
                </button>
            </article>
        </div>
    );
}
