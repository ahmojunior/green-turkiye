import type { Project } from '../types';

// Projects are the backbone of the economy. Beyond one-time bonuses on completion,
// most now provide passive per-turn income that offsets the daily decay of stats,
// so a well-developed region can be *sustained* rather than just spiked once.
export const PROJECTS: Project[] = [
  {
    id: 'recycle-plant',
    name: { tr: 'Geri Dönüşüm Tesisi', en: 'Recycling Plant', de: 'Recyclinganlage' },
    description: { tr: 'Çöpleri ayrıştırır. Her gün temizliğe küçük ama kalıcı bir katkı sağlar.', en: 'Sorts waste. Provides a small but permanent daily boost to cleanliness.', de: 'Trennt Müll. Liefert täglich einen kleinen, aber dauerhaften Sauberkeitsschub.' },
    cost: 250,
    duration: 5,
    effects: {
      cleanliness: 10,
      cleanlinessPerTurn: 2,
      happiness: 3
    }
  },
  {
    id: 'public-park',
    name: { tr: 'Şehir Parkı', en: 'City Park', de: 'Stadtpark' },
    description: { tr: 'Halkın nefes alacağı yeşil alan. Sürekli düşük maliyetli mutluluk kaynağı.', en: 'A green space for the public to breathe. A steady, low-cost source of happiness.', de: 'Eine grüne Oase zum Durchatmen. Eine stetige, kostengünstige Quelle der Zufriedenheit.' },
    cost: 200,
    duration: 7,
    effects: {
      happiness: 8,
      happinessPerTurn: 1
    }
  },
  {
    id: 'eco-park',
    name: { tr: 'Ekolojik Park', en: 'Eco Park', de: 'Ökopark' },
    description: { tr: 'Büyük yeşil alan. Hem mutluluğu hem çevreyi sürekli besler.', en: 'A large green space. Continuously feeds both happiness and the environment.', de: 'Eine großflächige Grünanlage. Sie stärkt fortlaufend sowohl die Zufriedenheit als auch die Umwelt.' },
    cost: 550,
    duration: 5,
    effects: {
      happiness: 15,
      happinessPerTurn: 2,
      cleanlinessPerTurn: 1
    }
  },
  {
    id: 'solar-farm',
    name: { tr: 'Güneş Enerjisi Santrali', en: 'Solar Power Plant', de: 'Solarkraftwerk' },
    description: { tr: 'Temiz enerji satarak kasaya günlük gelir getirir. Geri Dönüşüm Tesisi gerektirir.', en: 'Sells clean energy for daily income to the treasury. Requires the Recycling Plant.', de: 'Verkauft saubere Energie und bringt der Kasse tägliches Einkommen. Erfordert die Recyclinganlage.' },
    cost: 500,
    duration: 8,
    prerequisites: ['recycle-plant'],
    effects: {
      cleanliness: 5,
      budgetPerTurn: 15,
      cleanlinessPerTurn: 1
    }
  },
  {
    id: 'water-filter',
    name: { tr: 'Su Arıtma Tesisi', en: 'Water Treatment Plant', de: 'Wasseraufbereitungsanlage' },
    description: { tr: 'Pahalı ve uzun soluklu, ama temizlikte en güçlü kalıcı kaynak.', en: 'Expensive and long-term, but the strongest permanent source of cleanliness.', de: 'Teuer und langwierig, aber die stärkste dauerhafte Quelle für Sauberkeit.' },
    cost: 560,
    duration: 14,
    effects: {
      cleanliness: 20,
      cleanlinessPerTurn: 3,
      happiness: 5
    }
  },
  {
    id: 'smart-grid',
    name: { tr: 'Akıllı Şebeke', en: 'Smart Grid', de: 'Intelligentes Stromnetz' },
    description: { tr: 'Enerji verimliliğiyle kasaya büyük günlük gelir sağlar. Güneş Enerjisi gerektirir.', en: 'Provides large daily income to the treasury through energy efficiency. Requires Solar Power.', de: 'Sorgt durch Energieeffizienz für hohe tägliche Einnahmen der Kasse. Erfordert das Solarkraftwerk.' },
    cost: 700,
    duration: 10,
    prerequisites: ['solar-farm'],
    effects: {
      budgetPerTurn: 40
    }
  }
];
