import { useState } from 'react';
import type { Region } from '../types';
import { REGIONS } from '../data/regions';
import { TurkeyMap } from './TurkeyMap';
import { Map, ArrowRight } from 'lucide-react';

interface MainMenuProps {
  onStart: (region: Region) => void;
}

export function MainMenu({ onStart }: MainMenuProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const selectedRegion = REGIONS.find(r => r.id === selectedRegionId);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 overflow-hidden relative">
      
      {/* Tactical Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_100%)]"></div>
         <div 
            className="absolute inset-0 opacity-10"
            style={{
                backgroundImage: `linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }}
         ></div>
      </div>

      {/* Header */}
      <div className="p-8 text-center z-20 relative">
        <h1 className="text-6xl font-black text-green-500 mb-2 tracking-tight drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">YEŞİL TÜRKİYE</h1>
        <p className="text-xl text-slate-400 font-medium">Bölgeni seç, çevreyi koru, geleceği inşa et.</p>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative flex items-center justify-center -mt-10">
        <TurkeyMap 
          onRegionSelect={setSelectedRegionId} 
          selectedRegionId={selectedRegionId} 
        />
        
        {/* Helper Text */}
        {!selectedRegionId && (
          <div className="absolute bottom-10 animate-bounce text-gray-400 font-medium">
            Başlamak için haritadan bir bölge seçin
          </div>
        )}
      </div>

      {/* Selected Region Info Panel */}
      {selectedRegion && (
        <div className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200 p-8 animate-in slide-in-from-bottom-10 duration-300 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-50">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Map className="w-6 h-6 text-green-600" />
                <h3 className="text-3xl font-bold text-gray-800">{selectedRegion.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ml-2 ${
                  selectedRegion.difficulty === 'Kolay' ? 'bg-green-100 text-green-800' :
                  selectedRegion.difficulty === 'Orta' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedRegion.difficulty}
                </span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">{selectedRegion.description}</p>
            </div>

            <button
              onClick={() => onStart(selectedRegion)}
              className="group flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold text-xl transition-all shadow-lg hover:shadow-green-500/30 hover:scale-105 min-w-[200px] justify-center cursor-pointer"
            >
              Oyunu Başlat
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>
        </div>
      )}
    </div>
  );
}