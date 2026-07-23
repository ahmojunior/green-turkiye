import type { LocalizedText } from './index';

export interface QuestReward {
    budget?: number;
    happiness?: number;
    cleanliness?: number;
}

// The game stat a goal tracks. 'eventsSolved' counts resolved crisis events.
// 'sustainDays' mirrors the win condition's consecutive-days-held-above-threshold counter.
export type QuestStat = 'budget' | 'happiness' | 'cleanliness' | 'day' | 'eventsSolved' | 'sustainDays';

export interface Quest {
    id: string;
    title: LocalizedText;
    description: LocalizedText;
    stat: QuestStat;
    target: number;
    reward: QuestReward;
}

export interface QuestState {
    id: string;
    progress: number;
    isCompleted: boolean;
}
