import type { LocalizedText } from './index';

export interface QuestReward {
    budget?: number;
    happiness?: number;
    cleanliness?: number;
}

// The game stat a goal tracks. 'eventsSolved' counts resolved crisis events.
export type QuestStat = 'budget' | 'happiness' | 'cleanliness' | 'day' | 'eventsSolved';

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
