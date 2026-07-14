import type { Region } from '../types';
import { Difficulty } from '../types/enums';

// Each project always lands in the same relative 3x2 plot layout, just anchored
// at a different point per region so it stays clear of that region's spawnPoints.
const PROJECT_PLOT_ORDER = ['recycle-plant', 'public-park', 'eco-park', 'solar-farm', 'water-filter', 'smart-grid'];
function buildSlotsAt(anchorX: number, anchorY: number): Record<string, { x: number; y: number }> {
  const cols = 3;
  const spacing = 6;
  return Object.fromEntries(
    PROJECT_PLOT_ORDER.map((id, i) => [
      id,
      { x: anchorX + (i % cols) * spacing, y: anchorY + Math.floor(i / cols) * spacing },
    ])
  );
}

// Modifiers make each region play differently. Multipliers default to 1.0 (neutral);
// higher decay/eventFrequency = harder, higher budget = richer.
export const REGIONS: Region[] = [
  {
    id: 'marmara',
    name: { tr: 'Marmara Bölgesi', en: 'Marmara Region', de: 'Region Marmara' },
    description: { tr: 'Yüksek nüfus ve sanayi merkezi. Kasa hızlı dolar ama kirlilik daha da hızlı artar.', en: 'A high-population industrial hub. The treasury fills fast, but pollution rises even faster.', de: 'Ein bevölkerungsreiches Industriezentrum. Die Kasse füllt sich schnell, doch die Verschmutzung steigt noch schneller.' },
    difficulty: Difficulty.HARD,
    spawnPoints: [
      { x: 15, y: 25 },
      { x: 20, y: 20 },
      { x: 10, y: 30 },
      { x: 25, y: 15 }
    ],
    buildSlots: buildSlotsAt(6, 36),
    modifiers: {
      budgetMultiplier: 1.3,            // Industry hub — strong tax base
      cleanlinessDecayMultiplier: 1.6,  // Heavy pollution
      happinessDecayMultiplier: 1.2,
      eventFrequencyMultiplier: 1.3
    }
  },
  {
    id: 'blacksea',
    name: { tr: 'Karadeniz Bölgesi', en: 'Black Sea Region', de: 'Schwarzmeerregion' },
    description: { tr: 'Ormanlar ve yağmurlu kıyılar. Doğa kendini toparlar ama heyelan ve seller tedirgin eder.', en: 'Forests and rainy coasts. Nature recovers on its own, but landslides and floods keep everyone on edge.', de: 'Wälder und regnerische Küsten. Die Natur erholt sich von selbst, doch Erdrutsche und Überschwemmungen halten alle in Atem.' },
    difficulty: Difficulty.MEDIUM,
    spawnPoints: [
      { x: 40, y: 15 },
      { x: 55, y: 12 },
      { x: 70, y: 18 },
      { x: 80, y: 15 }
    ],
    buildSlots: buildSlotsAt(52, 26),
    modifiers: {
      budgetMultiplier: 1.0,
      cleanlinessDecayMultiplier: 0.9,  // Forests slow pollution
      happinessDecayMultiplier: 1.1,
      eventFrequencyMultiplier: 1.1
    }
  },
  {
    id: 'aegean',
    name: { tr: 'Ege Bölgesi', en: 'Aegean Region', de: 'Ägäisregion' },
    description: { tr: 'Turizm ve tarım odaklı. Denizi temiz tutmak halkın mutluluğu için hayati.', en: 'Focused on tourism and agriculture. Keeping the sea clean is vital for public happiness.', de: 'Geprägt von Tourismus und Landwirtschaft. Ein sauberes Meer ist entscheidend für die Zufriedenheit der Bevölkerung.' },
    difficulty: Difficulty.MEDIUM,
    spawnPoints: [
      { x: 12, y: 48 },
      { x: 14, y: 65 },
      { x: 22, y: 55 },
      { x: 20, y: 42 }
    ],
    buildSlots: buildSlotsAt(24, 48),
    modifiers: {
      budgetMultiplier: 1.1,
      cleanlinessDecayMultiplier: 1.0,
      happinessDecayMultiplier: 0.9,    // Pleasant climate
      eventFrequencyMultiplier: 1.0
    }
  },
  {
    id: 'anatolian',
    name: { tr: 'İç Anadolu', en: 'Central Anatolia', de: 'Zentralanatolien' },
    description: { tr: 'Sakin bozkır iklimi. İyi bir başlangıç bölgesi, ama su yönetimi ihmale gelmez.', en: 'A calm steppe climate. A good starter region, but water management can’t be neglected.', de: 'Ein ruhiges Steppenklima. Eine gute Region für Einsteiger, doch die Wasserwirtschaft darf nicht vernachlässigt werden.' },
    difficulty: Difficulty.EASY,
    spawnPoints: [
      { x: 45, y: 45 },
      { x: 35, y: 50 },
      { x: 50, y: 55 },
      { x: 40, y: 40 }
    ],
    buildSlots: buildSlotsAt(38, 26),
    modifiers: {
      budgetMultiplier: 0.95,
      cleanlinessDecayMultiplier: 0.8,  // Low industry
      happinessDecayMultiplier: 0.8,
      eventFrequencyMultiplier: 0.8
    }
  },
  {
    id: 'mediterranean',
    name: { tr: 'Akdeniz Bölgesi', en: 'Mediterranean Region', de: 'Mittelmeerregion' },
    description: { tr: 'Turizm cenneti. Yaz aylarında nüfus patlar; kasa dolar ama kıyılar zorlanır.', en: 'A tourism paradise. Population surges in summer; the treasury fills but the coastlines are strained.', de: 'Ein Touristenparadies. Im Sommer schnellt die Bevölkerung in die Höhe; die Kasse füllt sich, doch die Küsten geraten unter Druck.' },
    difficulty: Difficulty.MEDIUM,
    spawnPoints: [
      { x: 35, y: 75 },
      { x: 45, y: 80 },
      { x: 55, y: 78 },
      { x: 40, y: 85 }
    ],
    buildSlots: buildSlotsAt(38, 62),
    modifiers: {
      budgetMultiplier: 1.15,
      cleanlinessDecayMultiplier: 1.1,
      happinessDecayMultiplier: 0.9,
      eventFrequencyMultiplier: 1.1
    }
  },
  {
    id: 'eastern',
    name: { tr: 'Doğu Anadolu', en: 'Eastern Anatolia', de: 'Ostanatolien' },
    description: { tr: 'Zorlu kış şartları ve hayvancılık. Halkı memnun tutmak sürekli yatırım ister.', en: 'Harsh winters and livestock farming. Keeping the public happy demands constant investment.', de: 'Strenge Winter und Viehwirtschaft. Die Bevölkerung zufriedenzustellen erfordert ständige Investitionen.' },
    difficulty: Difficulty.HARD,
    spawnPoints: [
      { x: 80, y: 40 },
      { x: 85, y: 50 },
      { x: 75, y: 35 },
      { x: 82, y: 45 }
    ],
    buildSlots: buildSlotsAt(64, 42),
    modifiers: {
      budgetMultiplier: 0.85,           // Weak tax base
      cleanlinessDecayMultiplier: 1.1,
      happinessDecayMultiplier: 1.4,    // Harsh living conditions
      eventFrequencyMultiplier: 1.2
    }
  },
  {
    id: 'southeastern',
    name: { tr: 'Güneydoğu Anadolu', en: 'Southeastern Anatolia', de: 'Südostanatolien' },
    description: { tr: 'Tarihi doku ve tarım. Kuraklık ve baraj yönetimi çevreyi sürekli tehdit eder.', en: 'Historic fabric and agriculture. Drought and dam management constantly threaten the environment.', de: 'Geschichtsträchtige Region mit Landwirtschaft. Dürre und Staudammpolitik bedrohen die Umwelt fortwährend.' },
    difficulty: Difficulty.HARD,
    spawnPoints: [
      { x: 70, y: 70 },
      { x: 75, y: 65 },
      { x: 65, y: 75 },
      { x: 80, y: 72 }
    ],
    buildSlots: buildSlotsAt(58, 56),
    modifiers: {
      budgetMultiplier: 0.9,
      cleanlinessDecayMultiplier: 1.3,  // Drought-driven degradation
      happinessDecayMultiplier: 1.2,
      eventFrequencyMultiplier: 1.2
    }
  }
];
