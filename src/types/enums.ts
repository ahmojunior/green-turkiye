export const Difficulty = {
    EASY: 'Kolay',
    MEDIUM: 'Orta',
    HARD: 'Zor'
} as const;

export type Difficulty = typeof Difficulty[keyof typeof Difficulty];

export const TaxRate = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high'
} as const;

export type TaxRate = typeof TaxRate[keyof typeof TaxRate];
