import { useState } from 'react';
import { CheckCircle, Circle, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
import { ALL_QUESTS } from '../data/quests';
import type { QuestReward, QuestState } from '../types/quest';
import type { LocalizedText } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface QuestPanelProps {
    quests: QuestState[];
    toast: LocalizedText | null; // title of the most recently completed goal
}

const formatReward = (reward: QuestReward, t: (key: string) => string): string => {
    const parts: string[] = [];
    if (reward.budget) parts.push(`+${reward.budget} ${t('quest.reward.budget')}`);
    if (reward.happiness) parts.push(`+${reward.happiness} ${t('quest.reward.happiness')}`);
    if (reward.cleanliness) parts.push(`+${reward.cleanliness} ${t('quest.reward.cleanliness')}`);
    return parts.join(', ');
};

export function QuestPanel({ quests, toast }: QuestPanelProps) {
    const [isOpen, setIsOpen] = useState(true);
    const { lang, t } = useLanguage();

    return (
        <>
            {/* Quest Panel - Top Right Overlay */}
            <div
                className={`absolute top-28 right-4 w-72 z-30 pointer-events-auto transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-10px)]'
                    }`}
            >
                {/* The Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute -left-10 top-4 w-10 h-10 glass-panel flex items-center justify-center rounded-l-xl border-r-0 cursor-pointer hover:bg-white/10"
                >
                    {isOpen ? <ChevronRight className="w-5 h-5 text-slate-300" /> : <ChevronLeft className="w-5 h-5 text-slate-300" />}
                </button>

                <div className="w-full glass-panel p-0 overflow-hidden shadow-2xl">
                    <div className="px-4 py-4 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-white font-bold text-sm flex items-center gap-2">
                            <Gift className="w-4 h-4 text-amber-400" />
                            {t('quest.goals')}
                        </h3>
                        <span className="text-xs text-slate-400">
                            {quests.filter(q => q.isCompleted).length}/{quests.length}
                        </span>
                    </div>

                    <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto">
                        {quests.map(questState => {
                            const questDef = ALL_QUESTS.find(q => q.id === questState.id);
                            if (!questDef) return null;

                            return (
                                <div key={questState.id} className={`transition-all ${questState.isCompleted
                                    ? 'p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30'
                                    : 'p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10'
                                    }`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-0.5 ${questState.isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                                            {questState.isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium ${questState.isCompleted ? 'text-emerald-400 line-through opacity-70' : 'text-white'}`}>
                                                {questDef.title[lang]}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-0.5 leading-tight">
                                                {questDef.description[lang]}
                                            </p>

                                            {/* Progress Bar (if applicable) */}
                                            {!questState.isCompleted && questDef.target && (
                                                <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-400 transition-all duration-500"
                                                        style={{ width: `${Math.min(100, Math.max(0, (questState.progress / questDef.target) * 100))}%` }}
                                                    ></div>
                                                </div>
                                            )}

                                            {!questState.isCompleted && questDef.target && (
                                                <p className="text-[10px] text-slate-500 mt-1 text-right">
                                                    {Math.round(questState.progress)} / {questDef.target}
                                                </p>
                                            )}

                                            {!questState.isCompleted && (
                                                <p className="text-[10px] text-amber-400/80 mt-1 flex items-center gap-1">
                                                    <Gift className="w-3 h-3" /> {formatReward(questDef.reward, t)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {quests.length === 0 && (
                            <div className="p-6 text-center flex flex-col items-center gap-2 animate-pulse">
                                <Gift className="w-8 h-8 text-slate-500/50" />
                                <span className="text-sm font-medium text-slate-300">{t('quest.waitingForNew')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className="absolute top-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full flex items-center gap-3 z-50 glass-panel bg-emerald-500/20 border-emerald-500/30 text-white animate-in fade-in slide-in-from-top-4 duration-500">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold">{toast[lang]} {t('quest.completedToast')}</span>
                </div>
            )}
        </>
    );
}
