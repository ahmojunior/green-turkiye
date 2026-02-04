import type { Region } from '../types';

export const REGIONS: Region[] = [
  {
    id: 'marmara',
    name: 'Marmara Bölgesi',
    description: 'Yüksek nüfus ve sanayi merkezi. Bütçe yüksek ama kirlilik hızlı artıyor.',
    difficulty: 'Zor',
    spawnPoints: [
      { x: 15, y: 25 },
      { x: 20, y: 20 },
      { x: 10, y: 30 },
      { x: 25, y: 15 }
    ]
  },
  {
    id: 'blacksea',
    name: 'Karadeniz Bölgesi',
    description: 'Ormanlar ve yağmurlu kıyılar. Fabrikalar ekosistemi tehdit ediyor.',
    difficulty: 'Orta',
    spawnPoints: [
      { x: 40, y: 15 },
      { x: 55, y: 12 },
      { x: 70, y: 18 },
      { x: 80, y: 15 }
    ]
  },
  {
    id: 'aegean',
    name: 'Ege Bölgesi',
    description: 'Turizm ve tarım odaklı. Denizi temiz tutmak mutluluk için hayati önemde.',
    difficulty: 'Orta',
    spawnPoints: [
      { x: 10, y: 45 },
      { x: 15, y: 55 },
      { x: 8, y: 60 },
      { x: 12, y: 40 }
    ]
  },
  {
    id: 'anatolian',
    name: 'İç Anadolu',
    description: 'Kurak iklim ve tarım arazileri. Su yönetimi kritik öneme sahip.',
    difficulty: 'Kolay',
    spawnPoints: [
      { x: 45, y: 45 },
      { x: 35, y: 50 },
      { x: 50, y: 55 },
      { x: 40, y: 40 }
    ]
  },
  {
    id: 'mediterranean',
    name: 'Akdeniz Bölgesi',
    description: 'Turizm cenneti. Yaz aylarında nüfus patlaması yaşanıyor.',
    difficulty: 'Orta',
    spawnPoints: [
      { x: 35, y: 75 },
      { x: 45, y: 80 },
      { x: 55, y: 78 },
      { x: 40, y: 85 }
    ]
  },
  {
    id: 'eastern',
    name: 'Doğu Anadolu',
    description: 'Zorlu kış şartları ve hayvancılık. Altyapı yatırımı gerekiyor.',
    difficulty: 'Zor',
    spawnPoints: [
      { x: 80, y: 40 },
      { x: 85, y: 50 },
      { x: 75, y: 35 },
      { x: 82, y: 45 }
    ]
  },
  {
    id: 'southeastern',
    name: 'Güneydoğu Anadolu',
    description: 'Tarihi doku ve tarım. Kuraklık ve baraj yönetimi önemli.',
    difficulty: 'Zor',
    spawnPoints: [
      { x: 70, y: 70 },
      { x: 75, y: 65 },
      { x: 65, y: 75 },
      { x: 80, y: 72 }
    ]
  }
];
