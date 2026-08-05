import type { GameEvent } from '../types';

export const EVENTS: GameEvent[] = [
  // --- Genel Olaylar ---
  {
    id: 'factory-waste',
    title: { tr: 'Kaçak Atık Dökümü', en: 'Illegal Waste Dumping', de: 'Illegale Müllentsorgung' },
    description: { tr: 'Yerel bir fabrika maliyetleri düşürmek için atıklarını arıtmadan nehre döküyor.', en: 'A local factory is dumping untreated waste into the river to cut costs.', de: 'Eine örtliche Fabrik leitet ungeklärte Abwässer in den Fluss, um Kosten zu sparen.' },
    choices: [
      {
        text: { tr: 'Fabrikayı Kapat', en: 'Shut Down the Factory', de: 'Fabrik schließen' },
        effects: { budget: -100, happiness: -5, cleanliness: +15 }
      },
      {
        text: { tr: 'Ağır Para Cezası Kes', en: 'Impose a Heavy Fine', de: 'Hohe Geldstrafe verhängen' },
        effects: { budget: +50, happiness: 0, cleanliness: +5 }
      },
      {
        text: { tr: 'Görmezden Gel (Rüşvet)', en: 'Look the Other Way (Bribe)', de: 'Wegsehen (Bestechung)' },
        effects: { budget: +100, happiness: -10, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'tourist-season',
    title: { tr: 'Turist Akını', en: 'Tourist Rush', de: 'Touristenansturm' },
    description: { tr: 'Bölgeye turist yağıyor! Ekonomi için harika ama çevre kirliliği artabilir.', en: 'Tourists are pouring into the region! Great for the economy, but pollution may rise.', de: 'Touristen strömen in die Region! Großartig für die Wirtschaft, doch die Umweltverschmutzung könnte zunehmen.' },
    choices: [
      {
        text: { tr: 'Herkesi Kabul Et', en: 'Welcome Everyone', de: 'Alle willkommen heißen' },
        effects: { budget: +80, happiness: +5, cleanliness: -10 }
      },
      {
        text: { tr: 'Eko-Turizm Kotası Koy', en: 'Set an Eco-Tourism Quota', de: 'Ökotourismus-Kontingent einführen' },
        effects: { budget: +20, happiness: 0, cleanliness: +5 }
      }
    ]
  },
  {
    id: 'forest-fire-risk',
    title: { tr: 'Orman Yangını Riski', en: 'Forest Fire Risk', de: 'Waldbrandgefahr' },
    description: { tr: 'Sıcak hava dalgası orman yangını riskini artırıyor.', en: 'A heatwave is increasing the risk of forest fires.', de: 'Eine Hitzewelle erhöht die Gefahr von Waldbränden.' },
    choices: [
      {
        text: { tr: 'Gözetleme Kuleleri Kur', en: 'Build Watchtowers', de: 'Wachtürme errichten' },
        effects: { budget: -60, happiness: +5, cleanliness: +5 }
      },
      {
        text: { tr: 'Bütçe Ayırma', en: 'Don’t Allocate Budget', de: 'Kein Budget bereitstellen' },
        effects: { budget: 0, happiness: -5, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'plastic-ban',
    title: { tr: 'Plastik Poşet Yasağı', en: 'Plastic Bag Ban', de: 'Plastiktütenverbot' },
    description: { tr: 'Çevre örgütleri plastik kullanımının tamamen yasaklanması için baskı yapıyor. Marketler ise tepkili.', en: 'Environmental groups are pushing for a full ban on plastic use. Supermarkets are pushing back.', de: 'Umweltverbände fordern ein komplettes Plastikverbot. Die Supermärkte wehren sich dagegen.' },
    choices: [
      {
        text: { tr: 'Tam Yasak Uygula', en: 'Enforce a Full Ban', de: 'Vollständiges Verbot durchsetzen' },
        effects: { budget: -40, happiness: -10, cleanliness: +25 }
      },
      {
        text: { tr: 'Ücretli Yap ve Denetle', en: 'Charge a Fee and Regulate', de: 'Gebühr einführen und regulieren' },
        effects: { budget: +30, happiness: -5, cleanliness: +10 }
      },
      {
        text: { tr: 'Sektörü Serbest Bırak', en: 'Leave the Industry Unregulated', de: 'Branche unreguliert lassen' },
        effects: { budget: +10, happiness: +5, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'solar-incentive',
    title: { tr: 'Güneş Enerjisi Teşviği', en: 'Solar Energy Incentive', de: 'Förderung für Solarenergie' },
    description: { tr: 'Uluslararası bir fon, güneş paneli tarlaları kurmak için hibe teklif ediyor, ancak tarım arazisi talep ediyor.', en: 'An international fund is offering a grant for solar panel farms, but it requires farmland.', de: 'Ein internationaler Fonds bietet eine Förderung für Solarparks an, verlangt dafür aber landwirtschaftliche Flächen.' },
    choices: [
      {
        text: { tr: 'Kabul Et (Tarım Arazisine Kur)', en: 'Accept (Build on Farmland)', de: 'Annehmen (auf Ackerland bauen)' },
        effects: { budget: +100, happiness: -5, cleanliness: +20 }
      },
      {
        text: { tr: 'Sadece Çorak Araziye İzin Ver', en: 'Only Allow Barren Land', de: 'Nur auf Ödland erlauben' },
        effects: { budget: +20, happiness: +5, cleanliness: +10 }
      },
      {
        text: { tr: 'Reddet', en: 'Decline', de: 'Ablehnen' },
        effects: { budget: 0, happiness: 0, cleanliness: 0 }
      }
    ]
  },
  {
    id: 'ewaste-dump',
    title: { tr: 'Elektronik Atık Krizi', en: 'E-Waste Crisis', de: 'Elektroschrott-Krise' },
    description: { tr: 'Şehir çöplüklerinde geri dönüştürülmeyen elektronik atıklar toprağı zehirlemeye başladı.', en: 'Non-recycled e-waste in the city landfills has started poisoning the soil.', de: 'Nicht recycelter Elektroschrott auf den städtischen Mülldeponien beginnt, den Boden zu vergiften.' },
    choices: [
      {
        text: { tr: 'Geri Dönüşüm Tesisi Kur', en: 'Build a Recycling Facility', de: 'Recyclinganlage errichten' },
        effects: { budget: -80, happiness: +10, cleanliness: +15 }
      },
      {
        text: { tr: 'Yurt Dışına İhraç Et', en: 'Export It Abroad', de: 'Ins Ausland exportieren' },
        effects: { budget: +40, happiness: -5, cleanliness: +5 } // Not ethical, but profitable
      }
    ]
  },

  // --- MARMARA BÖLGESİ EKLEMELERİ ---
  {
    id: 'marmara-urban-renewal',
    regionId: 'marmara',
    title: { tr: 'Kentsel Dönüşüm İkilemi', en: 'Urban Renewal Dilemma', de: 'Dilemma der Stadterneuerung' },
    description: { tr: 'İstanbul\'da riskli binaların yıkımı çok fazla moloz ve toz çıkarıyor. Halk rahatsız.', en: 'Demolishing at-risk buildings in Istanbul is generating a lot of rubble and dust. The public is unhappy.', de: 'Der Abriss einsturzgefährdeter Gebäude in Istanbul erzeugt viel Schutt und Staub. Die Bevölkerung ist verärgert.' },
    choices: [
      {
        text: { tr: 'Yıkımları Hızlandır (Toza Rağmen)', en: 'Speed Up Demolitions (Despite the Dust)', de: 'Abrisse beschleunigen (trotz des Staubs)' },
        effects: { budget: -50, happiness: -15, cleanliness: -10 }
      },
      {
        text: { tr: 'Yeşil Bariyer Zorunluluğu Getir', en: 'Require Green Barriers', de: 'Grüne Schutzwände vorschreiben' },
        effects: { budget: -100, happiness: +5, cleanliness: +5 }
      }
    ]
  },
  {
    id: 'thrace-sunflower',
    regionId: 'marmara',
    title: { tr: 'Ayçiçeği Tarlalarında Sanayi', en: 'Industry in Sunflower Fields', de: 'Industrie in den Sonnenblumenfeldern' },
    description: { tr: 'Trakya\'daki verimli ayçiçeği tarlalarına yeni bir organize sanayi bölgesi kurulmak isteniyor.', en: 'A new organized industrial zone is planned on Thrace’s fertile sunflower fields.', de: 'Auf den fruchtbaren Sonnenblumenfeldern Thrakiens soll ein neues Industriegebiet entstehen.' },
    choices: [
      {
        text: { tr: 'Sanayiye İzin Ver', en: 'Allow the Industry', de: 'Industrie genehmigen' },
        effects: { budget: +130, happiness: -20, cleanliness: -15 }
      },
      {
        text: { tr: 'Tarımsal Sit Alanı İlan Et', en: 'Declare an Agricultural Conservation Area', de: 'Landwirtschaftliches Schutzgebiet ausweisen' },
        effects: { budget: -30, happiness: +15, cleanliness: +10 }
      }
    ]
  },

  // --- EGE BÖLGESİ EKLEMELERİ ---
  {
    id: 'izmir-wind-farm',
    regionId: 'aegean',
    title: { tr: 'Rüzgar Gülü ve Kuş Göçü', en: 'Wind Turbines and Bird Migration', de: 'Windräder und Vogelzug' },
    description: { tr: 'Çeşme\'ye kurulacak rüzgar santrali göçmen kuşların rotasında kalıyor.', en: 'The wind farm planned for Çeşme sits directly on a migratory bird route.', de: 'Der geplante Windpark bei Çeşme liegt genau auf einer Vogelzugroute.' },
    choices: [
      {
        text: { tr: 'Projeyi Onayla (Temiz Enerji)', en: 'Approve the Project (Clean Energy)', de: 'Projekt genehmigen (saubere Energie)' },
        effects: { budget: +60, happiness: +5, cleanliness: +15 }
      },
      {
        text: { tr: 'Konumu Değiştir (Ekstra Maliyet)', en: 'Relocate It (Extra Cost)', de: 'Standort verlegen (Mehrkosten)' },
        effects: { budget: -50, happiness: +10, cleanliness: +15 }
      }
    ]
  },

  // --- AKDENİZ BÖLGESİ EKLEMELERİ ---
  {
    id: 'med-invasive-fish',
    regionId: 'mediterranean',
    title: { tr: 'İstilacı Türler', en: 'Invasive Species', de: 'Invasive Arten' },
    description: { tr: 'Aslan balığı ve Balon balığı yerel balık popülasyonunu yok ediyor.', en: 'Lionfish and pufferfish are wiping out the local fish population.', de: 'Rotfeuerfische und Kugelfische dezimieren die einheimische Fischpopulation.' },
    choices: [
      {
        text: { tr: 'Avlanma Teşviği Ver (Ödül)', en: 'Offer Fishing Incentives (Bounty)', de: 'Fangprämien anbieten' },
        effects: { budget: -40, happiness: +10, cleanliness: +5 }
      },
      {
        text: { tr: 'Doğal Dengeye Bırak', en: 'Let Nature Take Its Course', de: 'Der Natur ihren Lauf lassen' },
        effects: { budget: 0, happiness: -10, cleanliness: -5 }
      }
    ]
  },
  {
    id: 'adana-stubble-burning',
    regionId: 'mediterranean',
    title: { tr: 'Anız Yakma Sorunu', en: 'Stubble Burning Problem', de: 'Problem der Stoppelfeldverbrennung' },
    description: { tr: 'Çukurova\'da hasat sonrası tarlalar yakılıyor, duman tüm şehri kapladı.', en: 'Fields in Çukurova are being burned after harvest, blanketing the whole city in smoke.', de: 'In Çukurova werden die Felder nach der Ernte abgebrannt, Rauch legt sich über die ganze Stadt.' },
    choices: [
      {
        text: { tr: 'Ağır Cezalar Uygula', en: 'Impose Heavy Penalties', de: 'Hohe Strafen verhängen' },
        effects: { budget: +20, happiness: -10, cleanliness: +10 }
      },
      {
        text: { tr: 'Eğitim ve Makine Desteği Ver', en: 'Provide Training and Machinery Support', de: 'Schulungen und Maschinenförderung anbieten' },
        effects: { budget: -60, happiness: +15, cleanliness: +15 }
      }
    ]
  },

  // --- İÇ ANADOLU BÖLGESİ EKLEMELERİ ---
  {
    id: 'ankara-green-belt',
    regionId: 'anatolian',
    title: { tr: 'Yeşil Kuşak Projesi', en: 'Green Belt Project', de: 'Grüngürtel-Projekt' },
    description: { tr: 'Bozkırın ortasına yapay bir orman kuşağı oluşturma projesi gündemde.', en: 'A project to create an artificial forest belt in the middle of the steppe is on the table.', de: 'Ein Projekt zur Anlage eines künstlichen Waldgürtels mitten in der Steppe steht zur Debatte.' },
    choices: [
      {
        text: { tr: 'Büyük Bütçe Ayır', en: 'Allocate a Large Budget', de: 'Großzügiges Budget bereitstellen' },
        effects: { budget: -120, happiness: +20, cleanliness: +20 }
      },
      {
        text: { tr: 'Daha Küçük Parklar Yap', en: 'Build Smaller Parks Instead', de: 'Stattdessen kleinere Parks anlegen' },
        effects: { budget: -40, happiness: +5, cleanliness: +5 }
      }
    ]
  },

  // --- KARADENİZ BÖLGESİ EKLEMELERİ ---
  {
    id: 'blacksea-hes',
    regionId: 'blacksea',
    title: { tr: 'HES Protestoları', en: 'Hydroelectric Plant Protests', de: 'Proteste gegen das Wasserkraftwerk' },
    description: { tr: 'Yerel halk, derelerini kurutacak Hidroelektrik Santrali (HES) istemiyor.', en: 'Locals oppose the hydroelectric plant (HEPP) that would dry up their streams.', de: 'Die Anwohner lehnen das Wasserkraftwerk ab, das ihre Bäche austrocknen würde.' },
    choices: [
      {
        text: { tr: 'Halkı Dinle, İptal Et', en: 'Listen to the Public, Cancel It', de: 'Auf die Bevölkerung hören und abbrechen' },
        effects: { budget: -90, happiness: +25, cleanliness: +10 }
      },
      {
        text: { tr: 'Güvenlik Güçleriyle İnşaatı Koru', en: 'Protect Construction with Security Forces', de: 'Bau mit Sicherheitskräften schützen' },
        effects: { budget: -30, happiness: -30, cleanliness: -5 }
      }
    ]
  },
  {
    id: 'fındık-pesticide',
    regionId: 'blacksea',
    title: { tr: 'Zirai İlaç Kalıntısı', en: 'Pesticide Residue', de: 'Pestizidrückstände' },
    description: { tr: 'Fındık ihracatında kullanılan ilaçlar nedeniyle ürünler gümrükten döndü.', en: 'Pesticides used in hazelnut production have caused shipments to be rejected at customs.', de: 'Wegen der bei der Haselnussproduktion eingesetzten Pestizide wurden Lieferungen am Zoll zurückgewiesen.' },
    choices: [
      {
        text: { tr: 'Organik Tarıma Geçişi Zorla', en: 'Mandate a Switch to Organic Farming', de: 'Umstellung auf Bio-Landwirtschaft vorschreiben' },
        effects: { budget: -100, happiness: -10, cleanliness: +20 }
      },
      {
        text: { tr: 'Yeni Pazarlar Ara', en: 'Look for New Markets', de: 'Neue Märkte suchen' },
        effects: { budget: -20, happiness: +5, cleanliness: -5 }
      }
    ]
  },

  // --- DOĞU ANADOLU BÖLGESİ EKLEMELERİ ---
  {
    id: 'van-lake-pollution',
    regionId: 'eastern',
    title: { tr: 'Van Gölü Can Çekişiyor', en: 'Lake Van Is Dying', de: 'Der Vansee liegt im Sterben' },
    description: { tr: 'Kanalizasyon atıkları İnci Kefali\'nin üreme alanlarını tehdit ediyor.', en: 'Sewage waste is threatening the breeding grounds of the Pearl Mullet.', de: 'Abwässer bedrohen die Laichgebiete der Perlmuräne.' },
    choices: [
      {
        text: { tr: 'Biyolojik Arıtma Tesisi Kur', en: 'Build a Biological Treatment Plant', de: 'Biologische Kläranlage errichten' },
        effects: { budget: -150, happiness: +15, cleanliness: +25 }
      },
      {
        text: { tr: 'Geçici Temizlik Yap', en: 'Do a Temporary Cleanup', de: 'Provisorische Reinigung durchführen' },
        effects: { budget: -30, happiness: +5, cleanliness: +5 }
      }
    ]
  },

  // --- GÜNEYDOĞU ANADOLU BÖLGESİ EKLEMELERİ ---
  {
    id: 'urfa-solar',
    regionId: 'southeastern',
    title: { tr: 'Güneşin Başkenti', en: 'Capital of the Sun', de: 'Hauptstadt der Sonne' },
    description: { tr: 'Şanlıurfa\'nın yakıcı güneşi enerjiye dönüştürülebilir ama altyapı yetersiz.', en: 'Şanlıurfa’s scorching sun could be turned into energy, but infrastructure is lacking.', de: 'Şanlıurfas sengende Sonne könnte in Energie umgewandelt werden, doch die Infrastruktur fehlt.' },
    choices: [
      {
        text: { tr: 'Altyapıyı Yenile ve Panel Kur', en: 'Upgrade Infrastructure and Install Panels', de: 'Infrastruktur ausbauen und Module installieren' },
        effects: { budget: -110, happiness: +10, cleanliness: +15 }
      },
      {
        text: { tr: 'Özel Sektörü Davet Et', en: 'Invite the Private Sector', de: 'Privatsektor einladen' },
        effects: { budget: +50, happiness: 0, cleanliness: +10 }
      }
    ]
  },
  {
    id: 'dust-transport',
    regionId: 'southeastern',
    title: { tr: 'Sınır Ötesi Toz Taşınımı', en: 'Cross-Border Dust Transport', de: 'Grenzüberschreitender Staubtransport' },
    description: { tr: 'Suriye üzerinden gelen çöl tozları hava kalitesini düşürüyor, nefes almak zorlaştı.', en: 'Desert dust blowing in from across Syria is lowering air quality, making it hard to breathe.', de: 'Wüstenstaub aus Syrien verschlechtert die Luftqualität und erschwert das Atmen.' },
    choices: [
      {
        text: { tr: 'Halka Maske Dağıt ve Uyar', en: 'Distribute Masks and Issue a Warning', de: 'Masken verteilen und Warnung ausgeben' },
        effects: { budget: -20, happiness: +5, cleanliness: 0 }
      },
      {
        text: { tr: 'Ağaçlandırma Bariyeri Başlat', en: 'Start a Reforestation Barrier', de: 'Aufforstungsgürtel anlegen' },
        effects: { budget: -80, happiness: +10, cleanliness: +5 } // Long-term solution
      }
    ]
  },
  // --- Bölgesel Olaylar ---

  // Karadeniz (Black Sea)
  {
    id: 'rize-tea-landslide',
    regionId: 'blacksea',
    title: { tr: 'Rize\'de Heyelan Riski', en: 'Landslide Risk in Rize', de: 'Erdrutschgefahr in Rize' },
    description: { tr: 'Aşırı yağışlar Rize\'deki çay bahçelerinde heyelan riskini artırdı.', en: 'Heavy rainfall has raised the landslide risk in Rize’s tea gardens.', de: 'Starkregen hat die Erdrutschgefahr in Rizes Teegärten erhöht.' },
    choices: [
      {
        text: { tr: 'İstinat Duvarları Ör', en: 'Build Retaining Walls', de: 'Stützmauern errichten' },
        effects: { budget: -80, happiness: +10, cleanliness: 0 }
      },
      {
        text: { tr: 'Doğal Akışına Bırak', en: 'Let It Run Its Natural Course', de: 'Der Natur ihren Lauf lassen' },
        effects: { budget: 0, happiness: -20, cleanliness: -5 }
      }
    ]
  },

  // Marmara
  {
    id: 'istanbul-mucilage',
    regionId: 'marmara',
    title: { tr: 'Müsilaj Kabusu', en: 'Sea Snot Nightmare', de: 'Albtraum Meeresschleim' },
    description: { tr: 'Marmara Denizi\'ni müsilaj (deniz salyası) kapladı. Balıkçılık ve turizm tehlikede!', en: 'The Sea of Marmara has been covered by mucilage (sea snot). Fishing and tourism are at risk!', de: 'Das Marmarameer ist mit Meeresschleim bedeckt. Fischerei und Tourismus sind in Gefahr!' },
    choices: [
      {
        text: { tr: 'Acil Temizlik Seferberliği', en: 'Launch an Emergency Cleanup Effort', de: 'Notfall-Reinigungsaktion starten' },
        effects: { budget: -150, happiness: +20, cleanliness: +20 }
      },
      {
        text: { tr: 'Kendi Kendine Geçmesini Bekle', en: 'Wait for It to Pass on Its Own', de: 'Abwarten, bis es von selbst vergeht' },
        effects: { budget: 0, happiness: -30, cleanliness: -30 }
      }
    ]
  },

  // Ege (Aegean)
  {
    id: 'izmir-geothermal',
    regionId: 'aegean',
    title: { tr: 'Jeotermal Tartışması', en: 'Geothermal Controversy', de: 'Streit um Geothermie' },
    description: { tr: 'İzmir\'de yeni bir jeotermal santral kurulmak isteniyor. Enerji vs Tarım arazileri.', en: 'A new geothermal plant is proposed in Izmir. Energy versus farmland.', de: 'In Izmir soll ein neues Geothermiekraftwerk entstehen. Energie gegen Ackerland.' },
    choices: [
      {
        text: { tr: 'Santrale İzin Ver', en: 'Approve the Plant', de: 'Kraftwerk genehmigen' },
        effects: { budget: +100, happiness: -10, cleanliness: -5 }
      },
      {
        text: { tr: 'Tarım Arazisini Koru', en: 'Protect the Farmland', de: 'Ackerland schützen' },
        effects: { budget: -20, happiness: +10, cleanliness: +5 }
      }
    ]
  },

  // Akdeniz (Mediterranean)
  {
    id: 'antalya-caretta',
    regionId: 'mediterranean',
    title: { tr: 'Caretta Caretta Yuvaları', en: 'Loggerhead Turtle Nests', de: 'Nistplätze der Unechten Karettschildkröte' },
    description: { tr: 'Antalya sahillerinde otel inşaatı kaplumbağa yuvalarını tehdit ediyor.', en: 'Hotel construction on Antalya’s beaches is threatening sea turtle nesting sites.', de: 'Hotelbauten an Antalyas Stränden bedrohen die Nistplätze der Meeresschildkröten.' },
    choices: [
      {
        text: { tr: 'İnşaatı Durdur', en: 'Halt Construction', de: 'Bau stoppen' },
        effects: { budget: -100, happiness: +15, cleanliness: +10 }
      },
      {
        text: { tr: 'Turizme Öncelik Ver', en: 'Prioritize Tourism', de: 'Tourismus Vorrang geben' },
        effects: { budget: +150, happiness: -10, cleanliness: -5 }
      }
    ]
  },

  // İç Anadolu (Anatolian)
  {
    id: 'ankara-drought',
    regionId: 'anatolian',
    title: { tr: 'Tuz Gölü Kuruyor', en: 'Lake Tuz Is Drying Up', de: 'Der Tuzsee trocknet aus' },
    description: { tr: 'Bilinçsiz sulama Tuz Gölü\'nü yok olma noktasına getirdi.', en: 'Reckless irrigation has brought Lake Tuz to the brink of disappearing.', de: 'Rücksichtslose Bewässerung hat den Tuzsee an den Rand des Verschwindens gebracht.' },
    choices: [
      {
        text: { tr: 'Vahşi Sulamayı Yasakla', en: 'Ban Unregulated Irrigation', de: 'Unregulierte Bewässerung verbieten' },
        effects: { budget: -30, happiness: -10, cleanliness: +10 }
      },
      {
        text: { tr: 'Çiftçiyi Destekle (Suya Devam)', en: 'Support the Farmers (Keep the Water Flowing)', de: 'Landwirte unterstützen (Wasser weiter fließen lassen)' },
        effects: { budget: +20, happiness: +10, cleanliness: -20 }
      }
    ]
  },

  // Doğu Anadolu (Eastern)
  {
    id: 'erzurum-snow',
    regionId: 'eastern',
    title: { tr: 'Yollar Kapandı', en: 'Roads Closed', de: 'Straßen gesperrt' },
    description: { tr: 'Erzurum\'da yoğun kar yağışı köy yollarını kapattı. Hasta nakli gerekiyor.', en: 'Heavy snowfall in Erzurum has closed village roads. Patients need to be transported.', de: 'Starker Schneefall in Erzurum hat die Dorfstraßen gesperrt. Patienten müssen transportiert werden.' },
    choices: [
      {
        text: { tr: 'Helikopter Ambulans Gönder', en: 'Send a Helicopter Ambulance', de: 'Rettungshubschrauber entsenden' },
        effects: { budget: -120, happiness: +25, cleanliness: 0 }
      },
      {
        text: { tr: 'Kar Küreme Ekiplerini Bekle', en: 'Wait for the Snowplow Crews', de: 'Auf die Schneeräumtrupps warten' },
        effects: { budget: -20, happiness: -10, cleanliness: 0 }
      }
    ]
  },

  // Güneydoğu Anadolu (Southeastern)
  {
    id: 'gap-dam',
    regionId: 'southeastern',
    title: { tr: 'Baraj Suları Yükseliyor', en: 'Dam Waters Are Rising', de: 'Der Stausee steigt' },
    description: { tr: 'Yeni baraj antik bir kenti sular altında bırakmak üzere.', en: 'The new dam is about to submerge an ancient city.', de: 'Der neue Staudamm droht, eine antike Stadt zu überfluten.' },
    choices: [
      {
        text: { tr: 'Eserleri Taşı (Müze Yap)', en: 'Relocate the Artifacts (Build a Museum)', de: 'Artefakte umsiedeln (Museum errichten)' },
        effects: { budget: -200, happiness: +10, cleanliness: 0 }
      },
      {
        text: { tr: 'Barajı Doldur (Enerji Lazım)', en: 'Fill the Dam (Energy Is Needed)', de: 'Staudamm fluten (Energie wird gebraucht)' },
        effects: { budget: +150, happiness: -20, cleanliness: -5 }
      }
    ]
  },

  // --- Yeni Eklenen Bölgesel Olaylar ---

  // Marmara
  {
    id: 'bursa-smog',
    regionId: 'marmara',
    title: { tr: 'Sanayi Hava Kirliliği', en: 'Industrial Air Pollution', de: 'Industrielle Luftverschmutzung' },
    description: { tr: 'Bursa\'da sanayi tesisleri nedeniyle hava kirliliği alarm seviyesine ulaştı.', en: 'Air pollution from industrial facilities in Bursa has reached alarming levels.', de: 'Die Luftverschmutzung durch Industrieanlagen in Bursa hat alarmierende Werte erreicht.' },
    choices: [
      {
        text: { tr: 'Filtre Zorunluluğu Getir', en: 'Mandate Emission Filters', de: 'Abgasfilter vorschreiben' },
        effects: { budget: -50, happiness: +5, cleanliness: +15 }
      },
      {
        text: { tr: 'Üretime Ara Verdir', en: 'Suspend Production', de: 'Produktion aussetzen' },
        effects: { budget: -120, happiness: -15, cleanliness: +25 }
      }
    ]
  },

  // Ege
  {
    id: 'olive-mining',
    regionId: 'aegean',
    title: { tr: 'Zeytinlik vs Maden', en: 'Olive Groves vs. Mining', de: 'Olivenhaine gegen Bergbau' },
    description: { tr: 'Muğla\'da linyit madeni açmak için asırlık zeytin ağaçlarının kesilmesi gerekiyor.', en: 'Opening a lignite mine in Muğla requires cutting down centuries-old olive trees.', de: 'Die Eröffnung einer Braunkohlemine in Muğla erfordert das Fällen jahrhundertealter Olivenbäume.' },
    choices: [
      {
        text: { tr: 'Zeytinlikleri Koru', en: 'Protect the Olive Groves', de: 'Olivenhaine schützen' },
        effects: { budget: -30, happiness: +20, cleanliness: +10 }
      },
      {
        text: { tr: 'Madene İzin Ver', en: 'Allow the Mine', de: 'Mine genehmigen' },
        effects: { budget: +120, happiness: -25, cleanliness: -20 }
      }
    ]
  },

  // Karadeniz
  {
    id: 'samsun-flood',
    regionId: 'blacksea',
    title: { tr: 'Sel Baskını Tehlikesi', en: 'Flood Danger', de: 'Hochwassergefahr' },
    description: { tr: 'Samsun\'da yanlış şehirleşme dere yataklarını tıkadı, sel riski var.', en: 'Poor urban planning in Samsun has blocked streambeds, raising flood risk.', de: 'Fehlerhafte Stadtplanung in Samsun hat Bachbetten verstopft und erhöht die Überschwemmungsgefahr.' },
    choices: [
      {
        text: { tr: 'Altyapıyı Yenile', en: 'Renovate the Infrastructure', de: 'Infrastruktur erneuern' },
        effects: { budget: -100, happiness: +10, cleanliness: +5 }
      },
      {
        text: { tr: 'Dere Yatağını Boşalt', en: 'Clear the Streambed', de: 'Bachbett räumen' },
        effects: { budget: -60, happiness: -20, cleanliness: +10 }
      }
    ]
  },

  // İç Anadolu
  {
    id: 'konya-sinkhole',
    regionId: 'anatolian',
    title: { tr: 'Konya\'da Obruklar', en: 'Sinkholes in Konya', de: 'Erdfälle in Konya' },
    description: { tr: 'Yeraltı suyunun aşırı kullanımı Konya Ovası\'nda dev obruklar oluşturuyor.', en: 'Overuse of groundwater is creating giant sinkholes in the Konya Plain.', de: 'Übermäßige Grundwasserentnahme lässt in der Konya-Ebene riesige Erdfälle entstehen.' },
    choices: [
      {
        text: { tr: 'Yeraltı Suyunu Yasakla', en: 'Ban Groundwater Extraction', de: 'Grundwasserentnahme verbieten' },
        effects: { budget: -40, happiness: -30, cleanliness: +15 }
      },
      {
        text: { tr: 'Modern Sulamaya Geç', en: 'Switch to Modern Irrigation', de: 'Auf moderne Bewässerung umstellen' },
        effects: { budget: -150, happiness: +15, cleanliness: +10 }
      }
    ]
  },

  // Akdeniz
  {
    id: 'mersin-port',
    regionId: 'mediterranean',
    title: { tr: 'Liman Sızıntısı', en: 'Port Spill', de: 'Hafenverschmutzung' },
    description: { tr: 'Mersin Limanı yakınlarında bir yük gemisinden kimyasal sızıntı saptandı.', en: 'A chemical spill from a cargo ship has been detected near Mersin Port.', de: 'In der Nähe des Hafens von Mersin wurde ein Chemikalienleck eines Frachtschiffs festgestellt.' },
    choices: [
      {
        text: { tr: 'Hızlı Müdahale Et', en: 'Respond Quickly', de: 'Schnell eingreifen' },
        effects: { budget: -90, happiness: +5, cleanliness: +15 }
      },
      {
        text: { tr: 'Karantina Uygula', en: 'Impose a Quarantine', de: 'Quarantäne verhängen' },
        effects: { budget: -40, happiness: -10, cleanliness: +5 }
      }
    ]
  },

  // Doğu Anadolu
  {
    id: 'malatya-apricot',
    regionId: 'eastern',
    title: { tr: 'Kayısıda Don Vurdu', en: 'Frost Hits the Apricots', de: 'Frost trifft die Aprikosenernte' },
    description: { tr: 'İklim değişikliği Malatya\'da zamansız don olaylarına ve mahsul kaybına yol açıyor.', en: 'Climate change is causing untimely frosts and crop losses in Malatya.', de: 'Der Klimawandel verursacht in Malatya unzeitigen Frost und Ernteausfälle.' },
    choices: [
      {
        text: { tr: 'Çiftçiye Destek Paketi', en: 'Provide a Farmer Support Package', de: 'Hilfspaket für Landwirte bereitstellen' },
        effects: { budget: -70, happiness: +20, cleanliness: 0 }
      },
      {
        text: { tr: 'Seralaşmayı Teşvik Et', en: 'Encourage Greenhouse Farming', de: 'Gewächshausanbau fördern' },
        effects: { budget: -100, happiness: +10, cleanliness: +5 }
      }
    ]
  },

  // Güneydoğu Anadolu
  {
    id: 'mardin-quarry',
    regionId: 'southeastern',
    title: { tr: 'Taş Ocakları Tartışması', en: 'Stone Quarry Controversy', de: 'Streit um die Steinbrüche' },
    description: { tr: 'Mardin\'in tarihi dokusuna yakın taş ocakları toz ve gürültü kirliliği yaratıyor.', en: 'Stone quarries near Mardin’s historic quarter are creating dust and noise pollution.', de: 'Steinbrüche nahe Mardins historischem Altstadtviertel verursachen Staub- und Lärmbelastung.' },
    choices: [
      {
        text: { tr: 'Ocakları Kapat', en: 'Close the Quarries', de: 'Steinbrüche schließen' },
        effects: { budget: -60, happiness: +15, cleanliness: +10 }
      },
      {
        text: { tr: 'Sıkı Denetim Uygula', en: 'Enforce Strict Oversight', de: 'Strenge Kontrollen einführen' },
        effects: { budget: -20, happiness: +5, cleanliness: +5 }
      }
    ]
  },

  // --- NORTH GERMANY (NORD) ---
  {
    id: 'nord-offshore-wind',
    regionId: 'nord',
    title: { tr: 'Açık Deniz Rüzgar Çiftliği Genişlemesi', en: 'Offshore Wind Farm Expansion', de: 'Ausbau des Offshore-Windparks' },
    description: { tr: 'Kuzey Denizi\'nde planlanan yeni rüzgar türbinleri balıkçı filolarını endişelendiriyor.', en: 'New wind turbines planned for the North Sea are worrying local fishing fleets.', de: 'Neue Windturbinen, die für die Nordsee geplant sind, beunruhigen die örtlichen Fischereiflotten.' },
    choices: [
      {
        text: { tr: 'Genişlemeyi Onayla', en: 'Approve the Expansion', de: 'Ausbau genehmigen' },
        effects: { budget: +90, happiness: -10, cleanliness: +20 }
      },
      {
        text: { tr: 'Türbin Bölgelerini Sınırla', en: 'Limit the Turbine Zones', de: 'Turbinenzonen begrenzen' },
        effects: { budget: +30, happiness: +10, cleanliness: +10 }
      }
    ]
  },
  {
    id: 'nord-storm-surge',
    regionId: 'nord',
    title: { tr: 'Fırtına Kabarması Tehdidi', en: 'Storm Surge Threat', de: 'Sturmflutgefahr' },
    description: { tr: 'Yükselen deniz seviyesi Kuzey Denizi kıyısındaki setleri zorluyor.', en: 'Rising sea levels are pushing North Sea dikes to their limit.', de: 'Der steigende Meeresspiegel bringt die Deiche an der Nordseeküste an ihre Grenzen.' },
    choices: [
      {
        text: { tr: 'Setleri Güçlendir', en: 'Reinforce the Dikes', de: 'Deiche verstärken' },
        effects: { budget: -140, happiness: +20 }
      },
      {
        text: { tr: 'Riskli Evleri Taşı', en: 'Relocate At-Risk Homes', de: 'Gefährdete Häuser umsiedeln' },
        effects: { budget: -60, happiness: -15, cleanliness: +5 }
      }
    ]
  },
  {
    id: 'nord-port-emissions',
    regionId: 'nord',
    title: { tr: 'Liman Gemi Emisyonları', en: 'Port Shipping Emissions', de: 'Schiffsemissionen im Hafen' },
    description: { tr: 'Limanda bekleyen konteyner gemileri ağır yakıt yakarak çevre mahalleleri dumana boğuyor.', en: 'Container ships idling in port burn heavy fuel oil, choking nearby neighborhoods in smog.', de: 'Im Hafen wartende Containerschiffe verbrennen Schweröl und hüllen die umliegenden Stadtteile in Smog.' },
    choices: [
      {
        text: { tr: 'Karadan Elektrik Bağlantısını Zorunlu Kıl', en: 'Mandate Shore Power', de: 'Landstrom vorschreiben' },
        effects: { budget: -90, happiness: +10, cleanliness: +15 }
      },
      {
        text: { tr: 'Denetimi Gemi Şirketlerine Bırak', en: 'Leave It to the Shipping Lines', de: 'Reedereien selbst entscheiden lassen' },
        effects: { budget: +40, happiness: -10, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'nord-wadden-sea',
    regionId: 'nord',
    title: { tr: 'Vatt Denizi\'nde Marina Planı', en: 'A Marina in the Wadden Sea', de: 'Eine Marina im Wattenmeer' },
    description: { tr: 'Korunan Vatt Denizi sulak alanının içine yeni bir turist marinası öneriliyor.', en: 'A new tourist marina is proposed inside the protected Wadden Sea wetland.', de: 'Im geschützten Wattenmeer soll eine neue Touristenmarina entstehen.' },
    choices: [
      {
        text: { tr: 'Marinayı Reddet', en: 'Reject the Marina', de: 'Marina ablehnen' },
        effects: { budget: -20, happiness: -5, cleanliness: +20 }
      },
      {
        text: { tr: 'Küçültülmüş Marinayı Onayla', en: 'Approve a Scaled-Down Marina', de: 'Kleinere Marina genehmigen' },
        effects: { budget: +60, happiness: +10, cleanliness: -10 }
      }
    ]
  },

  // --- RUHR AREA (RUHRGEBIET) ---
  {
    id: 'ruhr-river-cleanup',
    regionId: 'ruhrgebiet',
    title: { tr: 'Emscher Nehri Islahı', en: 'Emscher River Restoration', de: 'Renaturierung der Emscher' },
    description: { tr: 'On yıllarca akan sanayi atığı Emscher\'i açık bir lağıma çevirdi; şimdi ıslah projesi masada.', en: 'Decades of industrial sewage turned the Emscher into an open drain; a restoration project is now on the table.', de: 'Jahrzehntelange Industrieabwässer verwandelten die Emscher in einen offenen Kanal; nun steht ein Renaturierungsprojekt zur Debatte.' },
    choices: [
      {
        text: { tr: 'Tam Islahı Finanse Et', en: 'Fund the Full Restoration', de: 'Vollständige Renaturierung finanzieren' },
        effects: { budget: -160, happiness: +15, cleanliness: +25 }
      },
      {
        text: { tr: 'Sadece En Kötü Kesimleri Onar', en: 'Patch Only the Worst Sections', de: 'Nur die schlimmsten Abschnitte ausbessern' },
        effects: { budget: -50, happiness: +5, cleanliness: +8 }
      }
    ]
  },
  {
    id: 'ruhr-coal-closure',
    regionId: 'ruhrgebiet',
    title: { tr: 'Kömür Santralinin Kapatılması', en: 'Closing the Coal Plant', de: 'Stilllegung des Kohlekraftwerks' },
    description: { tr: 'Bölgenin son kömür santrali hem yaşlanıyor hem kirletiyor, ama aynı zamanda büyük bir işveren.', en: 'The region\'s last coal plant is aging and polluting, but it\'s also a major employer.', de: 'Das letzte Kohlekraftwerk der Region altert und verschmutzt, ist aber auch ein bedeutender Arbeitgeber.' },
    choices: [
      {
        text: { tr: 'Kapat ve İşçileri Yeniden Eğit', en: 'Shut It Down, Retrain Workers', de: 'Schließen und Arbeiter umschulen' },
        effects: { budget: -120, happiness: -10, cleanliness: +25 }
      },
      {
        text: { tr: 'Birkaç Yıl Daha Çalıştır', en: 'Keep It Running a Few More Years', de: 'Noch ein paar Jahre weiterlaufen lassen' },
        effects: { budget: +70, happiness: +10, cleanliness: -20 }
      }
    ]
  },
  {
    id: 'ruhr-brownfield',
    regionId: 'ruhrgebiet',
    title: { tr: 'Terk Edilmiş Çelik Fabrikası', en: 'The Abandoned Steelworks', de: 'Das stillgelegte Stahlwerk' },
    description: { tr: 'Şehir merkezinde kirlenmiş, harap bir çelik fabrikası duruyor — yeniden mi geliştirilsin, miras olarak mı korunsun?', en: 'A contaminated, derelict steelworks sits in the middle of town — redevelop it, or preserve it as heritage?', de: 'Mitten in der Stadt steht ein verseuchtes, verlassenes Stahlwerk — neu entwickeln oder als Denkmal erhalten?' },
    choices: [
      {
        text: { tr: 'Arındır ve Yeniden Geliştir', en: 'Decontaminate and Redevelop', de: 'Sanieren und neu entwickeln' },
        effects: { budget: -110, happiness: +10, cleanliness: +15 }
      },
      {
        text: { tr: 'Sanayi Mirası Olarak Koru', en: 'Preserve It as Industrial Heritage', de: 'Als Industriedenkmal erhalten' },
        effects: { budget: -20, happiness: +5, cleanliness: -5 }
      }
    ]
  },
  {
    id: 'ruhr-smog-alert',
    regionId: 'ruhrgebiet',
    title: { tr: 'Kış Dumanı Alarmı', en: 'Winter Smog Alert', de: 'Winter-Smogalarm' },
    description: { tr: 'Ruhr vadisi üzerinde sıkışan durgun kış havası kirliliği alarm seviyesine taşıdı.', en: 'Stagnant winter air trapped over the Ruhr valley has pushed pollution to alarming levels.', de: 'Stehende Winterluft über dem Ruhrtal hat die Verschmutzung auf alarmierende Werte getrieben.' },
    choices: [
      {
        text: { tr: 'Geçici Trafik Kısıtlaması Getir', en: 'Impose Temporary Driving Restrictions', de: 'Vorübergehende Fahrverbote verhängen' },
        effects: { budget: -30, happiness: -15, cleanliness: +20 }
      },
      {
        text: { tr: 'Sadece Halk Sağlığı Uyarısı Yap', en: 'Issue a Public Health Warning Only', de: 'Nur eine Gesundheitswarnung ausgeben' },
        effects: { happiness: -5, cleanliness: -5 }
      }
    ]
  },

  // --- RHINE-MAIN (RHEIN-MAIN) ---
  {
    id: 'rheinmain-airport',
    regionId: 'rheinmain',
    title: { tr: 'Havalimanı Pisti Genişletmesi', en: 'Airport Runway Expansion', de: 'Ausbau der Flughafen-Startbahn' },
    description: { tr: 'Frankfurt Havalimanı\'na yeni bir pist lojistik ekonomisini güçlendirir ama çevre kasabaları gürültüye boğar.', en: 'A new runway at Frankfurt Airport would boost the logistics economy but blankets nearby towns in noise.', de: 'Eine neue Startbahn am Frankfurter Flughafen würde die Logistikwirtschaft stärken, aber die umliegenden Orte in Lärm hüllen.' },
    choices: [
      {
        text: { tr: 'Genişletmeyi Onayla', en: 'Approve the Expansion', de: 'Ausbau genehmigen' },
        effects: { budget: +140, happiness: -20, cleanliness: -10 }
      },
      {
        text: { tr: 'Reddet, Sakinleri Koru', en: 'Reject It, Protect Residents', de: 'Ablehnen, Anwohner schützen' },
        effects: { budget: -30, happiness: +15, cleanliness: +5 }
      }
    ]
  },
  {
    id: 'rheinmain-rhine-spill',
    regionId: 'rheinmain',
    title: { tr: 'Ren Nehri\'nde Kimyasal Sızıntı', en: 'Chemical Spill in the Rhine', de: 'Chemieunfall im Rhein' },
    description: { tr: 'Bir kimya fabrikasındaki sızıntı Ren Nehri\'ni kirletti, aşağı yöndeki içme suyu kaynaklarını tehdit ediyor.', en: 'A chemical plant leak has tainted the Rhine, threatening drinking water intakes downstream.', de: 'Ein Leck in einer Chemiefabrik hat den Rhein verunreinigt und bedroht die Trinkwasserentnahme flussabwärts.' },
    choices: [
      {
        text: { tr: 'Acil Kapatma ve Temizlik', en: 'Emergency Shutdown and Cleanup', de: 'Notabschaltung und Reinigung' },
        effects: { budget: -130, happiness: +10, cleanliness: +20 }
      },
      {
        text: { tr: 'Seyreltip Sessizce İzle', en: 'Dilute and Monitor Quietly', de: 'Verdünnen und still überwachen' },
        effects: { budget: -20, happiness: -15, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'rheinmain-banking-energy',
    regionId: 'rheinmain',
    title: { tr: 'Bankacılık Kulelerinin Enerji Açlığı', en: 'The Banking Towers\' Energy Hunger', de: 'Der Energiehunger der Bankentürme' },
    description: { tr: 'Frankfurt\'un gökdelen bankaları ve veri merkezleri gece gündüz devasa miktarda enerji çekiyor.', en: 'Frankfurt\'s skyscraper banks and data centers draw enormous power around the clock.', de: 'Frankfurts Bankentürme und Rechenzentren verbrauchen rund um die Uhr enorme Mengen an Strom.' },
    choices: [
      {
        text: { tr: 'Kulelere Yeşil Enerji Zorunluluğu Getir', en: 'Mandate Green Energy for the Towers', de: 'Grünen Strom für die Türme vorschreiben' },
        effects: { budget: -70, cleanliness: +15 }
      },
      {
        text: { tr: 'Piyasaya Bırak', en: 'Leave It to the Market', de: 'Dem Markt überlassen' },
        effects: { budget: +50, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'rheinmain-traffic',
    regionId: 'rheinmain',
    title: { tr: 'Frankfurt Çevresinde Trafik Tıkanıklığı', en: 'Gridlock Around Frankfurt', de: 'Stau rund um Frankfurt' },
    description: { tr: 'Otoyol çevre yolundaki işe gidiş-geliş trafiği artık günlük bir tıkanıklığa ve büyüyen bir emisyon kaynağına dönüştü.', en: 'Commuter traffic on the ring autobahn has become a daily gridlock and a growing source of emissions.', de: 'Der Pendlerverkehr auf dem Autobahnring ist zu einem täglichen Stau und einer wachsenden Emissionsquelle geworden.' },
    choices: [
      {
        text: { tr: 'Banliyö Trenine Yatırım Yap', en: 'Invest in Commuter Rail', de: 'In den Pendlerzug investieren' },
        effects: { budget: -100, happiness: +15, cleanliness: +10 }
      },
      {
        text: { tr: 'Otoyolu Genişlet', en: 'Widen the Autobahn Instead', de: 'Stattdessen die Autobahn verbreitern' },
        effects: { budget: -140, happiness: +5, cleanliness: -15 }
      }
    ]
  },

  // --- BAVARIA (BAYERN) ---
  {
    id: 'bayern-glacier',
    regionId: 'bayern',
    title: { tr: 'Alp Buzulları Eriyor', en: 'The Alpine Glaciers Are Melting', de: 'Die Alpengletscher schmelzen' },
    description: { tr: 'Küçülen bir buzul, bir kayak merkezini daha fazla yapay kar üretmeye zorluyor ve bu da dağ derelerini kurutuyor.', en: 'A shrinking glacier is forcing a ski resort to make more artificial snow, draining mountain streams.', de: 'Ein schrumpfender Gletscher zwingt ein Skigebiet zu mehr Kunstschnee, was die Bergbäche austrocknet.' },
    choices: [
      {
        text: { tr: 'Kar Yapımını Sınırla', en: 'Limit the Snowmaking', de: 'Beschneiung begrenzen' },
        effects: { budget: -40, happiness: -10, cleanliness: +15 }
      },
      {
        text: { tr: 'Tesisin Su Çekmeye Devam Etmesine İzin Ver', en: 'Let the Resort Keep Pumping Water', de: 'Skigebiet weiter Wasser pumpen lassen' },
        effects: { budget: +60, happiness: +10, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'bayern-oktoberfest-waste',
    regionId: 'bayern',
    title: { tr: 'Oktoberfest Çöp Krizi', en: 'Oktoberfest Waste Crisis', de: 'Müllkrise beim Oktoberfest' },
    description: { tr: 'Milyonlarca festival ziyaretçisi her yıl Theresienwiese\'yi çöpe boğuyor.', en: 'Millions of festival visitors bury the Theresienwiese in waste every year.', de: 'Millionen Festivalbesucher hinterlassen jedes Jahr Müllberge auf der Theresienwiese.' },
    choices: [
      {
        text: { tr: 'Düzgün Bir Temizlik Ekibi Finanse Et', en: 'Fund a Proper Cleanup Crew', de: 'Ein richtiges Reinigungsteam finanzieren' },
        effects: { budget: -50, happiness: +10, cleanliness: +15 }
      },
      {
        text: { tr: 'Çöpü Satıcılara Bırak', en: 'Let Vendors Handle Their Own Trash', de: 'Müll den Standbetreibern überlassen' },
        effects: { budget: +20, happiness: +5, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'bayern-dairy-farmland',
    regionId: 'bayern',
    title: { tr: 'Alp Çayırlarında Süt Sığırcılığı', en: 'Dairy Farming in the Alpine Meadows', de: 'Milchviehhaltung auf den Almwiesen' },
    description: { tr: 'Yoğun süt sığırcılığından sızan atıklar, kartpostallık çayırları besleyen dağ derelerine karışıyor.', en: 'Runoff from intensive dairy farming is seeping into the mountain streams that feed the postcard-perfect meadows.', de: 'Abwässer aus der intensiven Milchviehhaltung sickern in die Bergbäche, die die malerischen Almwiesen speisen.' },
    choices: [
      {
        text: { tr: 'Düşük Atıklı Tarımı Teşvik Et', en: 'Subsidize Low-Runoff Farming', de: 'Umweltschonende Landwirtschaft fördern' },
        effects: { budget: -80, happiness: +5, cleanliness: +15 }
      },
      {
        text: { tr: 'Çiftçilerin Eskisi Gibi Devam Etmesine İzin Ver', en: 'Let Farmers Continue As Is', de: 'Landwirte wie gewohnt weitermachen lassen' },
        effects: { budget: +20, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'bayern-hydropower',
    regionId: 'bayern',
    title: { tr: 'Vadide Küçük Hidroelektrik Barajı', en: 'A Small Hydro Dam in the Valley', de: 'Ein kleines Wasserkraftwerk im Tal' },
    description: { tr: 'Önerilen mini hidroelektrik baraj bir köyü elektriklendirir ama turistlerin balık tuttuğu bir alabalık deresini bozar.', en: 'A proposed micro-hydro dam would power a village but disrupt a trout stream that draws anglers.', de: 'Ein geplantes Mini-Wasserkraftwerk würde ein Dorf mit Strom versorgen, aber einen bei Anglern beliebten Forellenbach stören.' },
    choices: [
      {
        text: { tr: 'Barajı İnşa Et', en: 'Build the Dam', de: 'Wasserkraftwerk bauen' },
        effects: { budget: +40, happiness: -5, cleanliness: +10 }
      },
      {
        text: { tr: 'Dereyi Koru', en: 'Protect the Stream Instead', de: 'Stattdessen den Bach schützen' },
        effects: { budget: -30, happiness: +10, cleanliness: +5 }
      }
    ]
  },

  // --- BADEN-WÜRTTEMBERG ---
  {
    id: 'bw-auto-emissions',
    regionId: 'badenwuerttemberg',
    title: { tr: 'Otomotiv Emisyon Skandalı', en: 'The Auto Emissions Scandal', de: 'Der Abgasskandal' },
    description: { tr: 'Yerel bir otomobil üreticisinin emisyon testlerini atlattığı ortaya çıktı, sektörün eski dizel skandalını anımsatıyor.', en: 'A local automaker is caught skirting emissions tests, echoing the industry\'s old diesel scandal.', de: 'Ein örtlicher Autohersteller wird beim Umgehen von Abgastests erwischt — eine Erinnerung an den alten Dieselskandal der Branche.' },
    choices: [
      {
        text: { tr: 'Ağır Para Cezası Kes ve Geri Çağırmayı Zorla', en: 'Fine It Heavily, Force a Recall', de: 'Hohe Strafe verhängen und Rückruf erzwingen' },
        effects: { budget: +60, happiness: +5, cleanliness: +15 }
      },
      {
        text: { tr: 'Sessizce Uzlaş', en: 'Negotiate a Quiet Settlement', de: 'Einen stillen Vergleich aushandeln' },
        effects: { budget: +100, happiness: -15, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'bw-black-forest',
    regionId: 'badenwuerttemberg',
    title: { tr: 'Karaorman\'da Kesim Tartışması', en: 'Logging Dispute in the Black Forest', de: 'Streit um die Abholzung im Schwarzwald' },
    description: { tr: 'Bir kereste şirketi Karaorman\'da genişletilmiş kesim hakları istiyor.', en: 'A timber company wants expanded logging rights in the Black Forest.', de: 'Ein Holzunternehmen fordert erweiterte Abholzungsrechte im Schwarzwald.' },
    choices: [
      {
        text: { tr: 'Yaşlı Ormanı Koru', en: 'Protect the Old-Growth Forest', de: 'Alten Baumbestand schützen' },
        effects: { budget: -30, happiness: +10, cleanliness: +15 }
      },
      {
        text: { tr: 'Sınırlı Kesime İzin Ver', en: 'Approve Limited Logging', de: 'Begrenzte Abholzung genehmigen' },
        effects: { budget: +70, happiness: -10, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'bw-stuttgart-smog',
    regionId: 'badenwuerttemberg',
    title: { tr: 'Stuttgart Çanağında Hava Kirliliği', en: 'Air Pollution in the Stuttgart Basin', de: 'Luftverschmutzung im Stuttgarter Kessel' },
    description: { tr: 'Stuttgart\'ın vadi coğrafyası egzoz gazlarını hapsediyor ve şehir hava kalitesi sınırlarını defalarca aştı.', en: 'Stuttgart\'s basin-shaped valley traps exhaust fumes, and the city has repeatedly broken air-quality limits.', de: 'Der Kessel von Stuttgart hält die Abgase gefangen, und die Stadt hat wiederholt die Luftqualitätsgrenzwerte überschritten.' },
    choices: [
      {
        text: { tr: 'Düşük Emisyon Bölgesi Getir', en: 'Introduce a Low-Emission Zone', de: 'Umweltzone einführen' },
        effects: { budget: -50, happiness: -10, cleanliness: +20 }
      },
      {
        text: { tr: 'Harekete Geçmeyi Bir Yıl Ertele', en: 'Delay Action Another Year', de: 'Maßnahmen um ein Jahr verschieben' },
        effects: { budget: +10, happiness: +5, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'bw-ev-transition',
    regionId: 'badenwuerttemberg',
    title: { tr: 'Elektrikli Araca Geçişin Bedeli', en: 'The Cost of the EV Transition', de: 'Der Preis der E-Auto-Wende' },
    description: { tr: 'İçten yanmalı motor parçaları üzerine kurulu küçük kasabalar, sektör elektrikli araca geçtikçe toplu işten çıkarmalarla karşı karşıya.', en: 'Small towns built around combustion-engine parts suppliers face mass layoffs as the industry electrifies.', de: 'Kleinstädte, die auf Zulieferern für Verbrennungsmotoren aufgebaut sind, drohen Massenentlassungen, während die Branche auf Elektroautos umstellt.' },
    choices: [
      {
        text: { tr: 'Yeniden Eğitim Programlarını Finanse Et', en: 'Fund Retraining Programs', de: 'Umschulungsprogramme finanzieren' },
        effects: { budget: -120, happiness: +15, cleanliness: +5 }
      },
      {
        text: { tr: 'Piyasanın Halletmesine İzin Ver', en: 'Let the Market Sort It Out', de: 'Den Markt entscheiden lassen' },
        effects: { budget: +30, happiness: -20 }
      }
    ]
  },

  // --- EASTERN GERMANY (OST) ---
  {
    id: 'ost-lignite-mine',
    regionId: 'ost',
    title: { tr: 'Linyit Madeninin Kapatılması', en: 'Phasing Out the Lignite Mine', de: 'Ausstieg aus dem Braunkohletagebau' },
    description: { tr: 'Bölgenin devasa linyit madeni büyük bir işveren ama daha büyük bir kirletici; kapatma süreci işliyor.', en: 'The region\'s giant lignite mine is a major employer but an even bigger polluter, and the phase-out clock is ticking.', de: 'Der riesige Braunkohletagebau der Region ist ein bedeutender Arbeitgeber, aber ein noch größerer Umweltverschmutzer — die Ausstiegsuhr tickt.' },
    choices: [
      {
        text: { tr: 'Kapatmayı Hızlandır', en: 'Accelerate the Phase-Out', de: 'Ausstieg beschleunigen' },
        effects: { budget: -100, happiness: -20, cleanliness: +25 }
      },
      {
        text: { tr: 'İşleri Korumak İçin Ertele', en: 'Delay It to Protect Jobs', de: 'Verzögern, um Arbeitsplätze zu schützen' },
        effects: { budget: +80, happiness: +10, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'ost-population-decline',
    regionId: 'ost',
    title: { tr: 'Gençlerin Göçü', en: 'The Exodus of the Young', de: 'Die Abwanderung der Jungen' },
    description: { tr: 'Gençler batıdaki şehirlere göç etmeye devam ediyor, geriye yaşlanan bir nüfus ve daralan bir bütçe kalıyor.', en: 'Young people keep leaving for western cities, leaving behind an aging population and a shrinking budget.', de: 'Junge Menschen ziehen weiterhin in westliche Städte, zurück bleiben eine alternde Bevölkerung und ein schrumpfendes Budget.' },
    choices: [
      {
        text: { tr: 'Yerel İş ve Konuta Yatırım Yap', en: 'Invest in Local Jobs and Housing', de: 'In lokale Jobs und Wohnraum investieren' },
        effects: { budget: -90, happiness: +15 }
      },
      {
        text: { tr: 'Düşüşü Kabul Et, Hizmetleri Kıs', en: 'Accept the Decline, Cut Services', de: 'Rückgang akzeptieren, Leistungen kürzen' },
        effects: { budget: +40, happiness: -20 }
      }
    ]
  },
  {
    id: 'ost-solar-farm-land',
    regionId: 'ost',
    title: { tr: 'Eski Maden Arazisine Güneş Çiftliği', en: 'A Solar Farm on Former Mine Land', de: 'Solarpark auf ehemaligem Bergbaugelände' },
    description: { tr: 'Islah edilmiş bir açık maden sahası dev bir güneş çiftliğine ev sahipliği yapabilir — ya da sulak alana dönüştürülebilir.', en: 'A reclaimed strip-mine site could host a huge solar farm — or be restored to wetland habitat instead.', de: 'Eine rekultivierte Tagebaufläche könnte einen riesigen Solarpark beherbergen — oder stattdessen zu einem Feuchtgebiet renaturiert werden.' },
    choices: [
      {
        text: { tr: 'Güneş Çiftliğini Kur', en: 'Build the Solar Farm', de: 'Solarpark bauen' },
        effects: { budget: +50, happiness: +5, cleanliness: +15 }
      },
      {
        text: { tr: 'Sulak Alana Dönüştür', en: 'Restore It to Wetland', de: 'Zu Feuchtgebiet renaturieren' },
        effects: { budget: -60, happiness: +10, cleanliness: +20 }
      }
    ]
  },
  {
    id: 'ost-heating-subsidy',
    regionId: 'ost',
    title: { tr: 'Isınma Yardımı Krizi', en: 'The Heating Subsidy Crisis', de: 'Die Heizkostenkrise' },
    description: { tr: 'Eski kömürlü bölgesel ısıtma şebekesinin gaza dönüştürülmesi düşük gelirli hanelerin faturalarını fırlattı.', en: 'Converting the old coal-fired district heating network to gas has spiked bills for low-income households.', de: 'Die Umstellung des alten kohlebefeuerten Fernwärmenetzes auf Gas hat die Rechnungen einkommensschwacher Haushalte in die Höhe getrieben.' },
    choices: [
      {
        text: { tr: 'Hane Halkının Isınma Faturalarını Sübvanse Et', en: 'Subsidize Households\' Heating Bills', de: 'Heizkosten der Haushalte subventionieren' },
        effects: { budget: -110, happiness: +20 }
      },
      {
        text: { tr: 'Fiyatları Olduğu Gibi Bırak', en: 'Let Prices Stand', de: 'Preise unverändert lassen' },
        effects: { budget: +20, happiness: -25 }
      }
    ]
  },

  // --- SCOTLAND ---
  {
    id: 'scotland-highland-wind',
    regionId: 'scotland',
    title: { tr: 'Yayla Rüzgar Çiftliği Tartışması', en: 'Highland Wind Farm Dispute', de: 'Streit um den Windpark im Hochland' },
    description: { tr: 'Manzaralı bir vadi için önerilen rüzgar çiftliği temiz enerji üretir ama turistlerin geldiği manzarayı değiştirir.', en: 'A wind farm proposed for a scenic glen would generate clean power but change the view tourists come for.', de: 'Ein für ein malerisches Tal geplanter Windpark würde sauberen Strom erzeugen, aber die Aussicht verändern, wegen der Touristen kommen.' },
    choices: [
      {
        text: { tr: 'Rüzgar Çiftliğini Onayla', en: 'Approve the Wind Farm', de: 'Windpark genehmigen' },
        effects: { budget: +90, happiness: -10, cleanliness: +20 }
      },
      {
        text: { tr: 'Manzaralı Vadiyi Koru', en: 'Protect the Scenic Glen', de: 'Malerisches Tal schützen' },
        effects: { budget: -30, happiness: +10, cleanliness: +5 }
      }
    ]
  },
  {
    id: 'scotland-salmon-farming',
    regionId: 'scotland',
    title: { tr: 'Somon Çiftliği Kirliliği', en: 'Salmon Farm Pollution', de: 'Verschmutzung durch Lachsfarmen' },
    description: { tr: 'Kıyı somon çiftliklerindeki bit ilaçları ve atıklar yabani balık stoklarına zarar veriyor.', en: 'Sea-lice treatments and waste from coastal salmon farms are damaging wild fish stocks.', de: 'Läusebehandlungen und Abfälle aus küstennahen Lachsfarmen schädigen die Wildfischbestände.' },
    choices: [
      {
        text: { tr: 'Çiftlik Düzenlemelerini Sıkılaştır', en: 'Tighten Farm Regulations', de: 'Vorschriften für Farmen verschärfen' },
        effects: { budget: -40, happiness: -10, cleanliness: +20 }
      },
      {
        text: { tr: 'Sektörün Kendi Kendini Denetlemesine İzin Ver', en: 'Let the Industry Self-Regulate', de: 'Branche sich selbst regulieren lassen' },
        effects: { budget: +60, happiness: +5, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'scotland-ferry-lifeline',
    regionId: 'scotland',
    title: { tr: 'Ada Feribot Hattı Krizi', en: 'The Island Ferry Lifeline', de: 'Die Fährverbindung zur Insel' },
    description: { tr: 'Eskiyen bir feribot, uzak bir ada topluluğunun tek yaşam hattı ve sürekli arızalanıyor.', en: 'An aging ferry is the only lifeline for a remote island community, and it keeps breaking down.', de: 'Eine alternde Fähre ist die einzige Lebensader einer abgelegenen Inselgemeinde und fällt ständig aus.' },
    choices: [
      {
        text: { tr: 'Yeni Bir Feribot Finanse Et', en: 'Fund a New Ferry', de: 'Eine neue Fähre finanzieren' },
        effects: { budget: -150, happiness: +20 }
      },
      {
        text: { tr: 'Eskisini Yine Onar', en: 'Patch the Old One Up Again', de: 'Die alte wieder reparieren' },
        effects: { budget: -30, happiness: -10 }
      }
    ]
  },
  {
    id: 'scotland-rewilding',
    regionId: 'scotland',
    title: { tr: 'Yaylanın Yeniden Vahşileştirilmesi', en: 'Rewilding the Highlands', de: 'Wiederverwilderung des Hochlands' },
    description: { tr: 'Doğa koruma savunucuları, şu anda koyunların otladığı çıplak tepelere yerli ormanın geri getirilmesini istiyor.', en: 'Conservationists want to reintroduce native forest to bare hillsides currently grazed by sheep.', de: 'Naturschützer wollen einheimischen Wald auf kahle Hänge zurückbringen, die derzeit von Schafen beweidet werden.' },
    choices: [
      {
        text: { tr: 'Yeniden Vahşileştirme Projesini Destekle', en: 'Back the Rewilding Project', de: 'Wiederverwilderungsprojekt unterstützen' },
        effects: { budget: -50, happiness: -5, cleanliness: +20 }
      },
      {
        text: { tr: 'Koyun Çiftçiliğinin Geçimini Koru', en: 'Protect Sheep Farming Livelihoods', de: 'Lebensgrundlage der Schafzüchter schützen' },
        effects: { budget: +30, happiness: +10, cleanliness: -5 }
      }
    ]
  },

  // --- NORTHERN ENGLAND ---
  {
    id: 'ne-shipyard-legacy',
    regionId: 'northern-england',
    title: { tr: 'Tersane Mirası Kirliliği', en: 'The Shipyard\'s Toxic Legacy', de: 'Das toxische Erbe der Werft' },
    description: { tr: 'Kapanmış bir Tyneside tersanesi, nehir kıyısı topraklarında on yıllarca süren ağır metal kirliliği bıraktı.', en: 'A closed Tyneside shipyard has left decades of heavy-metal contamination in the riverbank soil.', de: 'Eine geschlossene Werft am Tyne hat jahrzehntelange Schwermetallbelastung im Uferboden hinterlassen.' },
    choices: [
      {
        text: { tr: 'Tam Bir Arındırmayı Finanse Et', en: 'Fund a Full Decontamination', de: 'Vollständige Sanierung finanzieren' },
        effects: { budget: -140, happiness: +10, cleanliness: +25 }
      },
      {
        text: { tr: 'Çevresini Çevir ve Bırak', en: 'Fence It Off and Leave It', de: 'Absperren und liegen lassen' },
        effects: { budget: -10, happiness: -10, cleanliness: -5 }
      }
    ]
  },
  {
    id: 'ne-steel-town',
    regionId: 'northern-england',
    title: { tr: 'Çelik Fabrikasının Kapanma Tehdidi', en: 'The Steelworks Closure Threat', de: 'Die drohende Stahlwerksschließung' },
    description: { tr: 'Zorlanan bir çelik fabrikası kapanma tehdidiyle karşı karşıya ve etrafında kurulu kasabayı çökertebilir.', en: 'A struggling steel plant threatens to close, gutting the town built around it.', de: 'Ein angeschlagenes Stahlwerk droht zu schließen und würde die um es herum gewachsene Stadt ins Mark treffen.' },
    choices: [
      {
        text: { tr: 'Açık Kalması İçin Sübvanse Et', en: 'Subsidize It to Keep It Open', de: 'Subventionieren, um es offen zu halten' },
        effects: { budget: -130, happiness: +20, cleanliness: -15 }
      },
      {
        text: { tr: 'Kapanmasına İzin Ver, İşçileri Eğit', en: 'Let It Close, Retrain Workers', de: 'Schließen lassen, Arbeiter umschulen' },
        effects: { budget: -40, happiness: -15, cleanliness: +15 }
      }
    ]
  },
  {
    id: 'ne-river-tyne',
    regionId: 'northern-england',
    title: { tr: 'Tyne Nehri\'nin Temizlenmesi', en: 'Cleaning Up the River Tyne', de: 'Die Reinigung des Flusses Tyne' },
    description: { tr: 'Tersaneler kapandıktan yıllar sonra Tyne Nehri somonların dönebileceği kadar iyileşti — ama izleme bütçesi tehlikede.', en: 'Years after the shipyards closed, the River Tyne has recovered enough for salmon to return — but the monitoring budget is at risk.', de: 'Jahre nach der Schließung der Werften hat sich der Tyne so weit erholt, dass Lachse zurückkehren — doch das Budget für die Überwachung ist gefährdet.' },
    choices: [
      {
        text: { tr: 'Su Kalitesi İzlemeyi Finanse Etmeye Devam Et', en: 'Keep Funding Water Quality Monitoring', de: 'Gewässerüberwachung weiter finanzieren' },
        effects: { budget: -50, happiness: +5, cleanliness: +15 }
      },
      {
        text: { tr: 'İzleme Bütçesini Kes', en: 'Cut the Monitoring Budget', de: 'Überwachungsbudget kürzen' },
        effects: { budget: +30, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'ne-flood-defense',
    regionId: 'northern-england',
    title: { tr: 'Yorkshire\'da Sel Tehlikesi', en: 'Flood Danger in Yorkshire', de: 'Hochwassergefahr in Yorkshire' },
    description: { tr: 'Pennine\'lerdeki şiddetli yağışlar aşağıdaki vadi kasabalarının eskiyen sel savunmalarını sürekli zorluyor.', en: 'Heavy Pennine rainfall keeps overwhelming aging flood defenses in the valley towns below.', de: 'Starke Regenfälle in den Pennines überfordern immer wieder die alternden Hochwasserschutzanlagen der Talstädte.' },
    choices: [
      {
        text: { tr: 'Sel Savunmalarını Yeniden İnşa Et', en: 'Rebuild the Flood Defenses', de: 'Hochwasserschutz neu aufbauen' },
        effects: { budget: -120, happiness: +15, cleanliness: +5 }
      },
      {
        text: { tr: 'Kum Torbaları ve Uyarılarla Yetin', en: 'Rely on Sandbags and Warnings', de: 'Auf Sandsäcke und Warnungen setzen' },
        effects: { budget: -20, happiness: -15 }
      }
    ]
  },

  // --- MIDLANDS ---
  {
    id: 'midlands-car-plant',
    regionId: 'midlands',
    title: { tr: 'Otomobil Fabrikası Emisyonları', en: 'The Car Plant\'s Emissions', de: 'Die Abgase der Autofabrik' },
    description: { tr: 'Büyük bir otomobil fabrikası bölgenin en büyük işvereni, aynı zamanda en büyük kirletici.', en: 'A major car plant is the region\'s biggest employer — and its biggest emitter.', de: 'Eine große Autofabrik ist der größte Arbeitgeber der Region — und ihr größter Verschmutzer.' },
    choices: [
      {
        text: { tr: 'Daha Temiz Bir Üretim Hattı Zorunlu Kıl', en: 'Mandate a Cleaner Production Line', de: 'Saubere Produktionslinie vorschreiben' },
        effects: { budget: -100, cleanliness: +20 }
      },
      {
        text: { tr: 'Üretimi Olduğu Gibi Bırak', en: 'Leave Production As Is', de: 'Produktion unverändert lassen' },
        effects: { budget: +50, happiness: +5, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'midlands-canal-legacy',
    regionId: 'midlands',
    title: { tr: 'Kanal Ağının Sanayi Mirası', en: 'The Canal Network\'s Industrial Legacy', de: 'Das industrielle Erbe des Kanalnetzes' },
    description: { tr: 'Bölgenin tarihi kanalları hâlâ tabanlarında bir yüzyıllık sanayi tortusu taşıyor.', en: 'The region\'s historic canals still carry a century of industrial sediment on their beds.', de: 'Die historischen Kanäle der Region tragen noch immer ein Jahrhundert an industriellen Ablagerungen auf ihrem Grund.' },
    choices: [
      {
        text: { tr: 'Kanalları Tara ve Islah Et', en: 'Dredge and Restore the Canals', de: 'Kanäle ausbaggern und sanieren' },
        effects: { budget: -90, happiness: +10, cleanliness: +15 }
      },
      {
        text: { tr: 'Miras Merakı Olarak Bırak', en: 'Leave Them as a Heritage Curiosity', de: 'Als historische Kuriosität belassen' },
        effects: { happiness: +5, cleanliness: -5 }
      }
    ]
  },
  {
    id: 'midlands-foundry-closure',
    regionId: 'midlands',
    title: { tr: 'Döküm Fabrikasının Kapanması', en: 'The Foundry Closure', de: 'Die Schließung der Gießerei' },
    description: { tr: 'Tarihi bir Black Country dökümhanesi yeni emisyon kurallarını karşılayamıyor ve kapanma tehlikesiyle karşı karşıya.', en: 'A historic Black Country foundry can\'t meet the new emissions rules and faces closure.', de: 'Eine historische Gießerei im Black Country kann die neuen Abgasvorschriften nicht erfüllen und steht vor der Schließung.' },
    choices: [
      {
        text: { tr: 'Dönüştürmesine Yardım Et, Açık Kalsın', en: 'Help It Retrofit and Stay Open', de: 'Umrüstung unterstützen, offen halten' },
        effects: { budget: -110, happiness: +15, cleanliness: +10 }
      },
      {
        text: { tr: 'Kapanmasına İzin Ver', en: 'Let It Close', de: 'Schließen lassen' },
        effects: { budget: +20, happiness: -15, cleanliness: +15 }
      }
    ]
  },
  {
    id: 'midlands-warehouse-sprawl',
    regionId: 'midlands',
    title: { tr: 'Deponun Yeşil Kuşağı İşgali', en: 'Warehouses Sprawl Onto the Green Belt', de: 'Lagerhallen breiten sich auf den Grüngürtel aus' },
    description: { tr: 'E-ticaret depoları şehrin etrafındaki korunan yeşil kuşak arazisine yayılmaya devam ediyor.', en: 'E-commerce warehouses keep spreading onto protected green-belt land around the city.', de: 'E-Commerce-Lagerhallen breiten sich weiter auf geschütztes Grüngürtelland rund um die Stadt aus.' },
    choices: [
      {
        text: { tr: 'Depolara İzin Ver (İş, Lojistik Merkezi)', en: 'Approve the Warehouses (Jobs, Logistics Hub)', de: 'Lagerhallen genehmigen (Jobs, Logistikzentrum)' },
        effects: { budget: +110, happiness: -10, cleanliness: -15 }
      },
      {
        text: { tr: 'Yeşil Kuşağı Koru', en: 'Protect the Green Belt', de: 'Grüngürtel schützen' },
        effects: { budget: -30, happiness: +15, cleanliness: +10 }
      }
    ]
  },

  // --- WALES ---
  {
    id: 'wales-slate-quarry',
    regionId: 'wales',
    title: { tr: 'Terk Edilmiş Arduvaz Ocağı', en: 'The Abandoned Slate Quarry', de: 'Der stillgelegte Schieferbruch' },
    description: { tr: 'Kullanılmayan bir arduvaz ocağı vadide bir yara gibi duruyor — arazi tamamen ıslah mı edilsin, yoksa sanayi mirası turizmine mi açılsın?', en: 'A disused slate quarry scars a valley — restore the land fully, or open it as an industrial-heritage tourist site?', de: 'Ein stillgelegter Schieferbruch hinterlässt eine Narbe im Tal — das Land vollständig renaturieren oder als Industriedenkmal für Touristen öffnen?' },
    choices: [
      {
        text: { tr: 'Araziyi Tamamen Islah Et', en: 'Restore the Land Fully', de: 'Land vollständig renaturieren' },
        effects: { budget: -70, happiness: +5, cleanliness: +20 }
      },
      {
        text: { tr: 'Miras Turizm Alanı Olarak Aç', en: 'Open It as a Heritage Tourist Site', de: 'Als touristisches Denkmal öffnen' },
        effects: { budget: +50, happiness: +10, cleanliness: -5 }
      }
    ]
  },
  {
    id: 'wales-coal-valley',
    regionId: 'wales',
    title: { tr: 'Maden Vadisinde Çökme Riski', en: 'Subsidence in the Coal Valley', de: 'Bergsenkung im Kohletal' },
    description: { tr: 'Eski bir maden vadisinin üzerindeki cüruf yığınları dengesiz ve aşağıdaki köyü tehdit ediyor.', en: 'Old slag heaps above a former mining valley are unstable and threaten the village below.', de: 'Alte Schlackenhalden über einem ehemaligen Bergbautal sind instabil und bedrohen das Dorf darunter.' },
    choices: [
      {
        text: { tr: 'Cüruf Yığınlarını Sağlamlaştır', en: 'Stabilize the Slag Heaps', de: 'Schlackenhalden stabilisieren' },
        effects: { budget: -100, happiness: +20, cleanliness: +5 }
      },
      {
        text: { tr: 'Riskli Evleri Tahliye Et', en: 'Evacuate the At-Risk Homes Instead', de: 'Stattdessen gefährdete Häuser evakuieren' },
        effects: { budget: -50, happiness: -15 }
      }
    ]
  },
  {
    id: 'wales-afforestation',
    regionId: 'wales',
    title: { tr: 'Ağaçlandırma mı Koyun Otlatma mı', en: 'Afforestation vs. Sheep Grazing', de: 'Aufforstung gegen Schafweide' },
    description: { tr: 'Ulusal bir ağaçlandırma hedefi, tepe çiftliklerinin otlak arazisini yeni ormana dönüştürecek.', en: 'A national afforestation target would convert hill-farm grazing land into new forest.', de: 'Ein nationales Aufforstungsziel würde Weideland der Hügelbauern in neuen Wald verwandeln.' },
    choices: [
      {
        text: { tr: 'Ağaçlandırmaya Öncelik Ver', en: 'Prioritize Afforestation', de: 'Aufforstung priorisieren' },
        effects: { budget: -40, happiness: -15, cleanliness: +20 }
      },
      {
        text: { tr: 'Çiftçilerin Otlak Arazisini Koru', en: 'Protect the Hill Farmers\' Grazing Land', de: 'Weideland der Hügelbauern schützen' },
        effects: { budget: +20, happiness: +10, cleanliness: -5 }
      }
    ]
  },
  {
    id: 'wales-hydro-valley',
    regionId: 'wales',
    title: { tr: 'Snowdonia\'da Hidroelektrik Planı', en: 'A Hydro Plan for Snowdonia', de: 'Ein Wasserkraftplan für Snowdonia' },
    description: { tr: 'Snowdonia vadisindeki yeni bir hidroelektrik projesi temiz enerji vadediyor ama nadir bir habitatı sular altında bırakacak.', en: 'A new hydro scheme in a Snowdonia valley promises clean power but would flood a rare habitat.', de: 'Ein neues Wasserkraftprojekt in einem Snowdonia-Tal verspricht sauberen Strom, würde aber einen seltenen Lebensraum überfluten.' },
    choices: [
      {
        text: { tr: 'Hidroelektrik Projesini İnşa Et', en: 'Build the Hydro Scheme', de: 'Wasserkraftprojekt bauen' },
        effects: { budget: +50, happiness: -5, cleanliness: +10 }
      },
      {
        text: { tr: 'Bunun Yerine Habitatı Koru', en: 'Protect the Habitat Instead', de: 'Stattdessen den Lebensraum schützen' },
        effects: { budget: -30, happiness: +10, cleanliness: +10 }
      }
    ]
  },

  // --- SOUTHERN ENGLAND ---
  {
    id: 'se-ulez',
    regionId: 'southern-england',
    title: { tr: 'Düşük Emisyon Bölgesi Genişletmesi', en: 'Low-Emission Zone Expansion', de: 'Ausweitung der Umweltzone' },
    description: { tr: 'Şehrin düşük emisyon bölgesini genişletmek dumanı azaltır ama en çok eski araç sahiplerini vurur.', en: 'Expanding the city\'s low-emission zone would cut smog but hits owners of older cars hardest.', de: 'Die Ausweitung der städtischen Umweltzone würde den Smog verringern, träfe aber Besitzer älterer Autos am härtesten.' },
    choices: [
      {
        text: { tr: 'Bölgeyi Genişlet', en: 'Expand the Zone', de: 'Zone ausweiten' },
        effects: { budget: +40, happiness: -15, cleanliness: +25 }
      },
      {
        text: { tr: 'Genişletmeyi Ertele', en: 'Hold Off on Expansion', de: 'Ausweitung zurückstellen' },
        effects: { budget: -10, happiness: +10, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'se-thames-quality',
    regionId: 'southern-england',
    title: { tr: 'Thames Nehri\'ne Kanalizasyon Taşkını', en: 'Sewage Overflow Into the Thames', de: 'Abwasserüberlauf in die Themse' },
    description: { tr: 'Viktorya dönemi kanalizasyon şebekesi her şiddetli yağmurda Thames Nehri\'ne taşıyor.', en: 'Aging Victorian-era sewers overflow into the Thames every time it rains heavily.', de: 'Die alternde viktorianische Kanalisation läuft bei jedem starken Regen in die Themse über.' },
    choices: [
      {
        text: { tr: 'Kanalizasyon Yükseltmesini Finanse Et', en: 'Fund the Sewer Upgrade', de: 'Kanalisationsausbau finanzieren' },
        effects: { budget: -170, happiness: +15, cleanliness: +25 }
      },
      {
        text: { tr: 'Sadece En Kötü Taşkın Noktalarını Onar', en: 'Patch Only the Worst Overflow Points', de: 'Nur die schlimmsten Überlaufstellen ausbessern' },
        effects: { budget: -50, cleanliness: +5 }
      }
    ]
  },
  {
    id: 'se-green-belt-housing',
    regionId: 'southern-england',
    title: { tr: 'Yeşil Kuşakta Konut Baskısı', en: 'Housing Pressure on the Green Belt', de: 'Wohnungsdruck auf den Grüngürtel' },
    description: { tr: 'Ciddi bir konut kıtlığı, geliştiricileri korunan yeşil kuşak arazisine göz dikmeye itiyor.', en: 'A severe housing shortage is pushing developers to eye protected green-belt land.', de: 'Ein schwerer Wohnungsmangel lässt Bauträger nach geschütztem Grüngürtelland verlangen.' },
    choices: [
      {
        text: { tr: 'Sınırlı Yeşil Kuşak Gelişimine İzin Ver', en: 'Allow Limited Green-Belt Development', de: 'Begrenzte Bebauung des Grüngürtels erlauben' },
        effects: { budget: +130, happiness: -10, cleanliness: -15 }
      },
      {
        text: { tr: 'Yeşil Kuşağı Koru, Yoğun İnşa Et', en: 'Protect the Green Belt, Build Densely Instead', de: 'Grüngürtel schützen, stattdessen dicht bauen' },
        effects: { budget: -40, happiness: +10, cleanliness: +10 }
      }
    ]
  },
  {
    id: 'se-financial-district-energy',
    regionId: 'southern-england',
    title: { tr: 'Finans Merkezinin Enerji Talebi', en: 'The Financial District\'s Energy Demands', de: 'Der Energiebedarf des Finanzviertels' },
    description: { tr: 'Şehrin cam ofis kuleleri, gece gündüz süren işlem salonları ve sunucular için devasa enerji talep ediyor.', en: 'The city\'s glass office towers demand enormous power for round-the-clock trading floors and servers.', de: 'Die gläsernen Bürotürme der Stadt benötigen enorme Energiemengen für rund um die Uhr laufende Handelsräume und Server.' },
    choices: [
      {
        text: { tr: 'Verimlilik Dönüşümünü Zorunlu Kıl', en: 'Mandate Efficiency Retrofits', de: 'Effizienzsanierungen vorschreiben' },
        effects: { budget: -90, cleanliness: +15 }
      },
      {
        text: { tr: 'Kulelerin Kendi Enerjisini Yönetmesine İzin Ver', en: 'Leave Towers to Manage Their Own Energy', de: 'Türme ihre eigene Energie verwalten lassen' },
        effects: { budget: +60, cleanliness: -10 }
      }
    ]
  },

  // --- NORTHERN IRELAND ---
  {
    id: 'ni-shipyard-titanic',
    regionId: 'northern-ireland',
    title: { tr: 'Tersane Mirasının Yeniden Kullanımı', en: 'Repurposing the Shipyard\'s Legacy', de: 'Die Nachnutzung des Werftgeländes' },
    description: { tr: 'Titanic\'i inşa eden tarihi tersane büyük ölçüde atıl duruyor — alan yeniden mi geliştirilsin, miras olarak mı korunsun?', en: 'The historic shipyard that built the Titanic sits mostly idle — redevelop the site, or preserve it as heritage?', de: 'Die historische Werft, in der die Titanic gebaut wurde, liegt größtenteils brach — das Gelände neu entwickeln oder als Denkmal erhalten?' },
    choices: [
      {
        text: { tr: 'Yeşil Sanayi İçin Yeniden Geliştir', en: 'Redevelop for Green Industry', de: 'Für grüne Industrie neu entwickeln' },
        effects: { budget: -100, happiness: +10, cleanliness: +15 }
      },
      {
        text: { tr: 'Miras/Turizm Alanı Olarak Koru', en: 'Preserve It as a Heritage/Tourist Site', de: 'Als Denkmal und Touristenziel erhalten' },
        effects: { budget: +40, happiness: +15 }
      }
    ]
  },
  {
    id: 'ni-lough-neagh',
    regionId: 'northern-ireland',
    title: { tr: 'Lough Neagh\'de Yosun Patlaması', en: 'Algae Bloom in Lough Neagh', de: 'Algenblüte im Lough Neagh' },
    description: { tr: 'Tarımsal akış, bölgenin en büyük gölünde zehirli bir yosun patlamasını tetikledi.', en: 'Agricultural runoff has triggered a toxic algae bloom across the region\'s largest lake.', de: 'Landwirtschaftliche Abflüsse haben eine giftige Algenblüte im größten See der Region ausgelöst.' },
    choices: [
      {
        text: { tr: 'Tarımsal Akışı Sıkı Denetle', en: 'Regulate Farm Runoff Strictly', de: 'Landwirtschaftliche Abflüsse streng regulieren' },
        effects: { budget: -80, happiness: -15, cleanliness: +25 }
      },
      {
        text: { tr: 'Çiftçilere Sadece Gönüllü Rehberlik Sun', en: 'Offer Farmers Voluntary Guidance Only', de: 'Landwirten nur freiwillige Beratung anbieten' },
        effects: { budget: -10, happiness: +5, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'ni-peace-investment',
    regionId: 'northern-ireland',
    title: { tr: 'Barış Sonrası Kalkınma Yatırımı', en: 'Post-Peace Regeneration Investment', de: 'Investitionen in die Nachfriedensregion' },
    description: { tr: 'Uluslararası kalkınma fonu mevcut, ama ancak hazinenin zar zor karşılayabileceği yerel yatırımla eşleştirilirse.', en: 'International regeneration funding is available, but only if matched by local investment the treasury can barely afford.', de: 'Internationale Fördermittel für den Wiederaufbau stehen bereit, aber nur bei einer lokalen Kofinanzierung, die die Kasse kaum stemmen kann.' },
    choices: [
      {
        text: { tr: 'Fonu Eşleştir', en: 'Match the Funding', de: 'Kofinanzierung leisten' },
        effects: { budget: -120, happiness: +20, cleanliness: +10 }
      },
      {
        text: { tr: 'Reddet, Bütçe Çok Sıkı', en: 'Decline, the Budget Is Too Tight', de: 'Ablehnen, Budget zu knapp' },
        effects: { budget: +10, happiness: -15 }
      }
    ]
  },
  {
    id: 'ni-dairy-runoff',
    regionId: 'northern-ireland',
    title: { tr: 'Tarımsal Akışın Nehirlere Etkisi', en: 'Agricultural Runoff Into the Rivers', de: 'Landwirtschaftliche Abflüsse in die Flüsse' },
    description: { tr: 'Yoğun süt sığırcılığı akıntısı kırsal nehirleri yosunla boğuyor ve balık stoklarını öldürüyor.', en: 'Intensive dairy farming runoff is choking rural rivers with algae and killing fish stocks.', de: 'Abflüsse aus der intensiven Milchviehhaltung ersticken ländliche Flüsse mit Algen und töten Fischbestände.' },
    choices: [
      {
        text: { tr: 'Çiftlikler İçin Gübre Depolama Yükseltmesini Finanse Et', en: 'Fund Slurry Storage Upgrades for Farms', de: 'Gülle-Lagerung der Höfe modernisieren' },
        effects: { budget: -90, happiness: -5, cleanliness: +20 }
      },
      {
        text: { tr: 'Tarım Uygulamalarını Değiştirme', en: 'Leave Farming Practices Unchanged', de: 'Landwirtschaftliche Praktiken unverändert lassen' },
        effects: { budget: +30, happiness: +5, cleanliness: -15 }
      }
    ]
  },

  // ---------------------------------------------------------------------
  // ADDITIONAL EVENTS — grows the no-repeat pool so crises don't feel
  // like they're on a short loop over a long run.
  // ---------------------------------------------------------------------

  // --- Genel Olaylar (More Global Events) ---
  {
    id: 'urban-heatwave',
    title: { tr: 'Kentsel Isı Dalgası', en: 'Urban Heatwave', de: 'Städtische Hitzewelle' },
    description: { tr: 'Rekor sıcaklıklar şebekeyi zorluyor ve halk soğuma merkezleri talep ediyor.', en: 'Record heat is straining the power grid, and residents are demanding cooling centers.', de: 'Rekordhitze belastet das Stromnetz, und die Bevölkerung fordert Kühlzentren.' },
    choices: [
      {
        text: { tr: 'Halka Açık Soğuma Merkezleri Aç', en: 'Open Public Cooling Centers', de: 'Öffentliche Kühlzentren eröffnen' },
        effects: { budget: -60, happiness: +15 }
      },
      {
        text: { tr: 'Enerji Tasarrufu Çağrısı Yap', en: 'Issue an Energy-Saving Appeal', de: 'Zum Energiesparen aufrufen' },
        effects: { happiness: -10, cleanliness: +5 }
      }
    ]
  },
  {
    id: 'microplastic-water',
    title: { tr: 'İçme Suyunda Mikroplastik', en: 'Microplastics in the Drinking Water', de: 'Mikroplastik im Trinkwasser' },
    description: { tr: 'Yeni bir çalışma musluk suyunda endişe verici düzeyde mikroplastik parçacığı buldu.', en: 'A new study has found worrying levels of microplastic particles in tap water.', de: 'Eine neue Studie hat besorgniserregende Mengen an Mikroplastikpartikeln im Leitungswasser gefunden.' },
    choices: [
      {
        text: { tr: 'Gelişmiş Filtrasyona Yatırım Yap', en: 'Invest in Advanced Filtration', de: 'In fortschrittliche Filtration investieren' },
        effects: { budget: -100, cleanliness: +20 }
      },
      {
        text: { tr: 'Sonuçları Kamuoyuna Açıklama', en: "Don't Publicize the Results", de: 'Ergebnisse nicht veröffentlichen' },
        effects: { happiness: +5, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'green-jobs-training',
    title: { tr: 'Yeşil İş Eğitimi Talebi', en: 'A Call for Green Jobs Training', de: 'Forderung nach Ausbildung für grüne Jobs' },
    description: { tr: 'İşsiz gençler yenilenebilir enerji sektöründe iş bulmak için eğitim programı talep ediyor.', en: 'Unemployed young people are demanding a training program to find jobs in the renewable energy sector.', de: 'Arbeitslose junge Menschen fordern ein Ausbildungsprogramm für Jobs im Sektor erneuerbare Energien.' },
    choices: [
      {
        text: { tr: 'Programı Finanse Et', en: 'Fund the Program', de: 'Programm finanzieren' },
        effects: { budget: -90, happiness: +20, cleanliness: +5 }
      },
      {
        text: { tr: 'Özel Sektörün Öncülük Etmesini Bekle', en: 'Wait for the Private Sector to Lead', de: 'Auf die Privatwirtschaft warten' },
        effects: { happiness: -10 }
      }
    ]
  },

  // --- Marmara (More) ---
  {
    id: 'marmara-earthquake-retrofit',
    regionId: 'marmara',
    title: { tr: 'Deprem Güçlendirme Tartışması', en: 'The Earthquake Retrofit Debate', de: 'Die Debatte um die Erdbebensicherung' },
    description: { tr: 'Uzmanlar İstanbul\'daki binlerce binanın büyük depreme dayanamayacağını uyarıyor, ama güçlendirme maliyeti devasa.', en: "Experts warn thousands of Istanbul buildings won't survive the big one, but retrofitting costs are enormous.", de: 'Experten warnen, dass Tausende Gebäude in Istanbul dem großen Beben nicht standhalten würden, doch die Nachrüstung ist enorm teuer.' },
    choices: [
      {
        text: { tr: 'Zorunlu Güçlendirmeyi Başlat', en: 'Launch Mandatory Retrofitting', de: 'Verpflichtende Nachrüstung einführen' },
        effects: { budget: -180, happiness: +10 }
      },
      {
        text: { tr: 'Gönüllü Teşvik Programı Sun', en: 'Offer a Voluntary Incentive Program', de: 'Freiwilliges Förderprogramm anbieten' },
        effects: { budget: -50, happiness: -5 }
      }
    ]
  },
  {
    id: 'marmara-bosphorus-traffic',
    regionId: 'marmara',
    title: { tr: 'Boğaz\'da Gemi Trafiği Kirliliği', en: 'Bosphorus Shipping Traffic Pollution', de: 'Schiffsverkehrsverschmutzung am Bosporus' },
    description: { tr: 'Boğaz\'dan geçen yoğun tanker trafiği hem kaza riskini hem hava kirliliğini artırıyor.', en: 'Heavy tanker traffic through the Bosphorus is raising both accident risk and air pollution.', de: 'Der dichte Tankerverkehr durch den Bosporus erhöht sowohl das Unfallrisiko als auch die Luftverschmutzung.' },
    choices: [
      {
        text: { tr: 'Trafik Kontrolünü Sıkılaştır', en: 'Tighten Traffic Control', de: 'Verkehrskontrolle verschärfen' },
        effects: { budget: -40, happiness: +5, cleanliness: +15 }
      },
      {
        text: { tr: 'Ticareti Aksatma', en: "Don't Disrupt Trade", de: 'Handel nicht stören' },
        effects: { budget: +50, cleanliness: -10 }
      }
    ]
  },

  // --- Ege / Aegean (More) ---
  {
    id: 'aegean-beach-erosion',
    regionId: 'aegean',
    title: { tr: 'Kumsal Erozyonu', en: 'Beach Erosion', de: 'Strandabtragung' },
    description: { tr: 'Aşırı otel inşaatı Ege kıyılarındaki kumsalları hızla eritiyor.', en: 'Overdevelopment of hotels is rapidly eroding beaches along the Aegean coast.', de: 'Übermäßiger Hotelbau lässt die Strände an der Ägäisküste rapide erodieren.' },
    choices: [
      {
        text: { tr: 'Kıyı İnşaatını Sınırla', en: 'Restrict Coastal Construction', de: 'Küstenbebauung einschränken' },
        effects: { budget: -50, happiness: -10, cleanliness: +15 }
      },
      {
        text: { tr: 'İnşaata Devam Et', en: 'Let Construction Continue', de: 'Bau fortsetzen lassen' },
        effects: { budget: +90, happiness: +5, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'aegean-sponge-divers',
    regionId: 'aegean',
    title: { tr: 'Sünger Avcılığında Aşırı Avlanma', en: 'Overfishing the Sponge Beds', de: 'Überfischung der Schwammgründe' },
    description: { tr: 'Bodrum açıklarındaki sünger yatakları geleneksel dalgıçların aşırı avlanması yüzünden tükeniyor.', en: "Sponge beds off Bodrum are being depleted by traditional divers' overharvesting.", de: 'Die Schwammgründe vor Bodrum werden durch die Überfischung traditioneller Taucher erschöpft.' },
    choices: [
      {
        text: { tr: 'Avlanma Kotası Getir', en: 'Introduce a Harvest Quota', de: 'Fangquote einführen' },
        effects: { budget: -20, happiness: -10, cleanliness: +15 }
      },
      {
        text: { tr: 'Geleneği Serbest Bırak', en: 'Leave the Tradition Unregulated', de: 'Tradition unreguliert lassen' },
        effects: { budget: +10, happiness: +10, cleanliness: -10 }
      }
    ]
  },

  // --- Akdeniz / Mediterranean (More) ---
  {
    id: 'med-greenhouse-plastic',
    regionId: 'mediterranean',
    title: { tr: 'Sera Plastiği Kirliliği', en: 'Greenhouse Plastic Pollution', de: 'Plastikmüll aus Gewächshäusern' },
    description: { tr: 'Antalya\'nın seracılık bölgesinde kullanılmış plastik örtüler tarlalarda ve derelerde birikiyor.', en: "Used plastic sheeting from Antalya's greenhouse belt is piling up in fields and streams.", de: 'Gebrauchte Plastikfolien aus dem Gewächshausgürtel von Antalya häufen sich auf Feldern und in Bächen an.' },
    choices: [
      {
        text: { tr: 'Geri Dönüşüm Zorunluluğu Getir', en: 'Mandate Plastic Recycling', de: 'Recyclingpflicht einführen' },
        effects: { budget: -60, happiness: -5, cleanliness: +20 }
      },
      {
        text: { tr: 'Çiftçilere Karışma', en: "Don't Interfere with Farmers", de: 'Landwirte nicht einschränken' },
        effects: { budget: +20, happiness: +5, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'med-citrus-irrigation',
    regionId: 'mediterranean',
    title: { tr: 'Narenciye Sulamasında Su Kıtlığı', en: 'Water Scarcity in Citrus Irrigation', de: 'Wasserknappheit bei der Zitrusbewässerung' },
    description: { tr: 'Kuraklık narenciye bahçelerini sulayan yeraltı sularını tüketiyor.', en: 'Drought is depleting the groundwater that irrigates the citrus orchards.', de: 'Dürre erschöpft das Grundwasser, das die Zitrushaine bewässert.' },
    choices: [
      {
        text: { tr: 'Damla Sulamaya Geçişi Sübvanse Et', en: 'Subsidize the Switch to Drip Irrigation', de: 'Umstieg auf Tröpfchenbewässerung subventionieren' },
        effects: { budget: -100, happiness: +5, cleanliness: +10 }
      },
      {
        text: { tr: 'Çiftçileri Kendi Başına Bırak', en: 'Leave Farmers to Manage on Their Own', de: 'Landwirte auf sich allein gestellt lassen' },
        effects: { happiness: -15, cleanliness: -5 }
      }
    ]
  },

  // --- İç Anadolu / Anatolian (More) ---
  {
    id: 'anatolian-ankara-traffic',
    regionId: 'anatolian',
    title: { tr: 'Ankara\'da Trafik Emisyonu', en: 'Traffic Emissions in Ankara', de: 'Verkehrsemissionen in Ankara' },
    description: { tr: 'Başkentteki artan araç sayısı kış aylarında hava kalitesini ciddi düşürüyor.', en: "The capital's growing car count is seriously worsening winter air quality.", de: 'Die wachsende Zahl an Autos in der Hauptstadt verschlechtert die Luftqualität im Winter erheblich.' },
    choices: [
      {
        text: { tr: 'Toplu Taşımaya Yatırım Yap', en: 'Invest in Public Transit', de: 'In den öffentlichen Nahverkehr investieren' },
        effects: { budget: -110, happiness: +10, cleanliness: +15 }
      },
      {
        text: { tr: 'Araç Sahiplerine Dokunma', en: "Don't Touch Car Owners", de: 'Autobesitzer nicht belasten' },
        effects: { budget: +20, happiness: +5, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'anatolian-cappadocia-balloons',
    regionId: 'anatolian',
    title: { tr: 'Kapadokya\'da Balon Turizmi Baskısı', en: 'Balloon Tourism Pressure in Cappadocia', de: 'Ballontourismus-Druck in Kappadokien' },
    description: { tr: 'Her sabah gökyüzünü dolduran yüzlerce sıcak hava balonu gürültü ve yakıt emisyonu şikayetlerine yol açıyor.', en: 'Hundreds of hot-air balloons filling the sky each morning are drawing complaints about noise and fuel emissions.', de: 'Hunderte Heißluftballons, die jeden Morgen den Himmel füllen, sorgen für Beschwerden über Lärm und Treibstoffemissionen.' },
    choices: [
      {
        text: { tr: 'Günlük Balon Sayısını Sınırla', en: 'Cap the Number of Daily Flights', de: 'Zahl der täglichen Flüge begrenzen' },
        effects: { budget: -40, happiness: -10, cleanliness: +10 }
      },
      {
        text: { tr: 'Turizm Gelirine Öncelik Ver', en: 'Prioritize Tourism Revenue', de: 'Tourismuseinnahmen priorisieren' },
        effects: { budget: +80, happiness: +5, cleanliness: -10 }
      }
    ]
  },

  // --- Karadeniz / Black Sea (More) ---
  {
    id: 'blacksea-anchovy-overfishing',
    regionId: 'blacksea',
    title: { tr: 'Hamsi Stoklarında Aşırı Avlanma', en: 'Overfishing the Anchovy Stocks', de: 'Überfischung der Sardellenbestände' },
    description: { tr: 'Balıkçı filoları hamsi stoklarını sürdürülebilir sınırların çok üzerinde avlıyor.', en: 'Fishing fleets are hauling in anchovy stocks well beyond sustainable limits.', de: 'Fischereiflotten fangen Sardellen weit über nachhaltige Grenzen hinaus.' },
    choices: [
      {
        text: { tr: 'Avlanma Sezonunu Kısalt', en: 'Shorten the Fishing Season', de: 'Fangsaison verkürzen' },
        effects: { budget: -50, happiness: -15, cleanliness: +15 }
      },
      {
        text: { tr: 'Filoları Kısıtlama', en: "Don't Restrict the Fleets", de: 'Flotten nicht einschränken' },
        effects: { budget: +60, happiness: +10, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'blacksea-coal-mine-runoff',
    regionId: 'blacksea',
    title: { tr: 'Zonguldak Kömür Madeni Akıntısı', en: 'Zonguldak Coal Mine Runoff', de: 'Grubenwasser aus dem Kohlebergwerk Zonguldak' },
    description: { tr: 'Eski kömür madenlerinden sızan asitli su kıyı sularını kirletiyor.', en: 'Acidic water leaking from old coal mines is polluting the coastal waters.', de: 'Saures Wasser aus alten Kohlebergwerken verschmutzt die Küstengewässer.' },
    choices: [
      {
        text: { tr: 'Arıtma Tesisi Kur', en: 'Build a Treatment Facility', de: 'Aufbereitungsanlage errichten' },
        effects: { budget: -120, happiness: +5, cleanliness: +20 }
      },
      {
        text: { tr: 'İzlemeyle Yetin', en: 'Settle for Monitoring Only', de: 'Nur überwachen' },
        effects: { budget: -10, cleanliness: -10 }
      }
    ]
  },

  // --- Doğu Anadolu / Eastern (More) ---
  {
    id: 'eastern-wolf-livestock',
    regionId: 'eastern',
    title: { tr: 'Kurt Saldırıları ve Hayvancılık', en: 'Wolf Attacks and Livestock', de: 'Wolfsangriffe und Viehzucht' },
    description: { tr: 'Korunan kurt popülasyonu köy sürülerine saldırıyor, çiftçiler tazminat istiyor.', en: 'A protected wolf population is attacking village herds, and farmers are demanding compensation.', de: 'Eine geschützte Wolfspopulation greift Dorfherden an, und Landwirte fordern Entschädigung.' },
    choices: [
      {
        text: { tr: 'Çiftçilere Tazminat Öde', en: 'Compensate the Farmers', de: 'Landwirte entschädigen' },
        effects: { budget: -70, happiness: +15 }
      },
      {
        text: { tr: 'Popülasyonu Korumaya Devam Et, Ödeme Yok', en: 'Keep Protecting the Population, No Payouts', de: 'Population weiter schützen, keine Zahlungen' },
        effects: { happiness: -20, cleanliness: +10 }
      }
    ]
  },
  {
    id: 'eastern-euphrates-water-rights',
    regionId: 'eastern',
    title: { tr: 'Fırat\'ta Su Hakkı Anlaşmazlığı', en: 'Water Rights Dispute on the Euphrates', de: 'Streit um Wasserrechte am Euphrat' },
    description: { tr: 'Yukarı havzadaki barajlar aşağı yöndeki çiftçiler için su akışını azaltıyor.', en: 'Upstream dams are reducing water flow for farmers downriver.', de: 'Stauseen im Oberlauf verringern den Wasserfluss für Landwirte flussabwärts.' },
    choices: [
      {
        text: { tr: 'Su Tahsisini Yeniden Müzakere Et', en: 'Renegotiate the Water Allocation', de: 'Wasserverteilung neu verhandeln' },
        effects: { budget: -60, happiness: +15 }
      },
      {
        text: { tr: 'Mevcut Anlaşmayı Koru', en: 'Keep the Current Agreement', de: 'Bestehende Vereinbarung beibehalten' },
        effects: { budget: +20, happiness: -15, cleanliness: -5 }
      }
    ]
  },

  // --- Güneydoğu Anadolu / Southeastern (More) ---
  {
    id: 'southeastern-tigris-dye-pollution',
    regionId: 'southeastern',
    title: { tr: 'Dicle\'de Tekstil Boyama Kirliliği', en: 'Textile Dye Pollution in the Tigris', de: 'Textilfarbstoff-Verschmutzung im Tigris' },
    description: { tr: 'Küçük tekstil atölyeleri boyama atıklarını arıtmadan Dicle Nehri\'ne boşaltıyor.', en: 'Small textile workshops are dumping untreated dye waste into the Tigris River.', de: 'Kleine Textilwerkstätten leiten ungeklärte Farbstoffabwässer in den Tigris.' },
    choices: [
      {
        text: { tr: 'Ortak Arıtma Tesisi Kur', en: 'Build a Shared Treatment Facility', de: 'Gemeinsame Kläranlage bauen' },
        effects: { budget: -90, happiness: +5, cleanliness: +20 }
      },
      {
        text: { tr: 'Küçük İşletmeleri Zorlama', en: "Don't Burden Small Businesses", de: 'Kleinbetriebe nicht belasten' },
        effects: { budget: +20, happiness: +5, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'southeastern-desertification',
    regionId: 'southeastern',
    title: { tr: 'Otlak Arazisinin Çölleşmesi', en: 'Desertification of Grazing Land', de: 'Wüstenbildung auf Weideland' },
    description: { tr: 'Aşırı otlatma ve azalan yağış geniş otlak alanlarını çorak araziye çeviriyor.', en: 'Overgrazing and declining rainfall are turning vast grazing lands into barren ground.', de: 'Überweidung und abnehmender Niederschlag verwandeln weite Weideflächen in Ödland.' },
    choices: [
      {
        text: { tr: 'Otlatmayı Sınırla ve Ağaçlandır', en: 'Limit Grazing and Reforest', de: 'Beweidung begrenzen und aufforsten' },
        effects: { budget: -80, happiness: -10, cleanliness: +20 }
      },
      {
        text: { tr: 'Çobanların Geçimine Karışma', en: "Don't Interfere with Herders' Livelihoods", de: 'Hirten nicht in ihrer Existenz einschränken' },
        effects: { happiness: +10, cleanliness: -15 }
      }
    ]
  },

  // --- North Germany (Nord, More) ---
  {
    id: 'nord-fishing-quota',
    regionId: 'nord',
    title: { tr: 'Kuzey Denizi Balıkçılık Kotası', en: 'North Sea Fishing Quota Cut', de: 'Kürzung der Fangquote in der Nordsee' },
    description: { tr: 'AB balık stoklarını korumak için kotaları kesiyor, yerel balıkçılar geçimlerinin tehdit altında olduğunu söylüyor.', en: 'The EU is cutting quotas to protect fish stocks, and local fishermen say their livelihoods are at risk.', de: 'Die EU kürzt die Quoten zum Schutz der Fischbestände, lokale Fischer sehen ihre Existenz bedroht.' },
    choices: [
      {
        text: { tr: 'Kotayı Kabul Et', en: 'Accept the Quota Cut', de: 'Quotenkürzung akzeptieren' },
        effects: { budget: -40, happiness: -15, cleanliness: +15 }
      },
      {
        text: { tr: 'Ulusal İstisna İçin Lobi Yap', en: 'Lobby for a National Exemption', de: 'Für nationale Ausnahme lobbyieren' },
        effects: { budget: +30, happiness: +10, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'nord-elbe-dredging',
    regionId: 'nord',
    title: { tr: 'Elbe Nehri\'nin Derinleştirilmesi', en: 'Dredging the Elbe for Shipping', de: 'Vertiefung der Elbe für die Schifffahrt' },
    description: { tr: 'Daha büyük konteyner gemilerine izin vermek için Elbe\'nin derinleştirilmesi nehir tabanı ekosistemini bozuyor.', en: 'Deepening the Elbe to allow bigger container ships is disrupting the riverbed ecosystem.', de: 'Die Vertiefung der Elbe für größere Containerschiffe stört das Ökosystem des Flussbetts.' },
    choices: [
      {
        text: { tr: 'Derinleştirmeye Devam Et', en: 'Proceed with the Dredging', de: 'Vertiefung fortsetzen' },
        effects: { budget: +90, happiness: -5, cleanliness: -15 }
      },
      {
        text: { tr: 'Projeyi Askıya Al', en: 'Suspend the Project', de: 'Projekt aussetzen' },
        effects: { budget: -30, happiness: +5, cleanliness: +10 }
      }
    ]
  },

  // --- Ruhr Area (More) ---
  {
    id: 'ruhr-canal-noise',
    regionId: 'ruhrgebiet',
    title: { tr: 'Kanal Mavna Trafiği Gürültüsü', en: 'Canal Barge Traffic Noise', de: 'Lärm durch den Kanal-Frachtverkehr' },
    description: { tr: 'Gece boyunca çalışan mavnalar kanal kenarındaki mahallelerde uykuyu bölüyor.', en: 'Barges running through the night are disturbing sleep in canal-side neighborhoods.', de: 'Nachts fahrende Frachtkähne stören den Schlaf in den Vierteln entlang des Kanals.' },
    choices: [
      {
        text: { tr: 'Gece Trafiğini Kısıtla', en: 'Restrict Night Traffic', de: 'Nachtverkehr einschränken' },
        effects: { budget: -30, happiness: +15 }
      },
      {
        text: { tr: 'Lojistiği Aksatma', en: "Don't Disrupt Logistics", de: 'Logistik nicht stören' },
        effects: { budget: +40, happiness: -10 }
      }
    ]
  },
  {
    id: 'ruhr-urban-greening',
    regionId: 'ruhrgebiet',
    title: { tr: 'Terk Edilmiş Sanayi Sahalarının Yeşillendirilmesi', en: 'Greening the Derelict Industrial Sites', de: 'Begrünung der stillgelegten Industrieflächen' },
    description: { tr: 'Onlarca terk edilmiş fabrika sahası ya park haline getirilebilir ya da yeniden sanayiye açılabilir.', en: 'Dozens of derelict factory sites could become parks — or be reopened to industry.', de: 'Dutzende verlassene Fabrikgelände könnten zu Parks werden — oder wieder der Industrie geöffnet werden.' },
    choices: [
      {
        text: { tr: 'Parklara Dönüştür', en: 'Convert Them into Parks', de: 'In Parks umwandeln' },
        effects: { budget: -70, happiness: +15, cleanliness: +15 }
      },
      {
        text: { tr: 'Sanayiye Yeniden Aç', en: 'Reopen Them to Industry', de: 'Wieder für Industrie öffnen' },
        effects: { budget: +100, happiness: -5, cleanliness: -10 }
      }
    ]
  },

  // --- Rhine-Main (More) ---
  {
    id: 'rheinmain-flood-housing',
    regionId: 'rheinmain',
    title: { tr: 'Taşkın Ovasında Konut Baskısı', en: 'Housing Pressure on the Floodplain', de: 'Wohnungsdruck auf der Flussaue' },
    description: { tr: 'Konut kıtlığı geliştiricileri Ren\'in taşkın ovasına inşaat yapmaya itiyor.', en: "Housing shortages are pushing developers to build on the Rhine's floodplain.", de: 'Wohnungsmangel drängt Bauträger dazu, auf der Flussaue des Rheins zu bauen.' },
    choices: [
      {
        text: { tr: 'İnşaatı Yasakla', en: 'Ban Construction There', de: 'Bau dort verbieten' },
        effects: { budget: -20, happiness: -10, cleanliness: +15 }
      },
      {
        text: { tr: 'Sınırlı İnşaata İzin Ver', en: 'Allow Limited Construction', de: 'Begrenzten Bau erlauben' },
        effects: { budget: +100, happiness: +5, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'rheinmain-datacenter-cooling',
    regionId: 'rheinmain',
    title: { tr: 'Veri Merkezlerinin Su Talebi', en: "Data Centers' Water Demand", de: 'Wasserbedarf der Rechenzentren' },
    description: { tr: 'Frankfurt\'un devasa veri merkezleri soğutma için yerel su kaynaklarından büyük miktarda su çekiyor.', en: "Frankfurt's massive data centers are drawing huge amounts of water from local supplies for cooling.", de: 'Frankfurts riesige Rechenzentren entnehmen für die Kühlung große Mengen Wasser aus lokalen Quellen.' },
    choices: [
      {
        text: { tr: 'Su Çekimini Sınırla', en: 'Cap Their Water Usage', de: 'Wasserverbrauch begrenzen' },
        effects: { budget: -50, cleanliness: +15 }
      },
      {
        text: { tr: 'Sektörü Büyütmeye Devam Et', en: 'Keep Growing the Sector', de: 'Sektor weiter wachsen lassen' },
        effects: { budget: +90, cleanliness: -15 }
      }
    ]
  },

  // --- Bavaria (More) ---
  {
    id: 'bayern-urban-heat-munich',
    regionId: 'bayern',
    title: { tr: 'Münih\'te Kentsel Isı Adası', en: 'Urban Heat Island in Munich', de: 'Städtische Wärmeinsel in München' },
    description: { tr: 'Beton yüzeyler yaz sıcaklarını yükseltiyor, halk daha fazla gölgeli park istiyor.', en: 'Concrete surfaces are pushing up summer temperatures, and residents want more shaded parks.', de: 'Betonflächen treiben die Sommertemperaturen in die Höhe, die Bevölkerung fordert mehr schattige Parks.' },
    choices: [
      {
        text: { tr: 'Yeni Şehir Parkları Aç', en: 'Open New City Parks', de: 'Neue Stadtparks anlegen' },
        effects: { budget: -80, happiness: +15, cleanliness: +10 }
      },
      {
        text: { tr: 'Mevcut Planlamaya Devam Et', en: 'Stick with Current Planning', de: 'Bei bisheriger Planung bleiben' },
        effects: { budget: +10, happiness: -10 }
      }
    ]
  },
  {
    id: 'bayern-auto-supply-chain',
    regionId: 'bayern',
    title: { tr: 'Otomotiv Tedarik Zincirinin Emisyonları', en: "The Auto Supply Chain's Emissions", de: 'Die Emissionen der Automobil-Zulieferkette' },
    description: { tr: 'Bir otomobil devinin yerel tedarikçileri emisyon standartlarını karşılamakta zorlanıyor.', en: "A car giant's local suppliers are struggling to meet emissions standards.", de: 'Lokale Zulieferer eines Autoriesen haben Mühe, die Emissionsstandards zu erfüllen.' },
    choices: [
      {
        text: { tr: 'Tedarikçilere Geçiş Süresi Tanı', en: 'Give Suppliers a Transition Period', de: 'Zulieferern eine Übergangsfrist gewähren' },
        effects: { budget: -50, happiness: +10, cleanliness: +5 }
      },
      {
        text: { tr: 'Standartları Anında Uygula', en: 'Enforce Standards Immediately', de: 'Standards sofort durchsetzen' },
        effects: { budget: -20, happiness: -15, cleanliness: +20 }
      }
    ]
  },

  // --- Baden-Württemberg (More) ---
  {
    id: 'bw-lake-constance-quality',
    regionId: 'badenwuerttemberg',
    title: { tr: 'Constance Gölü\'nde Su Kalitesi', en: 'Water Quality in Lake Constance', de: 'Wasserqualität im Bodensee' },
    description: { tr: 'Tarımsal akış ve tekne trafiği içme suyu kaynağı olan gölü tehdit ediyor.', en: 'Agricultural runoff and boat traffic are threatening the lake that serves as a drinking water source.', de: 'Landwirtschaftliche Abflüsse und Bootsverkehr bedrohen den See, der als Trinkwasserquelle dient.' },
    choices: [
      {
        text: { tr: 'Tekne Trafiğini Sınırla', en: 'Restrict Boat Traffic', de: 'Bootsverkehr einschränken' },
        effects: { budget: -30, happiness: -10, cleanliness: +15 }
      },
      {
        text: { tr: 'Turizme Öncelik Ver', en: 'Prioritize Tourism', de: 'Tourismus priorisieren' },
        effects: { budget: +60, happiness: +10, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'bw-neckar-discharge',
    regionId: 'badenwuerttemberg',
    title: { tr: 'Neckar Nehri\'nde Sanayi Deşarjı', en: 'Industrial Discharge in the Neckar', de: 'Industrielle Einleitungen in den Neckar' },
    description: { tr: 'Bir kimya tesisi soğutma suyunu Neckar\'a normalden sıcak deşarj ediyor, balık ölümlerine yol açıyor.', en: 'A chemical plant is discharging cooling water into the Neckar hotter than normal, causing fish kills.', de: 'Eine Chemiefabrik leitet ihr Kühlwasser wärmer als üblich in den Neckar, was Fischsterben verursacht.' },
    choices: [
      {
        text: { tr: 'Deşarj Sıcaklığını Sınırla', en: 'Cap the Discharge Temperature', de: 'Einleitungstemperatur begrenzen' },
        effects: { budget: -60, happiness: +5, cleanliness: +20 }
      },
      {
        text: { tr: 'Tesisi Uyar, Devam Etsin', en: 'Warn the Plant, Let It Continue', de: 'Fabrik verwarnen, weiterlaufen lassen' },
        effects: { budget: +30, cleanliness: -15 }
      }
    ]
  },

  // --- Eastern Germany (Ost, More) ---
  {
    id: 'ost-wind-nimby',
    regionId: 'ost',
    title: { tr: 'Brandenburg\'da Rüzgar Türbini Direnişi', en: 'Wind Turbine Resistance in Brandenburg', de: 'Widerstand gegen Windräder in Brandenburg' },
    description: { tr: 'Köylüler yeni rüzgar türbinlerinin manzarayı ve mülk değerlerini bozacağını söyleyerek karşı çıkıyor.', en: 'Villagers are opposing new wind turbines, saying they will ruin the view and property values.', de: 'Dorfbewohner lehnen neue Windräder ab und befürchten, sie würden die Aussicht und Immobilienwerte beeinträchtigen.' },
    choices: [
      {
        text: { tr: 'Türbinlerin İnşasına Devam Et', en: 'Proceed with the Turbines', de: 'Windräder trotzdem bauen' },
        effects: { budget: +70, happiness: -15, cleanliness: +20 }
      },
      {
        text: { tr: 'Köylülerin İsteğine Uy, İptal Et', en: 'Bow to Villagers, Cancel It', de: 'Dorfbewohnern nachgeben, absagen' },
        effects: { budget: -20, happiness: +15, cleanliness: -5 }
      }
    ]
  },
  {
    id: 'ost-sandstone-tourism',
    regionId: 'ost',
    title: { tr: 'Elbe Kumtaşları\'nda Turizm Baskısı', en: 'Tourism Pressure in the Elbe Sandstone Mountains', de: 'Tourismusdruck im Elbsandsteingebirge' },
    description: { tr: 'Artan yürüyüşçü sayısı hassas kaya oluşumlarını ve patikaları aşındırıyor.', en: 'A growing number of hikers is eroding the fragile rock formations and trails.', de: 'Eine wachsende Zahl an Wanderern erodiert die empfindlichen Felsformationen und Wege.' },
    choices: [
      {
        text: { tr: 'Ziyaretçi Sayısını Sınırla', en: 'Limit Visitor Numbers', de: 'Besucherzahl begrenzen' },
        effects: { budget: -20, happiness: -10, cleanliness: +15 }
      },
      {
        text: { tr: 'Turizmi Sınırlama', en: "Don't Limit Tourism", de: 'Tourismus nicht einschränken' },
        effects: { budget: +50, happiness: +10, cleanliness: -10 }
      }
    ]
  },

  // --- Scotland (More) ---
  {
    id: 'scotland-oil-decommissioning',
    regionId: 'scotland',
    title: { tr: 'Kuzey Denizi Petrol Platformlarının Sökümü', en: 'North Sea Oil Rig Decommissioning', de: 'Rückbau der Nordsee-Ölplattformen' },
    description: { tr: 'Eski petrol platformlarının sökümü pahalı ama bırakılmaları deniz kirliliği riski taşıyor.', en: 'Decommissioning old oil rigs is expensive, but leaving them risks marine pollution.', de: 'Der Rückbau alter Ölplattformen ist teuer, doch sie stehenzulassen birgt das Risiko der Meeresverschmutzung.' },
    choices: [
      {
        text: { tr: 'Tam Sökümü Finanse Et', en: 'Fund Full Decommissioning', de: 'Vollständigen Rückbau finanzieren' },
        effects: { budget: -160, happiness: +10, cleanliness: +20 }
      },
      {
        text: { tr: 'Platformları Yerinde Bırak', en: 'Leave the Rigs in Place', de: 'Plattformen an Ort und Stelle belassen' },
        effects: { budget: +40, happiness: -10, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'scotland-peatland-restoration',
    regionId: 'scotland',
    title: { tr: 'Turbalık Restorasyonu', en: 'Peatland Restoration', de: 'Wiederherstellung der Moorlandschaften' },
    description: { tr: 'Bozulmuş turbalıkların restorasyonu karbon kredisi geliri sağlar ama koyun çiftçilerinin arazisini azaltır.', en: "Restoring degraded peatlands would earn carbon-credit revenue but shrink sheep farmers' land.", de: 'Die Wiederherstellung geschädigter Moore würde Einnahmen aus CO2-Zertifikaten bringen, aber das Land der Schafzüchter verkleinern.' },
    choices: [
      {
        text: { tr: 'Restorasyon Programını Başlat', en: 'Launch the Restoration Program', de: 'Wiederherstellungsprogramm starten' },
        effects: { budget: +40, happiness: -10, cleanliness: +20 }
      },
      {
        text: { tr: 'Çiftçi Arazisini Koru', en: "Protect the Farmers' Land", de: 'Land der Landwirte schützen' },
        effects: { budget: -10, happiness: +10, cleanliness: -5 }
      }
    ]
  },

  // --- Northern England (More) ---
  {
    id: 'ne-bus-fleet-emissions',
    regionId: 'northern-england',
    title: { tr: 'Otobüs Filosu Emisyonları', en: 'The Bus Fleet Emissions', de: 'Die Emissionen der Busflotte' },
    description: { tr: 'Şehrin dizel otobüs filosu hava kalitesi hedeflerine ulaşmayı engelliyor.', en: "The city's diesel bus fleet is blocking progress toward air-quality targets.", de: 'Die Dieselbusflotte der Stadt verhindert Fortschritte bei den Luftqualitätszielen.' },
    choices: [
      {
        text: { tr: 'Elektrikli Otobüslere Geç', en: 'Switch to Electric Buses', de: 'Auf Elektrobusse umsteigen' },
        effects: { budget: -130, happiness: +10, cleanliness: +20 }
      },
      {
        text: { tr: 'Filoyu Olduğu Gibi Kullanmaya Devam Et', en: 'Keep Running the Fleet As Is', de: 'Flotte unverändert weiterbetreiben' },
        effects: { budget: +20, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'ne-moorland-wildfire',
    regionId: 'northern-england',
    title: { tr: 'Bozkırda Yangın Riski', en: 'Wildfire Risk on the Moors', de: 'Waldbrandgefahr im Moorland' },
    description: { tr: 'Kurak bir yaz, Pennine bozkırlarında yangın riskini artırıyor ve turba yataklarını tehdit ediyor.', en: 'A dry summer is raising wildfire risk on the Pennine moors, threatening peat deposits.', de: 'Ein trockener Sommer erhöht die Waldbrandgefahr in den Pennine-Mooren und bedroht die Torfvorkommen.' },
    choices: [
      {
        text: { tr: 'Yangın Devriyelerini Artır', en: 'Increase Fire Patrols', de: 'Feuerwachen verstärken' },
        effects: { budget: -50, happiness: +5, cleanliness: +10 }
      },
      {
        text: { tr: 'Riski Göz Ardı Et', en: 'Ignore the Risk', de: 'Risiko ignorieren' },
        effects: { happiness: -15, cleanliness: -15 }
      }
    ]
  },

  // --- Midlands (More) ---
  {
    id: 'midlands-hs2-disruption',
    regionId: 'midlands',
    title: { tr: 'Yüksek Hızlı Tren İnşaatının Bozduğu Doğa', en: 'High-Speed Rail Construction Disruption', de: 'Störungen durch den Hochgeschwindigkeitsbahnbau' },
    description: { tr: 'Yeni yüksek hızlı demiryolu hattının inşaatı eski ormanlık alanları kesip geçiyor.', en: 'Construction of the new high-speed rail line is cutting through ancient woodland.', de: 'Der Bau der neuen Hochgeschwindigkeitsstrecke durchschneidet alten Waldbestand.' },
    choices: [
      {
        text: { tr: 'Güzergahı Değiştir (Ekstra Maliyet)', en: 'Reroute It (Extra Cost)', de: 'Streckenverlauf ändern (Mehrkosten)' },
        effects: { budget: -100, happiness: +10, cleanliness: +15 }
      },
      {
        text: { tr: 'Mevcut Güzergaha Devam Et', en: 'Proceed with the Current Route', de: 'Bei aktueller Streckenführung bleiben' },
        effects: { budget: +50, happiness: -10, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'midlands-tree-canopy-loss',
    regionId: 'midlands',
    title: { tr: 'Kentsel Ağaç Örtüsü Kaybı', en: 'Urban Tree Canopy Loss', de: 'Verlust der städtischen Baumkronen' },
    description: { tr: 'Yol genişletme çalışmaları Birmingham\'ın cadde ağaçlarının çoğunu kesiyor.', en: "Road-widening works are felling much of Birmingham's street tree canopy.", de: 'Straßenausbauarbeiten fällen einen Großteil von Birminghams Straßenbäumen.' },
    choices: [
      {
        text: { tr: 'Yerine Yeni Ağaç Dik', en: 'Replant to Compensate', de: 'Zum Ausgleich neu bepflanzen' },
        effects: { budget: -40, happiness: +10, cleanliness: +10 }
      },
      {
        text: { tr: 'Yol Genişletmesine Öncelik Ver', en: 'Prioritize the Road Widening', de: 'Straßenausbau priorisieren' },
        effects: { budget: +60, happiness: -10, cleanliness: -10 }
      }
    ]
  },

  // --- Wales (More) ---
  {
    id: 'wales-cardiff-bay-barrage',
    regionId: 'wales',
    title: { tr: 'Cardiff Körfezi Bariyeri ve Vahşi Yaşam', en: 'The Cardiff Bay Barrage and Wildlife', de: 'Die Cardiff-Bay-Sperre und die Tierwelt' },
    description: { tr: 'Körfez bariyeri tatlı su gölünü korur ama göçmen kuşların beslenme alanlarını ortadan kaldırdı.', en: 'The bay barrage preserves a freshwater lagoon but has eliminated feeding grounds for migratory birds.', de: 'Die Buchtsperre erhält eine Süßwasserlagune, hat aber die Nahrungsgründe für Zugvögel zerstört.' },
    choices: [
      {
        text: { tr: 'Alternatif Habitat Oluştur', en: 'Create an Alternative Habitat', de: 'Alternativen Lebensraum schaffen' },
        effects: { budget: -70, happiness: +5, cleanliness: +15 }
      },
      {
        text: { tr: 'Bariyeri Olduğu Gibi Bırak', en: 'Leave the Barrage As Is', de: 'Sperre unverändert lassen' },
        effects: { budget: +30, happiness: +5, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'wales-offshore-wind-fishing',
    regionId: 'wales',
    title: { tr: 'Kıyı Rüzgar Çiftliği ve Balıkçılık Anlaşmazlığı', en: 'Offshore Wind Farm vs. Fishing Grounds', de: 'Offshore-Windpark gegen Fanggründe' },
    description: { tr: 'Galler kıyısına önerilen bir rüzgar çiftliği balıkçı teknelerinin geleneksel avlanma alanlarını kapatacak.', en: 'A proposed wind farm off the Welsh coast would close off traditional fishing grounds for local boats.', de: 'Ein geplanter Windpark vor der walisischen Küste würde traditionelle Fanggründe für örtliche Boote sperren.' },
    choices: [
      {
        text: { tr: 'Rüzgar Çiftliğini Onayla', en: 'Approve the Wind Farm', de: 'Windpark genehmigen' },
        effects: { budget: +80, happiness: -15, cleanliness: +20 }
      },
      {
        text: { tr: 'Balıkçı Bölgelerini Koru', en: 'Protect the Fishing Grounds', de: 'Fanggründe schützen' },
        effects: { budget: -20, happiness: +15, cleanliness: -5 }
      }
    ]
  },

  // --- Southern England (More) ---
  {
    id: 'se-new-forest-roads',
    regionId: 'southern-england',
    title: { tr: 'New Forest\'ta Yol Genişletmesi', en: 'Road Widening Through the New Forest', de: 'Straßenausbau durch den New Forest' },
    description: { tr: 'Trafik sıkışıklığını azaltmak için önerilen bir yol genişletmesi eski koruluk alanını kesecek.', en: 'A proposed road widening to ease congestion would cut through ancient woodland.', de: 'Ein geplanter Straßenausbau zur Entlastung des Verkehrs würde durch alten Waldbestand führen.' },
    choices: [
      {
        text: { tr: 'Ormanı Koru, Genişletmeyi İptal Et', en: 'Protect the Forest, Cancel the Widening', de: 'Wald schützen, Ausbau absagen' },
        effects: { budget: -30, happiness: +10, cleanliness: +15 }
      },
      {
        text: { tr: 'Genişletmeye Devam Et', en: 'Proceed with the Widening', de: 'Ausbau fortsetzen' },
        effects: { budget: +70, happiness: -10, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'se-chalk-stream-abstraction',
    regionId: 'southern-england',
    title: { tr: 'Tebeşir Derelerinden Aşırı Su Çekimi', en: 'Overabstraction from the Chalk Streams', de: 'Übermäßige Wasserentnahme aus den Kalkbächen' },
    description: { tr: 'Su şirketlerinin nadir tebeşir derelerinden çektiği su seviyeleri tehlikeli derecede düşürüyor.', en: "Water companies' abstraction from the rare chalk streams is dropping levels to dangerous lows.", de: 'Die Wasserentnahme der Versorger aus den seltenen Kalkbächen senkt die Pegel auf gefährlich niedrige Werte.' },
    choices: [
      {
        text: { tr: 'Su Çekimini Sınırla', en: 'Limit the Abstraction', de: 'Wasserentnahme begrenzen' },
        effects: { budget: -60, happiness: -5, cleanliness: +20 }
      },
      {
        text: { tr: 'Su Şirketlerine Karışma', en: "Don't Interfere with Water Companies", de: 'Wasserversorger nicht einschränken' },
        effects: { budget: +40, cleanliness: -15 }
      }
    ]
  },

  // --- Northern Ireland (More) ---
  {
    id: 'ni-peatbog-turf-cutting',
    regionId: 'northern-ireland',
    title: { tr: 'Turba Bataklığı Kesim Anlaşmazlığı', en: 'Peat Bog Turf-Cutting Dispute', de: 'Streit ums Torfstechen im Moor' },
    description: { tr: 'Geleneksel turba kesimi yakıt sağlıyor ama korunan bataklık habitatını yok ediyor.', en: 'Traditional turf-cutting provides fuel but is destroying protected bog habitat.', de: 'Traditionelles Torfstechen liefert Brennstoff, zerstört aber geschütztes Moorhabitat.' },
    choices: [
      {
        text: { tr: 'Kesimi Yasakla', en: 'Ban the Turf-Cutting', de: 'Torfstechen verbieten' },
        effects: { budget: -20, happiness: -15, cleanliness: +20 }
      },
      {
        text: { tr: 'Geleneği Koru', en: 'Preserve the Tradition', de: 'Tradition bewahren' },
        effects: { budget: +10, happiness: +10, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'ni-antrim-wind-land-dispute',
    regionId: 'northern-ireland',
    title: { tr: 'Antrim\'de Rüzgar Çiftliği Arazi Anlaşmazlığı', en: 'Wind Farm Land Dispute in Antrim', de: 'Landstreit um Windpark in Antrim' },
    description: { tr: 'Bir çiftlik arazisi üzerine kurulacak rüzgar türbinleri komşu araziler için tazminat anlaşmazlığına yol açtı.', en: 'Wind turbines planned for a farm have sparked a compensation dispute with neighboring landowners.', de: 'Geplante Windräder auf einem Bauernhof haben einen Entschädigungsstreit mit benachbarten Landbesitzern ausgelöst.' },
    choices: [
      {
        text: { tr: 'Komşulara Tazminat Öde', en: 'Compensate the Neighbors', de: 'Nachbarn entschädigen' },
        effects: { budget: -50, happiness: +15, cleanliness: +10 }
      },
      {
        text: { tr: 'Türbinlere İzin Ver, Anlaşmazlığı Yoksay', en: 'Approve the Turbines, Ignore the Dispute', de: 'Windräder genehmigen, Streit ignorieren' },
        effects: { budget: +60, happiness: -10, cleanliness: +15 }
      }
    ]
  }
];
