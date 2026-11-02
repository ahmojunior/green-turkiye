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
  },

  // ---------------------------------------------------------------------------
  // Region-specific projects. Each region has a cheap first step and a bigger
  // follow-up that requires it, themed on that region's real-world problems.
  // ---------------------------------------------------------------------------

  // --- Turkey ---
  {
    id: 'marmara-air-network',
    regionId: 'marmara',
    name: { tr: 'Hava Kalitesi İzleme Ağı', en: 'Air Quality Monitoring Network', de: 'Luftqualitäts-Messnetz' },
    description: { tr: 'Sanayi bacalarını anlık izler, kirletenleri hızla tespit eder.', en: 'Tracks industrial stacks in real time and quickly identifies polluters.', de: 'Überwacht Industrieschornsteine in Echtzeit und ermittelt Verursacher schnell.' },
    cost: 280,
    duration: 4,
    effects: { cleanliness: 8, cleanlinessPerTurn: 1, happinessPerTurn: 1 }
  },
  {
    id: 'marmara-advanced-treatment',
    regionId: 'marmara',
    name: { tr: 'İleri Biyolojik Atık Su Arıtma', en: 'Advanced Biological Wastewater Treatment', de: 'Weitergehende biologische Abwasserreinigung' },
    description: { tr: 'Marmara Denizi’ne giden azot ve fosforu azaltarak müsilaj riskini düşürür.', en: 'Cuts the nitrogen and phosphorus reaching the Sea of Marmara, lowering the risk of sea snot.', de: 'Verringert den Stickstoff- und Phosphoreintrag ins Marmarameer und senkt so das Risiko von Meeresschleim.' },
    cost: 640,
    duration: 11,
    prerequisites: ['marmara-air-network'],
    effects: { cleanliness: 20, cleanlinessPerTurn: 3, happiness: 8 }
  },
  {
    id: 'blacksea-slope-forest',
    regionId: 'blacksea',
    name: { tr: 'Yamaç Ağaçlandırma', en: 'Slope Reforestation', de: 'Hangaufforstung' },
    description: { tr: 'Kökler dik yamaçlardaki toprağı tutar ve heyelan riskini azaltır.', en: 'Roots hold the soil on steep slopes and reduce the risk of landslides.', de: 'Wurzeln halten den Boden an steilen Hängen und verringern die Erdrutschgefahr.' },
    cost: 240,
    duration: 5,
    effects: { happiness: 8, happinessPerTurn: 1, cleanliness: 3 }
  },
  {
    id: 'blacksea-flood-warning',
    regionId: 'blacksea',
    name: { tr: 'Taşkın Erken Uyarı Sistemi', en: 'Flood Early Warning System', de: 'Hochwasser-Frühwarnsystem' },
    description: { tr: 'Dere yataklarını izler, ani sellerden önce vadileri uyarır.', en: 'Monitors stream beds and warns valleys before flash floods hit.', de: 'Überwacht Bachläufe und warnt Täler vor Sturzfluten.' },
    cost: 520,
    duration: 8,
    prerequisites: ['blacksea-slope-forest'],
    effects: { happiness: 12, happinessPerTurn: 2, cleanlinessPerTurn: 1 }
  },
  {
    id: 'aegean-olive-wastewater',
    regionId: 'aegean',
    name: { tr: 'Zeytin Karasuyu Arıtma', en: 'Olive Mill Wastewater Treatment', de: 'Aufbereitung von Olivenmühlen-Abwasser' },
    description: { tr: 'Zeytinyağı üretiminin zararlı atığının dere ve koylara ulaşmasını önler.', en: 'Keeps the harmful waste of olive oil production out of streams and bays.', de: 'Hält die schädlichen Abwässer der Olivenölherstellung von Bächen und Buchten fern.' },
    cost: 260,
    duration: 5,
    effects: { cleanliness: 10, cleanlinessPerTurn: 2 }
  },
  {
    id: 'aegean-marine-reserve',
    regionId: 'aegean',
    name: { tr: 'Deniz Koruma Alanı', en: 'Marine Protected Area', de: 'Meeresschutzgebiet' },
    description: { tr: 'Balık stoklarını toparlar; temiz koylar turizm geliri getirir.', en: 'Lets fish stocks recover, while clean bays bring in tourism income.', de: 'Lässt Fischbestände sich erholen; saubere Buchten bringen Tourismuseinnahmen.' },
    cost: 560,
    duration: 9,
    prerequisites: ['aegean-olive-wastewater'],
    effects: { cleanliness: 8, cleanlinessPerTurn: 1, happinessPerTurn: 1, budgetPerTurn: 12 }
  },
  {
    id: 'anatolian-drip-irrigation',
    regionId: 'anatolian',
    name: { tr: 'Damla Sulama Programı', en: 'Drip Irrigation Program', de: 'Tröpfchenbewässerungsprogramm' },
    description: { tr: 'Bozkır tarımında suyu köke verir, yeraltı suyunu ve çiftçinin bütçesini korur.', en: 'Delivers water straight to the roots, saving groundwater and farmers’ money on the steppe.', de: 'Bringt das Wasser direkt an die Wurzeln und schont in der Steppe Grundwasser und Betriebskosten.' },
    cost: 230,
    duration: 5,
    effects: { cleanliness: 6, cleanlinessPerTurn: 1, budgetPerTurn: 4 }
  },
  {
    id: 'anatolian-wetland-restoration',
    regionId: 'anatolian',
    name: { tr: 'Sulak Alan Restorasyonu', en: 'Wetland Restoration', de: 'Renaturierung von Feuchtgebieten' },
    description: { tr: 'Tuz Gölü havzasındaki kuruyan sulak alanları ve göçmen kuşların yaşamını destekler.', en: 'Supports the drying wetlands of the Lake Tuz basin and the migratory birds that depend on them.', de: 'Unterstützt die austrocknenden Feuchtgebiete im Becken des Tuz-Sees und die dortigen Zugvögel.' },
    cost: 520,
    duration: 10,
    prerequisites: ['anatolian-drip-irrigation'],
    effects: { cleanliness: 15, cleanlinessPerTurn: 2, happinessPerTurn: 1 }
  },
  {
    id: 'mediterranean-greenhouse-recycling',
    regionId: 'mediterranean',
    name: { tr: 'Sera Plastiği Geri Dönüşümü', en: 'Greenhouse Plastic Recycling', de: 'Recycling von Gewächshausfolien' },
    description: { tr: 'Yıpranan sera örtülerini toplar, tarlaya ve denize karışmasını önler.', en: 'Collects worn greenhouse covers before they end up in the fields and the sea.', de: 'Sammelt verschlissene Gewächshausfolien, bevor sie auf Feldern und im Meer landen.' },
    cost: 250,
    duration: 5,
    effects: { cleanliness: 9, cleanlinessPerTurn: 2, happiness: 2 }
  },
  {
    id: 'mediterranean-fire-watch',
    regionId: 'mediterranean',
    name: { tr: 'Orman Yangını Gözetleme Ağı', en: 'Wildfire Watch Network', de: 'Waldbrand-Überwachungsnetz' },
    description: { tr: 'Kuleler, kameralar ve hazır ekiplerle yangınları büyümeden yakalar.', en: 'Catches fires before they spread, using towers, cameras and standby crews.', de: 'Erkennt Brände mit Türmen, Kameras und Bereitschaftsteams, bevor sie sich ausbreiten.' },
    cost: 540,
    duration: 8,
    prerequisites: ['mediterranean-greenhouse-recycling'],
    effects: { cleanliness: 8, cleanlinessPerTurn: 1, happiness: 10, happinessPerTurn: 1 }
  },
  {
    id: 'eastern-clean-heating',
    regionId: 'eastern',
    name: { tr: 'Temiz Isınma Programı', en: 'Clean Heating Program', de: 'Programm für saubere Heizung' },
    description: { tr: 'Yalıtım ve verimli sobalarla sert kışları daha sıcak, havayı daha temiz yapar.', en: 'Insulation and efficient stoves make harsh winters warmer and the air cleaner.', de: 'Dämmung und effiziente Öfen machen strenge Winter wärmer und die Luft sauberer.' },
    cost: 260,
    duration: 5,
    effects: { happiness: 10, happinessPerTurn: 2 }
  },
  {
    id: 'eastern-biogas',
    regionId: 'eastern',
    name: { tr: 'Hayvansal Atıktan Biyogaz', en: 'Livestock Biogas Plant', de: 'Biogasanlage für Viehmist' },
    description: { tr: 'Hayvancılık atığını enerjiye çevirir; kirliliği azaltır, gelir getirir.', en: 'Turns livestock waste into energy, cutting pollution and generating income.', de: 'Wandelt Viehmist in Energie um, verringert die Verschmutzung und bringt Einnahmen.' },
    cost: 540,
    duration: 9,
    prerequisites: ['eastern-clean-heating'],
    effects: { cleanliness: 8, cleanlinessPerTurn: 2, budgetPerTurn: 12 }
  },
  {
    id: 'southeastern-closed-irrigation',
    regionId: 'southeastern',
    name: { tr: 'Kapalı Sistem Sulama', en: 'Closed-Pipe Irrigation', de: 'Geschlossene Rohrbewässerung' },
    description: { tr: 'Harran Ovası gibi sıcak ovalarda buharlaşmayı ve toprak tuzlanmasını azaltır.', en: 'Reduces evaporation and soil salinization on hot plains such as Harran.', de: 'Verringert Verdunstung und Bodenversalzung auf heißen Ebenen wie der von Harran.' },
    cost: 270,
    duration: 6,
    effects: { cleanliness: 10, cleanlinessPerTurn: 2 }
  },
  {
    id: 'southeastern-agrivoltaics',
    regionId: 'southeastern',
    name: { tr: 'Tarımsal Güneş Panelleri', en: 'Agrivoltaic Farms', de: 'Agri-Photovoltaik' },
    description: { tr: 'Aynı tarlada ekin ve elektrik üretir; paneller gölgesiyle su kaybını azaltır.', en: 'Grows crops and generates power on the same field, with panels shading the soil to save water.', de: 'Erzeugt Ernte und Strom auf demselben Feld; die Module beschatten den Boden und sparen Wasser.' },
    cost: 580,
    duration: 9,
    prerequisites: ['southeastern-closed-irrigation'],
    effects: { cleanliness: 5, cleanlinessPerTurn: 1, budgetPerTurn: 18 }
  },

  // --- Germany ---
  {
    id: 'nord-dike-upgrade',
    regionId: 'nord',
    name: { tr: 'Set Güçlendirme', en: 'Dike Reinforcement', de: 'Deichverstärkung' },
    description: { tr: 'Kuzey Denizi setlerini yükselen deniz ve fırtına kabarmalarına karşı güçlendirir.', en: 'Strengthens the North Sea dikes against rising seas and storm surges.', de: 'Verstärkt die Nordseedeiche gegen steigende Meeresspiegel und Sturmfluten.' },
    cost: 250,
    duration: 5,
    effects: { happiness: 9, happinessPerTurn: 1, cleanliness: 2 }
  },
  {
    id: 'nord-shore-power',
    regionId: 'nord',
    name: { tr: 'Limanda Kıyı Elektriği', en: 'Port Shore Power', de: 'Landstrom im Hafen' },
    description: { tr: 'Demirli gemiler dizel yakmak yerine karadan elektrik alır.', en: 'Docked ships plug into the grid instead of burning diesel.', de: 'Schiffe am Kai beziehen Strom vom Land, statt Diesel zu verbrennen.' },
    cost: 560,
    duration: 9,
    prerequisites: ['nord-dike-upgrade'],
    effects: { cleanliness: 10, cleanlinessPerTurn: 2, budgetPerTurn: 8 }
  },
  {
    id: 'ruhr-landscape-park',
    regionId: 'ruhrgebiet',
    name: { tr: 'Sanayi Mirası Parkı', en: 'Industrial Heritage Park', de: 'Landschaftspark Industriekultur' },
    description: { tr: 'Terk edilmiş çelik fabrikalarını Duisburg’daki gibi yeşil kamusal alanlara dönüştürür.', en: 'Turns abandoned steelworks into green public space, as Duisburg did.', de: 'Verwandelt stillgelegte Stahlwerke wie in Duisburg in grüne öffentliche Räume.' },
    cost: 270,
    duration: 5,
    effects: { happiness: 8, happinessPerTurn: 1, cleanliness: 4 }
  },
  {
    id: 'ruhr-emscher-renewal',
    regionId: 'ruhrgebiet',
    name: { tr: 'Emscher Nehri Yenilemesi', en: 'Emscher River Renewal', de: 'Emscher-Umbau' },
    description: { tr: 'Açık kanalizasyon olarak kullanılan nehri yeniden yaşayan bir ekosisteme çevirir.', en: 'Turns a river once used as an open sewer back into a living ecosystem.', de: 'Macht aus einem einst als offene Kloake genutzten Fluss wieder ein lebendiges Ökosystem.' },
    cost: 660,
    duration: 12,
    prerequisites: ['ruhr-landscape-park'],
    effects: { cleanliness: 22, cleanlinessPerTurn: 3, happiness: 6 }
  },
  {
    id: 'rheinmain-river-monitoring',
    regionId: 'rheinmain',
    name: { tr: 'Ren Su Kalitesi İstasyonu', en: 'Rhine Water Quality Station', de: 'Rheingütestation' },
    description: { tr: 'Kimyasal sızıntıları erken yakalar ve aşağı akıştaki kentleri uyarır.', en: 'Detects chemical spills early and warns the cities downstream.', de: 'Erkennt Chemieunfälle früh und warnt die Städte flussabwärts.' },
    cost: 240,
    duration: 4,
    effects: { cleanliness: 8, cleanlinessPerTurn: 1, happiness: 3 }
  },
  {
    id: 'rheinmain-rail-freight',
    regionId: 'rheinmain',
    name: { tr: 'Yükü Raylara Taşıma', en: 'Road-to-Rail Freight Hub', de: 'Güterverlagerung auf die Schiene' },
    description: { tr: 'Lojistiği kamyondan trene aktarır; trafik ve emisyon azalırken gelir sürer.', en: 'Moves logistics from trucks to trains, cutting traffic and emissions while income keeps flowing.', de: 'Verlagert Logistik vom Lkw auf die Bahn: weniger Verkehr und Emissionen bei stetigen Einnahmen.' },
    cost: 600,
    duration: 10,
    prerequisites: ['rheinmain-river-monitoring'],
    effects: { cleanliness: 10, cleanlinessPerTurn: 2, budgetPerTurn: 10 }
  },
  {
    id: 'bayern-alpine-shuttle',
    regionId: 'bayern',
    name: { tr: 'Alp Ring Otobüsleri', en: 'Alpine Shuttle Network', de: 'Alpen-Shuttlenetz' },
    description: { tr: 'Turistlerin dağ köylerine arabasız ulaşmasını sağlar.', en: 'Lets tourists reach mountain villages without a car.', de: 'Bringt Touristen ohne Auto in die Bergdörfer.' },
    cost: 230,
    duration: 4,
    effects: { cleanliness: 5, cleanlinessPerTurn: 1, happinessPerTurn: 1 }
  },
  {
    id: 'bayern-geothermal',
    regionId: 'bayern',
    name: { tr: 'Jeotermal Bölgesel Isıtma', en: 'Geothermal District Heating', de: 'Geothermie-Fernwärme' },
    description: { tr: 'Münih çevresindeki sıcak yeraltı sularıyla kentleri fosil yakıtsız ısıtır.', en: 'Heats cities without fossil fuels, using the hot groundwater beneath the Munich area.', de: 'Beheizt Städte ohne fossile Brennstoffe mit dem heißen Tiefenwasser im Raum München.' },
    cost: 580,
    duration: 9,
    prerequisites: ['bayern-alpine-shuttle'],
    effects: { cleanliness: 8, cleanlinessPerTurn: 1, budgetPerTurn: 15 }
  },
  {
    id: 'bw-fresh-air-corridors',
    regionId: 'badenwuerttemberg',
    name: { tr: 'Temiz Hava Koridorları', en: 'Fresh Air Corridors', de: 'Frischluftschneisen' },
    description: { tr: 'Stuttgart çanağına yamaçlardan serin ve temiz hava akışını korur.', en: 'Protects the flow of cool, clean air from the hillsides into the Stuttgart basin.', de: 'Sichert den Zustrom kühler, sauberer Luft von den Hängen in den Stuttgarter Talkessel.' },
    cost: 260,
    duration: 5,
    effects: { cleanliness: 8, cleanlinessPerTurn: 2 }
  },
  {
    id: 'bw-battery-recycling',
    regionId: 'badenwuerttemberg',
    name: { tr: 'Batarya Geri Dönüşüm Tesisi', en: 'Battery Recycling Plant', de: 'Batterie-Recyclingwerk' },
    description: { tr: 'Otomotiv sanayisinin eski bataryalarından değerli metalleri geri kazanır.', en: 'Recovers valuable metals from the auto industry’s used batteries.', de: 'Gewinnt wertvolle Metalle aus Altbatterien der Autoindustrie zurück.' },
    cost: 600,
    duration: 10,
    prerequisites: ['bw-fresh-air-corridors'],
    effects: { cleanliness: 5, cleanlinessPerTurn: 1, budgetPerTurn: 18 }
  },
  {
    id: 'ost-mine-lakes',
    regionId: 'ost',
    name: { tr: 'Maden Gölleri Rehabilitasyonu', en: 'Mine Lake Rehabilitation', de: 'Sanierung der Tagebauseen' },
    description: { tr: 'Lusatia’daki eski linyit ocaklarını göl ve dinlenme alanlarına dönüştürür.', en: 'Turns Lusatia’s former lignite pits into lakes and recreation areas.', de: 'Verwandelt die ehemaligen Braunkohlegruben der Lausitz in Seen und Erholungsgebiete.' },
    cost: 230,
    duration: 6,
    effects: { happiness: 9, happinessPerTurn: 1, cleanliness: 4 }
  },
  {
    id: 'ost-green-hydrogen',
    regionId: 'ost',
    name: { tr: 'Yeşil Hidrojen Merkezi', en: 'Green Hydrogen Hub', de: 'Grüner-Wasserstoff-Zentrum' },
    description: { tr: 'Rüzgar ve güneş elektriğiyle hidrojen üretir, kömür sonrası bölgeye iş getirir.', en: 'Makes hydrogen from wind and solar power, bringing jobs to a post-coal region.', de: 'Erzeugt Wasserstoff aus Wind- und Solarstrom und bringt Arbeit in eine Region nach der Kohle.' },
    cost: 580,
    duration: 10,
    prerequisites: ['ost-mine-lakes'],
    effects: { cleanliness: 4, cleanlinessPerTurn: 1, budgetPerTurn: 22 }
  },

  // --- United Kingdom ---
  {
    id: 'scotland-peatland',
    regionId: 'scotland',
    name: { tr: 'Turbalık Restorasyonu', en: 'Peatland Restoration', de: 'Moorrenaturierung' },
    description: { tr: 'Bozulmuş turbalıkları yeniden ıslatır; toprakta dev bir karbon deposunu korur.', en: 'Re-wets damaged peatlands, protecting a huge store of carbon in the soil.', de: 'Vernässt geschädigte Moore wieder und schützt so einen riesigen Kohlenstoffspeicher im Boden.' },
    cost: 240,
    duration: 6,
    effects: { cleanliness: 9, cleanlinessPerTurn: 2 }
  },
  {
    id: 'scotland-tidal-power',
    regionId: 'scotland',
    name: { tr: 'Gelgit Enerjisi Santrali', en: 'Tidal Power Array', de: 'Gezeitenkraftwerk' },
    description: { tr: 'Pentland Boğazı’nın güçlü akıntılarından öngörülebilir temiz elektrik üretir.', en: 'Generates predictable clean power from the strong currents of the Pentland Firth.', de: 'Erzeugt aus den starken Strömungen des Pentland Firth planbaren sauberen Strom.' },
    cost: 600,
    duration: 10,
    prerequisites: ['scotland-peatland'],
    effects: { cleanliness: 5, cleanlinessPerTurn: 1, budgetPerTurn: 20 }
  },
  {
    id: 'neng-electric-buses',
    regionId: 'northern-england',
    name: { tr: 'Elektrikli Otobüs Filosu', en: 'Electric Bus Fleet', de: 'Elektrobusflotte' },
    description: { tr: 'Kent merkezlerindeki eski dizel otobüsleri sessiz ve temiz araçlarla değiştirir.', en: 'Replaces old diesel buses in city centres with quiet, clean vehicles.', de: 'Ersetzt alte Dieselbusse in den Innenstädten durch leise, saubere Fahrzeuge.' },
    cost: 280,
    duration: 5,
    effects: { cleanliness: 8, cleanlinessPerTurn: 1, happinessPerTurn: 1 }
  },
  {
    id: 'neng-arc-furnace',
    regionId: 'northern-england',
    name: { tr: 'Elektrik Ark Ocağı', en: 'Electric Arc Furnace', de: 'Elektrolichtbogenofen' },
    description: { tr: 'Çelik üretimini kömürlü fırınlardan hurda eritmeye taşır, sanayiyi bölgede tutar.', en: 'Shifts steelmaking from coal-fired furnaces to melting scrap, keeping industry in the region.', de: 'Stellt die Stahlerzeugung von Kohlehochöfen auf Schrottschmelze um und hält die Industrie in der Region.' },
    cost: 680,
    duration: 12,
    prerequisites: ['neng-electric-buses'],
    effects: { cleanliness: 20, cleanlinessPerTurn: 3, budgetPerTurn: 8 }
  },
  {
    id: 'midlands-canal-restoration',
    regionId: 'midlands',
    name: { tr: 'Kanal Ağı Restorasyonu', en: 'Canal Network Restoration', de: 'Sanierung des Kanalnetzes' },
    description: { tr: 'Tarihi kanalları temizler; yaban hayatına ve yürüyüşçülere yeni bir koridor açar.', en: 'Cleans up the historic canals, opening a new corridor for wildlife and walkers.', de: 'Reinigt die historischen Kanäle und schafft einen neuen Korridor für Tiere und Spaziergänger.' },
    cost: 240,
    duration: 5,
    effects: { happiness: 8, happinessPerTurn: 1, cleanliness: 4 }
  },
  {
    id: 'midlands-gigafactory',
    regionId: 'midlands',
    name: { tr: 'Batarya Gigafabrikası', en: 'Battery Gigafactory', de: 'Batterie-Gigafabrik' },
    description: { tr: 'Otomotiv mirasını elektrikli araç üretimine taşır, yeni işler yaratır.', en: 'Moves the region’s car-making heritage into electric vehicles, creating new jobs.', de: 'Überführt das Erbe des Autobaus in die Elektromobilität und schafft neue Arbeitsplätze.' },
    cost: 620,
    duration: 10,
    prerequisites: ['midlands-canal-restoration'],
    effects: { cleanliness: 3, cleanlinessPerTurn: 1, budgetPerTurn: 22 }
  },
  {
    id: 'wales-native-woodland',
    regionId: 'wales',
    name: { tr: 'Doğal Orman Dikimi', en: 'Native Woodland Planting', de: 'Pflanzung heimischer Wälder' },
    description: { tr: 'Vadilere yerli ağaçlar diker; seli yavaşlatır, yaban hayatını geri getirir.', en: 'Plants native trees in the valleys, slowing floods and bringing wildlife back.', de: 'Pflanzt heimische Bäume in den Tälern, bremst Hochwasser und holt Wildtiere zurück.' },
    cost: 220,
    duration: 6,
    effects: { cleanliness: 7, cleanlinessPerTurn: 1, happiness: 3 }
  },
  {
    id: 'wales-pumped-hydro',
    regionId: 'wales',
    name: { tr: 'Pompaj Depolamalı Hidroelektrik', en: 'Pumped Storage Hydro', de: 'Pumpspeicherkraftwerk' },
    description: { tr: 'Dinorwig gibi eski taş ocaklarında fazla temiz enerjiyi su olarak depolar.', en: 'Stores surplus clean energy as water in old quarries, as at Dinorwig.', de: 'Speichert überschüssige saubere Energie als Wasser in alten Steinbrüchen wie in Dinorwig.' },
    cost: 580,
    duration: 10,
    prerequisites: ['wales-native-woodland'],
    effects: { cleanliness: 5, cleanlinessPerTurn: 1, budgetPerTurn: 18 }
  },
  {
    id: 'seng-clean-air-zone',
    regionId: 'southern-england',
    name: { tr: 'Temiz Hava Bölgesi', en: 'Clean Air Zone', de: 'Umweltzone' },
    description: { tr: 'En çok kirleten araçları sınırlar; kent havasını hızla iyileştirir.', en: 'Restricts the most polluting vehicles, quickly improving city air.', de: 'Beschränkt die umweltschädlichsten Fahrzeuge und verbessert die Stadtluft schnell.' },
    cost: 270,
    duration: 4,
    effects: { cleanliness: 8, cleanlinessPerTurn: 1, happinessPerTurn: 1 }
  },
  {
    id: 'seng-super-sewer',
    regionId: 'southern-england',
    name: { tr: 'Thames Süper Kanalizasyonu', en: 'Thames Super Sewer', de: 'Themse-Supersammler' },
    description: { tr: 'Yağmurda Thames’e taşan kanalizasyonu dev bir tünelle arıtmaya taşır.', en: 'A giant tunnel carries the sewage that overflows into the Thames during rain to treatment.', de: 'Ein riesiger Tunnel leitet bei Regen überlaufendes Abwasser statt in die Themse zur Kläranlage.' },
    cost: 640,
    duration: 12,
    prerequisites: ['seng-clean-air-zone'],
    effects: { cleanliness: 18, cleanlinessPerTurn: 3, happiness: 6 }
  },
  {
    id: 'ni-lough-neagh',
    regionId: 'northern-ireland',
    name: { tr: 'Lough Neagh Havza Temizliği', en: 'Lough Neagh Catchment Clean-up', de: 'Sanierung des Lough-Neagh-Einzugsgebiets' },
    description: { tr: 'Göle ulaşan besin kirliliğini azaltarak zehirli alg patlamalarıyla mücadele eder.', en: 'Fights toxic algae blooms by cutting the nutrient pollution reaching the lough.', de: 'Bekämpft giftige Algenblüten, indem weniger Nährstoffe in den See gelangen.' },
    cost: 230,
    duration: 6,
    effects: { cleanliness: 9, cleanlinessPerTurn: 2 }
  },
  {
    id: 'ni-wind-port',
    regionId: 'northern-ireland',
    name: { tr: 'Rüzgar Enerjisi Limanı', en: 'Offshore Wind Port', de: 'Offshore-Windhafen' },
    description: { tr: 'Belfast’ın tersane birikimini açık deniz rüzgarına yönlendirir, yeni işler açar.', en: 'Puts Belfast’s shipbuilding expertise to work on offshore wind, opening up new jobs.', de: 'Setzt Belfasts Schiffbau-Know-how für Offshore-Wind ein und schafft neue Arbeitsplätze.' },
    cost: 580,
    duration: 10,
    prerequisites: ['ni-lough-neagh'],
    effects: { happiness: 6, happinessPerTurn: 1, budgetPerTurn: 20 }
  }
];

// Region-specific projects come first so they stand out at the top of the list.
export const getProjectsForRegion = (regionId: string | null | undefined): Project[] => [
  ...PROJECTS.filter(p => p.regionId && p.regionId === regionId),
  ...PROJECTS.filter(p => !p.regionId),
];
