import type { GameEvent } from '../types';
import { AlertTriangle } from 'lucide-react';
import { useGameEffects } from '../contexts/GameEffectsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { sfx } from '../utils/sfx';

interface EventModalProps {
  event: GameEvent;
  onChoice: (index: number) => void;
}

export function EventModal({ event, onChoice }: EventModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-slate-950/70 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="bg-red-900/20 p-6 border-b border-red-500/20 flex items-start gap-4">
          <div className="bg-red-500/20 p-3 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{event.title[lang]}</h2>
            <p className="text-red-200/80 mt-1">{event.description[lang]}</p>
          </div>
        </div>

        {/* Choices */}
        <div className="p-6 grid gap-3">
          {event.choices.map((choice, index) => (
            <button
              key={index}
              onClick={(e) => handleChoiceClick(e, index)}
              className="text-left w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:border-blue-500/50 hover:bg-blue-900/20 transition-all group"
            >
              <p className="font-bold text-white">{choice.text[lang]}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}