import type { GameEvent } from '../types';

export const EVENTS: GameEvent[] = [
  // --- Genel Olaylar ---
  {
    id: 'factory-waste',
    title: 'Kaçak Atık Dökümü',
    description: 'Yerel bir fabrika maliyetleri düşürmek için atıklarını arıtmadan nehre döküyor.',
    choices: [
      {
        text: 'Fabrikayı Kapat',
        effects: { budget: -100, happiness: -5, cleanliness: +15 }
      },
      {
        text: 'Ağır Para Cezası Kes',
        effects: { budget: +50, happiness: 0, cleanliness: +5 }
      },
      {
        text: 'Görmezden Gel (Rüşvet)',
        effects: { budget: +100, happiness: -10, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'tourist-season',
    title: 'Turist Akını',
    description: 'Bölgeye turist yağıyor! Ekonomi için harika ama çevre kirliliği artabilir.',
    choices: [
      {
        text: 'Herkesi Kabul Et',
        effects: { budget: +80, happiness: +5, cleanliness: -10 }
      },
      {
        text: 'Eko-Turizm Kotası Koy',
        effects: { budget: +20, happiness: 0, cleanliness: +5 }
      }
    ]
  },
  {
    id: 'forest-fire-risk',
    title: 'Orman Yangını Riski',
    description: 'Sıcak hava dalgası orman yangını riskini artırıyor.',
    choices: [
      {
        text: 'Gözetleme Kuleleri Kur',
        effects: { budget: -60, happiness: +5, cleanliness: +5 }
      },
      {
        text: 'Bütçe Ayırma',
        effects: { budget: 0, happiness: -5, cleanliness: -10 }
      }
    ]
  },
  {
    id: 'plastic-ban',
    title: 'Plastik Poşet Yasağı',
    description: 'Çevre örgütleri plastik kullanımının tamamen yasaklanması için baskı yapıyor. Marketler ise tepkili.',
    choices: [
      {
        text: 'Tam Yasak Uygula',
        effects: { budget: -40, happiness: -10, cleanliness: +25 }
      },
      {
        text: 'Ücretli Yap ve Denetle',
        effects: { budget: +30, happiness: -5, cleanliness: +10 }
      },
      {
        text: 'Sektörü Serbest Bırak',
        effects: { budget: +10, happiness: +5, cleanliness: -15 }
      }
    ]
  },
  {
    id: 'solar-incentive',
    title: 'Güneş Enerjisi Teşviği',
    description: 'Uluslararası bir fon, güneş paneli tarlaları kurmak için hibe teklif ediyor, ancak tarım arazisi talep ediyor.',
    choices: [
      {
        text: 'Kabul Et (Tarım Arazisine Kur)',
        effects: { budget: +100, happiness: -5, cleanliness: +20 }
      },
      {
        text: 'Sadece Çorak Araziye İzin Ver',
        effects: { budget: +20, happiness: +5, cleanliness: +10 }
      },
      {
        text: 'Reddet',
        effects: { budget: 0, happiness: 0, cleanliness: 0 }
      }
    ]
  },
  {
    id: 'ewaste-dump',
    title: 'Elektronik Atık Krizi',
    description: 'Şehir çöplüklerinde geri dönüştürülmeyen elektronik atıklar toprağı zehirlemeye başladı.',
    choices: [
      {
        text: 'Geri Dönüşüm Tesisi Kur',
        effects: { budget: -80, happiness: +10, cleanliness: +15 }
      },
      {
        text: 'Yurt Dışına İhraç Et',
        effects: { budget: +40, happiness: -5, cleanliness: +5 } // Etik değil ama karlı
      }
    ]
  },

  // --- MARMARA BÖLGESİ EKLEMELERİ ---
  {
    id: 'marmara-urban-renewal',
    regionId: 'marmara',
    title: 'Kentsel Dönüşüm İkilemi',
    description: 'İstanbul\'da riskli binaların yıkımı çok fazla moloz ve toz çıkarıyor. Halk rahatsız.',
    choices: [
      {
        text: 'Yıkımları Hızlandır (Toza Rağmen)',
        effects: { budget: -50, happiness: -15, cleanliness: -10 }
      },
      {
        text: 'Yeşil Bariyer Zorunluluğu Getir',
        effects: { budget: -100, happiness: +5, cleanliness: +5 }
      }
    ]
  },
  {
    id: 'thrace-sunflower',
    regionId: 'marmara',
    title: 'Ayçiçeği Tarlalarında Sanayi',
    description: 'Trakya\'daki verimli ayçiçeği tarlalarına yeni bir organize sanayi bölgesi kurulmak isteniyor.',
    choices: [
      {
        text: 'Sanayiye İzin Ver',
        effects: { budget: +130, happiness: -20, cleanliness: -15 }
      },
      {
        text: 'Tarımsal Sit Alanı İlan Et',
        effects: { budget: -30, happiness: +15, cleanliness: +10 }
      }
    ]
  },

  // --- EGE BÖLGESİ EKLEMELERİ ---
  {
    id: 'izmir-wind-farm',
    regionId: 'aegean',
    title: 'Rüzgar Gülü ve Kuş Göçü',
    description: 'Çeşme\'ye kurulacak rüzgar santrali göçmen kuşların rotasında kalıyor.',
    choices: [
      {
        text: 'Projeyi Onayla (Temiz Enerji)',
        effects: { budget: +60, happiness: +5, cleanliness: +15 }
      },
      {
        text: 'Konumu Değiştir (Ekstra Maliyet)',
        effects: { budget: -50, happiness: +10, cleanliness: +15 }
      }
    ]
  },

  // --- AKDENİZ BÖLGESİ EKLEMELERİ ---
  {
    id: 'med-invasive-fish',
    regionId: 'mediterranean',
    title: 'İstilacı Türler',
    description: 'Aslan balığı ve Balon balığı yerel balık popülasyonunu yok ediyor.',
    choices: [
      {
        text: 'Avlanma Teşviği Ver (Ödül)',
        effects: { budget: -40, happiness: +10, cleanliness: +5 }
      },
      {
        text: 'Doğal Dengeye Bırak',
        effects: { budget: 0, happiness: -10, cleanliness: -5 }
      }
    ]
  },
  {
    id: 'adana-stubble-burning',
    regionId: 'mediterranean',
    title: 'Anız Yakma Sorunu',
    description: 'Çukurova\'da hasat sonrası tarlalar yakılıyor, duman tüm şehri kapladı.',
    choices: [
      {
        text: 'Ağır Cezalar Uygula',
        effects: { budget: +20, happiness: -10, cleanliness: +10 }
      },
      {
        text: 'Eğitim ve Makine Desteği Ver',
        effects: { budget: -60, happiness: +15, cleanliness: +15 }
      }
    ]
  },

  // --- İÇ ANADOLU BÖLGESİ EKLEMELERİ ---
  {
    id: 'ankara-green-belt',
    regionId: 'anatolian',
    title: 'Yeşil Kuşak Projesi',
    description: 'Bozkırın ortasına yapay bir orman kuşağı oluşturma projesi gündemde.',
    choices: [
      {
        text: 'Büyük Bütçe Ayır',
        effects: { budget: -120, happiness: +20, cleanliness: +20 }
      },
      {
        text: 'Daha Küçük Parklar Yap',
        effects: { budget: -40, happiness: +5, cleanliness: +5 }
      }
    ]
  },

  // --- KARADENİZ BÖLGESİ EKLEMELERİ ---
  {
    id: 'blacksea-hes',
    regionId: 'blacksea',
    title: 'HES Protestoları',
    description: 'Yerel halk, derelerini kurutacak Hidroelektrik Santrali (HES) istemiyor.',
    choices: [
      {
        text: 'Halkı Dinle, İptal Et',
        effects: { budget: -90, happiness: +25, cleanliness: +10 }
      },
      {
        text: 'Güvenlik Güçleriyle İnşaatı Koru',
        effects: { budget: -30, happiness: -30, cleanliness: -5 }
      }
    ]
  },
  {
    id: 'fındık-pesticide',
    regionId: 'blacksea',
    title: 'Zirai İlaç Kalıntısı',
    description: 'Fındık ihracatında kullanılan ilaçlar nedeniyle ürünler gümrükten döndü.',
    choices: [
      {
        text: 'Organik Tarıma Geçişi Zorla',
        effects: { budget: -100, happiness: -10, cleanliness: +20 }
      },
      {
        text: 'Yeni Pazarlar Ara',
        effects: { budget: -20, happiness: +5, cleanliness: -5 }
      }
    ]
  },

  // --- DOĞU ANADOLU BÖLGESİ EKLEMELERİ ---
  {
    id: 'van-lake-pollution',
    regionId: 'eastern',
    title: 'Van Gölü Can Çekişiyor',
    description: 'Kanalizasyon atıkları İnci Kefali\'nin üreme alanlarını tehdit ediyor.',
    choices: [
      {
        text: 'Biyolojik Arıtma Tesisi Kur',
        effects: { budget: -150, happiness: +15, cleanliness: +25 }
      },
      {
        text: 'Geçici Temizlik Yap',
        effects: { budget: -30, happiness: +5, cleanliness: +5 }
      }
    ]
  },

  // --- GÜNEYDOĞU ANADOLU BÖLGESİ EKLEMELERİ ---
  {
    id: 'urfa-solar',
    regionId: 'southeastern',
    title: 'Güneşin Başkenti',
    description: 'Şanlıurfa\'nın yakıcı güneşi enerjiye dönüştürülebilir ama altyapı yetersiz.',
    choices: [
      {
        text: 'Altyapıyı Yenile ve Panel Kur',
        effects: { budget: -110, happiness: +10, cleanliness: +15 }
      },
      {
        text: 'Özel Sektörü Davet Et',
        effects: { budget: +50, happiness: 0, cleanliness: +10 }
      }
    ]
  },
  {
    id: 'dust-transport',
    regionId: 'southeastern',
    title: 'Sınır Ötesi Toz Taşınımı',
    description: 'Suriye üzerinden gelen çöl tozları hava kalitesini düşürüyor, nefes almak zorlaştı.',
    choices: [
      {
        text: 'Halka Maske Dağıt ve Uyar',
        effects: { budget: -20, happiness: +5, cleanliness: 0 }
      },
      {
        text: 'Ağaçlandırma Bariyeri Başlat',
        effects: { budget: -80, happiness: +10, cleanliness: +5 } // Uzun vadeli çözüm
      }
    ]
  },
  // --- Bölgesel Olaylar ---
  
  // Karadeniz (Black Sea)
  {
    id: 'rize-tea-landslide',
    regionId: 'blacksea',
    title: 'Rize\'de Heyelan Riski',
    description: 'Aşırı yağışlar Rize\'deki çay bahçelerinde heyelan riskini artırdı.',
    choices: [
      {
        text: 'İstinat Duvarları Ör',
        effects: { budget: -80, happiness: +10, cleanliness: 0 }
      },
      {
        text: 'Doğal Akışına Bırak',
        effects: { budget: 0, happiness: -20, cleanliness: -5 }
      }
    ]
  },

  // Marmara
  {
    id: 'istanbul-mucilage',
    regionId: 'marmara',
    title: 'Müsilaj Kabusu',
    description: 'Marmara Denizi\'ni müsilaj (deniz salyası) kapladı. Balıkçılık ve turizm tehlikede!',
    choices: [
      {
        text: 'Acil Temizlik Seferberliği',
        effects: { budget: -150, happiness: +20, cleanliness: +20 }
      },
      {
        text: 'Kendi Kendine Geçmesini Bekle',
        effects: { budget: 0, happiness: -30, cleanliness: -30 }
      }
    ]
  },

  // Ege (Aegean)
  {
    id: 'izmir-geothermal',
    regionId: 'aegean',
    title: 'Jeotermal Tartışması',
    description: 'İzmir\'de yeni bir jeotermal santral kurulmak isteniyor. Enerji vs Tarım arazileri.',
    choices: [
      {
        text: 'Santrale İzin Ver',
        effects: { budget: +100, happiness: -10, cleanliness: -5 }
      },
      {
        text: 'Tarım Arazisini Koru',
        effects: { budget: -20, happiness: +10, cleanliness: +5 }
      }
    ]
  },

  // Akdeniz (Mediterranean)
  {
    id: 'antalya-caretta',
    regionId: 'mediterranean',
    title: 'Caretta Caretta Yuvaları',
    description: 'Antalya sahillerinde otel inşaatı kaplumbağa yuvalarını tehdit ediyor.',
    choices: [
      {
        text: 'İnşaatı Durdur',
        effects: { budget: -100, happiness: +15, cleanliness: +10 }
      },
      {
        text: 'Turizme Öncelik Ver',
        effects: { budget: +150, happiness: -10, cleanliness: -5 }
      }
    ]
  },

  // İç Anadolu (Anatolian)
  {
    id: 'ankara-drought',
    regionId: 'anatolian',
    title: 'Tuz Gölü Kuruyor',
    description: 'Bilinçsiz sulama Tuz Gölü\'nü yok olma noktasına getirdi.',
    choices: [
      {
        text: 'Vahşi Sulamayı Yasakla',
        effects: { budget: -30, happiness: -10, cleanliness: +10 }
      },
      {
        text: 'Çiftçiyi Destekle (Suya Devam)',
        effects: { budget: +20, happiness: +10, cleanliness: -20 }
      }
    ]
  },

  // Doğu Anadolu (Eastern)
  {
    id: 'erzurum-snow',
    regionId: 'eastern',
    title: 'Yollar Kapandı',
    description: 'Erzurum\'da yoğun kar yağışı köy yollarını kapattı. Hasta nakli gerekiyor.',
    choices: [
      {
        text: 'Helikopter Ambulans Gönder',
        effects: { budget: -120, happiness: +25, cleanliness: 0 }
      },
      {
        text: 'Kar Küreme Ekiplerini Bekle',
        effects: { budget: -20, happiness: -10, cleanliness: 0 }
      }
    ]
  },

  // Güneydoğu Anadolu (Southeastern)
  {
    id: 'gap-dam',
    regionId: 'southeastern',
    title: 'Baraj Suları Yükseliyor',
    description: 'Yeni baraj antik bir kenti sular altında bırakmak üzere.',
    choices: [
      {
        text: 'Eserleri Taşı (Müze Yap)',
        effects: { budget: -200, happiness: +10, cleanliness: 0 }
      },
      {
        text: 'Barajı Doldur (Enerji Lazım)',
        effects: { budget: +150, happiness: -20, cleanliness: -5 }
      }
    ]
  },

  // --- Yeni Eklenen Bölgesel Olaylar ---

  // Marmara
  {
    id: 'bursa-smog',
    regionId: 'marmara',
    title: 'Sanayi Hava Kirliliği',
    description: 'Bursa\'da sanayi tesisleri nedeniyle hava kirliliği alarm seviyesine ulaştı.',
    choices: [
      {
        text: 'Filtre Zorunluluğu Getir',
        effects: { budget: -50, happiness: +5, cleanliness: +15 }
      },
      {
        text: 'Üretime Ara Verdir',
        effects: { budget: -120, happiness: -15, cleanliness: +25 }
      }
    ]
  },

  // Ege
  {
    id: 'olive-mining',
    regionId: 'aegean',
    title: 'Zeytinlik vs Maden',
    description: 'Muğla\'da linyit madeni açmak için asırlık zeytin ağaçlarının kesilmesi gerekiyor.',
    choices: [
      {
        text: 'Zeytinlikleri Koru',
        effects: { budget: -30, happiness: +20, cleanliness: +10 }
      },
      {
        text: 'Madene İzin Ver',
        effects: { budget: +120, happiness: -25, cleanliness: -20 }
      }
    ]
  },

  // Karadeniz
  {
    id: 'samsun-flood',
    regionId: 'blacksea',
    title: 'Sel Baskını Tehlikesi',
    description: 'Samsun\'da yanlış şehirleşme dere yataklarını tıkadı, sel riski var.',
    choices: [
      {
        text: 'Altyapıyı Yenile',
        effects: { budget: -100, happiness: +10, cleanliness: +5 }
      },
      {
        text: 'Dere Yatağını Boşalt',
        effects: { budget: -60, happiness: -20, cleanliness: +10 }
      }
    ]
  },

  // İç Anadolu
  {
    id: 'konya-sinkhole',
    regionId: 'anatolian',
    title: 'Konya\'da Obruklar',
    description: 'Yeraltı suyunun aşırı kullanımı Konya Ovası\'nda dev obruklar oluşturuyor.',
    choices: [
      {
        text: 'Yeraltı Suyunu Yasakla',
        effects: { budget: -40, happiness: -30, cleanliness: +15 }
      },
      {
        text: 'Modern Sulamaya Geç',
        effects: { budget: -150, happiness: +15, cleanliness: +10 }
      }
    ]
  },

  // Akdeniz
  {
    id: 'mersin-port',
    regionId: 'mediterranean',
    title: 'Liman Sızıntısı',
    description: 'Mersin Limanı yakınlarında bir yük gemisinden kimyasal sızıntı saptandı.',
    choices: [
      {
        text: 'Hızlı Müdahale Et',
        effects: { budget: -90, happiness: +5, cleanliness: +15 }
      },
      {
        text: 'Karantina Uygula',
        effects: { budget: -40, happiness: -10, cleanliness: +5 }
      }
    ]
  },

  // Doğu Anadolu
  {
    id: 'malatya-apricot',
    regionId: 'eastern',
    title: 'Kayısıda Don Vurdu',
    description: 'İklim değişikliği Malatya\'da zamansız don olaylarına ve mahsul kaybına yol açıyor.',
    choices: [
      {
        text: 'Çiftçiye Destek Paketi',
        effects: { budget: -70, happiness: +20, cleanliness: 0 }
      },
      {
        text: 'Seralaşmayı Teşvik Et',
        effects: { budget: -100, happiness: +10, cleanliness: +5 }
      }
    ]
  },

  // Güneydoğu Anadolu
  {
    id: 'mardin-quarry',
    regionId: 'southeastern',
    title: 'Taş Ocakları Tartışması',
    description: 'Mardin\'in tarihi dokusuna yakın taş ocakları toz ve gürültü kirliliği yaratıyor.',
    choices: [
      {
        text: 'Ocakları Kapat',
        effects: { budget: -60, happiness: +15, cleanliness: +10 }
      },
      {
        text: 'Sıkı Denetim Uygula',
        effects: { budget: -20, happiness: +5, cleanliness: +5 }
      }
    ]
  }
];
