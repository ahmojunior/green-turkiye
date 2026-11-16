import { useState } from 'react';
import type { NewsItem } from '../types';
import { useLanguage } from '../contexts/language-context';
import { headlineText } from '../utils/storyText';
import { Mikey } from './Mikey';

// The day's bulletin on a TV set: Mikey anchors behind the desk and reads each
// headline as cheerful good news, even Kara Holding's. Tap for the next story.
export function NewsTV({ news }: { news: NewsItem[] }) {
    const { lang, t } = useLanguage();
    const [index, setIndex] = useState(0);
    if (news.length === 0) return null;
    const item = news[Math.min(index, news.length - 1)];
    const more = news.length > 1;

    return (
        <button
            type="button"
            onClick={() => more && setIndex((index + 1) % news.length)}
            aria-label={more ? t('news.next') : undefined}
            className={`tv-set block w-full text-left ${more ? 'cursor-pointer' : 'cursor-default'}`}
        >
            <div className="tv-screen">
                <span className="absolute top-1.5 left-2 text-[10px] font-black tracking-wider text-white/90">{t('news.channel')}</span>
                <span className="absolute top-1.5 right-2 flex items-center gap-1 text-[10px] font-black text-white">
                    <span className="tv-live-dot" /> {t('news.live')}
                </span>

                {/* Studio: Mikey behind the news desk, above the lower third */}
                <div className="relative flex-1 flex items-end justify-center">
                    <Mikey mood="happy" className="w-14 h-[71px] mobile-landscape:w-10 mobile-landscape:h-[51px]" />
                    <div className="tv-desk" />
                </div>

                {/* Lower third */}
                <div>
                    <div className="inline-block bg-red-600 text-white text-[10px] font-black px-2 py-0.5 tracking-wide">
                        {t('news.breaking')}{more ? ` ${index % news.length + 1}/${news.length}` : ''}
                    </div>
                    <p key={`${item.day}-${item.key}-${index}`} className="bg-white text-slate-900 text-xs font-bold px-2 py-1 leading-snug animate-fade-in">
                        {headlineText(item, lang)}
                    </p>
                </div>
            </div>
        </button>
    );
}
