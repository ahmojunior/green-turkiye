import type { Quest } from '../types/quest';

// Goals are optional milestones. Completing one grants a one-time reward,
// giving the player a steady sense of progress across a longer run.
export const ALL_QUESTS: Quest[] = [
    {
        id: 'budget_master',
        title: { tr: 'Bütçe Uzmanı', en: 'Budget Expert', de: 'Budgetexperte' },
        description: { tr: 'Bütçeni 1 Milyar üzerine çıkar.', en: 'Raise your budget above 1 Billion.', de: 'Erhöhe dein Budget auf über 1 Milliarde.' },
        stat: 'budget',
        target: 1000,
        reward: { happiness: 8 }
    },
    {
        id: 'happy_people',
        title: { tr: 'Mutlu Halk', en: 'Happy People', de: 'Zufriedenes Volk' },
        description: { tr: 'Halk mutluluğunu %80 üzerine çıkar.', en: 'Raise public happiness above 80%.', de: 'Erhöhe die Zufriedenheit der Bevölkerung auf über 80%.' },
        stat: 'happiness',
        target: 80,
        reward: { budget: 150 }
    },
    {
        id: 'clean_city',
        title: { tr: 'Tertemiz Şehir', en: 'Spotless City', de: 'Blitzsaubere Stadt' },
        description: { tr: 'Temizlik oranını %85 üzerine çıkar.', en: 'Raise cleanliness above 85%.', de: 'Erhöhe die Sauberkeit auf über 85%.' },
        stat: 'cleanliness',
        target: 85,
        reward: { happiness: 10 }
    },
    {
        id: 'crisis_manager',
        title: { tr: 'Kriz Yöneticisi', en: 'Crisis Manager', de: 'Krisenmanager' },
        description: { tr: '5 adet krize müdahale et.', en: 'Resolve 5 crises.', de: 'Löse 5 Krisen.' },
        stat: 'eventsSolved',
        target: 5,
        reward: { budget: 200, happiness: 5, cleanliness: 5 }
    },
    {
        id: 'survivor',
        title: { tr: 'Hayatta Kalan', en: 'Survivor', de: 'Überlebenskünstler' },
        description: { tr: '20. güne ulaş.', en: 'Reach day 20.', de: 'Erreiche Tag 20.' },
        stat: 'day',
        target: 20,
        reward: { cleanliness: 15, happiness: 10 }
    }
];
