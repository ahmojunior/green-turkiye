import type { GameState } from '../types';
import { Wallet, Smile, Leaf, Calendar, Trophy } from 'lucide-react';
import { TUNING } from '../utils/gameLogic';
import { formatBudget } from '../utils/format';
import { useLanguage } from '../contexts/LanguageContext';

interface GameHUDProps {
  state: GameState;
  regionName: string;
}

export function GameHUD({ state, regionName }: GameHUDProps) {
  const { t } = useLanguage();
  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none z-20">
      <div className="flex justify-between items-start">

        {/* Region Info */}
        <div className="glass-panel !rounded-xl p-4 pointer-events-auto min-w-[200px]">
          <h2 className="text-xl font-bold text-white">{regionName}</h2>
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>{t('hud.day')} {state.day}</span>
          </div>

          {/* Sustainability streak — the path to victory */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Trophy className="w-3.5 h-3.5" /> {t('hud.sustainability')}
              </span>
              <span className="text-slate-400">{state.sustainDays}/{TUNING.sustainGoalDays} {t('hud.daysUnit')}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (state.sustainDays / TUNING.sustainGoalDays) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 pointer-events-auto">
          {/* Budget */}
          <div className="flex flex-col items-center glass-panel !rounded-xl p-3 min-w-[100px]">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-slate-300">{t('hud.budget')}</span>
            </div>
            <span className="text-2xl font-bold text-white">{formatBudget(state.budget)}</span>
          </div>

          {/* Happiness */}
          <div className="flex flex-col items-center glass-panel !rounded-xl p-3 min-w-[100px]">
            <div className="flex items-center gap-2 mb-1">
              <Smile className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-slate-300">{t('hud.happiness')}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 mt-1">
              <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${state.happiness}%` }}></div>
            </div>
            <span className="text-sm font-bold mt-1 text-white">{Math.round(state.happiness)}%</span>
          </div>

          {/* Cleanliness */}
          <div className="flex flex-col items-center glass-panel !rounded-xl p-3 min-w-[100px]">
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="w-5 h-5 text-green-400" />
              <span className="font-bold text-slate-300">{t('hud.cleanliness')}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 mt-1">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${state.cleanliness < 30 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${state.cleanliness}%` }}
              ></div>
            </div>
            <span className="text-sm font-bold mt-1 text-white">{Math.round(state.cleanliness)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}