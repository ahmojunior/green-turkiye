export interface Project {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number; // Days to complete
  prerequisites?: string[]; // Added based on new project data
  effects: {
    happiness?: number;
    cleanliness?: number;
    budgetPerTurn?: number;
    // We could add prevention logic later, e.g. "prevents: ['flood']"
  };
}

export const PROJECTS: Project[] = [
  {
    id: 'recycle-plant',
    name: 'Geri Dönüşüm Tesisi',
    description: 'Çöpleri ayrıştırarak çevreye katkı sağlar.',
    cost: 150,
    duration: 5,
    effects: {
      cleanliness: 15,
      happiness: 5
    }
  },
  {
    id: 'solar-farm',
    name: 'Güneş Enerjisi Santrali',
    description: 'Temiz enerji üretir. Geri Dönüşüm Tesisi gerektirir.',
    cost: 300,
    duration: 8,
    prerequisites: ['recycle-plant'],
    effects: {
      budgetPerTurn: 15,
      cleanliness: 10
    }
  },
  {
    id: 'eco-park',
    name: 'Ekolojik Park',
    description: 'Halkın nefes alabileceği yeşil alan.',
    cost: 100,
    duration: 3,
    effects: {
      happiness: 20,
      cleanliness: 5
    }
  },
  {
    id: 'smart-grid',
    name: 'Akıllı Şebeke',
    description: 'Enerji verimliliği sağlar. Güneş Enerjisi gerektirir.',
    cost: 500,
    duration: 10,
    prerequisites: ['solar-farm'],
    effects: {
      budgetPerTurn: 40
    }
  },
  {
    id: 'public-park',
    name: 'Büyük Şehir Parkı',
    description: 'Halkın nefes alabileceği yeşil alanlar oluşturur.',
    cost: 150,
    duration: 7,
    effects: {
      happiness: 10,
      cleanliness: 5
    }
  },
  {
    id: 'water-filter',
    name: 'Su Arıtma Tesisi',
    description: 'Su kaynaklarını temizler ve salgınları önler.',
    cost: 400,
    duration: 20,
    effects: {
      cleanliness: 20,
      happiness: 5
    }
  }
];
