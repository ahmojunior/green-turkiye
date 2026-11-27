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
    // The highlight comes from PROJECT_LETTERS: each regional project has its own voice.
    project: {
        body: {
            tr: 'Bugün "{project}" tamamlandı, haberini duyunca hemen oturup yazdım. Başta kimse inanmamıştı, "yine bir tabela asıp gidecekler" demiştik. Yanılmışız.',
            en: 'Today "{project}" was finished, and when I heard, I sat down to write straight away. At first nobody believed in it; we said "they will put up a sign and leave". We were wrong.',
            de: 'Heute wurde „{project}“ fertiggestellt, und als ich davon hörte, habe ich mich sofort hingesetzt und geschrieben. Anfangs hat niemand daran geglaubt; wir sagten: „Die stellen ein Schild auf und verschwinden.“ Wir haben uns geirrt.',
        },
    },
};

// ---------------------------------------------------------------------------
// Who writes when a regional project opens, and the line they underline. The
// sender must be one of that region's CHARACTERS (checked by npm test).
// ---------------------------------------------------------------------------

const pl = (from: string, tr: string, en: string, de: string) => ({ from, highlight: { tr, en, de } });

export const PROJECT_LETTERS: Record<string, { from: string; highlight: LocalizedText }> = {
    // Türkiye
    'marmara-air-network': pl('ayse',
        'Okulun önündeki ekranda havayı artık herkes görüyor. Kirleten artık saklanamıyor.',
        'Everyone can now see the air on the screen outside the school. The polluters have nowhere to hide.',
        'Vor der Schule zeigt jetzt ein Bildschirm die Luftwerte. Die Verschmutzer können sich nicht mehr verstecken.'),
    'marmara-advanced-treatment': pl('riza',
        'Müsilaj yüzünden ağlarımız boş dönüyordu. Belki bu yıl yeniden balık tutarız.',
        'Sea snot left our nets empty. Maybe this year we will catch fish again.',
        'Wegen des Meeresschleims kamen unsere Netze leer zurück. Vielleicht fangen wir dieses Jahr wieder Fisch.'),
    'blacksea-slope-forest': pl('fadime',
        'Çay bahçemin üstündeki yamaca fidanlar dikildi. Yağmur yağınca artık toprağın kaymasından o kadar korkmayacağız.',
        'Saplings now cover the slope above my tea garden. When it rains, we will not fear the ground sliding as much.',
        'Am Hang über meinem Teegarten wachsen jetzt Setzlinge. Wenn es regnet, müssen wir nicht mehr so sehr um einen Erdrutsch bangen.'),
    'blacksea-flood-warning': pl('hasan',
        'Dere taşmadan önce artık telefonum çalacak. Bu gece ilk defa rahat uyuyacağım.',
        'Now my phone will ring before the stream floods. Tonight I will sleep soundly for the first time.',
        'Jetzt klingelt mein Telefon, bevor der Bach über die Ufer tritt. Heute Nacht schlafe ich zum ersten Mal ruhig.'),
    'aegean-olive-wastewater': pl('mustafa',
        'Karasuyu yıllarca dereye verdik, başka çaremiz yoktu. Artık zeytinimizi utanmadan sıkacağız.',
        'For years we poured the black water into the stream; we had no other choice. Now we can press our olives without shame.',
        'Jahrelang haben wir das schwarze Abwasser in den Bach geleitet, wir hatten keine Wahl. Jetzt können wir unsere Oliven ohne Scham pressen.'),
    'aegean-marine-reserve': pl('deniz',
        'Arkadaşlarla koruma alanında ilk dalışı yaptık. Mezun olunca gitmeyi düşünüyordum, şimdi burada kalmak istiyorum.',
        'My friends and I made our first dive in the reserve. I was planning to leave after graduating; now I want to stay.',
        'Mit Freunden habe ich den ersten Tauchgang im Schutzgebiet gemacht. Nach dem Abschluss wollte ich weggehen; jetzt möchte ich bleiben.'),
    'anatolian-drip-irrigation': pl('halil',
        'Kuyuyu her yıl daha derine kazıyorduk. Şimdi suyu toprağa değil, köke veriyorum.',
        'Every year we dug the well deeper. Now the water goes to the roots, not into the dirt.',
        'Jedes Jahr haben wir den Brunnen tiefer gegraben. Jetzt geht das Wasser an die Wurzeln statt in den Boden.'),
    'anatolian-wetland-restoration': pl('elif',
        'Göle su geri dönüyor. Çocukken orada flamingoları izlerdik, belki kızım da izler.',
        'Water is coming back to the lake. As a child I watched flamingos there; maybe my daughter will too.',
        'Das Wasser kehrt in den See zurück. Als Kind habe ich dort Flamingos beobachtet; vielleicht kann es meine Tochter auch.'),
    'mediterranean-greenhouse-recycling': pl('zeynep',
        'Yırtık sera naylonları yıllardır tarlanın kenarında uçuşuyordu. Bugün kamyon gelip hepsini topladı.',
        'For years torn greenhouse plastic blew around the edge of the field. Today a truck came and took it all away.',
        'Jahrelang flatterten zerrissene Gewächshausfolien am Feldrand. Heute kam ein Lastwagen und hat alles abgeholt.'),
    'mediterranean-fire-watch': pl('serkan',
        'Geçen yaz misafirlerimi dumanın içinden tahliye ettim. Bu yaz tepedeki kule bizi izliyor.',
        'Last summer I evacuated my guests through the smoke. This summer the tower on the hill is watching over us.',
        'Letzten Sommer habe ich meine Gäste durch den Rauch evakuiert. Diesen Sommer wacht der Turm auf dem Hügel über uns.'),
    'eastern-clean-heating': pl('rojda',
        'Kışın sınıfta sobanın dumanından tahtayı göremiyorduk. Artık çocuklar öksürmeden ders dinleyecek.',
        'In winter we could not see the board through the stove smoke. Now the children can listen without coughing.',
        'Im Winter konnten wir die Tafel vor lauter Ofenrauch nicht sehen. Jetzt können die Kinder zuhören, ohne zu husten.'),
    'eastern-biogas': pl('kemal',
        'Gübre eskiden ahırın arkasında kokardı. Şimdi o gübre evimi ısıtıyor.',
        'The manure used to stink behind the barn. Now it heats my house.',
        'Früher hat der Mist hinter dem Stall gestunken. Jetzt heizt er mein Haus.'),
    'southeastern-closed-irrigation': pl('ahmet',
        'Vahşi sulama tarlamı tuzdan bembeyaz etmişti. Kapalı boruyla toprağım yeniden nefes alacak.',
        'Flood irrigation had left my field white with salt. With closed pipes, my soil can breathe again.',
        'Durch die Flutbewässerung war mein Feld weiß vom Salz. Mit geschlossenen Rohren kann mein Boden wieder atmen.'),
    'southeastern-agrivoltaics': pl('leyla',
        'Tarlaların üstüne paneller kuruldu: ekine gölge, bize elektrik. Dükkânımın ışığı artık güneşten.',
        'Panels now stand above the fields: shade for the crops, power for us. The lights in my shop now run on sunshine.',
        'Über den Feldern stehen jetzt Solarpaneele: Schatten für die Pflanzen, Strom für uns. Das Licht in meinem Laden kommt jetzt von der Sonne.'),
    // Deutschland
    'nord-dike-upgrade': pl('anke',
        'Her fırtınada tekneyi karaya çekip dua ederdik. Yeni set evimden daha yüksek.',
        'With every storm surge we hauled the boat up and prayed. The new dike is taller than my house.',
        'Bei jeder Sturmflut haben wir das Boot hochgezogen und gebetet. Der neue Deich ist höher als mein Haus.'),
    'nord-shore-power': pl('jens',
        'Gemiler limanda motorlarını çalıştırır, isi bizim ciğerimize dolardı. Artık fişe takılıyorlar.',
        'Ships used to run their engines in port, and the soot filled our lungs. Now they plug in.',
        'Früher liefen die Schiffsmotoren im Hafen, und der Ruß landete in unseren Lungen. Jetzt hängen sie am Stromkabel.'),
    'ruhr-landscape-park': pl('klaus',
        'Kırk yıl çalıştığım ocağın üstünde şimdi çocuklar tırmanıyor. Torunuma "deden burada çalıştı" diyebileceğim.',
        'Children now climb over the pit where I worked for forty years. I can tell my grandson: "Grandpa worked here."',
        'Auf der Zeche, auf der ich vierzig Jahre gearbeitet habe, klettern jetzt Kinder. Ich kann meinem Enkel sagen: „Hier hat Opa gearbeitet.“'),
    'ruhr-emscher-renewal': pl('aylin',
        'Emscher\'e "lağım" derdik, öğrencilerim yanına bile yaklaşmazdı. Gelecek hafta dere kenarında fen dersi yapacağız.',
        'We used to call the Emscher "the sewer"; my pupils would not go near it. Next week we are holding science class on its bank.',
        'Wir nannten die Emscher „die Kloake“, meine Schüler gingen nicht mal in ihre Nähe. Nächste Woche haben wir Biologieunterricht am Ufer.'),
    'rheinmain-river-monitoring': pl('peter',
        'Bağlarımı Ren\'in suyuyla sularım. Artık suda ne olduğunu tahmin etmiyorum, biliyorum.',
        'I water my vines from the Rhine. Now I do not guess what is in the water; I know.',
        'Ich bewässere meine Reben mit Rheinwasser. Jetzt rate ich nicht mehr, was im Wasser ist, ich weiß es.'),
    'rheinmain-rail-freight': pl('sabine',
        'Her sabah tır kuyruğunda bir saat kaybediyordum. Yükler raya geçti, otoyol nefes aldı.',
        'I used to lose an hour every morning stuck behind lorries. The freight has moved to rail and the motorway can breathe.',
        'Jeden Morgen habe ich eine Stunde hinter Lastwagen verloren. Die Fracht fährt jetzt auf der Schiene, und die Autobahn atmet auf.'),
    'bayern-alpine-shuttle': pl('resi',
        'Hafta sonları vadimizden yüzlerce araba geçerdi. Şimdi turistler otobüsle geliyor, inekler bile sakinleşti.',
        'Every weekend hundreds of cars drove through our valley. Now the tourists come by bus, and even the cows are calmer.',
        'Am Wochenende sind Hunderte Autos durch unser Tal gefahren. Jetzt kommen die Touristen mit dem Bus, und sogar die Kühe sind ruhiger.'),
    'bayern-geothermal': pl('florian',
        'Ormanı yakacak odun için kesmeyi bırakabiliriz. Köyü artık yerin altındaki sıcaklık ısıtıyor.',
        'We can stop cutting the forest for firewood. The village is now heated by the warmth underground.',
        'Wir müssen den Wald nicht mehr für Brennholz schlagen. Das Dorf heizt jetzt die Wärme aus der Tiefe.'),
    'bw-fresh-air-corridors': pl('lena',
        'Yamaçlardaki hava koridorlarına kır çiçekleri ekildi. Arılarım şehre kadar uçabilecek.',
        'Wildflowers were sown along the fresh-air corridors on the slopes. My bees can fly all the way into town.',
        'An den Frischluftschneisen wurden Wildblumen gesät. Meine Bienen können jetzt bis in die Stadt fliegen.'),
    'bw-battery-recycling': pl('markus',
        'Yıllarca batarya yaptık ama bitince nereye gittiğini hiç düşünmedik. Artık o lityum geri dönüyor.',
        'For years we built batteries and never thought about where they end up. Now the lithium comes back.',
        'Jahrelang haben wir Batterien gebaut und nie überlegt, wo sie landen. Jetzt kommt das Lithium zurück.'),
    'ost-mine-lakes': pl('gisela',
        'Eski kömür ocağının yerinde şimdi bir göl var. Babam orada çalışırdı, ben şimdi orada yüzüyorum.',
        'Where the old coal pit was, there is now a lake. My father worked there; now I swim there.',
        'Wo früher der Tagebau war, ist jetzt ein See. Mein Vater hat dort gearbeitet; jetzt schwimme ich dort.'),
    'ost-green-hydrogen': pl('uwe',
        'Rüzgâr türbinleri gece boşa dönerdi. Şimdi o rüzgâr hidrojene dönüşüyor, köye de iş geliyor.',
        'The wind turbines used to spin for nothing at night. Now that wind becomes hydrogen, and it brings jobs to the village.',
        'Nachts drehten sich die Windräder umsonst. Jetzt wird aus dem Wind Wasserstoff, und das Dorf bekommt Arbeit.'),
    // United Kingdom
    'scotland-peatland': pl('fiona',
        'Gönüllülerle turbalıktaki kanalları kapattık. Toprak yeniden ıslanınca karbonu da içinde tutacak.',
        'With volunteers we blocked the drains in the peat bog. Once it is wet again, it will hold on to its carbon.',
        'Mit Freiwilligen haben wir die Gräben im Moor verschlossen. Wenn es wieder nass ist, hält es seinen Kohlenstoff.'),
    'scotland-tidal-power': pl('angus',
        'Ömrüm boyunca gelgiti hesapladım. Şimdi aynı gelgit evlerimizin ışığını yakıyor.',
        'I have reckoned the tides all my life. Now the same tides light our homes.',
        'Ich habe mein Leben lang die Gezeiten berechnet. Jetzt bringen dieselben Gezeiten Licht in unsere Häuser.'),
    'neng-electric-buses': pl('priya',
        'Dükkânın önündeki duraktaki otobüsler vitrinimi isle karartırdı. Yeni otobüsler sessiz, vitrinim temiz.',
        'The diesel buses at the stop outside blackened my shop window. The new buses are quiet and my window stays clean.',
        'Die Dieselbusse an der Haltestelle vor meinem Laden haben das Schaufenster geschwärzt. Die neuen Busse sind leise, das Fenster bleibt sauber.'),
    'neng-arc-furnace': pl('tom',
        'Rüzgâr çelik fabrikasından estiğinde koyunlarımın yünü griye dönerdi. Yeni fırın elektrikle çalışıyor, duman yok.',
        'When the wind blew from the steelworks, my sheep\'s wool turned grey. The new furnace runs on electricity: no smoke.',
        'Wenn der Wind vom Stahlwerk kam, wurde die Wolle meiner Schafe grau. Der neue Ofen läuft mit Strom: kein Rauch.'),
    'midlands-canal-restoration': pl('amira',
        'Kanal yıllarca alışveriş arabası ve çamurla doluydu. Bugün öğrencilerimle kıyısında ördek saydık.',
        'For years the canal was full of shopping trolleys and mud. Today my pupils and I counted ducks along its bank.',
        'Jahrelang war der Kanal voller Einkaufswagen und Schlamm. Heute haben meine Schüler und ich am Ufer Enten gezählt.'),
    'midlands-gigafactory': pl('ray',
        'Ocaklar kapanınca kasaba bir daha toparlanamadı. Torunum gelecek hafta yeni batarya fabrikasında işe başlıyor.',
        'When the pits closed, the town never recovered. My grandson starts at the new battery factory next week.',
        'Als die Zechen schlossen, hat sich die Stadt nie erholt. Mein Enkel fängt nächste Woche in der neuen Batteriefabrik an.'),
    'wales-native-woodland': pl('rhys',
        'Kulüpten arkadaşlarla bir hafta sonunda yüzlerce meşe fidanı diktik. Torunlarımız bu ormanda yürüyecek.',
        'My friends from the club and I planted hundreds of oak saplings in one weekend. Our grandchildren will walk in this wood.',
        'Mit Freunden aus dem Verein haben wir an einem Wochenende Hunderte Eichensetzlinge gepflanzt. Unsere Enkel werden in diesem Wald spazieren gehen.'),
    'wales-pumped-hydro': pl('gwen',
        'Dağdaki eski taş ocağı artık suyu bir pil gibi saklıyor. Rüzgâr dursa da ışıklar yanıyor.',
        'The old quarry on the mountain now stores water like a battery. Even when the wind drops, the lights stay on.',
        'Der alte Steinbruch am Berg speichert jetzt Wasser wie eine Batterie. Auch wenn der Wind nachlässt, bleibt das Licht an.'),
    'seng-clean-air-zone': pl('sarah',
        'Her cumartesi pazara şehre iniyorum, eskiden tezgâhımı egzoz kokusu sarardı. Bu sabah sadece çilek kokuyordu.',
        'Every Saturday I drive into town for the market; my stall used to reek of exhaust. This morning it smelled only of strawberries.',
        'Jeden Samstag fahre ich zum Markt in die Stadt; früher roch mein Stand nach Abgasen. Heute Morgen roch es nur nach Erdbeeren.'),
    'seng-super-sewer': pl('jamie',
        'Her yağmurdan sonra plajdaki "denize girmeyin" bayrağını ben asıyordum. Artık o bayrağı çok daha az asacağım.',
        'After every rainstorm I was the one raising the "do not swim" flag on the beach. Now I will raise it far less often.',
        'Nach jedem Regen war ich es, der am Strand die Flagge „Baden verboten“ hisste. Jetzt muss ich sie viel seltener hissen.'),
    'ni-lough-neagh': pl('declan',
        'Göl yeşil bir çorbaya dönmüştü, yılanbalıkları ölüyordu. Çiftliklerden gelen akıntı kesilince göl yeniden nefes alacak.',
        'The lough had turned into green soup and the eels were dying. With the farm runoff cut off, it can breathe again.',
        'Der See war zu grüner Suppe geworden, die Aale starben. Ohne den Abfluss von den Höfen kann er wieder atmen.'),
    'ni-wind-port': pl('siobhan',
        'Mezun öğrencilerim iş için hep İngiltere\'ye giderdi. Şimdi rüzgâr limanında, burada iş bulabiliyorlar.',
        'My former pupils always left for England to find work. Now they can find it here, at the wind port.',
        'Meine ehemaligen Schüler sind immer zum Arbeiten nach England gegangen. Jetzt finden sie hier Arbeit, im Windhafen.'),
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
