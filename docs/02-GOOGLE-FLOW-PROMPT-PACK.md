# E. Google Flow Prompt Pack — "Porcelain & Light"

Bu paket sitedeki **tüm** görsel alanlarını karşılar. Görseller eklenene kadar site, her alanda marka dilinde
tasarlanmış bir placeholder (porselen ışık + ince çizgi ikon + görsel kodu) gösterir; yani demo görselsiz de bütünlüklü görünür.

> **Neden hero'da fotoğraf yok?** Hero ve Anatomi sahnesinin görseli, tarayıcıda gerçek zamanlı üretilen prosedürel
> 3D dişdir (bkz. bölüm 3). Bu, sitenin imza anıdır ve fotoğrafla taklit edilemez.

---

## 0. Kullanım akışı

1. Her görseli aşağıdaki promptla Google Flow'da üretin (4 varyasyon → en iyisini seçin).
2. Dosyayı **belirtilen adla** `assets-src/…` altına koyun.
3. `npm run images:optimize` → AVIF + WebP `public/` altına yazılır. Kodda değişiklik gerekmez.
4. Aynı "fotoğrafçı" hissi için: **Stil Kilidi** bloğunu her prompta ekleyin ve aynı oturumda üretin.

## 1. Görsel dil (tüm görseller için ortak)

| Parametre | Karar |
|---|---|
| Konsept | Porselen yüzeylere düşen yumuşak kuzey ışığı; klinik titizlik + insani sıcaklık |
| Işık | Kamera solundan geniş, difüz gün ışığı; düşük kontrast; gölgeler hafif sıcak |
| Renk ısısı | ~5200 K, sıcak-nötr beyaz; **mavi klinik ton yok** |
| Kamera dili | Orta format editoryal (Hasselblad X2D / Phase One hissi), sığ alan derinliği, ince film greni |
| Malzemeler | Porselen, traverten, keten, buzlu cam, fırçalanmış şampanya metal, açık meşe |
| Palet | Porcelain `#F3EFE8` · Bone `#FBF9F5` · Linen `#E8E1D6` · Champagne `#B08D57` · Obsidian `#16181B` · Sage `#8E9B8C` (az) · Clinical glow `#9DB6C1` (yalnızca teknoloji) |
| İnsan | Doğal cilt dokusu, rötuşsuz, onurlu; abartılı beyaz dişler yok; yüz tanınır değilse tercih edilir |
| Mevzuat | Önce/sonra, "sonuç" ima eden karşılaştırma, kan/işlem anı, fiyat, logo, yazı **yok** |

### Stil Kilidi (her prompt sonuna ekleyin)

```
editorial healthcare photography, soft north-facing daylight from camera left, large diffused light source,
warm neutral white balance 5200K, low contrast, lifted warm shadows, porcelain and travertine surfaces,
brushed champagne metal accents, medium format camera look, shallow depth of field, subtle fine film grain,
calm minimal composition, generous negative space, photorealistic, premium, understated luxury,
no text, no logo, no watermark
```

### Ortak Negative (her görsele ekleyin)

```
text, letters, typography, logo, watermark, signage, brand names, blue clinical color cast, cyan tint,
harsh flash, specular hotspots, HDR look, oversaturated, neon, stock photo cliché, thumbs up, fake smile,
exaggerated bright white teeth, veneers look, before and after, split comparison, blood, surgery in progress,
open wound, needles close-up, gloves with blood, cartoon, 3d render look, plastic skin, airbrushed skin,
distorted hands, extra fingers, deformed teeth, cluttered background, busy props, dutch angle
```

---

## 2. Görsel listesi (19 adet)

| # | Kod | Kullanım | Oran | Dosya (`assets-src/…`) |
|---|---|---|---|---|
| 1 | SRV-IMPLANT-01 | Hizmetler önizleme + İmplant sayfası | 4:5 | `shared/services/implant.png` |
| 2 | SRV-SMILE-01 | Gülüş Tasarımı | 4:5 | `shared/services/smile-design.png` |
| 3 | SRV-ENDO-01 | Kanal Tedavisi | 4:5 | `shared/services/endodontics.png` |
| 4 | SRV-WHITE-01 | Diş Beyazlatma | 4:5 | `shared/services/whitening.png` |
| 5 | SRV-ORTHO-01 | Şeffaf Plak | 4:5 | `shared/services/orthodontics.png` |
| 6 | SRV-VENEER-01 | Zirkonyum & Lamina | 4:5 | `shared/services/zirconium-laminate.png` |
| 7 | SRV-PEDO-01 | Pedodonti | 4:5 | `shared/services/pedodontics.png` |
| 8 | PRC-CONSULT-01 | Süreç 1 — Tanışma & Muayene | 16:10 | `shared/process/consult.png` |
| 9 | PRC-SCAN-01 | Süreç 2 — Görüntüleme & Planlama | 16:10 | `shared/process/scan.png` |
| 10 | PRC-TREAT-01 | Süreç 3 — Tedavi | 16:10 | `shared/process/treatment.png` |
| 11 | PRC-CARE-01 | Süreç 4 — Kontrol & Koruma | 16:10 | `shared/process/care.png` |
| 12 | CTA-LIGHT-01 | İletişim bandı | 21:9 | `shared/contact-band.png` |
| 13 | OG-SHARE-01 | WhatsApp/sosyal paylaşım önizlemesi | 1.91:1 | `clinics/<id>/og.png` |
| 14 | CLN-INTERIOR-01 | Klinik galerisi 01 (**gerçek foto önerilir**) | 16:10 | `clinics/<id>/interior-01.jpg` |
| 15 | CLN-STERIL-01 | Klinik galerisi 02 (**gerçek foto önerilir**) | 4:5 | `clinics/<id>/sterilization-01.jpg` |
| 16 | CLN-LOUNGE-01 | Klinik galerisi 03 (**gerçek foto önerilir**) | 4:5 | `clinics/<id>/lounge-01.jpg` |
| 17 | DOC-PORTRAIT-REAL | Hekim portresi — **yalnızca gerçek fotoğraf** (çekim brifi) | 4:5 | `clinics/<id>/doctor-<hekim-id>.jpg` |
| 18 | DOC-HANDS-01 | Hekim portresi yokken tanınmaz "eller" alternatifi (opsiyonel) | 4:5 | `clinics/<id>/doctor-<hekim-id>.jpg` |
| 19 | 3D-REF-TOOTH-01 | 3D ekip/art direction referansı (sitede kullanılmaz) | 1:1 | — |

> ⚠ **Etik not (14–18):** Yapay zekâ ile üretilmiş bir iç mekân veya kişi, gerçek kliniğin/hekimin kendisiymiş gibi
> sunulmamalıdır. Demoda kullanılacaksa `clinicSection.images[].caption` alanına "Temsili görsel" ekleyin;
> yayına alınmadan önce gerçek fotoğraflarla değiştirin. Hekim yüzü **asla** üretilmemelidir.

---

### 1 · SRV-IMPLANT-01

- **Kullanım:** Hizmet listesinde imleci izleyen önizleme, `/hizmetler/implant` hero görseli
- **Oran:** 4:5 (hedef 1200×1500)
- **Prompt:**
  ```
  a single dental implant with a ceramic crown placed upright on a honed white travertine block,
  titanium screw thread catching soft light, crown translucent at the edges like porcelain,
  a folded linen cloth and a small brushed champagne metal tray softly out of focus behind,
  still life product photography for a premium dental clinic, macro detail on the threads,
  object placed on the lower third, large calm negative space above
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `jawbone cross-section, gums, mouth, x-ray, medical diagram, multiple implants`
- **Art direction:** Müzede sergilenen bir mücevher gibi — tıbbi değil, zanaat nesnesi
- **Lighting:** Soldan difüz pencere ışığı, sağdan zayıf beyaz dolgu kartonu, arka plan yumuşak gradyan
- **Camera:** 100 mm macro, f/4, göz hizasının hafif üstü (10°)
- **Composition:** Nesne alt üçte birde, merkezin hafif solunda; üstte %45 boşluk (kart kırpması için güvenli)
- **Renk paleti:** Bone, Porcelain, Champagne; titanyumda nötr gri

### 2 · SRV-SMILE-01

- **Kullanım:** Gülüş Tasarımı önizleme + sayfa
- **Oran:** 4:5
- **Prompt:**
  ```
  close editorial portrait crop of a woman in her thirties with a natural relaxed half smile,
  lips slightly parted, natural teeth with realistic shade (not bright white), freckles and real skin texture,
  soft cream knit sweater, face cropped from nose to chin with jawline, warm porcelain wall background,
  gentle window light on one side of the face, quiet confident mood, beauty editorial for a dental clinic
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `perfect veneers, hollywood smile, glossy lipstick, heavy makeup, teeth whitening result, laughing wide open mouth`
- **Art direction:** "Sonuç" değil "kişi" — doğallık ve güven; tanınabilir tam yüz yok (etik + mevzuat)
- **Lighting:** Kamera solundan büyük softbox etkili pencere ışığı, sağ yanak hafif gölgede
- **Camera:** 85 mm, f/2.2, göz hizası
- **Composition:** Dudaklar dikey olarak üst %40 çizgisinde; kırpma burundan çeneye
- **Renk paleti:** Porcelain arka plan, sıcak ten tonları, Linen kıyafet

### 3 · SRV-ENDO-01

- **Kullanım:** Kanal Tedavisi
- **Oran:** 4:5
- **Prompt:**
  ```
  an elegant anatomical sculpture of a human molar carved from translucent alabaster, cut in half vertically
  to reveal inner layers: enamel shell, warm ivory dentin and a thin rose-colored pulp chamber with root canals,
  standing on a matte porcelain plinth, museum still life, subtle rim light revealing translucency
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `real extracted tooth, decay, dirt, blood, gore, textbook diagram, labels, arrows`
- **Art direction:** Sitedeki 3D anatomi sahnesiyle aynı dil — bilimsel ama heykelsi
- **Lighting:** Arkadan-sağdan ince kenar ışığı (translüsenliği göstermek için), önden çok düşük dolgu
- **Camera:** 100 mm macro, f/5.6, hafif alt açı (heykel etkisi)
- **Composition:** Nesne dikey merkezde, alt %20'de kaide; arka plan kesintisiz gradyan
- **Renk paleti:** Bone, Linen, pulpada tozlu gül `#D27C63` (çok küçük alan)

### 4 · SRV-WHITE-01

- **Kullanım:** Diş Beyazlatma
- **Oran:** 4:5
- **Prompt:**
  ```
  abstract still life of morning light passing through a frosted glass cylinder and a small porcelain bowl
  of pure white pearls on a travertine surface, soft caustic light patterns falling on the stone,
  sense of brightness and purity without showing teeth, minimalist spa-like clinical calm
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `teeth, mouth, whitening trays, gel syringes, before after shade guide, sparkles, lens flare`
- **Art direction:** "Beyazlık" metaforu — sonuç vaadi yerine ışık ve saflık hissi (reklam mevzuatına uygun)
- **Lighting:** Düşük açılı sert-ama-yumuşatılmış güneş ışığı, kostik desenler
- **Camera:** 70 mm, f/4, 30° yukarıdan
- **Composition:** Nesneler sağ alt, ışık desenleri sol üste yayılır
- **Renk paleti:** Bone, Porcelain, çok hafif Clinical glow yansıması

### 5 · SRV-ORTHO-01

- **Kullanım:** Şeffaf Plak
- **Oran:** 4:5
- **Prompt:**
  ```
  a pair of crystal clear dental aligners resting on a small round porcelain dish,
  light refracting through the transparent plastic edges, a linen napkin and a pale oak surface,
  precise product macro photography, calm and hygienic, luxury accessory aesthetic
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `metal braces, wires, brackets, saliva, dirty plastic, brand case, packaging`
- **Art direction:** Günlük hayatın parçası, zahmetsiz bir nesne; cam objesi gibi ışığı kıran şeffaflık
- **Lighting:** Arkadan-yandan ışık (kenar kırılmaları), önde beyaz yansıtıcı
- **Camera:** 100 mm macro, f/4, 35° yukarıdan
- **Composition:** Tabak merkezin altında, plaklar hafif çapraz; üstte boşluk
- **Renk paleti:** Bone, açık meşe, Champagne yansıma

### 6 · SRV-VENEER-01

- **Kullanım:** Zirkonyum & Lamina
- **Oran:** 4:5
- **Prompt:**
  ```
  a row of ultra thin ceramic veneer shells and one zirconia crown arranged like jewelry on a dark obsidian
  velvet tray, backlit so the porcelain glows with delicate translucency and subtle shade gradients,
  a dental ceramist's shade tab softly blurred in the background, fine craftsmanship atelier mood
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `mouth, grinding, dust, lab mess, plaster models, bright white opaque teeth, jewelry box logo`
- **Art direction:** Atölye / mücevher zanaatı; tek karanlık zeminli görsel → listede ritim kırıcı
- **Lighting:** Arkadan difüz ışık panosu (translüsenlik), önden çok düşük dolgu
- **Camera:** 100 mm macro, f/5.6, 20° yukarıdan
- **Composition:** Diyagonal dizilim soldan sağa yükselir; alt üçte bir
- **Renk paleti:** Obsidian zemin, Bone/Linen porselen, Champagne detay

### 7 · SRV-PEDO-01

- **Kullanım:** Pedodonti
- **Oran:** 4:5
- **Prompt:**
  ```
  a small child's soft toothbrush with muted sage handle and a tiny wooden toy standing next to a porcelain cup
  on a sunlit linen covered table, gentle playful but calm atmosphere, soft morning light,
  warm and safe feeling for parents, no people
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `cartoon characters, bright primary colors, plastic toys clutter, child face, crying, dental chair`
- **Art direction:** Oyunbaz ama sakin — ebeveyne güven veren, gürültüsüz bir çocuk dünyası
- **Lighting:** Sabah güneşi, yumuşak gölgeler
- **Camera:** 50 mm, f/2.8, göz hizası
- **Composition:** Nesneler sol alt, sağ üst boşluk ve ışık
- **Renk paleti:** Linen, Sage, açık meşe, Porcelain

### 8 · PRC-CONSULT-01

- **Kullanım:** Süreç kartı 1 (Tanışma & Muayene)
- **Oran:** 16:10 (1600×1000)
- **Prompt:**
  ```
  a calm consultation moment across a light oak desk, a dentist's hands in a cream coat gesturing gently
  toward a tablet showing an abstract soft graphic, patient's hands holding a glass of water opposite,
  faces out of frame, warm sunlit consultation room, trust and conversation, human and unhurried
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `visible faces, x-ray on screen, readable UI text, handshake cliché, clipboard, dental chair`
- **Art direction:** "Önce dinleriz" — işlem değil diyalog
- **Lighting:** Yandan pencere ışığı masaya yayılır
- **Camera:** 50 mm, f/2.8, göğüs hizası
- **Composition:** Eller orta bantta, masa yatay çizgisi alt üçte bir
- **Renk paleti:** Açık meşe, Bone, Linen

### 9 · PRC-SCAN-01

- **Kullanım:** Süreç kartı 2 (Görüntüleme & Planlama)
- **Oran:** 16:10
- **Prompt:**
  ```
  a large calibrated monitor in a softly lit planning room displaying an abstract translucent 3D dental arch scan
  in pale ivory on a dark background with thin champagne measurement lines, a wireless intraoral scanner wand resting
  on a porcelain stand in the foreground, quiet technology, precision without coldness
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `readable numbers, UI text, brand logos, blue hologram, sci-fi, patient data, cluttered desk`
- **Art direction:** Teknoloji var ama klinik soğukluğu yok — sitedeki AI/lab sahnesiyle köprü
- **Lighting:** Monitör parıltısı + pencereden sıcak difüz ışık dengesi
- **Camera:** 35 mm, f/2.8, masa hizası
- **Composition:** Ekran sağ yarıda, tarayıcı sol ön planda bulanık
- **Renk paleti:** Obsidian ekran, Bone tarama, Champagne çizgiler, çok az Clinical glow

### 10 · PRC-TREAT-01

- **Kullanım:** Süreç kartı 3 (Tedavi)
- **Oran:** 16:10
- **Prompt:**
  ```
  top-down still life of sterile sealed dental instrument pouches and a neatly arranged brushed steel tray
  on a clean porcelain countertop, precise geometric arrangement, soft daylight, calm order and hygiene,
  a single folded linen towel, no blood, no procedure
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `used instruments, blood, syringe needle close-up, patient mouth, messy tray, gloves`
- **Art direction:** Düzen = güven; knolling estetiği
- **Lighting:** Tavandan geniş difüz ışık, çok yumuşak gölgeler
- **Camera:** 50 mm, f/8, tam üstten (flat lay)
- **Composition:** Izgaraya hizalı, sağda nefes alanı
- **Renk paleti:** Porcelain, fırçalanmış çelik gri, Linen

### 11 · PRC-CARE-01

- **Kullanım:** Süreç kartı 4 (Kontrol & Koruma)
- **Oran:** 16:10
- **Prompt:**
  ```
  a serene bathroom vanity at sunrise, travertine basin, a bamboo toothbrush in a porcelain cup, a small linen towel
  and a sprig of green in a glass, long soft shadows, everyday ritual of care, peaceful and clean
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `toothpaste brand, bottles with labels, mirror reflection of a person, water splashes, clutter`
- **Art direction:** Tedavi sonrası "gündelik ritüel" — uzun vadeli bakım
- **Lighting:** Düşük açılı gündoğumu, uzun gölgeler
- **Camera:** 50 mm, f/2.8, lavabo hizası
- **Composition:** Nesneler sol üçte bir, sağda ışık düşen boş traverten
- **Renk paleti:** Traverten, Bone, Sage vurgusu

### 12 · CTA-LIGHT-01

- **Kullanım:** İletişim bölümü geniş bant (başlık üzerine biner → alt kısım sakin olmalı)
- **Oran:** 21:9 (2400×1030)
- **Prompt:**
  ```
  wide architectural detail of a minimal clinic reception corner, curved limewashed wall in warm porcelain tone,
  a single sculptural ceramic vase, morning light beam sweeping diagonally across the wall,
  vast calm negative space in the lower left for typography, serene welcoming atmosphere
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `people, reception desk with logo, signage, plants clutter, chairs, busy details in lower left`
- **Art direction:** Kapıdan içeri adım atma hissi; başlık için sakin sol-alt alan
- **Lighting:** Diyagonal güneş huzmesi, geri kalan her şey yumuşak
- **Camera:** 35 mm, f/5.6, göz hizası
- **Composition:** Vazo sağ üçte bir; sol alt %50 boş
- **Renk paleti:** Porcelain, Linen, Champagne ışık

### 13 · OG-SHARE-01

- **Kullanım:** Link paylaşım önizlemesi (WhatsApp, Instagram DM, LinkedIn) — her kliniğe kopyalanır
- **Oran:** 1.91:1 (1200×630)
- **Prompt:**
  ```
  a glowing translucent porcelain molar sculpture floating above a dark obsidian surface with a thin champagne orbit ring
  around it, soft volumetric light from above, premium minimal hero still, centered subject with space on the left
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `cartoon tooth, smiley tooth, sparkles, blue background`
- **Art direction:** Sitedeki 3D hero'nun fotoğrafik karşılığı; küçük önizlemede bile okunur
- **Lighting:** Üstten volumetrik, kenar ışığı
- **Camera:** 85 mm, f/4, hafif alt açı
- **Composition:** Diş merkezin sağında, sol %40 boş
- **Renk paleti:** Obsidian, Bone, Champagne

### 14 · CLN-INTERIOR-01 (temsili — gerçek foto önerilir)

- **Kullanım:** Klinik galerisi 01 (geniş)
- **Oran:** 16:10 (1600×1000)
- **Gerçek çekim brifi:** Muayene odası, tüm ışıklar açık + pencere ışığı; kamera 24–35 mm, göz hizası, dikey çizgiler düz; kişisel eşya, kablo, marka logosu kadraj dışı.
- **Prompt (demo için temsili):**
  ```
  a serene modern dental treatment room with a cream upholstered dental chair, limewashed walls, pale oak cabinetry,
  large window with sheer linen curtain, soft daylight, discreet brushed champagne fixtures, everything spotless
  and uncluttered, architectural interior photography
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `people, blue chair, green surgical light glare, visible brand logos, monitors with text, clutter`
- **Art direction:** Sakin, ferah, "burada rahatlarım"
- **Lighting:** Pencere + yumuşak tavan ışığı, pozlama iç-dış dengeli
- **Camera:** 28 mm tilt-shift görünümü, f/8, göz hizası
- **Composition:** Koltuk sağ üçte bir, pencere sol
- **Renk paleti:** Porcelain, açık meşe, Linen, Champagne

### 15 · CLN-STERIL-01 (temsili — gerçek foto önerilir)

- **Kullanım:** Klinik galerisi 02
- **Oran:** 4:5
- **Gerçek çekim brifi:** Otoklav ve paketlenmiş setler; etiketler/hasta bilgisi görünmesin; 50 mm, dikey.
- **Prompt:**
  ```
  close view of neatly stacked sealed sterilization pouches with dental instruments inside, on a clean porcelain shelf
  next to a softly blurred modern autoclave, orderly calm hygiene, soft daylight
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `readable labels, dates, patient names, dirty instruments, blood`
- **Art direction:** Protokol = güven; tekrar eden düzen ritmi
- **Lighting:** Yandan difüz
- **Camera:** 70 mm, f/3.5
- **Composition:** Paketler diyagonal ritim, üst üçte birde cihaz bulanık
- **Renk paleti:** Bone, çelik gri, Linen

### 16 · CLN-LOUNGE-01 (temsili — gerçek foto önerilir)

- **Kullanım:** Klinik galerisi 03
- **Oran:** 4:5
- **Prompt:**
  ```
  a quiet waiting lounge corner with a curved boucle armchair in cream, a travertine side table with a ceramic cup of tea
  and a closed linen-bound book, warm afternoon light, calm like a boutique hotel, no people
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `TV screen, magazines with text, crowded waiting room, fluorescent light`
- **Art direction:** Bekleme değil "mola"
- **Lighting:** Öğleden sonra sıcak yan ışık
- **Camera:** 50 mm, f/2.8
- **Composition:** Koltuk alt yarı, üstte duvar ve ışık
- **Renk paleti:** Linen, Porcelain, traverten, Champagne

### 17 · DOC-PORTRAIT-REAL — gerçek çekim brifi (üretim YOK)

- **Kullanım:** Hekimler bölümü
- **Oran:** 4:5 (1000×1250)
- **Çekim:** 85 mm, f/2.8; kamera solundan büyük softbox veya pencere; arka plan açık porselen/keten tonlu düz duvar (#F3EFE8'e yakın); krem veya beyaz önlük/triko; bel üstü, hafif 3/4 duruş; doğal ifade, zorlanmış gülümseme yok.
- **Rötuş:** Minimum (cilt dokusu korunur), renk ısısı sıcak-nötr, kontrast düşük.
- **Neden üretim yok:** Gerçek bir hekimi temsil eden yapay yüz yanıltıcıdır (hasta güveni, mesleki etik, reklam mevzuatı).

### 18 · DOC-HANDS-01 (opsiyonel, tanınmaz alternatif)

- **Kullanım:** Gerçek portre gelene kadar hekim kartı (caption: "Temsili görsel")
- **Oran:** 4:5
- **Prompt:**
  ```
  a dentist's hands in a cream coat holding a small dental mirror and a porcelain shade guide near a window,
  face out of frame, calm precise gesture, soft daylight, editorial detail portrait
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `face, eyes, name tag, text on coat, gloves with stains`
- **Art direction:** Kişi değil zanaat vurgusu; kimlik iddiası yok
- **Lighting:** Pencere ışığı soldan
- **Camera:** 85 mm, f/2.5
- **Composition:** Eller merkezin altında, üstte önlük dokusu
- **Renk paleti:** Bone, Linen, Champagne

### 19 · 3D-REF-TOOTH-01 (referans, sitede kullanılmaz)

- **Kullanım:** İleride GLB sipariş edilirse 3D sanatçıya art direction referansı
- **Oran:** 1:1
- **Prompt:**
  ```
  studio render reference of a stylized human upper molar with four rounded cusps and three smooth tapering roots,
  semi-translucent porcelain enamel with a visible warm ivory dentin core and a thin rose pulp,
  floating on a dark obsidian background with a thin champagne ring, clean product visualization
  + [Stil Kilidi]
  ```
- **Negative:** Ortak Negative + `cartoon, decay, dirt, gums, jaw, text labels`

---

## 3. 3D asset stratejisi

**Karar: GLB/GLTF modeli kullanılmadı.** Diş, tarayıcıda işaretli mesafe alanlarından (SDF) marching cubes ile
üretiliyor (`src/app/features/tooth-stage/tooth-geometry.ts`), hesaplama Web Worker'da yapılıyor.

| Katman | Amaç | Izgara (desktop / mobil) | Üçgen (ölçülen, desktop / mobil) | Doku |
|---|---|---|---|---|
| Mine (enamel) | Hero + anatomi dış kabuk, fresnel kenar ışığı | 68³ / 52³ | 19.7k / 11.5k | Yok (PBR materyal) |
| Dentin | Anatomi 02 | 56³ / 44³ | 8.4k / 5.2k | Yok |
| Pulpa + kanallar | Anatomi 03 | 68³ / 52³ | 4.5k / 2.5k | Yok |
| Nokta bulutu | "Dijital tarama" geçişi | mine köşelerinden seyreltme | ~5.4k / ~1.9k nokta | Yok |

Toplam bütçe desktop ≈ 33k, mobil ≈ 19k üçgen. Üretim Web Worker'da ~1–3 sn sürer (cihaza bağlı); bu sırada vektör poster görünür ve ana thread bloklanmaz.

**Neden GLB değil?**
- İndirilecek model yok (Draco'lu bir GLB bile 3 katman için ~300–600 KB olurdu); worker kodu 3.7 KB gzip.
- Üç katman aynı alan fonksiyonundan geldiği için **birebir hizalı** (ayrı modellenen katmanlarda kayma olur).
- LOD = çözünürlük parametresi; mobil otomatik düşük detay.
- Materyaller (porselen/dentin/pulpa) marka paletinden okunur → klinik renkleriyle uyumlu.

**Desktop/mobil stratejisi:**
- 3D, **ilk kullanıcı etkileşimine** (fare, dokunma, kaydırma, klavye) kadar yüklenmez → LCP/TBT'yi etkilemez.
- `features.webgl = false`, Save-Data, WebGL yok, zayıf mobil (≤3 çekirdek/≤2 GB) → vektör poster (aynı üç katman, CSS ile).
- Görünür alan dışında ve sekme gizliyken render döngüsü durur. DPR sınırı: desktop 1.75, mobil 1.5.
- `prefers-reduced-motion`: animasyon yok; katman değişiminde tek kare çizilir.

**İleride GLB gerekirse** (ör. implant/plak gibi ürün sahneleri): `assets/models/implant.glb` — ≤15k üçgen,
Draco + meshopt, 1K KTX2 doku (base/ORM/normal), yalnızca desktop'ta ve görünür alana girince yükleyin.
