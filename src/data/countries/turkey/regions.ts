import type { Region } from '../../../types';
import { Difficulty } from '../../../types/enums';

// Modifiers make each region play differently. Multipliers default to 1.0 (neutral);
// higher decay/eventFrequency = harder, higher budget = richer.
export const TURKEY_REGIONS: Region[] = [
  {
    id: 'marmara',
    name: { tr: 'Marmara Bölgesi', en: 'Marmara Region', de: 'Region Marmara' },
    description: { tr: 'Yüksek nüfus ve sanayi merkezi. Kasa hızlı dolar ama kirlilik daha da hızlı artar.', en: 'A high-population industrial hub. The treasury fills fast, but pollution rises even faster.', de: 'Ein bevölkerungsreiches Industriezentrum. Die Kasse füllt sich schnell, doch die Verschmutzung steigt noch schneller.' },
    difficulty: Difficulty.HARD,
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
    description: { tr: 'Ormanlar ve yağmurlu kıyılar. Dere yataklarına yapılaşma, taş ocakları ve HES tartışmaları bölgeyi sel ve heyelana açık bırakıyor.', en: 'Forests and rainy coasts. Building in streambeds, quarries and hydro disputes leave the region exposed to floods and landslides.', de: 'Wälder und regnerische Küsten. Bebaute Bachbetten, Steinbrüche und Streit um Wasserkraft machen die Region anfällig für Fluten und Erdrutsche.' },
    difficulty: Difficulty.MEDIUM,
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
    description: { tr: 'Bozkır iklimi ve kapalı havza. Sanayi yükü düşük görünür, ama yeraltı suyu Türkiye’nin en kırılgan kaynağıdır: obruklar bunun işaretidir.', en: 'Steppe climate and a closed basin. The industrial load looks light, but the groundwater here is Turkey’s most fragile resource, and the sinkholes are the warning sign.', de: 'Steppenklima und abflussloses Becken. Die Industrielast wirkt gering, doch das Grundwasser ist hier die empfindlichste Ressource des Landes: Die Dolinen sind das Warnzeichen.' },
    difficulty: Difficulty.EASY,
    modifiers: {
      budgetMultiplier: 0.95,
      cleanlinessDecayMultiplier: 0.8,  // Slow visible decay — the damage here is the aquifer, which this bar does not show
      happinessDecayMultiplier: 0.8,
      eventFrequencyMultiplier: 0.8
    }
  },
  {
    id: 'mediterranean',
    name: { tr: 'Akdeniz Bölgesi', en: 'Mediterranean Region', de: 'Mittelmeerregion' },
    description: { tr: 'Turizm cenneti. Yaz aylarında nüfus patlar; kasa dolar ama kıyılar zorlanır.', en: 'A tourism paradise. Population surges in summer; the treasury fills but the coastlines are strained.', de: 'Ein Touristenparadies. Im Sommer schnellt die Bevölkerung in die Höhe; die Kasse füllt sich, doch die Küsten geraten unter Druck.' },
    difficulty: Difficulty.MEDIUM,
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
    modifiers: {
      budgetMultiplier: 0.9,
      cleanlinessDecayMultiplier: 1.3,  // Drought-driven degradation
      happinessDecayMultiplier: 1.2,
      eventFrequencyMultiplier: 1.2
    }
  }
];
