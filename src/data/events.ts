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
  }
];
