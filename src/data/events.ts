import type { GameEvent } from '../types';

export const EVENTS: GameEvent[] = [
  // --- Genel Olaylar ---
  {
    id: 'factory-waste',
    title: { tr: 'Kaçak Atık Dökümü', en: 'Illegal Waste Dumping', de: 'Illegale Müllentsorgung' },
    description: { tr: 'Yerel bir fabrika maliyetleri düşürmek için atıklarını arıtmadan nehre döküyor.', en: 'A local factory is dumping untreated waste into the river to cut costs.', de: 'Eine örtliche Fabrik leitet ungeklärte Abwässer in den Fluss, um Kosten zu sparen.' },
    location: { provinces: [], nationwide: true },
    tags: { pollution: ['water', 'waste'] },
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
    location: { provinces: [], nationwide: true },
    tags: { pollution: ['waste', 'marine', 'landuse'] },
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
    location: { provinces: [], nationwide: true },
    tags: { pollution: ['hazard', 'air'] },
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
    title: { tr: 'Plastik Poşet Tartışması', en: 'The Plastic Bag Debate', de: 'Streit um die Plastiktüte' },
    description: { tr: "Marketler ücretsiz poşet dağıtmaya devam etmek istiyor. Türkiye 1 Ocak 2019'da poşeti ücretli yaptı (25 kuruş) ve Bakanlık ilk yıllarda kullanımın yaklaşık %75 azaldığını açıkladı.", en: 'Supermarkets want to keep handing out free bags. Turkey introduced a charge of 25 kuruş per bag on 1 January 2019, and the ministry reported use falling by roughly 75% in the first years.', de: 'Supermärkte wollen weiter kostenlose Tüten ausgeben. Die Türkei führte am 1. Januar 2019 ein Entgelt von 25 Kuruş ein; das Ministerium meldete in den ersten Jahren rund 75% weniger Verbrauch.' },
    location: { provinces: [], nationwide: true },
    tags: { pollution: ['waste'], mechanisms: ['price-signal'] },
    sources: [
      { label: 'CNN Türk: ücretli poşet uygulaması ve kullanımdaki düşüş', url: 'https://www.cnnturk.com/ekonomi/turkiye/market-posetinin-incelikleri-kullanimi-hizla-azaliyor-ama-suistimallere-dikkat-991386', status: 'partly-verified' },
      { label: 'Diken: poşet kullanımı yüzde 75 düştü (Bakanlık verisi)', url: 'https://www.diken.com.tr/?p=1010769', status: 'partly-verified' }
    ],
    choices: [
      {
        text: { tr: 'Tam Yasak Uygula', en: 'Enforce a Full Ban', de: 'Vollständiges Verbot durchsetzen' },
        effects: { budget: -40, happiness: -10, cleanliness: +25 },
        outcome: {
          what: { tr: 'Poşet raftan kalktı; bez çanta satışı arttı, denetim maliyeti ve esnaf tepkisi de arttı.', en: 'Bags disappeared from the counter: cloth bag sales rose, and so did enforcement costs and shopkeeper anger.', de: 'Die Tüte verschwand: Stoffbeutel verkauften sich besser, Kontrollkosten und Ärger im Handel stiegen ebenso.' },
          why: { tr: 'Yasak en hızlı düşüşü verir ama en çok direnci ve denetim yükünü de getirir; kayıt dışı dağıtım bu yüzden sık görülür.', en: 'A ban delivers the fastest drop but also the most resistance and the heaviest enforcement load, which is why informal hand-outs are common.', de: 'Ein Verbot wirkt am schnellsten, erzeugt aber den meisten Widerstand und Kontrollaufwand; informelle Ausgabe ist deshalb häufig.' }
        }
      },
      {
        text: { tr: 'Ücretlendir ve Denetle', en: 'Charge a Fee and Regulate', de: 'Entgelt erheben und kontrollieren' },
        effects: { budget: +30, happiness: -5, cleanliness: +15 },
        outcome: {
          what: { tr: 'Poşet 25 kuruş oldu; kullanım hızla düştü ve ücretin bir kısmı geri dönüşüm payı olarak bütçeye geldi.', en: 'Bags went to 25 kuruş: use fell quickly and part of the fee came into the budget as a recycling contribution.', de: 'Die Tüte kostete 25 Kuruş: Der Verbrauch sank rasch, ein Teil des Entgelts floss als Recyclingbeitrag in den Haushalt.' },
          why: { tr: 'Küçük ama görünür bir fiyat, kararı tam alışveriş anına taşır. Türkiye\'de gerçek uygulama da budur ve ilk yıllarda kullanımın yaklaşık %75 azaldığı bildirildi: davranış değişimi için yasak şart değil.', en: 'A small but visible price moves the decision to the moment of shopping. This is what Turkey actually did, and use reportedly fell by about 75% in the first years: changing behaviour did not require a ban.', de: 'Ein kleiner, sichtbarer Preis verlegt die Entscheidung in den Einkaufsmoment. Genau das tat die Türkei, der Verbrauch sank in den ersten Jahren um etwa 75%: Verhaltensänderung braucht kein Verbot.' }
        }
      },
      {
        text: { tr: 'Sektörü Serbest Bırak', en: 'Leave the Industry Unregulated', de: 'Branche unreguliert lassen' },
        effects: { budget: +10, happiness: +5, cleanliness: -15 },
        outcome: {
          what: { tr: 'Poşet ücretsiz kaldı, kimse şikayet etmedi ve dere ağızlarında biriken plastik arttı.', en: 'Bags stayed free, nobody complained, and the plastic piling up at stream mouths grew.', de: 'Die Tüten blieben gratis, niemand beschwerte sich, und der Plastikmüll an den Bachmündungen nahm zu.' },
          why: { tr: 'Ücretsiz poşetin maliyeti kaybolmaz, yalnızca görünmez olur: toplama, temizlik ve kıyıda kalan plastik olarak topluma geri döner.', en: 'The cost of a free bag does not disappear, it only becomes invisible: it returns as collection, clean-up and plastic left on the shore.', de: 'Die Kosten der Gratistüte verschwinden nicht, sie werden unsichtbar: Sie kehren als Sammlung, Reinigung und Strandplastik zurück.' }
        }
      }
    ]
  },
  {
    id: 'solar-incentive',
    title: { tr: 'Güneş Enerjisi Teşviki', en: 'Solar Energy Incentive', de: 'Förderung für Solarenergie' },
    description: { tr: 'Uluslararası bir fon güneş tarlası için hibe veriyor ama arazi istiyor. Panel elektrik üretir; aynı dönümde o yıl yiyecek üretilmez. Bu bir kirlilik sorunu değil, arazi kullanımı tercihidir.', en: 'An international fund is offering a grant for a solar farm, but it wants land. Panels make electricity; the same field grows no food that year. This is a land-use choice rather than a pollution problem.', de: 'Ein internationaler Fonds bietet Zuschüsse für einen Solarpark, verlangt aber Fläche. Module erzeugen Strom; dasselbe Feld liefert in dem Jahr keine Nahrung. Das ist eine Flächennutzungsfrage, kein Verschmutzungsproblem.' },
    location: { provinces: [], nationwide: true },
    tags: { pollution: ['energy', 'landuse'] },
    choices: [
      {
        text: { tr: 'Tarım Arazisine Kur', en: 'Build on Farmland', de: 'Auf Ackerland bauen' },
        effects: { budget: +100, happiness: -10, cleanliness: +10 }
      },
      {
        text: { tr: 'Çorak Araziye ve Çatılara Kur', en: 'Build on Barren Land and Rooftops', de: 'Auf Ödland und Dächern bauen' },
        effects: { budget: -20, happiness: -5, cleanliness: +15 }
      },
      {
        text: { tr: 'Teklifi Reddet', en: 'Turn the Offer Down', de: 'Angebot ablehnen' },
        effects: { budget: 0, happiness: 0, cleanliness: -5 }
      }
    ]
  },
  {
    id: 'ewaste-dump',
    title: { tr: 'Elektronik Atık Krizi', en: 'E-Waste Crisis', de: 'Elektroschrott-Krise' },
    description: { tr: 'Çöp sahasına giden elektronik atıktaki kurşun ve ağır metaller toprağa ve suya sızıyor. Metal ayırmak için açıkta yakma yöntemi ise aynı metalleri doğrudan havaya veriyor.', en: 'Lead and heavy metals in the e-waste going to landfill are leaching into soil and water, while open burning to recover metals puts those same metals straight into the air.', de: 'Blei und Schwermetalle aus dem Elektroschrott auf der Deponie sickern in Boden und Wasser; offenes Verbrennen zur Metallgewinnung bringt dieselben Metalle direkt in die Luft.' },
    location: { provinces: [], nationwide: true },
    tags: { pollution: ['waste', 'soil', 'air'], mechanisms: ['pollution-displacement'] },
    sources: [
      { label: 'Basel Sözleşmesi sekretaryası: elektronik atığın gizli maliyeti', url: 'https://www.brsmeas.org/?tabid=7717', status: 'verified' },
      { label: 'PRB: e-atığın insan ve çevre üzerindeki etkileri', url: 'https://www.prb.org/resources/the-human-and-environmental-effects-of-e-waste/', status: 'verified' }
    ],
    choices: [
      {
        text: { tr: 'Toplama ve Geri Dönüşüm Tesisi Kur', en: 'Build Collection and Recycling', de: 'Sammlung und Recycling aufbauen' },
        effects: { budget: -80, happiness: +10, cleanliness: +15 },
        outcome: {
          what: { tr: 'Cihazlar kayıtlı tesiste sökülmeye başladı; metaller geri kazanıldı, çöp sahasına giden yük azaldı.', en: 'Devices began to be dismantled at a licensed facility: metals were recovered and less waste reached the landfill.', de: 'Geräte wurden in einer zugelassenen Anlage zerlegt: Metalle zurückgewonnen, weniger Last auf der Deponie.' },
          why: { tr: 'Elektronik atık aslında yoğun bir metal kaynağıdır. Kontrollü sökümde aynı metaller gelir getirir; kontrolsüz yakmada ise solunan havaya karışır.', en: 'E-waste is in fact a dense source of metals. Dismantled under control, those metals earn money; burned without control, they end up in the air people breathe.', de: 'Elektroschrott ist tatsächlich eine dichte Metallquelle. Kontrolliert zerlegt bringen die Metalle Erlöse; unkontrolliert verbrannt landen sie in der Atemluft.' }
        }
      },
      {
        text: { tr: 'Yurt Dışına İhraç Et', en: 'Export It Abroad', de: 'Ins Ausland exportieren' },
        effects: { budget: +40, happiness: -5, cleanliness: 0 },
        delayed: [
          {
            inDays: 15,
            effects: { budget: -30, happiness: -8 },
            message: { tr: 'İhraç edilen atık sınırda durduruldu: iade ve ceza masrafı çıktı.', en: 'The exported waste was stopped at the border: it came back, with a fine attached.', de: 'Der exportierte Abfall wurde an der Grenze gestoppt: Rückführung samt Strafe.' }
          }
        ],
        outcome: {
          what: { tr: 'Atık gemiye yüklendi ve kasaya para girdi; yerel çöp sahası olduğu gibi kaldı.', en: 'The waste was loaded onto a ship and money came in; the local landfill stayed exactly as it was.', de: 'Der Abfall ging aufs Schiff und Geld kam herein; die lokale Deponie blieb unverändert.' },
          why: { tr: 'İhracat kirliliği yok etmez, taşır. Tehlikeli atığın sınır ötesi hareketi Basel Sözleşmesi\'ne göre alıcı ülkenin önceden bilgilendirilmiş onayını gerektirir ve sevkiyatlar sıkça "ikinci el" diye beyan edilir; varış yerindeki enformel geri kazanımda işçiler kurşuna ve yanma dumanına maruz kalır.', en: 'Export moves pollution rather than removing it. Transboundary movement of hazardous waste requires the receiving country\'s prior informed consent under the Basel Convention, and shipments are often declared as second-hand goods; at the destination, informal recovery exposes workers to lead and burning fumes.', de: 'Export beseitigt die Verschmutzung nicht, er verlagert sie. Grenzüberschreitende Verbringung gefährlicher Abfälle verlangt nach der Basler Konvention die vorherige Zustimmung des Empfängerlandes; Sendungen werden oft als Gebrauchtware deklariert, und am Ziel setzt informelle Verwertung Arbeiter Blei und Brandrauch aus.' }
        }
      },
      {
        text: { tr: 'Üreticiye Geri Alma Yükümlülüğü Getir', en: 'Make Producers Take Devices Back', de: 'Rücknahmepflicht für Hersteller' },
        effects: { budget: -20, happiness: -5, cleanliness: +18 },
        outcome: {
          what: { tr: 'Satış noktaları eski cihazı geri almaya başladı; maliyet ürün fiyatına yansıdı, toplama oranı yükseldi.', en: 'Shops started taking old devices back: the cost showed up in prices and collection rates rose.', de: 'Händler nahmen Altgeräte zurück: Die Kosten landeten im Preis, die Sammelquote stieg.' },
          why: { tr: 'Toplamanın maliyeti bir yerde duruyor. Üreticiye verildiğinde, cihazı sökülebilir ve geri kazanılabilir tasarlamak şirketin kendi çıkarına dönüşür.', en: 'The cost of collection always sits somewhere. Put on the producer, designing devices to be taken apart and recovered becomes the company\'s own interest.', de: 'Die Sammelkosten liegen immer irgendwo. Beim Hersteller wird es zu dessen eigenem Interesse, Geräte zerlegbar und verwertbar zu konstruieren.' }
        }
      }
    ]
  },

  // --- MARMARA BÖLGESİ EKLEMELERİ ---
  {
    id: 'marmara-urban-renewal',
    regionId: 'marmara',
    title: { tr: 'Yıkımda Asbest Riski', en: 'Asbestos in the Demolition', de: 'Asbest beim Abriss' },
    description: { tr: "İstanbul'da riskli binaların yıkımı hızlanıyor. Eski yapı stokunda çatı levhası, boru ve yalıtımda asbest bulunabiliyor; kuru yıkım lifleri doğrudan havaya veriyor.", en: 'Demolition of at-risk buildings in Istanbul is speeding up. Older building stock can contain asbestos in roof sheets, pipes and insulation, and dry demolition puts the fibres straight into the air.', de: 'Der Abriss einsturzgefährdeter Gebäude in Istanbul beschleunigt sich. Alte Bausubstanz kann Asbest in Dachplatten, Rohren und Dämmung enthalten; trockener Abriss setzt die Fasern direkt frei.' },
    location: { provinces: ['İstanbul'] },
    tags: { pollution: ['air', 'waste', 'hazard'], mechanisms: ['asbestos-fibre-release'] },
    sources: [
      { label: 'Dünya: enkaz ve yıkımlarda asbest uyarısı, söküm uzmanları', url: 'https://www.dunya.com/gundem/enkaz-bolgesi-tehlike-saciyor-yikimlar-izlenmemeli-haberi-686563', status: 'partly-verified' },
      { label: 'BirGün: TMMOB ve tabip odalarından asbest uyarısı', url: 'https://www.birgun.net/haber/tmmob-den-deprem-bolgesi-icin-asbest-uyarisi-421911', status: 'partly-verified' }
    ],
    choices: [
      {
        text: { tr: 'Yıkımları Hızlandır', en: 'Speed Up the Demolitions', de: 'Abrisse beschleunigen' },
        effects: { budget: -50, happiness: -15, cleanliness: -15 },
        delayed: [
          {
            inDays: 22,
            effects: { happiness: -10 },
            message: { tr: 'Yıkım yapılan mahallede solunum yolu şikayetleri arttı.', en: 'Respiratory complaints have risen in the demolition neighbourhood.', de: 'Im Abrissviertel häufen sich Atemwegsbeschwerden.' }
          }
        ],
        outcome: {
          what: { tr: 'Binalar hızla indi; çevredeki sokaklarda toz şikayetleri ve lif maruziyeti arttı.', en: 'The buildings came down fast, and dust complaints and fibre exposure rose in the surrounding streets.', de: 'Die Gebäude fielen schnell, Staubbeschwerden und Faserbelastung in den Straßen nahmen zu.' },
          why: { tr: 'Asbest ancak havalanınca tehlikelidir. Kuru yıkım molozdaki lifi solunabilir hale getirir ve etkisi yıllar sonra akciğer hastalığı olarak ortaya çıkar.', en: 'Asbestos is dangerous once it becomes airborne. Dry demolition makes the fibres in the rubble breathable, and the effect shows up years later as lung disease.', de: 'Asbest ist gefährlich, sobald er in die Luft gelangt. Trockener Abriss macht die Fasern einatembar; die Folgen zeigen sich Jahre später als Lungenerkrankung.' }
        }
      },
      {
        text: { tr: 'Önce Asbest Tespiti, Sonra Islak Söküm', en: 'Survey for Asbestos First, Then Wet Removal', de: 'Erst Asbesterkundung, dann Nassentfernung' },
        effects: { budget: -120, happiness: +5, cleanliness: +10 },
        outcome: {
          what: { tr: 'Yıkım ruhsatından önce tespit raporu ve lisanslı söküm zorunlu oldu; program yavaşladı, maliyet arttı, lif ölçümleri düşük kaldı.', en: 'A survey report and licensed removal became mandatory before any demolition permit: the programme slowed, costs rose, and fibre readings stayed low.', de: 'Vor jeder Abrissgenehmigung wurden Gutachten und lizenzierter Rückbau Pflicht: langsamer, teurer, aber die Fasermesswerte blieben niedrig.' },
          why: { tr: 'Meslek odalarının önerdiği sıra budur: önce asbest envanteri, sonra lisanslı söküm, yıkım sırasında sulama ve FFP3 maske. Lif havaya karışmadan alınırsa risk kaynağında biter.', en: 'This is the order the professional chambers call for: inventory first, then licensed removal, with wetting and FFP3 masks during demolition. Capture the fibre before it flies and the risk ends at source.', de: 'Genau diese Reihenfolge fordern die Kammern: erst Inventar, dann lizenzierter Rückbau, beim Abriss Benetzung und FFP3-Masken. Wird die Faser vorher gebunden, endet das Risiko an der Quelle.' }
        }
      },
      {
        text: { tr: 'Sadece Toz Bariyeri Kur', en: 'Just Put Up Dust Barriers', de: 'Nur Staubschutzwände aufstellen' },
        effects: { budget: -70, happiness: +5, cleanliness: -5 },
        outcome: {
          what: { tr: 'Branda ve su perdesi görünür tozu azalttı, şikayetler düştü; asbest sorunu olduğu yerde kaldı.', en: 'Sheeting and water curtains cut the visible dust and the complaints, while the asbestos problem stayed exactly where it was.', de: 'Planen und Wasserschleier verringerten sichtbaren Staub und Beschwerden; das Asbestproblem blieb unverändert.' },
          why: { tr: 'Bariyer iri tozu tutar, asbest lifini değil. Görünür kirlilik ile sağlık riski aynı şey değildir.', en: 'A barrier holds back coarse dust, not asbestos fibres. Visible pollution and health risk are not the same thing.', de: 'Eine Barriere hält groben Staub zurück, keine Asbestfasern. Sichtbare Verschmutzung und Gesundheitsrisiko sind nicht dasselbe.' }
        }
      }
    ]
  },
  {
    id: 'thrace-sunflower',
    regionId: 'marmara',
    title: { tr: 'Ayçiçeği Tarlalarında Sanayi', en: 'Industry in Sunflower Fields', de: 'Industrie in den Sonnenblumenfeldern' },
    description: { tr: 'Trakya\'daki verimli ayçiçeği tarlalarına yeni bir organize sanayi bölgesi kurulmak isteniyor.', en: 'A new organized industrial zone is planned on Thrace’s fertile sunflower fields.', de: 'Auf den fruchtbaren Sonnenblumenfeldern Thrakiens soll ein neues Industriegebiet entstehen.' },
    location: { provinces: ['Tekirdağ', 'Edirne', 'Kırklareli'] },
    tags: { pollution: ['landuse', 'air'] },
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
    id: 'aegean-wind-siting',
    regionId: 'aegean',
    title: { tr: 'Rüzgar Santrali Nereye Kurulsun?', en: 'Where Should the Wind Farm Go?', de: 'Wohin mit dem Windpark?' },
    description: { tr: "Ege'de yeni bir rüzgar santralinin yeri tartışılıyor. Rüzgar düşük karbonludur; etkisi büyük ölçüde nereye kurulduğuna bağlıdır. Türkiye'nin belgelenmiş süzülen kuş göç boğazları Boğaziçi, Borçka ve Hatay-Belen'dir.", en: 'The site for a new Aegean wind farm is under debate. Wind power is low-carbon; its impact depends mostly on where it is built. Turkey\'s documented soaring-bird bottlenecks are the Bosphorus, Borçka and Belen in Hatay.', de: 'Der Standort eines neuen Windparks in der Ägäis wird diskutiert. Windkraft ist kohlenstoffarm; ihre Wirkung hängt vor allem vom Standort ab. Die belegten Zugengpässe der Segelvögel sind Bosporus, Borçka und Belen in Hatay.' },
    location: { provinces: ['İzmir', 'Manisa'] },
    tags: { pollution: ['energy', 'biodiversity', 'landuse'], mechanisms: ['siting'] },
    sources: [
      { label: 'Belen Geçidi süzülen kuş göçü sayımı, ilkbahar 2015 (Niğde ÖHÜ arşivi)', url: 'https://acikerisim.ohu.edu.tr/items/5f224e34-2217-4813-b497-6aedd243adb6', status: 'verified' }
    ],
    choices: [
      {
        text: { tr: 'Planlandığı Gibi Onayla', en: 'Approve It as Planned', de: 'Wie geplant genehmigen' },
        // Energy gain and habitat loss cancel on the one bar we have: the cost of
        // skipping the survey is real but unmeasured, which is the point.
        effects: { budget: +60, happiness: +5, cleanliness: 0 },
        delayed: [
          {
            inDays: 14,
            effects: { cleanliness: -8 },
            message: { tr: 'Göç mevsiminde türbinlerin altında kuş kayıpları bildirildi.', en: 'Bird losses have been reported under the turbines during the migration season.', de: 'In der Zugzeit wurden Vogelverluste unter den Turbinen gemeldet.' }
          }
        ],
        outcome: {
          what: { tr: 'Türbinler kuruldu ve bölgeye düşük karbonlu elektrik geldi; kuş ve habitat etkisi hiç ölçülmedi.', en: 'The turbines went up and the region gained low-carbon electricity, with the effect on birds and habitat never measured.', de: 'Die Turbinen entstanden und die Region bekam kohlenstoffarmen Strom; die Wirkung auf Vögel und Lebensraum wurde nie gemessen.' },
          why: { tr: 'Ölçülmeyen etki yok sayılmış olmaz. Saha öncesi göç ve habitat etüdü yapılmadığında risk ortadan kalkmaz, yalnızca görünmez olur.', en: 'An impact you do not measure has not been avoided. Without a pre-construction migration and habitat survey the risk is not removed, only made invisible.', de: 'Eine nicht gemessene Wirkung ist keine vermiedene Wirkung. Ohne vorherige Zug- und Habitatstudie verschwindet das Risiko nicht, es wird nur unsichtbar.' }
        }
      },
      {
        text: { tr: 'Önce Bir Yıllık Kuş ve Habitat Etüdü', en: 'Run a Year of Bird and Habitat Surveys First', de: 'Zuerst ein Jahr Vogel- und Habitatstudie' },
        effects: { budget: -50, happiness: +5, cleanliness: +15 },
        outcome: {
          what: { tr: 'Proje bir yıl gecikti; etüt sonucuna göre birkaç türbinin yeri değişti ve santral kuruldu.', en: 'The project slipped by a year; the survey moved a handful of turbines and the farm was built.', de: 'Das Projekt verzögerte sich um ein Jahr; die Studie verschob einige Turbinen, der Park wurde gebaut.' },
          why: { tr: 'Göç birkaç hafta içinde yoğunlaşır ve belirli hatlarda akar. Bu hatlar bilinirse etkinin büyük kısmı birkaç türbinin yerini değiştirerek önlenebilir; bilinmezse önlenemez.', en: 'Migration concentrates into a few weeks and follows specific lines. Once you know those lines, most of the impact can be avoided by moving a few turbines; without them, it cannot.', de: 'Der Zug bündelt sich auf wenige Wochen und feste Linien. Kennt man sie, lässt sich der Großteil der Wirkung durch das Versetzen weniger Turbinen vermeiden, sonst nicht.' }
        }
      },
      {
        text: { tr: 'Projeyi İptal Et', en: 'Cancel the Project', de: 'Projekt absagen' },
        effects: { budget: -20, happiness: -10, cleanliness: -5 },
        outcome: {
          what: { tr: 'Proje rafa kalktı; bölgenin elektriği mevcut santrallerden gelmeye devam etti.', en: 'The project was shelved and the region kept drawing its power from the existing plants.', de: 'Das Projekt wurde gestoppt; die Region bezog ihren Strom weiter aus den bestehenden Kraftwerken.' },
          why: { tr: 'İptal, elektrik ihtiyacını ortadan kaldırmaz. Açık çoğunlukla mevcut üretimle, yani ağırlıklı fosil kaynakla kapanır: karşılaştırma "santral mi, hiçbir şey mi" değil, "hangi santral" sorusudur.', en: 'Cancelling does not remove the demand. The gap is usually filled by existing, mostly fossil generation: the comparison is never plant versus nothing, it is which plant.', de: 'Eine Absage beseitigt den Bedarf nicht. Die Lücke füllt meist der bestehende, überwiegend fossile Kraftwerkspark: Die Frage lautet nie Kraftwerk oder nichts, sondern welches Kraftwerk.' }
        }
      }
    ]
  },

  // --- AKDENİZ BÖLGESİ EKLEMELERİ ---
  {
    id: 'med-invasive-fish',
    regionId: 'mediterranean',
    title: { tr: 'İstilacı Türler', en: 'Invasive Species', de: 'Invasive Arten' },
    description: { tr: "Süveyş üzerinden gelen balon balığı ve aslan balığı Akdeniz kıyılarında yayılıyor. Balon balığı ağlara zarar veriyor ve tüketildiğinde zehirlenmeye yol açabiliyor; 2020 sonunda bir tebliğle kuyruk başına 5 TL destek ödemesi başlatıldı.", en: 'Pufferfish and lionfish arriving through Suez are spreading along the Mediterranean coast. Pufferfish damage nets and can poison anyone who eats them; a government notice in late 2020 introduced a 5 TL payment per tail.', de: 'Über Suez eingewanderte Kugelfische und Rotfeuerfische breiten sich an der Mittelmeerküste aus. Kugelfische beschädigen Netze und können beim Verzehr vergiften; Ende 2020 führte ein Erlass 5 TL je Schwanz ein.' },
    location: { provinces: ['Hatay', 'Mersin', 'Antalya', 'Muğla'], basin: 'Akdeniz' },
    tags: { pollution: ['biodiversity', 'marine'], mechanisms: ['lessepsian-migration'] },
    sources: [
      { label: 'Hürriyet: balon balığı avlayana kuyruk başına 5 TL destek', url: 'https://www.hurriyet.com.tr/ekonomi/balon-baligi-avlayana-5-tl-destek-41678300', status: 'partly-verified' },
      { label: 'Diken: destek ödemesi sona erdi, 24 günde 36 bin balık', url: 'https://www.diken.com.tr/?p=900647', status: 'partly-verified' }
    ],
    choices: [
      {
        text: { tr: 'Kuyruk Başına Destek Ödemesi Yap', en: 'Pay a Bounty Per Tail', de: 'Prämie je Schwanz zahlen' },
        effects: { budget: -40, happiness: +10, cleanliness: +3 },
        outcome: {
          what: { tr: 'Balıkçılar kısa sürede on binlerce balon balığı getirdi; destek bütçesi dolunca program durdu.', en: 'Fishers landed tens of thousands of pufferfish within weeks, and the programme stopped once its budget was used up.', de: 'Fischer brachten binnen Wochen Zehntausende Kugelfische; als das Budget erschöpft war, endete das Programm.' },
          why: { tr: 'Ödül avı artırır ve yayılmayı yavaşlatır, ama türü yok etmez: tebliğ 1 milyon kuyrukla sınırlıydı ve Antalya\'da 24 günde 36 bin balık getirildi. Yerleşmiş bir istilacıyı geri almak, yayılmasını yavaşlatmaktan çok daha zordur.', en: 'A bounty raises the catch and slows the spread without eradicating the species: the notice was capped at one million tails, and 36,000 fish came in within 24 days in Antalya. Rolling back an established invader is far harder than slowing it.', de: 'Eine Prämie erhöht den Fang und bremst die Ausbreitung, rottet die Art aber nicht aus: Der Erlass war auf eine Million Schwänze begrenzt, in Antalya kamen in 24 Tagen 36.000 Fische zusammen. Einen etablierten Einwanderer zurückzudrängen ist weit schwerer, als ihn zu bremsen.' }
        }
      },
      {
        text: { tr: 'Doğal Dengeye Bırak', en: 'Let Nature Find Its Balance', de: 'Der Natur ihren Lauf lassen' },
        effects: { budget: 0, happiness: -10, cleanliness: -10 },
        outcome: {
          what: { tr: 'İstilacı türlerin payı artmaya devam etti, yerli stoklar ve balıkçının geliri düştü.', en: 'The invaders kept gaining ground while native stocks and fishing income fell.', de: 'Die invasiven Arten breiteten sich weiter aus, heimische Bestände und Fischereieinkommen sanken.' },
          why: { tr: '"Denge" kendiliğinden kurulmaz: bu türlerin yeni bölgede doğal avcısı yoktur, bu yüzden rekabet tek yönlü işler.', en: 'Balance does not restore itself: these species have no natural predator in the new range, so the competition runs one way.', de: 'Ein Gleichgewicht stellt sich nicht von selbst ein: Diese Arten haben im neuen Gebiet keine natürlichen Feinde, die Konkurrenz läuft einseitig.' }
        }
      },
      {
        text: { tr: 'İzleme Ağı ve Halk Sağlığı Uyarısı Kur', en: 'Set Up Monitoring and a Public Health Warning', de: 'Monitoring und Gesundheitswarnung einrichten' },
        effects: { budget: -30, happiness: 0, cleanliness: +8 },
        outcome: {
          what: { tr: 'Kıyı boyunca kayıt ağı kuruldu, yeni türlerin nerede göründüğü haritalandı ve zehirlenme vakaları azaldı.', en: 'A recording network along the coast mapped where new species appeared, and poisoning cases dropped.', de: 'Ein Meldenetz entlang der Küste kartierte neue Arten, Vergiftungsfälle gingen zurück.' },
          why: { tr: 'İstila bir kirlilik değil, biyoçeşitlilik sorunudur: ölçülmeden yönetilemez. Üstelik balon balığı zehirlidir, bu yüzden "yakala ve ye" basit bir çözüm değildir.', en: 'An invasion is a biodiversity problem rather than a pollution one: it cannot be managed without being measured. And pufferfish are poisonous, so catch-and-eat is not a simple answer.', de: 'Eine Invasion ist kein Verschmutzungs-, sondern ein Biodiversitätsproblem: ohne Messung nicht steuerbar. Zudem sind Kugelfische giftig, "fangen und essen" ist also keine einfache Lösung.' }
        }
      }
    ]
  },
  {
    id: 'hatay-belen-migration',
    regionId: 'mediterranean',
    title: { tr: "Belen Geçidi'nde Göç Mevsimi", en: 'Migration Season at Belen Pass', de: 'Zugzeit am Belen-Pass' },
    description: { tr: "Hatay-Belen, Türkiye'nin üç büyük süzülen kuş göç boğazından biri. 2015 ilkbaharında geçitte 50 binden fazla süzülen kuş sayıldı; bunların 46 binden fazlası leylekti. Geçide yakın türbinler göç pencerelerinde risk yaratıyor.", en: 'Belen in Hatay is one of Turkey\'s three great soaring-bird bottlenecks. Over 50,000 soaring birds were counted at the pass in spring 2015, more than 46,000 of them white storks. Turbines near the pass create a risk during the migration windows.', de: 'Belen in Hatay ist einer der drei großen Zugengpässe für Segelvögel in der Türkei. Im Frühjahr 2015 wurden am Pass über 50.000 Segelvögel gezählt, davon mehr als 46.000 Weißstörche. Turbinen nahe dem Pass bergen in den Zugfenstern ein Risiko.' },
    location: { provinces: ['Hatay'] },
    tags: { pollution: ['biodiversity', 'energy'], mechanisms: ['migration-bottleneck', 'curtailment'] },
    sources: [
      { label: 'Belen Geçidi süzülen kuş göçü sayımı, ilkbahar 2015 (Niğde ÖHÜ arşivi)', url: 'https://acikerisim.ohu.edu.tr/items/5f224e34-2217-4813-b497-6aedd243adb6', status: 'verified' }
    ],
    choices: [
      {
        text: { tr: 'Göç Pencerelerinde Türbinleri Durdur', en: 'Shut the Turbines During Migration Windows', de: 'Turbinen in den Zugfenstern abschalten' },
        effects: { budget: -60, happiness: 0, cleanliness: +15 },
        outcome: {
          what: { tr: 'Gözlemciler yoğun geçiş günlerinde türbinleri durdurdu; yıllık üretimin küçük bir kısmı kayboldu, çarpma olayları neredeyse bitti.', en: 'Observers stopped the turbines on heavy passage days: a small slice of annual output was lost and collisions all but ended.', de: 'Beobachter stoppten die Turbinen an Tagen starken Durchzugs: ein kleiner Teil der Jahresproduktion entfiel, Kollisionen hörten nahezu auf.' },
          why: { tr: 'Göç yıla yayılmaz, birkaç haftaya ve belirli hava koşullarına sıkışır. Riskin zamanda yoğunlaşması, üretimin küçük bir kısmını feda ederek etkinin büyük kısmını önlemeyi mümkün kılar.', en: 'Migration is not spread across the year: it compresses into a few weeks and particular weather. Because the risk concentrates in time, giving up a small share of output avoids most of the impact.', de: 'Der Zug verteilt sich nicht übers Jahr, er bündelt sich auf wenige Wochen und bestimmte Wetterlagen. Weil sich das Risiko zeitlich ballt, verhindert ein kleiner Produktionsverzicht den größten Teil der Wirkung.' }
        }
      },
      {
        text: { tr: 'Üretime Kesintisiz Devam Et', en: 'Keep Generating Without Interruption', de: 'Ohne Unterbrechung weiter erzeugen' },
        effects: { budget: +50, happiness: +5, cleanliness: -10 },
        outcome: {
          what: { tr: 'Santral tam kapasite çalıştı; göç mevsiminde türbin altlarında ölü leylekler bulundu.', en: 'The farm ran at full capacity, and dead storks were found under the turbines during the migration season.', de: 'Der Park lief mit voller Leistung; in der Zugzeit lagen tote Störche unter den Turbinen.' },
          why: { tr: 'Düşük karbonlu üretim, yerel etkisi yok demek değildir. Bir darboğazda yoğunlaşan popülasyonlarda kayıp bölgesel değil, göç yolunun tamamı için anlam taşır.', en: 'Low-carbon generation does not mean no local impact. Where populations funnel through a bottleneck, losses matter not just locally but for the whole flyway.', de: 'Kohlenstoffarme Erzeugung heißt nicht wirkungsfrei. Wo sich Populationen an einem Engpass bündeln, zählen Verluste für den gesamten Zugweg.' }
        }
      },
      {
        text: { tr: 'Türbinleri Geçidin Dışına Taşı', en: 'Move the Turbines Away From the Pass', de: 'Turbinen vom Pass wegverlegen' },
        effects: { budget: -140, happiness: -5, cleanliness: +15 },
        outcome: {
          what: { tr: 'Türbinler sökülüp göç hattının dışına kuruldu; maliyet yüksekti, yeni sahada rüzgar biraz daha zayıftı.', en: 'The turbines were dismantled and rebuilt off the flyway: expensive, and the wind at the new site was a little weaker.', de: 'Die Turbinen wurden abgebaut und abseits des Zugwegs neu errichtet: teuer, und der Wind am neuen Standort etwas schwächer.' },
          why: { tr: 'Bir rüzgar santralinde etkiyi belirleyen ilk karar yerdir; ikinci karar işletme biçimidir. Yer yanlış seçildiğinde, doğru işletme bile maliyeti tamamen kaldıramaz.', en: 'For a wind farm, the first decision that sets the impact is the site; the second is how it is operated. Choose the site badly and even good operation cannot remove the whole cost.', de: 'Bei einem Windpark bestimmt zuerst der Standort die Wirkung, dann die Betriebsweise. Ist der Standort falsch, hebt selbst guter Betrieb die Kosten nicht ganz auf.' }
        }
      }
    ]
  },
  {
    id: 'adana-stubble-burning',
    regionId: 'mediterranean',
    title: { tr: 'Anız Yakma Sorunu', en: 'Stubble Burning Problem', de: 'Problem der Stoppelfeldverbrennung' },
    description: { tr: 'Çukurova\'da hasat sonrası tarlalar yakılıyor, duman tüm şehri kapladı.', en: 'Fields in Çukurova are being burned after harvest, blanketing the whole city in smoke.', de: 'In Çukurova werden die Felder nach der Ernte abgebrannt, Rauch legt sich über die ganze Stadt.' },
    location: { provinces: ['Adana', 'Osmaniye', 'Mersin'], basin: 'Seyhan' },
    tags: { pollution: ['air', 'soil'] },
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
    location: { provinces: ['Ankara'] },
    tags: { pollution: ['landuse', 'air'] },
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
    location: { provinces: ['Rize', 'Artvin'] },
    tags: { pollution: ['energy', 'water', 'biodiversity'] },
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
    id: 'hazelnut-aflatoxin',
    regionId: 'blacksea',
    title: { tr: 'Fındıkta Aflatoksin', en: 'Aflatoxin in the Hazelnuts', de: 'Aflatoxin in den Haselnüssen' },
    description: { tr: 'Fındık partileri AB sınırında geri çevriliyor. Bildirimlerde öne çıkan gerekçe zirai ilaç değil aflatoksin: nemli hasat ve depoda gelişen küflerin ürettiği toksin. AB sınırı fındıkta aflatoksin B1 için 5 µg/kg düzeyindedir.', en: 'Hazelnut consignments are being turned back at the EU border. The hazard named in the notifications is not pesticide residue but aflatoxin, a toxin from moulds that grow in damp harvest and storage. The EU limit for hazelnuts is 5 µg/kg of aflatoxin B1.', de: 'Haselnusslieferungen werden an der EU-Grenze zurückgewiesen. Der genannte Gefahrstoff ist nicht Pestizidrückstand, sondern Aflatoxin, ein Gift von Schimmeln aus feuchter Ernte und Lagerung. Der EU-Grenzwert liegt bei 5 µg/kg Aflatoxin B1.' },
    location: { provinces: ['Ordu', 'Giresun', 'Trabzon', 'Samsun'] },
    tags: { pollution: ['soil', 'waste'], mechanisms: ['mycotoxin', 'post-harvest-moisture'] },
    sources: [
      { label: 'FoodNavigator: RASFF bildirimlerinde Türkiye kaynaklı fındık ve aflatoksin', url: 'https://www.foodnavigator.com/Article/2017/11/28/RASFF-50-notifications-triggered-by-food-poisoning', status: 'partly-verified' },
      { label: 'Aflatoxin in hazelnuts: AB limitleri ve bildirim verileri (sektör sunumu)', url: 'https://nocciolare.it/wp-content/uploads/2024/11/7-Aflatoxin-Hazelnut-2024.pdf', status: 'partly-verified' }
    ],
    choices: [
      {
        text: { tr: 'Kurutma ve Depolama Altyapısına Yatır', en: 'Invest in Drying and Storage', de: 'In Trocknung und Lagerung investieren' },
        effects: { budget: -100, happiness: +10, cleanliness: +10 },
        outcome: {
          what: { tr: 'Üreticiye kurutma betonu, nem ölçer ve havalandırmalı depo desteği verildi; iade oranı düştü.', en: 'Growers got drying floors, moisture meters and ventilated stores, and the rejection rate fell.', de: 'Erzeuger erhielten Trocknungsflächen, Feuchtemesser und belüftete Lager; die Rückweisungen gingen zurück.' },
          why: { tr: 'Aflatoksin tarlada değil, nemli kalan üründe oluşur. Nemi hasattan sonra hızla düşürmek toksinin oluşmasını baştan engeller.', en: 'Aflatoxin forms in produce that stays damp, not in the field. Dropping moisture quickly after harvest stops the toxin from forming at all.', de: 'Aflatoxin entsteht in feucht gebliebener Ware, nicht auf dem Feld. Schnelles Trocknen nach der Ernte verhindert die Bildung von vornherein.' }
        }
      },
      {
        text: { tr: 'Organik Tarıma Geçişi Zorunlu Tut', en: 'Mandate a Switch to Organic Farming', de: 'Umstellung auf Bio vorschreiben' },
        effects: { budget: -100, happiness: -10, cleanliness: +12 },
        outcome: {
          what: { tr: 'Üretici ilaç kullanımını bıraktı, toprak ve su için iyi oldu; sınırda iadeler sürdü.', en: 'Growers dropped pesticides, which helped soil and water, and the border rejections continued.', de: 'Die Erzeuger verzichteten auf Pestizide, gut für Boden und Wasser; die Rückweisungen gingen weiter.' },
          why: { tr: 'Doğru niyet, yanlış mekanizma: organik üretim pestisit kalıntısını azaltır, aflatoksini değil. Küf nemle ilgilidir ve organik üründe de gelişir.', en: 'Right intention, wrong mechanism: organic production cuts pesticide residue, not aflatoxin. Mould is about moisture and grows in organic produce just the same.', de: 'Richtige Absicht, falscher Mechanismus: Bio senkt Pestizidrückstände, nicht Aflatoxin. Schimmel hängt an der Feuchte und wächst auch in Bioware.' }
        }
      },
      {
        text: { tr: 'Yeni Pazarlar Ara', en: 'Look for New Markets', de: 'Neue Märkte suchen' },
        effects: { budget: -20, happiness: +5, cleanliness: -5 },
        delayed: [
          {
            inDays: 18,
            effects: { budget: -40 },
            message: { tr: 'Yeni pazar da aflatoksin denetimi başlattı; partiler yine geri döndü.', en: 'The new market started aflatoxin checks too, and the consignments came back again.', de: 'Auch der neue Markt prüft nun auf Aflatoxin; die Partien kamen erneut zurück.' }
          }
        ],
        outcome: {
          what: { tr: 'Daha gevşek limitleri olan pazarlara satış yapıldı; ürün satıldı, sorun yerinde kaldı.', en: 'The crop was sold into markets with looser limits: it moved, and the problem stayed put.', de: 'Die Ernte ging in Märkte mit lockereren Grenzwerten: verkauft, Problem geblieben.' },
          why: { tr: 'Limit değiştirince toksin değişmez. Aflatoksin kuvvetli bir karaciğer toksinidir; onu kimin yediği değişir sadece.', en: 'Changing the limit does not change the toxin. Aflatoxin is a potent liver toxin; all that changes is who eats it.', de: 'Ein anderer Grenzwert ändert das Gift nicht. Aflatoxin ist stark leberschädigend; es ändert sich nur, wer es isst.' }
        }
      }
    ]
  },

  // --- DOĞU ANADOLU BÖLGESİ EKLEMELERİ ---
  {
    id: 'van-pearl-mullet',
    regionId: 'eastern',
    title: { tr: 'İnci Kefali Göçü', en: 'The Pearl Mullet Run', de: 'Die Wanderung der Perlmaräne' },
    description: { tr: "İnci kefali, Van Gölü'nün sodalı suyunda yaşayıp yumurtlamak için tatlı su derelerine göç eden endemik bir balık. Göç için 15 Nisan-15 Temmuz arasında avlanma yasağı var; kaçak avcılık ve kuruyan dereler göçü aksatıyor.", en: 'The pearl mullet lives in the soda water of Lake Van but migrates into freshwater streams to spawn. A fishing ban runs from 15 April to 15 July for the migration, while poaching and drying streams disrupt it.', de: 'Die Perlmaräne lebt im Sodawasser des Van-Sees und wandert zum Laichen in Süßwasserbäche. Für die Wanderung gilt vom 15. April bis 15. Juli ein Fangverbot; Wilderei und austrocknende Bäche stören sie.' },
    location: { provinces: ['Van', 'Bitlis'], basin: 'Van Gölü' },
    tags: { pollution: ['biodiversity', 'water'], mechanisms: ['spawning-migration', 'seasonal-closure'] },
    sources: [
      { label: 'DHA: inci kefali üreme göçü ve av yasağı', url: 'https://www.dha.com.tr/foto-galeri/yagislar-yuz-guldurdu-inci-kefali-ureme-sezonuna-guclu-giriyor-2855384', status: 'partly-verified' },
      { label: "Vatan: Van'da 90 günlük av yasağı (15 Nisan-15 Temmuz)", url: 'https://www.gazetevatan.com/sehirler/van/vanda-90-gunluk-yasak-basladi-2363441', status: 'partly-verified' }
    ],
    choices: [
      {
        text: { tr: 'Yasağı Dere Ağızlarında Fiilen Denetle', en: 'Actually Police the Ban at the Stream Mouths', de: 'Verbot an den Bachmündungen durchsetzen' },
        effects: { budget: -60, happiness: -10, cleanliness: +15 },
        outcome: {
          what: { tr: 'Ekipler göç boyunca dere ağızlarında nöbet tuttu; kaçak av azaldı, balıkçı tepkisi arttı.', en: 'Teams watched the stream mouths throughout the run: poaching fell and the fishing community pushed back.', de: 'Teams bewachten während der Wanderung die Bachmündungen: weniger Wilderei, mehr Unmut bei den Fischern.' },
          why: { tr: 'Darboğaz dere ağzıdır: balık orada yoğunlaşır ve en kolay avlanır. Yasağın işe yaraması, yazıldığı yerde değil, uygulandığı yerde belli olur.', en: 'The stream mouth is the bottleneck: the fish concentrate there and are easiest to catch. A ban proves itself where it is enforced, not where it is written.', de: 'Die Bachmündung ist der Engpass: Dort sammeln sich die Fische und sind am leichtesten zu fangen. Ein Verbot bewährt sich dort, wo es durchgesetzt wird.' }
        }
      },
      {
        text: { tr: 'Dere Akışını ve Balık Geçitlerini Onar', en: 'Restore Stream Flow and Fish Passes', de: 'Bachabfluss und Fischpässe instand setzen' },
        effects: { budget: -120, happiness: -5, cleanliness: +20 },
        outcome: {
          what: { tr: 'Sulama alımları göç penceresinde sınırlandı, eski bentlere geçit yapıldı; sürü yukarı havzaya ulaştı.', en: 'Irrigation withdrawals were capped during the run and passes were built at old weirs; the shoal reached the upper streams.', de: 'Entnahmen wurden während der Wanderung begrenzt und alte Wehre mit Pässen versehen; der Schwarm erreichte die Oberläufe.' },
          why: { tr: 'Tür sodalı gölde üreyemez; üremesi tatlı suya çıkmasına bağlıdır. Dere kurursa ya da önü kesilirse av yasağı tek başına yetmez, çünkü sorun avlanma değil erişimdir.', en: 'The species cannot spawn in soda water; reproduction depends on reaching fresh water. If the stream dries or is blocked, a fishing ban alone is not enough, because the problem is access rather than catch.', de: 'Die Art kann im Sodawasser nicht laichen; die Fortpflanzung hängt am Erreichen von Süßwasser. Trocknet der Bach aus oder ist er versperrt, genügt ein Fangverbot nicht, denn es geht um den Zugang.' }
        }
      },
      {
        text: { tr: 'Bu Sezon Bir Şey Yapma', en: 'Do Nothing This Season', de: 'In dieser Saison nichts tun' },
        effects: { budget: 0, happiness: +5, cleanliness: -15 },
        outcome: {
          what: { tr: 'Av sürdü, göç zayıf geçti ve ertesi yıl tezgaha gelen balık küçüldü.', en: 'Fishing continued, the run was weak, and the fish on the stalls were smaller the following year.', de: 'Der Fang lief weiter, die Wanderung blieb schwach, im Folgejahr waren die Fische kleiner.' },
          why: { tr: 'Göç eden balık, o yılın yumurtalarını taşır. Bir sezon kaybı bir sonraki yılın değil, birkaç yıl sonrasının stoğunu küçültür: etki gecikmeli görünür.', en: 'The migrating fish carry that year\'s eggs. A lost season shrinks the stock not next year but several years later: the effect shows up with a delay.', de: 'Die wandernden Fische tragen die Eier des Jahres. Eine verlorene Saison verkleinert den Bestand nicht im nächsten, sondern in einigen Jahren: Die Wirkung kommt verzögert.' }
        }
      }
    ]
  },

  // --- GÜNEYDOĞU ANADOLU BÖLGESİ EKLEMELERİ ---
  {
    id: 'urfa-solar',
    regionId: 'southeastern',
    title: { tr: 'Güneşin Başkenti', en: 'Capital of the Sun', de: 'Hauptstadt der Sonne' },
    description: { tr: 'Şanlıurfa\'nın yakıcı güneşi enerjiye dönüştürülebilir ama altyapı yetersiz.', en: 'Şanlıurfa’s scorching sun could be turned into energy, but infrastructure is lacking.', de: 'Şanlıurfas sengende Sonne könnte in Energie umgewandelt werden, doch die Infrastruktur fehlt.' },
    location: { provinces: ['Şanlıurfa'] },
    tags: { pollution: ['energy'] },
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
    description: { tr: 'İlkbahar ve sonbaharda çöl tozu bölgeye ulaşıp PM10 değerlerini yükseltiyor. Model çalışmaları kaynakları Sahra, Suriye ve Arabistan çölleri olarak gösteriyor: toz, hava sistemleriyle yüzlerce kilometre taşınıyor.', en: 'Desert dust reaches the region in spring and autumn and pushes PM10 up. Modelling traces the sources to the Sahara, the Syrian desert and the Arabian Peninsula: the dust travels hundreds of kilometres with weather systems.', de: 'Im Frühjahr und Herbst erreicht Wüstenstaub die Region und treibt die PM10-Werte hoch. Modelle verweisen auf Sahara, Syrische Wüste und Arabische Halbinsel: Der Staub zieht mit Wettersystemen Hunderte Kilometer weit.' },
    location: { provinces: ['Şanlıurfa', 'Mardin', 'Diyarbakır'] },
    tags: { pollution: ['air'], mechanisms: ['long-range-transport', 'exposure-reduction'] },
    sources: [
      { label: "Şanlıurfa'yı etkileyen toz taşınımı kaynakları (YÖK tez arşivi, HYSPLIT analizi)", url: 'https://acikbilim.yok.gov.tr/handle/20.500.12812/92211', status: 'verified' },
      { label: 'Güneydoğu Anadolu hava kalitesi analizi (Ankara Üniv. Çevrebilim dergisi)', url: 'https://dergipark.org.tr/tr/pub/aucevrebilim/article/477021', status: 'verified' }
    ],
    choices: [
      {
        text: { tr: 'Erken Uyarı ve Sağlık Danışmanlığı Kur', en: 'Set Up Early Warning and Health Advice', de: 'Frühwarnung und Gesundheitsberatung aufbauen' },
        effects: { budget: -30, happiness: +15, cleanliness: 0 },
        outcome: {
          what: { tr: 'Toz günleri önceden duyuruldu; okul bahçesi etkinlikleri ertelendi, astım hastaları ilaçlarını hazırladı, acil başvuruları azaldı.', en: 'Dust days were announced in advance: outdoor school activities were postponed, asthma patients prepared their medication and emergency visits fell.', de: 'Staubtage wurden vorab angekündigt: Aktivitäten im Freien verschoben, Asthmakranke vorbereitet, weniger Notaufnahmen.' },
          why: { tr: 'Toz sınır ötesinden sinoptik ölçekte gelir; kaynağı yerelde kapatılamaz. Kazanç, kirliliği değil maruziyeti azaltmaktan gelir.', en: 'The dust arrives from across the border at synoptic scale; the source cannot be switched off locally. The gain comes from reducing exposure rather than the pollution itself.', de: 'Der Staub kommt grenzüberschreitend im synoptischen Maßstab; die Quelle ist lokal nicht abstellbar. Der Gewinn liegt darin, die Exposition zu senken, nicht die Verschmutzung.' }
        }
      },
      {
        text: { tr: 'Yerel Ağaçlandırma Bariyeri Kur', en: 'Build a Local Tree Barrier', de: 'Lokalen Baumriegel pflanzen' },
        effects: { budget: -80, happiness: +5, cleanliness: +5 },
        outcome: {
          what: { tr: 'Kuşak dikildi ve yıllar içinde yerel toprak erozyonunu azalttı; toz taşınımı günlerinde PM10 yine tavan yaptı.', en: 'The belt was planted and cut local soil erosion over the years, while PM10 still peaked on transport days.', de: 'Der Gürtel wurde gepflanzt und verringerte über Jahre die lokale Bodenerosion; an Transporttagen stieg PM10 dennoch stark.' },
          why: { tr: 'Ağaç kuşağı yerel toz kalkışını ve erozyonu azaltır, hava sistemiyle kilometrelerce yükseklikten gelen çöl tozunu durduramaz. Doğru önlem, yanlış ölçek.', en: 'A tree belt reduces local soil loss and local dust lift, but cannot stop desert dust arriving kilometres up with a weather system. Right measure, wrong scale.', de: 'Ein Baumriegel mindert lokale Erosion und lokalen Staub, hält aber keinen Wüstenstaub auf, der kilometerhoch mit dem Wetter kommt. Richtige Maßnahme, falscher Maßstab.' }
        }
      },
      {
        text: { tr: 'Bölgesel İşbirliği Başlat', en: 'Start Regional Cooperation', de: 'Regionale Zusammenarbeit beginnen' },
        effects: { budget: -50, happiness: +5, cleanliness: +10 },
        outcome: {
          what: { tr: 'Komşu ülkelerle ortak izleme ve arazi ıslahı görüşmeleri başladı; ilk sonuçlar yıllar sonrasına işaret ediyor.', en: 'Joint monitoring and land-restoration talks began with neighbouring countries, with first results years away.', de: 'Mit den Nachbarländern begannen Gespräche über gemeinsames Monitoring und Landsanierung; erste Ergebnisse liegen Jahre entfernt.' },
          why: { tr: 'Kaynak başka ülkenin sınırları içindeyse, kalıcı çözüm de oradadır. Sınır ötesi kirlilikte tek taraflı önlem maruziyeti yönetir, kaynağı yalnızca ortak çalışma değiştirir.', en: 'If the source sits inside another country, so does the lasting fix. With transboundary pollution a one-sided measure manages exposure; only joint work changes the source.', de: 'Liegt die Quelle in einem anderen Land, liegt dort auch die dauerhafte Lösung. Bei grenzüberschreitender Verschmutzung steuert einseitiges Handeln nur die Exposition.' }
        }
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
    location: { provinces: ['Rize'] },
    tags: { pollution: ['hazard', 'soil'] },
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
    description: { tr: "Marmara'nın yüzeyini müsilaj kapladı. Asıl sürükleyici, arıtılmadan ya da yetersiz arıtılarak denize verilen atıksudaki azot ve fosfor; ısınan ve tabakalaşan su bunu büyütüyor.", en: 'Mucilage has covered the surface of the Sea of Marmara. The real driver is nitrogen and phosphorus in wastewater that reaches the sea untreated or barely treated; warm, stratified water amplifies it.', de: 'Schleim bedeckt das Marmarameer. Treiber sind Stickstoff und Phosphor aus Abwasser, das ungeklärt oder kaum geklärt ins Meer gelangt; warmes, geschichtetes Wasser verstärkt das.' },
    location: { provinces: ['İstanbul', 'Kocaeli', 'Tekirdağ'], basin: 'Marmara Denizi' },
    tags: { pollution: ['marine', 'water'], mechanisms: ['eutrophication', 'nutrient-loading'] },
    sources: [
      { label: 'AA: Marmara Denizi Eylem Planı (22 madde, Haziran 2021)', url: 'https://www.aa.com.tr/en/environment/turkey-unveils-action-plan-to-clean-sea-of-marmara/2265768', status: 'verified' },
      { label: 'TÜİK Su ve Atıksu İstatistikleri 2024: arıtma ile hizmet verilen belediye nüfusu %76,9', url: 'https://www.alomaliye.com/2025/12/09/su-ve-atiksu-istatistikleri-2024/', status: 'partly-verified' }
    ],
    choices: [
      {
        text: { tr: 'Yüzeyi Topla (Acil Temizlik)', en: 'Skim the Surface (Emergency Cleanup)', de: 'Oberfläche abschöpfen (Notreinigung)' },
        effects: { budget: -150, happiness: +20, cleanliness: +10 },
        delayed: [
          {
            inDays: 25,
            effects: { cleanliness: -15 },
            message: { tr: 'Marmara yeniden müsilajla kaplandı: besin yükü hiç azalmamıştı.', en: 'Mucilage has covered the Marmara again: the nutrient load never went down.', de: 'Das Marmarameer ist wieder voller Schleim: Die Nährstofffracht war nie gesunken.' }
          }
        ],
        outcome: {
          what: { tr: 'Yüzey birkaç haftada temizlendi, görüntü düzeldi ve tepkiler dindi. Ertesi yaz müsilaj geri geldi.', en: 'The surface was cleared within weeks, the view improved and the outcry died down. The mucilage returned the next summer.', de: 'Die Oberfläche war in Wochen geräumt, der Anblick besser, der Protest verstummte. Im nächsten Sommer kam der Schleim zurück.' },
          why: { tr: 'Toplama belirtiyi alır, nedeni değil: azot ve fosfor yükü denize girmeye devam ettiği sürece su ısınınca plankton yeniden patlar.', en: 'Skimming removes the symptom, not the cause: while the nitrogen and phosphorus load keeps entering the sea, the plankton bloom returns as soon as the water warms.', de: 'Abschöpfen beseitigt das Symptom, nicht die Ursache: solange Stickstoff und Phosphor weiter ins Meer gelangen, blüht das Plankton bei Erwärmung erneut auf.' }
        }
      },
      {
        text: { tr: 'İleri Biyolojik Arıtmaya Geç', en: 'Switch to Advanced Biological Treatment', de: 'Auf weitergehende biologische Reinigung umstellen' },
        effects: { budget: -200, happiness: -5, cleanliness: +25 },
        outcome: {
          what: { tr: 'Tesislerin dönüşümü yıllar sürdü ve bütçeyi zorladı; denize giden azot yükü kalıcı olarak düştü.', en: 'Converting the plants took years and strained the budget, but the nitrogen load reaching the sea fell for good.', de: 'Der Umbau der Anlagen dauerte Jahre und belastete den Haushalt, doch die Stickstofffracht ins Meer sank dauerhaft.' },
          why: { tr: 'Müsilajın yakıtı besin tuzlarıdır. 2021 eylem planının merkezinde de mevcut tesisleri ileri biyolojik arıtmaya çevirmek ve azotu yaklaşık %40 azaltmak vardı.', en: 'Nutrients are what feed mucilage. Converting existing plants to advanced biological treatment and cutting nitrogen by roughly 40% was the core of the 2021 action plan too.', de: 'Nährstoffe sind der Treibstoff des Schleims. Auch der Aktionsplan von 2021 setzte auf den Umbau bestehender Anlagen und rund 40% weniger Stickstoff.' }
        }
      },
      {
        text: { tr: 'Havzadaki Tarım ve Sanayi Yükünü Sınırla', en: 'Limit the Farm and Industry Load in the Basin', de: 'Fracht aus Landwirtschaft und Industrie begrenzen' },
        effects: { budget: -80, happiness: -15, cleanliness: +15 },
        outcome: {
          what: { tr: 'Gübre ve sanayi deşarjı denetimi çiftçiyi ve sanayiciyi kızdırdı; havzadan gelen yük azaldı.', en: 'Policing fertiliser use and industrial discharge angered farmers and factories alike, and the load coming off the basin fell.', de: 'Die Kontrolle von Dünger und Industrieeinleitungen verärgerte Bauern wie Betriebe, doch die Fracht aus dem Einzugsgebiet sank.' },
          why: { tr: 'Denize giden besin yükünün bir kısmı borudan değil, havzadaki tarladan ve küçük işletmeden gelir; yalnızca tesisleri yenilemek bu kısmı yakalayamaz.', en: 'Part of the nutrient load does not arrive through a pipe but from fields and small workshops across the basin; upgrading treatment plants alone never catches it.', de: 'Ein Teil der Nährstofffracht kommt nicht aus einem Rohr, sondern von Feldern und Kleinbetrieben im Einzugsgebiet; der Anlagenumbau allein erfasst ihn nicht.' }
        }
      }
    ]
  },
  {
    id: 'ergene-textile-dye',
    regionId: 'marmara',
    title: { tr: 'Ergene Nehri ve Tekstil Boyası', en: 'The Ergene and the Dye Houses', de: 'Die Ergene und die Färbereien' },
    description: { tr: "Trakya'nın tekstil ve deri sanayisi ile kentlerin atıksuyu aynı nehre, Ergene'ye gidiyor. TBMM'de sunulan rakamlara göre nehre günde yaklaşık 460 bin m³ sanayi ve 240 bin m³ evsel atıksu veriliyor.", en: 'The textile and leather industry of Thrace and the region\'s urban sewage both drain into one river, the Ergene. Figures presented in parliament put the daily load at about 460,000 m³ of industrial and 240,000 m³ of domestic wastewater.', de: 'Die Textil- und Lederindustrie Thrakiens und die Abwässer der Städte fließen in denselben Fluss, die Ergene. Im Parlament vorgelegte Zahlen nennen täglich rund 460.000 m³ Industrie- und 240.000 m³ Hausabwasser.' },
    location: { provinces: ['Tekirdağ', 'Edirne', 'Kırklareli'], basin: 'Meriç-Ergene' },
    tags: { pollution: ['water', 'marine'], mechanisms: ['pollution-displacement', 'joint-treatment'] },
    sources: [
      { label: "Medyascope: TBMM'de sunulan Ergene deşarj rakamları", url: 'https://medyascope.tv/2021/10/21/mecliste-musilaj-tartisilmaya-devam-ediyor-prof-dr-lokman-hakan-tecer-ergene-nehrine-gunluk-700-bin-metrekupluk-bir-atik-su-desarji-soz-konusu/', status: 'partly-verified' },
      { label: 'Habertürk: Ergene Havzası koruma planı ve derin deşarj tartışması', url: 'https://www.haberturk.com/dikkat-ceken-ergene-uyarisi-3669603', status: 'partly-verified' }
    ],
    choices: [
      {
        text: { tr: 'OSB Ortak Arıtmasını İleri Kademeye Çıkar', en: 'Upgrade the Shared Industrial Treatment Plant', de: 'Gemeinsame Industriekläranlage aufrüsten' },
        effects: { budget: -120, happiness: -5, cleanliness: +25 },
        outcome: {
          what: { tr: 'Organize sanayi bölgelerinin ortak tesisi ileri arıtmaya geçti; boya yükü ve renk nehirde gözle görülür biçimde azaldı.', en: 'The industrial zones\' shared plant moved to advanced treatment, and the dye load and colour in the river visibly dropped.', de: 'Die gemeinsame Anlage der Industriegebiete ging auf weitergehende Reinigung über; Farbfracht und Färbung im Fluss gingen sichtbar zurück.' },
          why: { tr: 'Yük nehre girmeden tutulursa havzanın tamamı kazanır. Ortak tesis, tek tek küçük atölyelerin kuramayacağı arıtma kademesini ölçek sayesinde mümkün kılar.', en: 'Catch the load before it reaches the river and the whole basin gains. A shared plant makes a treatment stage possible, through scale, that no single small workshop could build.', de: 'Wird die Fracht vor dem Fluss abgefangen, gewinnt das ganze Einzugsgebiet. Die Gemeinschaftsanlage ermöglicht durch Größe eine Reinigungsstufe, die kein kleiner Betrieb allein schafft.' }
        }
      },
      {
        text: { tr: 'Derin Deniz Deşarj Hattına Bağla', en: 'Pipe It to a Deep-Sea Outfall', de: 'An eine Tiefwassereinleitung anschließen' },
        effects: { budget: -90, happiness: +10, cleanliness: +5 },
        delayed: [
          {
            inDays: 20,
            effects: { cleanliness: -12 },
            message: { tr: 'Deşarj hattının çıkışında Marmara suyundaki besin yükü yükseldi.', en: 'Nutrient levels in the Marmara have risen around the outfall.', de: 'Rund um die Einleitung sind die Nährstoffwerte im Marmarameer gestiegen.' }
          }
        ],
        outcome: {
          what: { tr: 'Hat devreye girdi; nehirdeki koku ve renk azaldı, aynı yük bu kez boruyla denize taşındı.', en: 'The pipeline went live: the smell and colour in the river eased while the same load now travelled to the sea instead.', de: 'Die Leitung ging in Betrieb: Geruch und Färbung im Fluss nahmen ab, dieselbe Fracht ging nun ins Meer.' },
          why: { tr: 'Deşarj hattı yükü nehirden alır ama yok etmez: azot, fosfor ve tuz denize gider. Kirliliğin yer değiştirmesi, arıtılması değildir, ve Marmara\'daki müsilajın yakıtı tam da bu besin yüküdür.', en: 'An outfall takes the load off the river without removing it: the nitrogen, phosphorus and salt go to the sea. Displacing pollution is not treating it, and that nutrient load is exactly what feeds mucilage in Marmara.', de: 'Eine Fernleitung nimmt die Fracht aus dem Fluss, beseitigt sie aber nicht: Stickstoff, Phosphor und Salz gehen ins Meer. Verlagerung ist keine Reinigung, und genau diese Nährstofffracht nährt den Schleim im Marmarameer.' }
        }
      },
      {
        text: { tr: 'Küçük Atölyeleri Zorlama', en: 'Spare the Small Workshops', de: 'Kleinbetriebe verschonen' },
        effects: { budget: +20, happiness: +5, cleanliness: -20 },
        outcome: {
          what: { tr: 'Atölyeler üretime devam etti ve istihdam korundu; nehirdeki renk değişimi aşağı havzadaki tarım sulamasına kadar ulaştı.', en: 'The workshops kept running and jobs were safe; the colour in the river reached as far as the irrigation intakes downstream.', de: 'Die Betriebe liefen weiter, Arbeitsplätze blieben; die Verfärbung reichte bis zu den Bewässerungsentnahmen flussabwärts.' },
          why: { tr: 'Nehir kirliliği aşağı akar: yukarıdaki küçük bir deşarj, aşağıda içme suyu, sulama ve balıkçılık olarak karşımıza çıkar. Maliyetin kaçtığı yer, sorumluluğun bittiği yer değildir.', en: 'River pollution flows downhill: a small discharge upstream reappears downstream as drinking water, irrigation and fisheries. Where the cost is avoided is not where the responsibility ends.', de: 'Flussverschmutzung fließt abwärts: Eine kleine Einleitung oben erscheint unten als Trinkwasser, Bewässerung und Fischerei. Wo Kosten vermieden werden, endet die Verantwortung nicht.' }
        }
      }
    ]
  },

  // Ege (Aegean)
  {
    id: 'aegean-geothermal-reinjection',
    regionId: 'aegean',
    title: { tr: 'Jeotermalde Reenjeksiyon Tartışması', en: 'The Geothermal Reinjection Debate', de: 'Streit um die Reinjektion' },
    description: { tr: 'Büyük Menderes grabenindeki jeotermal santraller düşük karbonlu elektrik üretiyor. Kızıldere ölçümlerinde nehre verilen jeotermal atık suda litrede 24 mg\'a varan bor saptandı; çalışma tek uygulanabilir çözüm olarak reenjeksiyonu gösteriyor.', en: 'Geothermal plants in the Büyük Menderes graben produce low-carbon power. Measurements at Kızıldere found up to 24 mg/l of boron in the spent fluid discharged to the river, and the study points to reinjection as the only workable fix.', de: 'Geothermiekraftwerke im Büyük-Menderes-Graben erzeugen kohlenstoffarmen Strom. In Kızıldere wurden bis zu 24 mg/l Bor im eingeleiteten Thermalwasser gemessen; die Studie nennt Reinjektion als einzige praktikable Lösung.' },
    location: { provinces: ['Aydın', 'Denizli', 'Manisa'], basin: 'Büyük Menderes' },
    tags: { pollution: ['water', 'energy', 'soil'], mechanisms: ['brine-discharge', 'reinjection'] },
    sources: [
      { label: 'Boron pollution due to geothermal wastewater discharge into the Büyük Menderes river', url: 'https://www.inderscience.com/info/inarticle.php?artid=3741', status: 'verified' },
      { label: 'Kızıldere jeotermal projesinin çevresel etkileri (Geothermics, 2005)', url: 'https://avesis.hacettepe.edu.tr/yayin/3e3e2b10-d38c-4f38-a094-b2a692b0d878/developmental-and-environmental-effects-of-the-kizildere-geothermal-power-project-turkey', status: 'verified' }
    ],
    choices: [
      {
        text: { tr: 'Reenjeksiyonu Zorunlu Kıl', en: 'Make Reinjection Mandatory', de: 'Reinjektion vorschreiben' },
        effects: { budget: -80, happiness: +5, cleanliness: +20 },
        outcome: {
          what: { tr: 'Santraller atık suyu rezervuara geri basmak zorunda kaldı; yatırım maliyeti arttı, nehirdeki bor düştü.', en: 'The plants had to pump spent fluid back into the reservoir: capital costs rose and boron levels in the river fell.', de: 'Die Kraftwerke mussten das Thermalwasser zurückpressen: höhere Investitionen, sinkende Borwerte im Fluss.' },
          why: { tr: 'Jeotermal akışkan düşük karbonlu ama tuzlu ve borludur. Reenjeksiyon onu üretildiği derinliğe geri verir; yüzey deşarjı ise aynı suyu sulama suyuna karıştırır.', en: 'Geothermal fluid is low-carbon but salty and boron-rich. Reinjection returns it to the depth it came from; surface discharge mixes the same water into irrigation supply.', de: 'Thermalwasser ist kohlenstoffarm, aber salz- und borhaltig. Reinjektion bringt es in die Tiefe zurück; Oberflächeneinleitung mischt es ins Bewässerungswasser.' }
        }
      },
      {
        text: { tr: 'Yüzey Deşarjına İzin Ver, Sadece İzle', en: 'Allow Surface Discharge, Just Monitor It', de: 'Oberflächeneinleitung erlauben, nur überwachen' },
        effects: { budget: +40, happiness: -5, cleanliness: -15 },
        outcome: {
          what: { tr: 'Ölçüm istasyonları kuruldu ve bor değerleri düzenli olarak kaydedildi; değerler yükselmeye devam etti.', en: 'Monitoring stations went in and boron values were logged regularly. The values kept climbing.', de: 'Messstationen wurden errichtet und Borwerte regelmäßig erfasst. Die Werte stiegen weiter.' },
          why: { tr: 'İzleme bir önlem değil, bir ölçü aletidir. Bor bitkiler için düşük derişimlerde bile toksiktir ve sulama suyuyla tarlaya taşınır.', en: 'Monitoring is an instrument, not a measure. Boron is toxic to plants even at low concentrations and travels onto fields with irrigation water.', de: 'Überwachung ist ein Messgerät, keine Maßnahme. Bor ist für Pflanzen schon in geringen Konzentrationen giftig und gelangt mit dem Bewässerungswasser aufs Feld.' }
        }
      },
      {
        text: { tr: 'Üretimi Durdur', en: 'Shut the Plants Down', de: 'Kraftwerke stilllegen' },
        effects: { budget: -40, happiness: -15, cleanliness: +10 },
        outcome: {
          what: { tr: 'Deşarj durdu, bölgedeki üretim ve istihdam da durdu; elektrik açığı şebekeden kapandı.', en: 'The discharge stopped, and so did local generation and jobs; the shortfall was covered from the grid.', de: 'Die Einleitung endete, ebenso Erzeugung und Arbeitsplätze vor Ort; die Lücke deckte das Netz.' },
          why: { tr: 'Sorun jeotermalin kendisi değil, akışkanın nasıl yönetildiğidir. Kaynağı kapatmak düşük karbonlu üretimi de kapatır: teknoloji değil, uygulama seçimi tartışılıyordu.', en: 'The problem was never geothermal itself but how the fluid is handled. Closing the source closes the low-carbon generation with it: the argument was about practice, not technology.', de: 'Das Problem ist nicht die Geothermie, sondern der Umgang mit dem Fluid. Die Quelle zu schließen beendet auch die kohlenstoffarme Erzeugung: Es ging um die Praxis, nicht um die Technik.' }
        }
      }
    ]
  },

  // Akdeniz (Mediterranean)
  {
    id: 'antalya-caretta',
    regionId: 'mediterranean',
    title: { tr: 'Caretta Caretta Yuvaları', en: 'Loggerhead Turtle Nests', de: 'Nistplätze der Unechten Karettschildkröte' },
    description: { tr: 'Antalya sahillerinde otel inşaatı kaplumbağa yuvalarını tehdit ediyor.', en: 'Hotel construction on Antalya’s beaches is threatening sea turtle nesting sites.', de: 'Hotelbauten an Antalyas Stränden bedrohen die Nistplätze der Meeresschildkröten.' },
    location: { provinces: ['Antalya', 'Muğla'] },
    tags: { pollution: ['biodiversity', 'landuse', 'light'] },
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
    location: { provinces: ['Aksaray', 'Konya', 'Ankara'], basin: 'Konya Kapalı Havzası' },
    tags: { pollution: ['water', 'groundwater', 'biodiversity'] },
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
    location: { provinces: ['Erzurum', 'Kars', 'Ardahan'] },
    tags: { pollution: ['hazard'] },
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
    location: { provinces: ['Batman', 'Mardin', 'Gaziantep'], basin: 'Dicle' },
    tags: { pollution: ['heritage', 'water', 'energy'] },
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
    location: { provinces: ['Bursa'] },
    tags: { pollution: ['air'] },
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
    id: 'aegean-olive-vs-lignite',
    regionId: 'aegean',
    title: { tr: 'Zeytinlik mi, Linyit mi?', en: 'Olive Grove or Lignite?', de: 'Olivenhain oder Braunkohle?' },
    description: { tr: "Manisa-Yırca'da 2014'te bir termik santral projesi için yaklaşık 6 bin zeytin ağacı kesildi; mahkeme santralin ÇED olumlu kararını daha sonra iptal etti. Aynı tartışma 2023'te Muğla-Akbelen ormanında yeniden yaşandı.", en: 'In Yırca, Manisa, around 6,000 olive trees were cut in 2014 for a coal plant project; a court later annulled the plant\'s environmental approval. The same argument returned at Akbelen forest in Muğla in 2023.', de: 'In Yırca (Manisa) wurden 2014 rund 6.000 Olivenbäume für ein Kohlekraftwerksprojekt gefällt; ein Gericht hob die Umweltgenehmigung später auf. 2023 wiederholte sich der Streit im Wald von Akbelen in Muğla.' },
    location: { provinces: ['Manisa', 'Muğla'] },
    tags: { pollution: ['landuse', 'energy', 'air'], mechanisms: ['irreversibility'] },
    sources: [
      { label: 'Cumhuriyet: Yırca\'da zeytin ağaçlarının kesilmesi (Kasım 2014)', url: 'https://www.cumhuriyet.com.tr/haber/bile-bile-kesmisler-139223', status: 'partly-verified' },
      { label: 'BirGün: Yırca santral projesine ÇED iptali', url: 'https://www.birgun.net/haber/kolin-in-yirca-daki-santral-projesine-gec-gelen-ced-iptali-83767', status: 'partly-verified' }
    ],
    choices: [
      {
        text: { tr: 'Zeytinlikleri Koru', en: 'Protect the Olive Groves', de: 'Olivenhaine schützen' },
        effects: { budget: -30, happiness: +20, cleanliness: +10 },
        outcome: {
          what: { tr: 'Ağaçlar yerinde kaldı; köyün geçim kaynağı korundu, bölgeye beklenen yatırım gelmedi.', en: 'The trees stayed, the village kept its livelihood and the promised investment went elsewhere.', de: 'Die Bäume blieben, das Dorf behielt seine Lebensgrundlage, die erhoffte Investition kam nicht.' },
          why: { tr: 'Asırlık bir zeytinlik onlarca yılda yetişir: kaybı pratikte geri döndürülemez, oysa santral başka bir sahada kurulabilir.', en: 'A century-old grove takes decades to grow: losing it is effectively irreversible, while a plant can be sited somewhere else.', de: 'Ein hundertjähriger Hain wächst über Jahrzehnte: Sein Verlust ist praktisch unumkehrbar, ein Kraftwerk lässt sich anderswo bauen.' }
        }
      },
      {
        text: { tr: 'Kesime İzin Ver', en: 'Allow the Felling', de: 'Fällung genehmigen' },
        effects: { budget: +120, happiness: -25, cleanliness: -20 },
        outcome: {
          what: { tr: 'Ağaçlar kesildi ve kasaya para girdi; köy uzun bir hukuk mücadelesine başladı.', en: 'The trees came down and money came in; the village began a long legal fight.', de: 'Die Bäume fielen, Geld floss; das Dorf begann einen langen Rechtsstreit.' },
          why: { tr: 'Linyit yakmak hem ocak sahasını hem havayı etkiler. Üstelik kesim bir kez yapıldığında, sonradan gelen mahkeme kararı sahada bir şey geri getirmez.', en: 'Burning lignite affects both the mine site and the air. And once the felling is done, a later court ruling brings nothing back on the ground.', de: 'Braunkohle betrifft Tagebau und Luft zugleich. Ist gefällt, bringt ein späteres Urteil vor Ort nichts zurück.' }
        }
      },
      {
        text: { tr: 'Yargı Süreci Bitene Kadar İzni Beklet', en: 'Hold the Permit Until the Courts Rule', de: 'Genehmigung bis zum Urteil aussetzen' },
        effects: { budget: -10, happiness: +5, cleanliness: +5 },
        outcome: {
          what: { tr: 'Şirket gecikmeden şikayetçi oldu, köy nöbeti bıraktı ve karar mahkemeden çıkana kadar hiçbir ağaç kesilmedi.', en: 'The company complained about the delay, the village stood down its watch, and no tree was cut before the ruling came.', de: 'Die Firma beklagte die Verzögerung, das Dorf beendete die Wache, und bis zum Urteil fiel kein Baum.' },
          why: { tr: "Yırca'da yürütmeyi durdurma kararı ağaçlar kesildikten yaklaşık 12 saat sonra açıklandı. Geri döndürülemez işlemi yargı süreci bitmeden yapmak, hukuki galibiyeti anlamsız kılar: sıra, kararın kendisi kadar önemlidir.", en: 'At Yırca the stay of execution arrived about twelve hours after the trees were cut. Taking an irreversible step before the courts finish makes winning the case meaningless: sequence matters as much as the ruling.', de: 'In Yırca kam der Baustopp rund zwölf Stunden nach der Fällung. Ein unumkehrbarer Schritt vor Verfahrensende entwertet den Sieg vor Gericht: Die Reihenfolge zählt so viel wie das Urteil.' }
        }
      }
    ]
  },

  // Karadeniz
  {
    id: 'samsun-flood',
    regionId: 'blacksea',
    title: { tr: 'Sel Baskını Tehlikesi', en: 'Flood Danger', de: 'Hochwassergefahr' },
    description: { tr: 'Samsun\'da yanlış şehirleşme dere yataklarını tıkadı, sel riski var.', en: 'Poor urban planning in Samsun has blocked streambeds, raising flood risk.', de: 'Fehlerhafte Stadtplanung in Samsun hat Bachbetten verstopft und erhöht die Überschwemmungsgefahr.' },
    location: { provinces: ['Samsun', 'Kastamonu'] },
    tags: { pollution: ['hazard', 'landuse'] },
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
    title: { tr: "Konya'da Obruklar", en: 'Sinkholes in Konya', de: 'Dolinen in Konya' },
    description: { tr: 'Karapınar ve Ereğli çevresinde yüzlerce obruk kayda geçti: 2022 tarihli bir çalışma Karapınar\'da 619, Ereğli\'de 130 obruk sayıyor. Sulama için çekilen yeraltı suyu düştükçe karstik boşluklar taşıyıcı desteğini yitiriyor.', en: 'Hundreds of sinkholes have been recorded around Karapınar and Ereğli: a 2022 study counts 619 in Karapınar and 130 in Ereğli. As irrigation pumping lowers the water table, karst cavities lose the support that held them up.', de: 'Rund um Karapınar und Ereğli wurden Hunderte Dolinen erfasst: Eine Studie von 2022 zählt 619 in Karapınar und 130 in Ereğli. Sinkt der Grundwasserspiegel durch Bewässerung, verlieren Karsthohlräume ihren Halt.' },
    location: { provinces: ['Konya', 'Karaman', 'Aksaray'], basin: 'Konya Kapalı Havzası' },
    tags: { pollution: ['groundwater', 'hazard', 'landuse'], mechanisms: ['rebound-effect', 'aquifer-drawdown'] },
    sources: [
      { label: 'Karapınar ve Ereğli obruk envanteri (KTÜN, 2022)', url: 'https://gcris.ktun.edu.tr/handle/20.500.13091/5670', status: 'partly-verified' },
      { label: 'Grafton ve ark., The paradox of irrigation efficiency, Science (2018)', url: 'https://doi.org/10.1126/science.aat9314', status: 'verified' }
    ],
    choices: [
      {
        text: { tr: 'Kaçak Kuyuları Kapat', en: 'Close the Illegal Wells', de: 'Illegale Brunnen schließen' },
        effects: { budget: -40, happiness: -30, cleanliness: +15 },
        outcome: {
          what: { tr: 'Denetim ekipleri kuyuları mühürledi; çiftçiler sert tepki gösterdi, çekim gözle görülür biçimde azaldı.', en: 'Inspectors sealed the wells, farmers reacted furiously, and extraction fell visibly.', de: 'Kontrolleure versiegelten die Brunnen, Bauern protestierten heftig, die Entnahme sank sichtbar.' },
          why: { tr: 'Obruğun nedeni toplam çekimdir. Çekim düşünce su tablasının düşüşü yavaşlar, ama kapanan her kuyu bir geçim kaynağıdır: bu yüzden en doğrudan çözüm aynı zamanda en sert olanıdır.', en: 'Total extraction is what drives the sinkholes. Less pumping slows the drawdown, but every sealed well is somebody\'s livelihood: the most direct remedy is also the harshest.', de: 'Entscheidend ist die Gesamtentnahme. Weniger Pumpen bremst das Absinken, doch jeder versiegelte Brunnen ist eine Existenzgrundlage: Die direkteste Lösung ist auch die härteste.' }
        }
      },
      {
        text: { tr: 'Damla Sulamayı Sübvanse Et', en: 'Subsidise Drip Irrigation', de: 'Tröpfchenbewässerung fördern' },
        effects: { budget: -150, happiness: +15, cleanliness: 0 },
        delayed: [
          {
            inDays: 20,
            effects: { happiness: -5, cleanliness: -12 },
            message: { tr: "Karapınar'da yeni bir obruk açıldı: sulanan alan genişlemişti.", en: 'A new sinkhole has opened at Karapınar: the irrigated area had grown.', de: 'Bei Karapınar ist eine neue Doline eingebrochen: Die bewässerte Fläche war gewachsen.' }
          }
        ],
        outcome: {
          what: { tr: 'Çiftçiler damla sulamaya geçti ve tasarruf ettikleri suyla daha geniş alan suladı; su tablası düşmeye devam etti.', en: 'Farmers switched to drip and used the water they saved to irrigate more land; the water table kept falling.', de: 'Die Bauern stellten auf Tropfbewässerung um und bewässerten mit dem gesparten Wasser mehr Fläche; der Grundwasserspiegel sank weiter.' },
          why: { tr: 'Buna sulamada geri tepme (verimlilik paradoksu) denir: tarla ölçeğinde verim artar, havza ölçeğinde toplam çekim azalmaz. Ölçüm ve kota olmadan verimlilik tek başına su tasarrufu demek değildir (Grafton vd., Science, 2018).', en: 'This is the rebound, or irrigation efficiency paradox: efficiency rises at field scale while total basin extraction does not fall. Without metering and caps, efficiency alone is not water saved (Grafton et al., Science, 2018).', de: 'Das ist der Rebound-Effekt, das Effizienzparadox: Auf dem Feld steigt die Effizienz, die Entnahme im Einzugsgebiet sinkt nicht. Ohne Zähler und Obergrenzen ist Effizienz allein kein gespartes Wasser (Grafton u.a., Science, 2018).' }
        }
      },
      {
        text: { tr: 'Damla Sulama + Sayaçlı Kota + Ürün Deseni', en: 'Drip Irrigation + Metered Quota + Crop Change', de: 'Tropfbewässerung + Zählerquote + Fruchtwechsel' },
        effects: { budget: -180, happiness: -10, cleanliness: +20 },
        outcome: {
          what: { tr: 'Her kuyuya sayaç takıldı, yıllık kota tanımlandı ve su isteyen ürünlerden kademeli çıkış desteklendi. Çiftçi memnun değildi, su tablasının düşüşü durdu.', en: 'Every well got a meter, an annual quota was set and a gradual shift away from thirsty crops was funded. Farmers were unhappy; the drawdown stopped.', de: 'Jeder Brunnen bekam einen Zähler, eine Jahresquote wurde festgelegt und der Ausstieg aus durstigen Kulturen gefördert. Die Bauern waren unzufrieden, das Absinken endete.' },
          why: { tr: 'Kota çekimi doğrudan sınırlar, damla sulama aynı kota içinde daha çok ürün almayı sağlar, ürün deseni ise talebi küçültür. Geri tepmeyi kıran, verimliliğin kendisi değil, verimliliğin üstüne konan tavandır.', en: 'A quota caps extraction directly, drip gets more crop out of the same quota, and the crop shift shrinks demand. What breaks the rebound is not efficiency but the ceiling placed on top of it.', de: 'Die Quote begrenzt die Entnahme direkt, Tropfbewässerung holt mehr Ertrag aus derselben Quote, der Fruchtwechsel senkt den Bedarf. Den Rebound bricht nicht die Effizienz, sondern die Obergrenze darüber.' }
        }
      }
    ]
  },

  // Akdeniz
  {
    id: 'mersin-port',
    regionId: 'mediterranean',
    title: { tr: 'Liman Sızıntısı', en: 'Port Spill', de: 'Hafenverschmutzung' },
    description: { tr: 'Mersin Limanı yakınlarında bir yük gemisinden kimyasal sızıntı saptandı.', en: 'A chemical spill from a cargo ship has been detected near Mersin Port.', de: 'In der Nähe des Hafens von Mersin wurde ein Chemikalienleck eines Frachtschiffs festgestellt.' },
    location: { provinces: ['Mersin'] },
    tags: { pollution: ['marine', 'water'] },
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
    location: { provinces: ['Malatya'] },
    tags: { pollution: ['hazard'] },
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
    location: { provinces: ['Mardin'] },
    tags: { pollution: ['air', 'noise', 'heritage'] },
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
    location: { provinces: [], nationwide: true },
    tags: { pollution: ['air', 'hazard'] },
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
    location: { provinces: [], nationwide: true },
    tags: { pollution: ['water', 'waste'] },
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
    location: { provinces: [], nationwide: true },
    tags: { pollution: ['energy'] },
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
    location: { provinces: ['İstanbul'] },
    tags: { pollution: ['hazard'] },
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
    location: { provinces: ['İstanbul'], basin: 'İstanbul Boğazı' },
    tags: { pollution: ['air', 'marine'] },
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
    location: { provinces: ['Muğla', 'Aydın', 'İzmir'] },
    tags: { pollution: ['landuse', 'marine'] },
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
    location: { provinces: ['Muğla'] },
    tags: { pollution: ['biodiversity', 'marine'] },
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
    location: { provinces: ['Antalya'] },
    tags: { pollution: ['waste', 'soil'] },
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
    location: { provinces: ['Mersin', 'Adana', 'Antalya'] },
    tags: { pollution: ['groundwater'] },
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
    location: { provinces: ['Ankara'] },
    tags: { pollution: ['air'] },
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
    location: { provinces: ['Nevşehir'] },
    tags: { pollution: ['air', 'noise'] },
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
    location: { provinces: ['Trabzon', 'Rize', 'Ordu', 'Samsun'], basin: 'Karadeniz' },
    tags: { pollution: ['biodiversity', 'marine'] },
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
    location: { provinces: ['Zonguldak', 'Bartın'] },
    tags: { pollution: ['water', 'marine', 'soil'] },
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
    location: { provinces: ['Van', 'Muş', 'Bitlis'] },
    tags: { pollution: ['biodiversity'] },
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
    location: { provinces: ['Elazığ', 'Malatya'], basin: 'Fırat' },
    tags: { pollution: ['water', 'energy'] },
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
    id: 'harran-salinity',
    regionId: 'southeastern',
    title: { tr: 'Harran Ovasında Tuzlanma', en: 'Salinisation on the Harran Plain', de: 'Versalzung in der Harran-Ebene' },
    description: { tr: "Harran Ovası 1995'ten beri Atatürk Barajı suyuyla sulanıyor. Drenaj yetersiz kaldığı ve tarlaya fazla su verildiği için taban suyu yükseldi; bir DSİ çalışması 20-25 bin hektarda ciddi taban suyu ve tuzluluk sorunu bildiriyor.", en: 'The Harran Plain has been irrigated with water from the Atatürk Dam since 1995. Drainage did not keep up and fields were over-watered, so the water table rose; a state hydrogeology study reports serious shallow-groundwater and salinity problems on 20,000-25,000 hectares.', de: 'Die Harran-Ebene wird seit 1995 mit Wasser des Atatürk-Staudamms bewässert. Die Dränage hielt nicht Schritt und es wurde zu viel bewässert, der Grundwasserspiegel stieg; eine staatliche Studie meldet auf 20.000-25.000 Hektar ernste Vernässungs- und Versalzungsprobleme.' },
    location: { provinces: ['Şanlıurfa'], basin: 'Fırat' },
    tags: { pollution: ['soil', 'groundwater', 'landuse'], mechanisms: ['salinisation', 'waterlogging'] },
    sources: [
      { label: 'Harran Ovasında sulama sonrası taban suyu ve tuzluluk (JMO/DSİ bildirisi)', url: 'https://www.jmo.org.tr/resimler/ekler/a02387b02ce7de2_ek.pdf', status: 'verified' },
      { label: 'Harran Ovası toprak tuzluluğu ve GAP sulama alanı (TURJAF)', url: 'https://agrifoodscience.com/index.php/TURJAF/article/download/2855/1353/23212', status: 'partly-verified' }
    ],
    choices: [
      {
        text: { tr: 'Drenaj Şebekesini Tamamla', en: 'Complete the Drainage Network', de: 'Dränagenetz fertigstellen' },
        effects: { budget: -140, happiness: +5, cleanliness: +20 },
        outcome: {
          what: { tr: 'Tahliye kanalları ve drenler yapıldı; taban suyu çekildi, tuzlu lekeler yıllar içinde küçüldü.', en: 'Collector channels and field drains went in: the water table dropped and the salt patches shrank over the years.', de: 'Sammler und Dränagen entstanden: Der Grundwasserspiegel sank, die Salzflecken schrumpften über Jahre.' },
          why: { tr: 'Tuz suyla gelir, suyun buharlaştığı yerde kalır. Taban suyu kök bölgesine yaklaştığında tuz yukarı taşınır; drenaj suya çıkış vererek bu taşınmayı tersine çevirir.', en: 'Salt arrives with the water and stays where the water evaporates. Once the water table reaches the root zone the salt is drawn upward; drainage gives the water an exit and reverses that movement.', de: 'Salz kommt mit dem Wasser und bleibt, wo es verdunstet. Erreicht das Grundwasser die Wurzelzone, wird Salz nach oben gezogen; Dränage gibt dem Wasser einen Ausgang und kehrt das um.' }
        }
      },
      {
        text: { tr: 'Sulamaya Aynı Şekilde Devam Et', en: 'Keep Irrigating the Same Way', de: 'Weiter wie bisher bewässern' },
        effects: { budget: +30, happiness: +10, cleanliness: -20 },
        delayed: [
          {
            inDays: 25,
            effects: { cleanliness: -12 },
            message: { tr: 'Harran Ovasında tuzlu lekeler yayıldı; drenaj hâlâ yetersiz.', en: 'Salt patches have spread across the Harran Plain; drainage is still short.', de: 'In der Harran-Ebene breiten sich Salzflecken aus; die Dränage fehlt weiterhin.' }
          }
        ],
        outcome: {
          what: { tr: 'Bu yılın hasadı iyi geçti; tarlaların kenarlarında beyaz tuz lekeleri genişledi.', en: 'This year\'s harvest was good, and the white salt patches at the field edges kept spreading.', de: 'Die diesjährige Ernte war gut, die weißen Salzflecken an den Feldrändern wuchsen weiter.' },
          why: { tr: 'Daha çok su her zaman daha çok ürün demek değildir. Drenajsız ovada fazla su taban suyunu yükseltir ve toprağı tuzlandırır: zarar yavaş birikir, bu yüzden ilk yıllarda görünmez.', en: 'More water does not always mean more crop. On a plain without drainage, excess water raises the water table and salts the soil: the damage accumulates slowly, which is why it is invisible in the early years.', de: 'Mehr Wasser heißt nicht immer mehr Ertrag. Ohne Dränage hebt Überschusswasser den Grundwasserspiegel und versalzt den Boden: Der Schaden häuft sich langsam und bleibt anfangs unsichtbar.' }
        }
      },
      {
        text: { tr: 'Su Kotası ve Tuza Dayanıklı Ürün Deseni', en: 'Water Quota and Salt-Tolerant Crops', de: 'Wasserquote und salztolerante Kulturen' },
        effects: { budget: -60, happiness: -15, cleanliness: +15 },
        outcome: {
          what: { tr: 'Parsel başına su ölçüldü ve pamuk yerine daha az su isteyen ürünler desteklendi; çiftçi gelirinde ilk yıl düşüş oldu.', en: 'Water was metered per parcel and less thirsty crops were funded in place of cotton, with farm incomes dipping in the first year.', de: 'Wasser wurde je Parzelle gemessen und statt Baumwolle genügsamere Kulturen gefördert; im ersten Jahr sanken die Einkommen.' },
          why: { tr: 'Tuzlanmanın motoru tarlaya giren fazla sudur. Girdiyi kısmak hem taban suyunu düşürür hem de drenaj yatırımını küçültür; ürün deseni ise aynı suyla daha fazla gelir elde etmeyi sağlar.', en: 'The engine of salinisation is the excess water entering the field. Cutting the input lowers the water table and shrinks the drainage bill, while the crop mix earns more from the same water.', de: 'Motor der Versalzung ist das Überschusswasser im Feld. Weniger Zufuhr senkt den Grundwasserspiegel und die Dränagekosten, die Fruchtfolge erlöst mehr aus demselben Wasser.' }
        }
      }
    ]
  },
  {
    id: 'southeastern-desertification',
    regionId: 'southeastern',
    title: { tr: 'Otlak Arazisinin Çölleşmesi', en: 'Desertification of Grazing Land', de: 'Wüstenbildung auf Weideland' },
    description: { tr: 'Aşırı otlatma ve azalan yağış geniş otlak alanlarını çorak araziye çeviriyor.', en: 'Overgrazing and declining rainfall are turning vast grazing lands into barren ground.', de: 'Überweidung und abnehmender Niederschlag verwandeln weite Weideflächen in Ödland.' },
    location: { provinces: ['Şanlıurfa', 'Mardin', 'Diyarbakır'] },
    tags: { pollution: ['soil', 'landuse'] },
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
