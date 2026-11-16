import type { EventChoice, LetterKind, LocalizedText } from '../types';

// Story content for the consequence channels (ROADMAP Faz 4–5): the citizens
// who write letters, the letter templates, the news ticker and the endings.
// The reducer stores only facts (who, which decision, which tier); every line
// of text is built here at render time.

// ---------------------------------------------------------------------------
// What counts as a dirty deal or a clean choice. The holding and the co-op grow
// from these, so the rule must stay provable from the decision log.
// ---------------------------------------------------------------------------

/** Money in, environment out: a bribe, or a deal that pays to pollute. */
export const isDirtyDeal = (c: EventChoice) =>
    !!c.bribe || ((c.effects.budget ?? 0) > 0 && (c.effects.cleanliness ?? 0) < 0);

/** A real clean-up that does not pay for itself. */
export const isCleanChoice = (c: EventChoice) =>
    !isDirtyDeal(c) && (c.effects.cleanliness ?? 0) >= 10 && (c.effects.budget ?? 0) <= 0;

// ---------------------------------------------------------------------------
// Citizens: two per region, each tied to a province on the map.
// ---------------------------------------------------------------------------

export interface Character {
    id: string;
    name: string;
    role: LocalizedText;
    province: string; // must match the map's province name
}

const c = (id: string, name: string, province: string, tr: string, en: string, de: string): Character =>
    ({ id, name, province, role: { tr, en, de } });

export const CHARACTERS: Record<string, Character[]> = {
    // Türkiye
    marmara: [
        c('ayse', 'Ayşe', 'Kocaeli', 'öğretmen', 'teacher', 'Lehrerin'),
        c('riza', 'Rıza', 'Çanakkale', 'balıkçı', 'fisherman', 'Fischer'),
    ],
    blacksea: [
        c('hasan', 'Hasan amca', 'Rize', 'balıkçı', 'fisherman', 'Fischer'),
        c('fadime', 'Fadime abla', 'Trabzon', 'çay üreticisi', 'tea grower', 'Teebäuerin'),
    ],
    aegean: [
        c('deniz', 'Deniz', 'İzmir', 'üniversite öğrencisi', 'university student', 'Studentin'),
        c('mustafa', 'Mustafa amca', 'Muğla', 'zeytin üreticisi', 'olive grower', 'Olivenbauer'),
    ],
    anatolian: [
        c('halil', 'Halil', 'Konya', 'çiftçi', 'farmer', 'Landwirt'),
        c('elif', 'Elif', 'Ankara', 'hemşire', 'nurse', 'Krankenpflegerin'),
    ],
    mediterranean: [
        c('serkan', 'Serkan', 'Antalya', 'pansiyoncu', 'guesthouse owner', 'Pensionswirt'),
        c('zeynep', 'Zeynep', 'Mersin', 'narenciye üreticisi', 'citrus grower', 'Zitrusbäuerin'),
    ],
    eastern: [
        c('rojda', 'Rojda', 'Van', 'öğretmen', 'teacher', 'Lehrerin'),
        c('kemal', 'Kemal amca', 'Erzurum', 'hayvan yetiştiricisi', 'livestock farmer', 'Viehzüchter'),
    ],
    southeastern: [
        c('ahmet', 'Ahmet', 'Şanlıurfa', 'çiftçi', 'farmer', 'Landwirt'),
        c('leyla', 'Leyla', 'Gaziantep', 'esnaf', 'shopkeeper', 'Ladenbesitzerin'),
    ],
    // Deutschland
    nord: [
        c('jens', 'Jens', 'Hamburg', 'liman işçisi', 'dock worker', 'Hafenarbeiter'),
        c('anke', 'Anke', 'Schleswig-Holstein', 'balıkçı', 'fisher', 'Fischerin'),
    ],
    ruhrgebiet: [
        c('klaus', 'Klaus', 'Nordrhein-Westfalen', 'emekli madenci', 'retired miner', 'Bergmann im Ruhestand'),
        c('aylin', 'Aylin', 'Nordrhein-Westfalen', 'öğretmen', 'teacher', 'Lehrerin'),
    ],
    rheinmain: [
        c('sabine', 'Sabine', 'Hessen', 'banka çalışanı', 'bank clerk', 'Bankangestellte'),
        c('peter', 'Peter', 'Rheinland-Pfalz', 'bağcı', 'winemaker', 'Winzer'),
    ],
    bayern: [
        c('resi', 'Resi', 'Bayern', 'çiftçi', 'farmer', 'Bäuerin'),
        c('florian', 'Florian', 'Bayern', 'orman muhafızı', 'forester', 'Förster'),
    ],
    badenwuerttemberg: [
        c('markus', 'Markus', 'Baden-Württemberg', 'mühendis', 'engineer', 'Ingenieur'),
        c('lena', 'Lena', 'Baden-Württemberg', 'arıcı', 'beekeeper', 'Imkerin'),
    ],
    ost: [
        c('gisela', 'Gisela', 'Sachsen', 'emekli', 'pensioner', 'Rentnerin'),
        c('uwe', 'Uwe', 'Brandenburg', 'çiftçi', 'farmer', 'Landwirt'),
    ],
    // United Kingdom
    scotland: [
        c('fiona', 'Fiona', 'Edinburgh', 'hemşire', 'nurse', 'Krankenpflegerin'),
        c('angus', 'Angus', 'Dumfries and Galloway', 'balıkçı', 'fisherman', 'Fischer'),
    ],
    'northern-england': [
        c('tom', 'Tom', 'Cumbria', 'koyun çiftçisi', 'sheep farmer', 'Schafzüchter'),
        c('priya', 'Priya', 'Sunderland', 'esnaf', 'shopkeeper', 'Ladenbesitzerin'),
    ],
    midlands: [
        c('ray', 'Ray', 'Derbyshire', 'emekli madenci', 'retired miner', 'Bergmann im Ruhestand'),
        c('amira', 'Amira', 'Leicestershire', 'öğretmen', 'teacher', 'Lehrerin'),
    ],
    wales: [
        c('rhys', 'Rhys', 'Cardiff', 'üniversite öğrencisi', 'university student', 'Student'),
        c('gwen', 'Gwen', 'Pembrokeshire', 'balıkçı', 'fisher', 'Fischerin'),
    ],
    'southern-england': [
        c('sarah', 'Sarah', 'Kent', 'çiftçi', 'farmer', 'Landwirtin'),
        c('jamie', 'Jamie', 'Brighton and Hove', 'cankurtaran', 'lifeguard', 'Rettungsschwimmer'),
    ],
    'northern-ireland': [
        c('siobhan', 'Siobhán', 'Derry', 'öğretmen', 'teacher', 'Lehrerin'),
        c('declan', 'Declan', 'Fermanagh', 'olta balıkçısı', 'angler', 'Angler'),
    ],
};

export const findCharacter = (id: string): Character | undefined =>
    Object.values(CHARACTERS).flat().find(ch => ch.id === id);

// ---------------------------------------------------------------------------
// Letter templates. {days} and {event} are filled at render time. The body can
// run long; the highlight is the one sentence a skimming player must not miss.
// A delayed letter's highlight is the consequence message of the event itself.
// ---------------------------------------------------------------------------

export const LETTERS: Record<LetterKind, { body: LocalizedText; highlight?: LocalizedText }> = {
    delayed: {
        body: {
            tr: 'Size buradan yazıyorum. {days} gün önce "{event}" konusunda bir karar verdiniz. O gün burada kimse pek bir şey fark etmedi, hayat devam etti. Bugün durum farklı.',
            en: 'I am writing to you from here. {days} days ago you made a decision about "{event}". Nobody here noticed much that day; life went on. Today it is different.',
            de: 'Ich schreibe Ihnen von hier. Vor {days} Tagen haben Sie über „{event}“ entschieden. Damals hat hier kaum jemand etwas gemerkt, das Leben ging weiter. Heute ist es anders.',
        },
    },
    dirty: {
        body: {
            tr: 'Size buradan yazıyorum. "{event}" meselesinde paranın tarafını tuttunuz. Herkes duydu, kimse yüksek sesle bir şey demedi. Ama çarşıda, kahvede, okul kapısında konuşuluyor.',
            en: 'I am writing to you from here. On "{event}" you sided with the money. Everyone heard; nobody said anything out loud. But people talk about it at the market, at the café, at the school gate.',
            de: 'Ich schreibe Ihnen von hier. Bei „{event}“ haben Sie sich für das Geld entschieden. Alle haben es gehört, niemand hat laut etwas gesagt. Aber auf dem Markt, im Café und am Schultor wird darüber geredet.',
        },
        highlight: {
            tr: '{days} gün önce o şirkete göz yumdunuz. Biz unutmadık.',
            en: '{days} days ago you looked the other way for that company. We have not forgotten.',
            de: 'Vor {days} Tagen haben Sie bei dieser Firma weggesehen. Wir haben es nicht vergessen.',
        },
    },
    cleanGood: {
        body: {
            tr: 'Uzun zamandır yazmak istiyordum. Bu sabah erkenden yola çıktım, dere kenarında çocuklar oynuyordu. Yıllardır görmediğim bir şeydi bu. Komşular da fark etti, kimse inanamıyor.',
            en: 'I have meant to write for a long time. I set off early this morning and children were playing by the stream. I had not seen that in years. The neighbours noticed too; nobody can quite believe it.',
            de: 'Ich wollte Ihnen schon lange schreiben. Heute früh war ich unterwegs, und am Bach spielten Kinder. Das habe ich seit Jahren nicht gesehen. Die Nachbarn haben es auch bemerkt, keiner kann es glauben.',
        },
        highlight: {
            tr: 'Dere tertemiz, şükür. Böyle devam edin.',
            en: 'The stream is clean again. Please keep going.',
            de: 'Der Bach ist wieder sauber. Bitte machen Sie weiter so.',
        },
    },
    cleanBad: {
        body: {
            tr: 'Kötü haberle yazdığım için kusura bakmayın. Bu sabah suyun rengi yine değişikti, koku eve kadar geliyor. Komşular taşınmayı konuşuyor. Ben buradan bir yere gitmek istemiyorum.',
            en: 'Forgive me for writing with bad news. This morning the water was a strange colour again, and the smell reaches the house. The neighbours are talking about moving away. I do not want to leave.',
            de: 'Verzeihen Sie, dass ich mit schlechten Nachrichten schreibe. Heute Morgen hatte das Wasser wieder eine seltsame Farbe, der Geruch kommt bis ins Haus. Die Nachbarn reden vom Wegziehen. Ich will hier nicht weg.',
        },
        highlight: {
            tr: 'Balık kalmadı. Lütfen bir şey yapın.',
            en: 'The fish are gone. Please do something.',
            de: 'Die Fische sind weg. Bitte tun Sie etwas.',
        },
    },
    happyBad: {
        body: {
            tr: 'Fiyatlar artıyor, işler azalıyor. Pazarda herkes aynı şeyi konuşuyor. Kimse sizi kötü biri sanmıyor ama bizi duymadığınızı düşünüyoruz.',
            en: 'Prices are going up and work is drying up. Everyone at the market says the same thing. Nobody thinks you are a bad person, but we feel you are not listening.',
            de: 'Die Preise steigen, die Arbeit wird weniger. Auf dem Markt sagen alle dasselbe. Niemand hält Sie für einen schlechten Menschen, aber wir haben das Gefühl, dass Sie uns nicht zuhören.',
        },
        highlight: {
            tr: 'Geçinemiyoruz. Sesimizi duyun.',
            en: 'We cannot make ends meet. Hear us.',
            de: 'Wir kommen nicht mehr über die Runden. Hören Sie uns.',
        },
    },
};

// ---------------------------------------------------------------------------
// News ticker. Mikey reads every line as a cheerful anchor; the player knows
// better. Kara Holding grows one step per dirty deal, the co-op one step per
// two clean choices.
// ---------------------------------------------------------------------------

export const HEADLINES: Record<string, LocalizedText> = {
    holding1: { tr: 'Kara Holding\'den yeni yatırım: küçük fabrika üretime başladı!', en: 'New investment from Kara Holding: a small factory starts production!', de: 'Neue Investition von Kara Holding: Eine kleine Fabrik nimmt den Betrieb auf!' },
    holding2: { tr: 'Kara Holding ikinci tesisini açtı, hisseler tavan!', en: 'Kara Holding opens a second plant, shares hit the roof!', de: 'Kara Holding eröffnet zweites Werk, die Aktie schießt nach oben!' },
    holding3: { tr: 'Kara Holding büyümeye doymuyor! Artık bölgenin en büyüğü.', en: 'Kara Holding just keeps growing! Now the biggest in the region.', de: 'Kara Holding wächst und wächst! Jetzt das größte Unternehmen der Region.' },
    holding4: { tr: 'Kara Holding\'den müjde: senin bölgende yeni dev tesis!', en: 'Great news from Kara Holding: a giant new plant in your region!', de: 'Frohe Kunde von Kara Holding: ein riesiges neues Werk in deiner Region!' },
    holding5: { tr: 'Kara Holding sahili satın almak için teklif verdi!', en: 'Kara Holding bids to buy the coastline!', de: 'Kara Holding bietet für die Küste!' },
    coop1: { tr: 'Mahallede yeşil kooperatif kuruldu: ilk üyeler kompost yapıyor!', en: 'A green co-op opens in town: its first members are composting!', de: 'Eine grüne Genossenschaft ist gegründet: Die ersten Mitglieder kompostieren!' },
    coop2: { tr: 'Yeşil Kooperatif\'in güneş panelleri okul çatısında!', en: 'The Green Co-op puts solar panels on the school roof!', de: 'Die Grüne Genossenschaft bringt Solarmodule aufs Schuldach!' },
    coop3: { tr: 'Kooperatif gönüllüleri dereyi baştan sona temizledi!', en: 'Co-op volunteers clean the stream from end to end!', de: 'Freiwillige der Genossenschaft reinigen den Bach von vorn bis hinten!' },
    coop4: { tr: 'Yeşil Kooperatif komşu bölgelere örnek oldu!', en: 'The Green Co-op becomes a model for neighbouring regions!', de: 'Die Grüne Genossenschaft wird zum Vorbild für die Nachbarregionen!' },
    coop5: { tr: 'Yeşil Kooperatif ülkenin en iyi yerel girişimi seçildi!', en: 'The Green Co-op is named the best local initiative in the country!', de: 'Die Grüne Genossenschaft ist die beste lokale Initiative des Landes!' },
    project: { tr: '{project} açıldı! Kurdeleyi halk birlikte kesti.', en: '{project} opens! Residents cut the ribbon together.', de: '{project} eröffnet! Die Bewohner schneiden gemeinsam das Band durch.' },
    sustain: { tr: 'Bölge {days} gündür yeşil çizginin üstünde!', en: 'The region has stayed above the green line for {days} days!', de: 'Die Region liegt seit {days} Tagen über der grünen Linie!' },
};

// ---------------------------------------------------------------------------
// Endings. The first one whose rule holds is the ending; each has a headline
// Mikey reads, and the set is what makes "one more run" worth it.
// ---------------------------------------------------------------------------

export interface EndingFacts {
    isVictory: boolean;
    budget: number;
    happiness: number;
    cleanliness: number;
    holdingTier: number;
    coopTier: number;
}

export interface Ending {
    id: string;
    happy: boolean;
    headline: LocalizedText;
    when: (f: EndingFacts) => boolean;
}

export const ENDINGS: Ending[] = [
    {
        id: 'green-model', happy: true, when: f => f.isVictory && f.holdingTier === 0,
        headline: { tr: 'Yeşil Kooperatif bölgeni ülkeye örnek gösterdi!', en: 'The Green Co-op holds up your region as a model for the country!', de: 'Die Grüne Genossenschaft macht deine Region zum Vorbild für das ganze Land!' },
    },
    {
        id: 'green-shadow', happy: true, when: f => f.isVictory && f.holdingTier >= 2,
        headline: { tr: 'Bölge yemyeşil! Kara Holding de kapıda bekliyor.', en: 'The region is green! And Kara Holding is waiting at the door.', de: 'Die Region ist grün! Und Kara Holding wartet schon vor der Tür.' },
    },
    {
        id: 'green', happy: true, when: f => f.isVictory,
        headline: { tr: 'Bölge yeşil kaldı, halk bayramda!', en: 'The region stayed green, and the people are celebrating!', de: 'Die Region ist grün geblieben, die Leute feiern!' },
    },
    {
        id: 'coast-sold', happy: false, when: f => f.cleanliness <= 0 && f.holdingTier >= 4,
        headline: { tr: 'Kara Holding sahili satın aldı!', en: 'Kara Holding has bought the coastline!', de: 'Kara Holding hat die Küste gekauft!' },
    },
    {
        id: 'toxic', happy: false, when: f => f.cleanliness <= 0,
        headline: { tr: 'Bölge zehirli atık bölgesi ilan edildi.', en: 'The region has been declared a toxic waste zone.', de: 'Die Region wurde zum Giftmüllgebiet erklärt.' },
    },
    {
        id: 'clean-broke', happy: false, when: f => f.budget <= 0 && f.cleanliness >= 60,
        headline: { tr: 'Dereler tertemiz ama kasa bomboş.', en: 'The streams are spotless, but the treasury is empty.', de: 'Die Bäche sind blitzsauber, aber die Kasse ist leer.' },
    },
    {
        id: 'bankrupt', happy: false, when: f => f.budget <= 0,
        headline: { tr: 'Bölge iflas etti, borç kapıda.', en: 'The region is bankrupt, and the debt collectors are at the door.', de: 'Die Region ist pleite, die Gläubiger stehen vor der Tür.' },
    },
    {
        id: 'uprising', happy: false, when: () => true,
        headline: { tr: 'Halk meydanda: "Bizi duyun!"', en: 'The people fill the square: "Hear us!"', de: 'Die Menschen füllen den Platz: „Hört uns!“' },
    },
];

export const getEnding = (f: EndingFacts): Ending => ENDINGS.find(e => e.when(f)) ?? ENDINGS[ENDINGS.length - 1];
