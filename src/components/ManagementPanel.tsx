import { useState, useEffect } from 'react';
import { PROJECTS } from '../data/projects';
import { Coins, Hammer, Clock, CheckCircle, Lock } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { TaxRate } from '../types/enums';

export function ManagementPanel() {
    const {
        gameState,
        setTaxRate,
        buyProject,
        setPaused
    } = useGame();

    const { taxRate, budget, activeProjects, completedProjectIds } = gameState;
    const [showProjects, setShowProjects] = useState(false);
    const [insufficientFundsId, setInsufficientFundsId] = useState<string | null>(null);

    // Pause game when modal is open
    useEffect(() => {
        setPaused(showProjects);
    }, [showProjects, setPaused]);

    return (
        <>
            {/* Tax Controls - Bottom Left */}
            <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
                <div className="glass-panel !rounded-xl p-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-400" /> Vergi Oranı
                    </h3>
                    <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 gap-1">
                        {(Object.values(TaxRate) as TaxRate[]).map((rate) => (
                            <button
                                key={rate}
                                onClick={() => setTaxRate(rate)}
                                className={`
                                    px-4 py-2 rounded-md text-sm font-bold transition-all
                                    ${taxRate === rate
                                        ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                                        : 'text-slate-400 hover:text-white hover:bg-white/10'}
                                `}
                            >
                                {rate === TaxRate.LOW && 'Düşük'}
                                {rate === TaxRate.NORMAL && 'Normal'}
                                {rate === TaxRate.HIGH && 'Yüksek'}
                            </button>
                        ))}
                    </div>
                    <div className="mt-2 text-xs text-slate-500 font-medium h-4">
                        {taxRate === TaxRate.LOW && '+5 Bütçe, +1 Mutluluk / Gün'}
                        {taxRate === TaxRate.NORMAL && '+15 Bütçe / Gün'}
                        {taxRate === TaxRate.HIGH && '+40 Bütçe, -1 Mutluluk / Gün'}
                    </div>
                </div>
            </div>

            {/* Projects Button - Bottom Right */}
            <div className="absolute bottom-6 right-6 z-20">
                <button
                    onClick={() => setShowProjects(true)}
                    className="flex items-center gap-3 bg-emerald-600/80 hover:bg-emerald-500/90 backdrop-blur border border-emerald-400/30 text-white px-6 py-4 rounded-xl shadow-[0_4px_20px_rgba(52,211,153,0.25)] hover:shadow-[0_4px_28px_rgba(52,211,153,0.45)] transition-all active:scale-95 font-bold text-lg"
                >
                    <Hammer className="w-6 h-6" />
                    Projeler &amp; Yatırımlar
                    {activeProjects.length > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                            {activeProjects.length} Aktif
                        </span>
                    )}
                </button>
            </div>

            {/* Projects Modal */}
            {showProjects && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="glass-panel !rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in">

                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Şehir Projeleri</h2>
                                <p className="text-slate-400">Bütçeni kullanarak şehrini geliştir.</p>
                            </div>
                            <button
                                onClick={() => setShowProjects(false)}
                                className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Project Cards Grid */}
                        <div className="overflow-y-auto custom-scrollbar max-h-[60vh] p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {PROJECTS.map(project => {
                                const isCompleted = completedProjectIds.includes(project.id);
                                const isActive = activeProjects.some(p => p.id === project.id);
                                const activeProject = activeProjects.find(p => p.id === project.id);

                                const hasPrereqs = !project.prerequisites || project.prerequisites.every(pId => completedProjectIds.includes(pId));
                                const canAfford = budget >= project.cost;

                                return (
                                    <div
                                        key={project.id}
                                        onClick={() => {
                                            if (isCompleted || !hasPrereqs || isActive) return;
                                            if (!canAfford) {
                                                setInsufficientFundsId(project.id);
                                                setTimeout(() => setInsufficientFundsId(null), 600);
                                            } else {
                                                buyProject(project);
                                            }
                                        }}
                                        className={`
                                            border rounded-xl p-5 relative overflow-hidden transition-all duration-300 text-left
                                            ${insufficientFundsId === project.id
                                                ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                                : isCompleted
                                                    ? 'border-emerald-500/30 bg-emerald-500/10 cursor-default'
                                                    : isActive
                                                        ? 'border-blue-500/30 bg-blue-500/10 cursor-default'
                                                        : !hasPrereqs
                                                            ? 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
                                                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 cursor-pointer'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-white">{project.name}</h3>
                                            {isCompleted && <CheckCircle className="text-emerald-400" />}
                                            {isActive && <Clock className="text-blue-400 animate-spin-slow" />}
                                            {!hasPrereqs && (
                                                <div className="flex items-center gap-1 text-xs font-bold text-red-400 border border-red-500/30 px-2 py-1 rounded bg-red-500/10">
                                                    <Lock className="w-3 h-3" /> Kilitli
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-sm text-slate-400 mb-3">{project.description}</p>

                                        {/* Prereq Info */}
                                        {!hasPrereqs && project.prerequisites && (
                                            <div className="text-xs text-red-400 mb-3 font-medium">
                                                Gereksinim: {project.prerequisites.map(id => PROJECTS.find(p => p.id === id)?.name).join(', ')}
                                            </div>
                                        )}

                                        {/* Cost & Duration */}
                                        <div className="mb-3 pb-3 border-b border-white/10">
                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <Coins className="w-4 h-4 text-yellow-400" />
                                                    <div>
                                                        <div className="text-slate-400 text-xs">Fiyat</div>
                                                        <div className="text-white font-bold">{project.cost.toLocaleString()}M</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-blue-400" />
                                                    <div>
                                                        <div className="text-slate-400 text-xs">Süre</div>
                                                        <div className="text-white font-bold">{project.duration} Gün</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Returns & Effects */}
                                        <div className="space-y-1 text-xs mb-4">
                                            <div className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2">Getiriler:</div>
                                            {project.effects.budgetPerTurn ? (
                                                <div className="text-emerald-400 font-medium">✓ +{project.effects.budgetPerTurn} Bütçe / Gün</div>
                                            ) : null}
                                            {project.effects.cleanliness ? (
                                                <div className="text-emerald-400 font-medium">✓ +{project.effects.cleanliness} Temizlik</div>
                                            ) : null}
                                            {project.effects.happiness ? (
                                                <div className="text-blue-400 font-medium">✓ +{project.effects.happiness} Mutluluk</div>
                                            ) : null}
                                            {!project.effects.budgetPerTurn && !project.effects.cleanliness && !project.effects.happiness ? (
                                                <div className="text-slate-500">Henüz belirtilmemiş</div>
                                            ) : null}
                                        </div>

                                        {isActive && (
                                            <div className="mt-2">
                                                <div className="w-full bg-white/10 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                                        style={{ width: `${((project.duration - activeProject!.daysRemaining) / project.duration) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className="text-center text-xs text-blue-400 mt-1 font-bold">
                                                    {activeProject!.daysRemaining} gün kaldı
                                                </div>
                                            </div>
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
