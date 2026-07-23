import type { GameEvent } from '../types';
import { AlertTriangle, Wallet, Smile, Leaf } from 'lucide-react';
import { useGameEffects } from '../contexts/GameEffectsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { sfx } from '../utils/sfx';
import { formatBudget } from '../utils/format';

interface EventModalProps {
  event: GameEvent;
  onChoice: (index: number) => void;
  budget: number;
  happiness: number;
  cleanliness: number;
}

export function EventModal({ event, onChoice, budget, happiness, cleanliness }: EventModalProps) {
  const { showFloatingText } = useGameEffects();
  const { lang } = useLanguage();

  const handleChoiceClick = (e: React.MouseEvent, index: number) => {
    const choice = event.choices[index];
    const { clientX, clientY } = e;

    // Budget — color matches the HUD's Wallet icon so each stat reads consistently
    if (choice.effects.budget) {
      showFloatingText(clientX, clientY,
        `${choice.effects.budget > 0 ? '+' : ''}${choice.effects.budget}`,
        choice.effects.budget > 0 ? '#eab308' : '#dc2626' // yellow-500 : red-600
      );
    }
    // Happiness (offset slightly)
    const happinessChange = choice.effects.happiness;
    if (happinessChange) {
      setTimeout(() => {
        showFloatingText(clientX + 20, clientY - 20,
          `${happinessChange > 0 ? '+' : ''}${happinessChange}`,
          happinessChange > 0 ? '#2563eb' : '#dc2626'
        );
      }, 100);
    }
    // Cleanliness
    const cleanlinessChange = choice.effects.cleanliness;
    if (cleanlinessChange) {
      setTimeout(() => {
        showFloatingText(clientX - 20, clientY - 20,
          `${cleanlinessChange > 0 ? '+' : ''}${cleanlinessChange}`,
          cleanlinessChange > 0 ? '#16a34a' : '#dc2626'
        );
      }, 200);
    }

    const net = (choice.effects.budget ?? 0) / 50 + (choice.effects.happiness ?? 0) + (choice.effects.cleanliness ?? 0);
    if (net > 0.5) sfx.choiceGood();
    else if (net < -0.5) sfx.choiceBad();
    else sfx.choiceNeutral();

    onChoice(index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 mobile-landscape:p-2">
      <div className="bg-slate-950/70 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300 mobile-landscape:max-h-[92dvh] mobile-landscape:overflow-y-auto">

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

        {/* Header */}
        <div className="bg-red-900/20 p-6 mobile-landscape:p-3 border-b border-red-500/20 flex items-start gap-4 mobile-landscape:gap-2">
          <div className="bg-red-500/20 p-3 mobile-landscape:p-1.5 rounded-full">
            <AlertTriangle className="w-8 h-8 mobile-landscape:w-5 mobile-landscape:h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mobile-landscape:text-base">{event.title[lang]}</h2>
            <p className="text-red-200/80 mt-1 mobile-landscape:text-xs mobile-landscape:mt-0.5">{event.description[lang]}</p>
          </div>
        </div>

        {/* Choices */}
        <div className="p-6 mobile-landscape:p-3 grid gap-3 mobile-landscape:gap-1.5">
          {event.choices.map((choice, index) => {
            const { budget, happiness, cleanliness } = choice.effects;
            const hasEffects = !!(budget || happiness || cleanliness);
            return (
              <button
                key={index}
                onClick={(e) => handleChoiceClick(e, index)}
                className="text-left w-full p-4 mobile-landscape:p-2 rounded-xl border border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-900/20 transition-all group"
              >
                <p className="font-bold text-white mobile-landscape:text-xs">{choice.text[lang]}</p>
                {hasEffects && (
                  <div className="flex items-center gap-3 mt-2 text-sm font-bold mobile-landscape:gap-2 mobile-landscape:mt-1 mobile-landscape:text-[10px]">
                    {budget ? (
                      <span className={`flex items-center gap-1 ${budget > 0 ? 'text-[#eab308]' : 'text-[#dc2626]'}`}>
                        <Wallet className="w-3.5 h-3.5 mobile-landscape:w-3 mobile-landscape:h-3" /> {budget > 0 ? '+' : ''}{budget}
                      </span>
                    ) : null}
                    {happiness ? (
                      <span className={`flex items-center gap-1 ${happiness > 0 ? 'text-[#2563eb]' : 'text-[#dc2626]'}`}>
                        <Smile className="w-3.5 h-3.5 mobile-landscape:w-3 mobile-landscape:h-3" /> {happiness > 0 ? '+' : ''}{happiness}
                      </span>
                    ) : null}
                    {cleanliness ? (
                      <span className={`flex items-center gap-1 ${cleanliness > 0 ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>
                        <Leaf className="w-3.5 h-3.5 mobile-landscape:w-3 mobile-landscape:h-3" /> {cleanliness > 0 ? '+' : ''}{cleanliness}
                      </span>
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}