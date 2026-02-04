import type { GameState } from '../types';
import { Wallet, Smile, Leaf, Calendar } from 'lucide-react';

interface GameHUDProps {
  state: GameState;
  regionName: string;
}

export function GameHUD({ state, regionName }: GameHUDProps) {
  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none z-20">
      <div className="flex justify-between items-start">
        
        {/* Region Info */}
        <div className="bg-white/90 backdrop-blur shadow-lg rounded-xl p-4 border border-gray-200 pointer-events-auto">
          <h2 className="text-xl font-bold text-gray-800">{regionName}</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Gün {state.day}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 pointer-events-auto">
          {/* Budget */}
          <div className="flex flex-col items-center bg-white/90 backdrop-blur shadow-lg rounded-xl p-3 min-w-[100px] border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-gray-700">Bütçe</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">{state.budget}M</span>
          </div>

          {/* Happiness */}
          <div className="flex flex-col items-center bg-white/90 backdrop-blur shadow-lg rounded-xl p-3 min-w-[100px] border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Smile className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-gray-700">Mutluluk</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${state.happiness}%` }}></div>
            </div>
            <span className="text-sm font-bold mt-1">{state.happiness}%</span>
          </div>

          {/* Cleanliness (was Pollution) */}
          <div className="flex flex-col items-center bg-white/90 backdrop-blur shadow-lg rounded-xl p-3 min-w-[100px] border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="font-bold text-gray-700">Temizlik</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div 
                className={`h-2.5 rounded-full ${state.cleanliness < 30 ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${state.cleanliness}%` }}
              ></div>
            </div>
            <span className="text-sm font-bold mt-1">{state.cleanliness}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}