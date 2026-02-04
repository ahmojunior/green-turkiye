import type { GameEvent } from '../types';
import { AlertTriangle } from 'lucide-react';
import { useGameEffects } from '../contexts/GameEffectsContext';

interface EventModalProps {
  event: GameEvent;
  onChoice: (index: number) => void;
}

export function EventModal({ event, onChoice }: EventModalProps) {
  const { showFloatingText } = useGameEffects();

  const handleChoiceClick = (e: React.MouseEvent, index: number) => {
    const choice = event.choices[index];
    const { clientX, clientY } = e;
    
    // Budget
    if (choice.effects.budget) {
       showFloatingText(clientX, clientY, 
         `${choice.effects.budget > 0 ? '+' : ''}${choice.effects.budget}`, 
         choice.effects.budget > 0 ? '#16a34a' : '#dc2626' // green-600 : red-600
       );
    }
    // Happiness (offset slightly)
    const happinessChange = choice.effects.happiness;
    if (happinessChange) {
        setTimeout(() => {
            showFloatingText(clientX + 20, clientY - 20, 
                `${happinessChange > 0 ? '+' : ''}${happinessChange} 😊`, 
                happinessChange > 0 ? '#2563eb' : '#dc2626'
            );
        }, 100);
    }
    // Cleanliness
    const cleanlinessChange = choice.effects.cleanliness;
    if (cleanlinessChange) {
         setTimeout(() => {
            showFloatingText(clientX - 20, clientY - 20, 
                `${cleanlinessChange > 0 ? '+' : ''}${cleanlinessChange} 🌿`, 
                cleanlinessChange > 0 ? '#16a34a' : '#dc2626'
            );
        }, 200);
    }

    onChoice(index);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-red-50 p-6 border-b border-red-100 flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
            <p className="text-gray-600 mt-1">{event.description}</p>
          </div>
        </div>

        {/* Choices */}
        <div className="p-6 grid gap-3">
          {event.choices.map((choice, index) => (
            <button
              key={index}
              onClick={(e) => handleChoiceClick(e, index)}
              className="text-left w-full p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <p className="font-bold text-gray-800 group-hover:text-blue-700">{choice.text}</p>
              <div className="flex gap-3 mt-2 text-xs font-medium opacity-70">
                {choice.effects.budget !== undefined && choice.effects.budget !== 0 && (
                  <span className={choice.effects.budget > 0 ? 'text-green-600' : 'text-red-600'}>
                    {choice.effects.budget > 0 ? '+' : ''}{choice.effects.budget} Bütçe
                  </span>
                )}
                {choice.effects.happiness !== undefined && choice.effects.happiness !== 0 && (
                  <span className={choice.effects.happiness > 0 ? 'text-green-600' : 'text-red-600'}>
                    {choice.effects.happiness > 0 ? '+' : ''}{choice.effects.happiness} Mutluluk
                  </span>
                )}
                {choice.effects.cleanliness !== undefined && choice.effects.cleanliness !== 0 && (
                  <span className={choice.effects.cleanliness > 0 ? 'text-green-600' : 'text-red-600'}>
                    {choice.effects.cleanliness > 0 ? '+' : ''}{choice.effects.cleanliness} Temizlik
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}