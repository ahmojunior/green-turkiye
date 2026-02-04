import { useState } from 'react';
import { PROJECTS, type Project } from '../data/projects';
import type { TaxRate, ActiveProject } from '../types';
import { Coins, Hammer, Clock, CheckCircle } from 'lucide-react';

interface ManagementPanelProps {
  taxRate: TaxRate;
  onSetTaxRate: (rate: TaxRate) => void;
  budget: number;
  activeProjects: ActiveProject[];
  completedProjectIds: string[];
  onBuyProject: (project: Project) => void;
}

export function ManagementPanel({ 
  taxRate, 
  onSetTaxRate, 
  budget, 
  activeProjects, 
  completedProjectIds, 
  onBuyProject 
}: ManagementPanelProps) {
  const [showProjects, setShowProjects] = useState(false);

  return (
    <>
      {/* Tax Controls - Bottom Left */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
         <div className="bg-white/90 backdrop-blur shadow-xl rounded-xl p-4 border border-gray-200">
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Coins className="w-4 h-4" /> Vergi Oranı
             </h3>
             <div className="flex bg-gray-100 p-1 rounded-lg">
                 {(['low', 'normal', 'high'] as TaxRate[]).map((rate) => (
                     <button
                        key={rate}
                        onClick={() => onSetTaxRate(rate)}
                        className={`
                            px-4 py-2 rounded-md text-sm font-bold transition-all
                            ${taxRate === rate 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}
                        `}
                     >
                        {rate === 'low' && 'Düşük'}
                        {rate === 'normal' && 'Normal'}
                        {rate === 'high' && 'Yüksek'}
                     </button>
                 ))}
             </div>
             <div className="mt-2 text-xs text-gray-500 font-medium h-4">
                 {taxRate === 'low' && '+10 Bütçe, +1 Mutluluk / Gün'}
                 {taxRate === 'normal' && '+30 Bütçe / Gün'}
                 {taxRate === 'high' && '+80 Bütçe, -1 Mutluluk / Gün'}
             </div>
         </div>
      </div>

      {/* Projects Button - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-20">
          <button
            onClick={() => setShowProjects(true)}
            className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl shadow-xl transition-transform active:scale-95 font-bold text-lg"
          >
              <Hammer className="w-6 h-6" />
              Projeler & Yatırımlar
              {activeProjects.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      {activeProjects.length} Aktif
                  </span>
              )}
          </button>
      </div>

      {/* Projects Modal */}
      {showProjects && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Şehir Projeleri</h2>
                        <p className="text-gray-500">Bütçeni kullanarak şehrini geliştir.</p>
                      </div>
                      <button 
                        onClick={() => setShowProjects(false)}
                        className="p-2 hover:bg-gray-200 rounded-full"
                      >
                          ✕
                      </button>
                  </div>
                  
                  <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {PROJECTS.map(project => {
                          const isCompleted = completedProjectIds.includes(project.id);
                          const isActive = activeProjects.some(p => p.id === project.id);
                          const activeProject = activeProjects.find(p => p.id === project.id);
                          const canAfford = budget >= project.cost;

                          return (
                              <div 
                                key={project.id}
                                className={`
                                    border-2 rounded-xl p-5 relative overflow-hidden transition-all
                                    ${isCompleted ? 'border-green-200 bg-green-50' : 
                                      isActive ? 'border-blue-200 bg-blue-50' :
                                      'border-gray-100 bg-white hover:border-blue-300'}
                                `}
                              >
                                  <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-bold text-lg text-gray-800">{project.name}</h3>
                                      {isCompleted && <CheckCircle className="text-green-600" />}
                                      {isActive && <Clock className="text-blue-600 animate-spin-slow" />}
                                  </div>
                                  
                                  <p className="text-sm text-gray-600 mb-4 h-10">{project.description}</p>
                                  
                                  <div className="flex gap-4 text-xs font-medium text-gray-500 mb-4">
                                      <span className="flex items-center gap-1">
                                          <Coins className="w-3 h-3" /> {project.cost}M
                                      </span>
                                      <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" /> {project.duration} Gün
                                      </span>
                                  </div>

                                  <div className="space-y-1 text-xs mb-4">
                                      {project.effects.budgetPerTurn && (
                                          <div className="text-green-700">+{project.effects.budgetPerTurn} Bütçe / Gün</div>
                                      )}
                                      {project.effects.cleanliness && (
                                          <div className="text-green-700">+{project.effects.cleanliness} Temizlik (Bitince)</div>
                                      )}
                                      {project.effects.happiness && (
                                          <div className="text-blue-700">+{project.effects.happiness} Mutluluk (Bitince)</div>
                                      )}
                                  </div>

                                  {isActive ? (
                                      <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                                          <div 
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                                            style={{ width: `${((project.duration - activeProject!.daysRemaining) / project.duration) * 100}%` }}
                                          ></div>
                                          <div className="text-center text-xs text-blue-700 mt-1 font-bold">
                                              {activeProject!.daysRemaining} gün kaldı
                                          </div>
                                      </div>
                                  ) : isCompleted ? (
                                      <button disabled className="w-full py-2 bg-green-100 text-green-700 font-bold rounded-lg cursor-default">
                                          Tamamlandı
                                      </button>
                                  ) : (
                                      <button 
                                        onClick={() => onBuyProject(project)}
                                        disabled={!canAfford}
                                        className={`
                                            w-full py-2 font-bold rounded-lg transition-colors
                                            ${canAfford 
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200' 
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                                        `}
                                      >
                                          Projeyi Başlat
                                      </button>
                                  )}
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
      )}
    </>
  );
}
