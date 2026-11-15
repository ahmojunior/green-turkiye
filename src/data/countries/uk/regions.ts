import type { Region } from '../../../types';
import { Difficulty } from '../../../types/enums';

// The UK's 232 local authorities (see provincePaths.ts) grouped into 6 macro-regions,
// mirroring the difficulty/modifier spread of Germany's 6 regions. Spawn points and
// build-slot anchors are derived from the real centroid coordinates in gb.svg's
// label_points group, re-expressed as percentages of provincePaths.ts's cropped
// viewBox (see index.ts) — the 0-100 percentage space ProjectSites/EventNode
// markers are positioned in.
export const UK_REGIONS: Region[] = [
  {
    id: 'scotland',
    name: { tr: 'İskoçya', en: 'Scotland', de: 'Schottland' },
    description: { tr: 'Yaylalar ve rüzgarlı adalar. Rüzgar ve hidroelektrik enerji temiz tutar, ama uzak kırsal alanlar her krizi maliyetli hale getirir.', en: 'Highlands and windswept isles. Wind and hydro power keep things clean, but remote rural stretches make every crisis costly to reach.', de: 'Hochland und windumtoste Inseln. Wind- und Wasserkraft halten alles sauber, doch entlegene ländliche Gebiete machen jede Krise teuer.' },
    difficulty: Difficulty.MEDIUM,
    modifiers: {
      budgetMultiplier: 1.0,
      cleanlinessDecayMultiplier: 0.9,   // Wind and hydro keep the air clean
      happinessDecayMultiplier: 1.05,    // Remote, harsh weather wears at morale
      eventFrequencyMultiplier: 1.0
    }
  },
  {
    id: 'northern-england',
    name: { tr: 'Kuzey İngiltere', en: 'Northern England', de: 'Nordengland' },
    description: { tr: 'Eski sanayi şehirleri ve limanlar. Fabrikalar ve limanlar kasayı hızlı doldurur, ama on yıllardır süren ağır sanayi hava ve nehirleri zorlamaya devam eder.', en: 'Old industrial cities and ports. Factories and shipping fill the treasury fast, but decades of heavy industry keep straining the air and rivers.', de: 'Alte Industriestädte und Häfen. Fabriken und Häfen füllen die Kasse schnell, doch jahrzehntelange Schwerindustrie belastet weiterhin Luft und Flüsse.' },
    difficulty: Difficulty.HARD,
    modifiers: {
      budgetMultiplier: 1.3,             // Industry hub — strong tax base
      cleanlinessDecayMultiplier: 1.6,   // Heavy pollution
      happinessDecayMultiplier: 1.2,
      eventFrequencyMultiplier: 1.3
    }
  },
  {
    id: 'midlands',
    name: { tr: 'Midlands', en: 'Midlands', de: 'Midlands' },
    description: { tr: 'Mühendislik ve otomotiv sanayisinin yuvası. İnovasyon iyi kazandırır, ama fabrikaları hava kalitesini baskı altında tutar.', en: 'Home to engineering and the auto industry. Innovation pays well, but its factories keep the air quality under pressure.', de: 'Heimat des Maschinenbaus und der Automobilindustrie. Innovation zahlt sich aus, doch ihre Fabriken setzen die Luftqualität unter Druck.' },
    difficulty: Difficulty.MEDIUM,
    modifiers: {
      budgetMultiplier: 1.1,
      cleanlinessDecayMultiplier: 1.15,  // Factory emissions
      happinessDecayMultiplier: 0.95,
      eventFrequencyMultiplier: 1.0
    }
  },
  {
    id: 'wales',
    name: { tr: 'Galler', en: 'Wales', de: 'Wales' },
    description: { tr: 'Dağlar ve yeşil vadiler. Başlamak için yumuşak bir bölge, düşük nüfus yoğunluğu ve temiz hava huzur verir.', en: 'Mountains and green valleys. A gentle region to start in, with low population density and clean air keeping residents content.', de: 'Berge und grüne Täler. Eine sanfte Region für den Einstieg, mit geringer Bevölkerungsdichte und sauberer Luft, die die Bewohner zufrieden hält.' },
    difficulty: Difficulty.EASY,
    modifiers: {
      budgetMultiplier: 1.2,
      cleanlinessDecayMultiplier: 0.85,  // Clean rural air
      happinessDecayMultiplier: 0.85,    // Pleasant, low-density living
      eventFrequencyMultiplier: 0.9
    }
  },
  {
    id: 'southern-england',
    name: { tr: 'Güney İngiltere', en: 'Southern England', de: 'Südengland' },
    description: { tr: 'Finans, lojistik ve Londra\'nın kalbi. Vergi tabanı zengin, ama yoğun nüfus ve trafik mutluluğu sürekli zorlar.', en: 'Finance, logistics, and the heart of London. The tax base runs rich, but dense population and traffic keep happiness under constant pressure.', de: 'Finanzwesen, Logistik und das Herz Londons. Die Steuerbasis ist üppig, doch dichte Bevölkerung und Verkehr setzen die Zufriedenheit ständig unter Druck.' },
    difficulty: Difficulty.MEDIUM,
    modifiers: {
      budgetMultiplier: 1.25,            // Wealthy financial hub
      cleanlinessDecayMultiplier: 1.15,  // Traffic and density
      happinessDecayMultiplier: 1.15,    // Crowding pressure
      eventFrequencyMultiplier: 1.1
    }
  },
  {
    id: 'northern-ireland',
    name: { tr: 'Kuzey İrlanda', en: 'Northern Ireland', de: 'Nordirland' },
    description: { tr: 'Sanayisizleşme sonrası hâlâ yeniden inşa halinde bir bölge. Vergi tabanı zayıf, moral kırılgan — dikkatli ve istikrarlı yatırım gerektirir.', en: 'A region still rebuilding after deindustrialization. The tax base is thin and morale is fragile, demanding careful, steady investment.', de: 'Eine Region, die sich nach der Deindustrialisierung noch immer im Wiederaufbau befindet. Die Steuerbasis ist dünn und die Stimmung fragil — das erfordert sorgfältige, stetige Investitionen.' },
    difficulty: Difficulty.HARD,
    modifiers: {
      budgetMultiplier: 0.8,             // Weak tax base
      cleanlinessDecayMultiplier: 1.05,
      happinessDecayMultiplier: 1.3,     // Economic anxiety
      eventFrequencyMultiplier: 1.15
    }
  }
];
