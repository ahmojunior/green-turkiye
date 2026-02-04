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