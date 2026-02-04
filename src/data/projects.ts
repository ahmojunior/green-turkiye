export interface Project {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number; // Days to complete
  effects: {
    happiness?: number;
    cleanliness?: number;
    budgetPerTurn?: number;
    // We could add prevention logic later, e.g. "prevents: ['flood']"
  };
}

export const PROJECTS: Project[] = [
  {
    id: 'recycling-center',
    name: 'Geri Dönüşüm Tesisi',
    description: 'Şehrin atıklarını yöneterek temizliği artırır.',
    cost: 300,
    duration: 15,
    effects: {
      cleanliness: 15,
      budgetPerTurn: 2
    }
  },
  {
    id: 'solar-plant',
    name: 'Güneş Enerjisi Santrali',
    description: 'Temiz enerji sağlar ve uzun vadede bütçe kazandırır.',
    cost: 500,
    duration: 30,
    effects: {
      cleanliness: 5,
      budgetPerTurn: 10
    }
  },
  {
    id: 'tourism-ad',
    name: 'Turizm Reklam Kampanyası',
    description: 'Bölgeye turist çeker ve bütçeyi artırır.',
    cost: 200,
    duration: 10,
    effects: {
      happiness: 5,
      budgetPerTurn: 15
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
