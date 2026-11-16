# Yol Haritası

> Son güncelleme: 15 Kasım 2026

## Sorun

Geri bildirimler net: Oyun eğitici ama oynanmıyor. Üç kök neden görüyoruz:

1. **Kimse "Nasıl Oynanır?" menüsünü okumuyor.** Dört bölümlük, GIF'li bir modal. Oyuncu onu atlıyor, sonra her şeyin açık olduğu bir ekrana düşüyor.
2. **Oyun speedrun gibi hissettiriyor.** [GameContext.tsx](src/contexts/GameContext.tsx) içinde 1 saniye 1 oyun günü ediyor. Oyuncu yönetmek yerine kriz kovalıyor.
3. **Kararların sonucu hissedilmiyor.** Bir seçim yapılıyor, rakamlar oynuyor, ama kimse bir şey hissetmiyor ya da hatırlamıyor.

## Hedefler

| Hedef | Ölçüt |
|---|---|
| İlk dakika | Oyuncu telefonda, hiçbir şey okumadan 60 saniye içinde ilk kararını verir. |
| Ders saatine sığar | Bir oyun yaklaşık 10–12 dakika sürer. |
| Öğrenme | Oyun sonunda oyuncu en az bir neden-sonuç ilişkisini kendi cümlesiyle açıklar (ör. "kirlilik birikir, geç vurur"). |
| Tekrar | Test edenlerin yarısı 30 saniye içinde yeniden başlar. |

Telemetri yok. Bu ölçütleri 3–5 öğrenciyle telefonda yapılan playtestlerle ölçüyoruz.

## İlkeler

- **Oyun gösterir, metin anlatmaz.** Rüşvet seçilirse haritadaki nehir kahverengiye döner. Bunu açıklayan bir paragraf olmaz.
- **İpuçları tek satırdır.** Mektuplar uzun ve gerçekçi olabilir, ama önemli cümleler fosforlu kalemle vurgulanır. Göz gezdiren oyuncu yalnızca vurguyu okur.
- **Oyuncu suç ortağıdır ve oyun unutmaz.** Seçimler daha sonra karakterlerin ağzından, haberlerde ve oyunun sonunda geri döner.
- **Puan, rozet ve XP yok.** Tekrar oynama sebebi içeriktir: farklı sonlar, farklı mektuplar.
- **Doğru olmayan nedensellik iddiası yok.** Oyun "bu, şu kararın sonucuydu" diyorsa bu kayıtla kanıtlanabilir olmalı.

---

## Faz 0 — Başlangıç ölçümü

Hiçbir şeyi değiştirmeden mevcut sürümü 3–5 öğrenciye telefonda oynatıyoruz.

- Nerede takıldıklarını, neyi anlamadıklarını ve ne zaman bıraktıklarını not ediyoruz.
- "Bu neden oldu?" ve "O seçim ne yaptı?" sorularını soruyoruz.

**Bitti sayılır:** Sonraki fazların öncelik sırası bu gözlemlerle doğrulandığında.

## Faz 1 — Tempo ve mobil

**Gün = tur.** Gün içinde saat işlemez. Oyuncu krizleri inceler, mektup okur, karar verir ve "Günü bitir" butonuna basar. Bekleyen krizler ertesi gün büyür. Baskı saniyelerden günlere taşınır. Soru artık "hızlı tıkla" değil, "neyi erteleyeceğim?" olur.

- `TICK` zamanlayıcı yerine butondan tetiklenir. Reducer zaten saf olduğu için mantık büyük ölçüde aynı kalır.
- Node ömürleri, spawn oranları ve bozulma değerleri gün cinsinden yeniden ayarlanır.
- Aynı anda açık node sayısına bir sınır konur.
- Harita ve event kartı telefon genişliğinde kullanılabilir hâle gelir (README To-Do'daki "Mobile Optimization").

**Bitti sayılır:** Oyun telefonda baştan sona oynanabildiğinde ve tek bir oyun 10–12 dakika sürdüğünde.

## Faz 2 — Mikey ve onboarding

**Mikey** (sarı kafalı mikrofon maskot) oyunun **muhabiri** olur. Krizleri anons eder, ipucu verir, haberleri okur. Tasarım kuralları MIKEY.md'den gelir: küçük kalır, işin önüne geçmez, hareketler `prefers-reduced-motion` arkasında durur.

- "Önce nasıl oynanır öğrenmek ister misin?" sorusu kalkar. Oyuncu doğrudan oyuna girer.
- "Nasıl Oynanır?" menüsü sadece referans olarak kalır.
- **Kademeli açılım:** İlk günlerde haritada tek node olur. Vergi ve proje paneli, ilk event çözülene kadar kilitli kalır.
- **İlk kez olunca tek cümlelik ipucu.** Her ipucunun bir tetikleyicisi ve `localStorage` "görüldü" bayrağı vardır. Ekranda aynı anda tek ipucu olur ve dokununca kapanır. Toplam 5–6 ipucu:

  | Tetikleyici | Mikey ne der veya ne yapar |
  |---|---|
  | İlk node çıktı | Krizi gösterir: "Dokun, ne yapacağına karar ver." |
  | Node ilk kez büyüdü | "Bekleyen krizler büyür." |
  | Bir stat ilk kez kritik seviyeye düştü | Barı gösterir, tek satır açıklama yapar. |
  | Bütçe ilk kez azaldı | Vergi panelini açar: "Vergi para getirir, mutluluğu düşürür." |
  | İlk gecikmeli etki geldi | "Bu, birkaç gün önceki kararın." |

- Stat barına dokununca tek satırlık açıklama çıkar.
- "Mikey'i sustur" seçeneği eklenir.

**Teknik:**
- Mikey SVG'si bir React bileşenine taşınır ve `mood` prop'u alır.
- `point` hâli eklenir: Mikey kolunu hedefe uzatır, hedef vurgulanır.
- `alarmed` hâli eklenir: yeni bir kriz anında kullanılır.
- Konuşma balonunda Caveat yazı tipinin Türkçe ve Almanca karakterleri doğru gösterdiği doğrulanır.

**Ton kuralı:** Mikey felakete değil, oyuncunun kararına tepki verir. Sel çıktı diye ağlamaz. Temizlik çöktüğünde üzülür.

**Bitti sayılır:** Playtestte oyuncu hiçbir şey okumadan 60 saniyede ilk kararını verdiğinde.

## Faz 3 — Kayıt ve simülasyon (altyapı)

Sonraki fazların hepsi oyunun "hatırlamasına" dayanıyor.

- **`actionLog`:** Gönderilen her aksiyonun kaydı. Gecikmeli etkiler `causeDay` ve `eventId` taşır. Aynı seed ile kayıt yeniden oynatıldığında aynı state'in çıktığını doğrulayan bir test yazılır.
- **Seçeneklere `bribe` bayrağı:** Rüşvet seçenekleri şu an sadece metindeki "(Rüşvet)" ifadesiyle ayırt ediliyor.
- **Headless sim:** Farklı politikalarla 200 seed'li oyun oynanır (hep rüşvet, hep temiz, maksimum vergi, açgözlü). Rapor: kazanma oranı, baskın strateji ve hangi event'in ne sıklıkla göründüğü. Denge değişiklikleri bu rakamlarla yapılır, tahminle yapılmaz.

**Bitti sayılır:** Yeniden oynatma testi geçtiğinde ve sim raporu üretildiğinde.

## Faz 4 — Sonuçlar görünür olur

Üç kanal var ve her birinin farklı bir rolü var.

### Mektuplar (yerel, kişisel)

CİMER benzeri, halktan gelen mektuplar.

- Her bölgede 2–3 sabit, isimli karakter olur (ör. Rize'den balıkçı Hasan amca). Mektupları oyuncunun kararlarına göre değişir: önce "Dere tertemiz, şükür", sonra "Balık kalmadı evlat".
- **Karakterler hatırlar:** "Geçen ay o fabrikaya göz yumdunuz."
- Mektuplar uzun ve gerçekçi olabilir. **Önemli cümleler fosforlu kalemle vurgulanır.**
- Mektup, geldiği ilden haritada bir baloncukla çıkar.
- **Gecikmeli bedeli mektup getirir.** Üç gün önce rüşvet alındıysa bugün "Nehir kokuyor" mektubu gelir. Kirliliğin bir stok olduğu, bir akış olmadığı böyle öğretilir.

### Haber bandı (genel tablo)

Ekranın altında, Mikey'in okuduğu tek satırlık haberler. Modal değildir, oyunu durdurmaz.

- **Kurgusal bir kötü firma** vardır, gerçek bir marka değil. Her rüşvetle bir basamak büyür: küçük fabrika → holding → senin bölgende yeni tesis. Toplam 5 basamak.
- **Dramatik ironi:** Mikey haberi masum ve neşeli bir spiker gibi okur ("Kara Holding büyümeye doymuyor!"). Oyuncu bunun neden olduğunu bilir. Mikey ahlak dersi vermez.
- **Büyüyen firma yeni kirlilik eventleri doğurur.** Haber sadece metin değildir, oyuncu bedelini oyunda öder.
- Karşılığı da var: Temiz seçimlerde yeşil bir kooperatif büyür. Yaklaşık 10 iyi haber yazılır.

### Gün sonu özeti

Her gün kısa bir ekranla biter: günün mektupları, bir manşet ve kasa durumu. Papers, Please'teki gün sonu ritmi gibi. Faz 1'deki tur yapısının doğal parçasıdır.

**Bitti sayılır:** Playtestte oyuncuya gecikmeli bir etkiden sonra "Bu neden oldu?" diye sorulduğunda doğru kararı gösterebildiğinde.

## Faz 5 — Sonlar ve debrief

- **Birden fazla son.** Kazan/kaybet yerine hikâyeli sonlar olur: "Kara Holding sahili satın aldı", "Dereler temiz ama kasa boş". Her sonun Mikey'in okuduğu bir manşeti vardır. Sonları toplamak "bir daha oynayayım" sebebi olur.
- **3 kartlı debrief.** Sadece kayıtla kanıtlanabilen kartlar gösterilir. Bir teşhis satırı eklenir: "İlk çöken stat: X, gün N."
- Restart butonu ekranın üst yarısında, kaydırmadan görünür.
- Mikey sonuca göre `happy` ya da `sad` hâlinde kısa bir yorum yapar.

**Bitti sayılır:** Test edenlerin yarısı 30 saniye içinde yeniden başladığında.

## Faz 6 — İkinci playtest

Faz 0'daki protokol tekrar edilir ve hedefler tablosuna göre ölçülür. Sonuçlara göre aşağıdaki ertelenen işlerden hangilerinin açılacağına karar verilir.

---

## Ertelenenler (playtest destekliyorsa)

- **Replay:** Aynı seed ile işaretlenen karara dönüp diğer seçeneği denemek.
- **Kalıcı yeşil harita:** Kazanılan bölgeler haritada kalıcı olarak yeşile döner (`localStorage`).
- **Gizli kirlilik stokları** (hava, su, toprak): Sadece mektuplar ve gecikmeli etkiler birikmeyi öğretemezse.
- Rüşvet ve ucuz seçenekleri ~10'arlık gruplar hâlinde gecikmeli etkiye dönüştürmek.
- Bölgeye özel senaryolar.

## Reddedilenler

- Puan, leaderboard, günlük seed, XP, rozet: Backend ve kitle yok. Ayrıca dışsal ödül, öğrenmeyi gölgeler.
- Sabit seed'li, senaryolu tutorial: Her ilk oyun aynı olur.
- Görünür 4 ayrı kirlilik barı: Mobilde kalabalık yapar, oyunu kazanılamaz hâle getirir.
- "N. günde şu event yüzünden çöktün" cümlesi: Bozulma ve gecikmeli etkiler birlikte vurduğu için masum bir event'i suçlayabilir.

## Riskler

- **Yazım yükü.** Mektuplar, haberler, sonlar ve ipuçlarının hepsi 3 dilde (TR/EN/DE) yazılacak ve doğrulanacak. Kapsam küçük tutulmalı.
- **Clippy etkisi.** Fazla konuşan maskot itici olur. Her ipucu bir kez görünür, oyunu durdurmaz ve sustur seçeneği vardır.
- **Ton.** Sevimli bir maskot gerçek felaketleri hafife alıyormuş gibi görünmemeli.
- **Tur sistemine geçiş** tüm denge ayarlarını değiştirir. Faz 3'teki sim, Faz 1'deki ayarları doğrulamak için tekrar çalıştırılmalı.
