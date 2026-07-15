import type { Region } from '../../../types';
import { Difficulty } from '../../../types/enums';
import { buildSlotsAt } from '../../../utils/buildSlots';

// Germany's 16 Bundesländer (see provincePaths.ts) grouped into 6 macro-regions,
// mirroring the difficulty/modifier spread of Turkey's 7 regions.
export const GERMANY_REGIONS: Region[] = [
  {
    id: 'nord',
    name: { tr: 'Kuzey Almanya', en: 'North Germany', de: 'Norddeutschland' },
    description: { tr: 'Rüzgarlı kıyılar ve yoğun limanlar. Açık deniz rüzgar enerjisi elektriği sağlar, ama yükselen deniz seviyesi ve fırtınalar kıyıyı tedirgin eder.', en: 'Windswept coasts and busy ports. Offshore wind keeps the lights on, but rising seas and storm surges keep the coast on edge.', de: 'Windige Küsten und geschäftige Häfen. Offshore-Windkraft hält die Lichter an, doch steigende Meeresspiegel und Sturmfluten halten die Küste in Atem.' },
    difficulty: Difficulty.MEDIUM,
    spawnPoints: [
      { x: 45, y: 8 },
      { x: 50, y: 15 },
      { x: 40, y: 20 },
      { x: 60, y: 12 }
    ],
    buildSlots: buildSlotsAt(35, 5),
    modifiers: {
      budgetMultiplier: 1.0,
      cleanlinessDecayMultiplier: 0.9,  // Wind energy keeps the air clean
      happinessDecayMultiplier: 1.1,    // Flood risk keeps residents on edge
      eventFrequencyMultiplier: 1.0
    }
  },
  {
    id: 'ruhrgebiet',
    name: { tr: 'Ruhr Bölgesi', en: 'Ruhr Area', de: 'Ruhrgebiet' },
    description: { tr: 'Eski sanayi kalbi. Fabrikalar kasayı hızlı doldurur, ama on yıllardır süren ağır sanayi hava ve nehirleri sürekli zorlar.', en: 'The old industrial heartland. Factories fill the treasury fast, but decades of heavy industry have left the air and rivers under constant strain.', de: 'Das alte industrielle Herzland. Fabriken füllen die Kasse schnell, doch jahrzehntelange Schwerindustrie belastet Luft und Flüsse fortwährend.' },
    difficulty: Difficulty.HARD,
    spawnPoints: [
      { x: 22, y: 35 },
      { x: 28, y: 40 },
      { x: 18, y: 42 },
      { x: 25, y: 30 }
    ],
    buildSlots: buildSlotsAt(14, 33),
    modifiers: {
      budgetMultiplier: 1.3,            // Industry hub — strong tax base
      cleanlinessDecayMultiplier: 1.6,  // Heavy pollution
      happinessDecayMultiplier: 1.2,
      eventFrequencyMultiplier: 1.3
    }
  },
  {
    id: 'rheinmain',
    name: { tr: 'Ren-Main', en: 'Rhine-Main', de: 'Rhein-Main' },
    description: { tr: 'Finans ve lojistik kavşağı. Düzenli gelir akar, ama yoğun trafik ve sanayi kirliliği sürekli diri tutar.', en: 'A finance and logistics crossroads. Steady income flows in, but dense traffic and industry keep pollution simmering.', de: 'Eine Kreuzung aus Finanzwesen und Logistik. Stetige Einnahmen fließen, doch dichter Verkehr und Industrie halten die Verschmutzung am Köcheln.' },
    difficulty: Difficulty.MEDIUM,
    spawnPoints: [
      { x: 32, y: 48 },
      { x: 38, y: 52 },
      { x: 28, y: 55 },
      { x: 35, y: 45 }
    ],
    buildSlots: buildSlotsAt(20, 46),
    modifiers: {
      budgetMultiplier: 1.15,
      cleanlinessDecayMultiplier: 1.1,
      happinessDecayMultiplier: 1.0,
      eventFrequencyMultiplier: 1.05
    }
  },
  {
    id: 'bayern',
    name: { tr: 'Bavyera', en: 'Bavaria', de: 'Bayern' },
    description: { tr: 'Alp zirveleri ve zengin bir vergi tabanı. Başlamak için yumuşak bir bölge, yine de her yaz turist kalabalığı çekiciliğini sınar.', en: 'Alpine peaks and a wealthy tax base. A gentle region to start in, though tourist crowds test its charm every summer.', de: 'Alpengipfel und eine wohlhabende Steuerbasis. Eine sanfte Region für den Einstieg, auch wenn Touristenmassen ihren Charme jeden Sommer auf die Probe stellen.' },
    difficulty: Difficulty.EASY,
    spawnPoints: [
      { x: 62, y: 70 },
      { x: 68, y: 75 },
      { x: 58, y: 80 },
      { x: 65, y: 65 }
    ],
    buildSlots: buildSlotsAt(52, 66),
    modifiers: {
      budgetMultiplier: 1.2,            // Wealthy tax base
      cleanlinessDecayMultiplier: 0.85, // Alpine air stays clean
      happinessDecayMultiplier: 0.85,   // Pleasant living
      eventFrequencyMultiplier: 0.9
    }
  },
  {
    id: 'badenwuerttemberg',
    name: { tr: 'Baden-Württemberg', en: 'Baden-Württemberg', de: 'Baden-Württemberg' },
    description: { tr: 'Mühendislik ve otomotiv sanayisinin yuvası. İnovasyon iyi kazandırır, ama fabrikaları hava kalitesini baskı altında tutar.', en: 'Home to engineering and the auto industry. Innovation pays well, but its factories keep the air quality under pressure.', de: 'Heimat des Maschinenbaus und der Automobilindustrie. Innovation zahlt sich aus, doch ihre Fabriken setzen die Luftqualität unter Druck.' },
    difficulty: Difficulty.MEDIUM,
    spawnPoints: [
      { x: 35, y: 70 },
      { x: 40, y: 75 },
      { x: 30, y: 78 },
      { x: 38, y: 65 }
    ],
    buildSlots: buildSlotsAt(22, 66),
    modifiers: {
      budgetMultiplier: 1.1,
      cleanlinessDecayMultiplier: 1.15, // Factory emissions
      happinessDecayMultiplier: 0.95,
      eventFrequencyMultiplier: 1.0
    }
  },
  {
    id: 'ost',
    name: { tr: 'Doğu Almanya', en: 'Eastern Germany', de: 'Ostdeutschland' },
    description: { tr: 'Sanayisizleşme sonrası hâlâ yeniden inşa halinde bir bölge. Vergi tabanı zayıf, moral kırılgan — dikkatli ve istikrarlı yatırım gerektirir.', en: 'A region still rebuilding after deindustrialization. The tax base is thin and morale is fragile, demanding careful, steady investment.', de: 'Eine Region, die sich nach der Deindustrialisierung noch immer im Wiederaufbau befindet. Die Steuerbasis ist dünn und die Stimmung fragil — das erfordert sorgfältige, stetige Investitionen.' },
    difficulty: Difficulty.HARD,
    spawnPoints: [
      { x: 62, y: 35 },
      { x: 68, y: 40 },
      { x: 58, y: 45 },
      { x: 65, y: 28 }
    ],
    buildSlots: buildSlotsAt(50, 30),
    modifiers: {
      budgetMultiplier: 0.8,            // Weak tax base
      cleanlinessDecayMultiplier: 1.05,
      happinessDecayMultiplier: 1.3,    // Economic anxiety
      eventFrequencyMultiplier: 1.15
    }
  }
];
