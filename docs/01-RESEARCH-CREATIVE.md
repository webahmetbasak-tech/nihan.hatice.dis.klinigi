# A–D. Araştırma · Creative Direction · Teknoloji · Storyboard

## A. RESEARCH

### İncelenen kaynaklar

| Kaynak | Ne öğrendik |
|---|---|
| [Aventura Dental Arts](https://aventuradentalarts.com/) — Awwwards SOTD, 19 Mart 2026 ([Awwwards](https://www.awwwards.com/sites/aventura-dental-arts)) | Palet yalnızca `#EAE8E8` + `#14151D`: lüks dental = renk değil **kısıtlama**. Büyük fotoğraf, ortalanmış editoryal başlık, hizmet rozetleri, "01/06" numaralı karuseller, kalıcı "Book a Call" CTA, hekim/teknoloji bölümleriyle güven katmanı. |
| [ORYZO AI](https://oryzo.ai/) — Lusion ([BTS: UX/UI](https://blog.lusion.co/oryzo-bts-part-3-7-website-ux-ui-and-illustrations), [Awwwards](https://www.awwwards.com/sites/oryzo-ai)) | Tek kahraman nesne, gerçek zamanlı Three.js, ağırlık/inertia hissi, Z ekseninde kamera. Metnin %99'u tek aile, 4 renk: *"efektin parlaması için etrafındaki her şey sessiz kalmalı."* Bilgi mimarisi sıradan (hero → özellik → spec → yorum → CTA), yenilik görsel işlemde. |
| [Awwwards dental arşivi](https://www.awwwards.com/inspiration_search/dental/) | 27 dental proje: SOTD'ler (Aventura, Halo Dental, L'Avenir, Art of Swissdent) ortak nokta **tek güçlü art direction + sınırlı palet**; mavi-turkuaz klişesi 2015 dönemine ait (L'Avenir `#49c5b6`). |
| [Halo Dental](https://www.awwwards.com/sites/halo-dental) (SOTD 2024) | Siyah + tek vurgu rengi, mikro etkileşim ve footer tasarımıyla ödül — teknoloji markası dili. |
| [Art of Swissdent](https://www.awwwards.com/sites/art-of-swissdent) (SOTD 2021) | Ürün fotoğrafçılığı + GSAP geçişleri + parallax; "sağlıklı dişlerin dünyasına dalış". |
| [Sağlıkta reklam yasağı — MDM Hukuk](https://mdmhukuk.com/saglikta-reklam-yasagi-ve-cezalari-doktor-dis-hekimi/), [İDO duyurusu](https://www.ido.org.tr/haber_goster.php?Id=2843), [Hukuki Haber](https://www.hukukihaber.net/turkiyede-dis-hekimligi-meslegine-yonelik-reklam-yasagi-hukuki-cerceve-ve-uygulama) | 1219 s. Kanun md. 40, ADSH Yönetmeliği md. 24: **fiyat, indirim, önce/sonra, hasta yorumu, "en iyi/uzman/garantili/ağrısız/tek seansta"** yasak; ad, adres, telefon, çalışma saatleri, hizmet alanları ve bilimsel bilgilendirme serbest. İdari para cezası 34.701–69.411 TL. |
| Demo klinikler (herkese açık profiller) | Üç klinik de **Kütahya**'da. Kütahya Akademi 2023'te kurulmuş poliklinik; Nazlı Yoluç "Smiling is art" sloganı; Kadriye Özkul için rehberlerde iki farklı adres (→ placeholder bırakıldı). |

### Referanslardan alınanlar ve nedenleri

| Fikir | Kaynak | Neden |
|---|---|---|
| Sınırlı palet + tek vurgu (şampanya) | Aventura, Oryzo | Premium algı = disiplin; klinik renkleri değişse de sistem bozulmaz |
| Tek kahraman nesne (3D diş) | Oryzo | Sitenin "imza anı"; dental kimliği ilk saniyede okutur |
| Editoryal serif başlıklar | Aventura | Tıbbi yayın ciddiyeti + insani sıcaklık |
| Numaralı bölümler, mono etiketler | Aventura ("01/06"), Oryzo | Bilimsel/ölçülü his, tarama kolaylığı |
| Konvansiyonel IA, yenilikçi sunum | Oryzo | Hasta bilgiyi beklediği yerde bulmalı (dönüşüm) |
| Kalıcı randevu CTA | Aventura | Her bölümde bir sonraki adım |

### Bilinçli olarak kullanılmayanlar

| Fikir | Neden kullanılmadı |
|---|---|
| Hasta yorumları / puan yıldızları | Türkiye mevzuatı + sahte veri üretmeme ilkesi |
| Önce/sonra galerisi | Mevzuat yasağı; aynı etkiyi **anatomi eğitimi** ile güvene çevirdik |
| Fiyat tablosu | Mevzuat; config'te `features.showPrices` varsayılan kapalı |
| Oryzo'nun mizahi/ironik tonu | Sağlıkta güveni zedeler |
| Preloader / intro animasyonu | LCP'yi geciktirir; hero metni SSR ile anında gelir |
| Tam ekran video hero | Mobil veri/performans; 3D sahne daha az byte ile daha çok anlam taşıyor |
| Google Maps iframe | Üçüncü taraf çerez (KVKK) + ~500 KB JS; "Yol tarifi" linki yeterli |
| Google Fonts CDN | Kullanıcı IP'sinin yurt dışına aktarımı (KVKK); fontlar self-host |
| Özel imleç (custom cursor) | Erişilebilirlik ve dokunmatikte anlamsız; yalnızca hizmet listesinde görsel önizleme |
| Her öğeye hover animasyonu | Hareket hiyerarşisini sulandırır |

---

## B. CREATIVE DIRECTION

### Konsept: **"Porcelain & Light" — Mine ve Işık**

Mine, vücudun ışığı kıran tek dokusudur. Estetik diş hekimliği ışığın mine üzerindeki davranışını yönetmektir;
teşhis ise katmanları görebilmektir. Site bu iki fikri anlatır: **gündüz** (porselen, sıcak ışık, insan) ve
**laboratuvar** (obsidyen, katmanlar, teknoloji). Kullanıcı hero'dan anatomiye inerken zemin gündüzden laboratuvara koyulaşır.

Ton: bilgilendirici, sakin, ölçülü. Üstünlük iddiası yok — güven, açıklık ve süreç şeffaflığıyla kurulur.
Hero mesajı: **"Her gülüş, milimetrik bir karardır."** (klişe "Smile Design" yerine hassasiyet + insan kararı)

### Renk sistemi (BRAND TOKENS)

| Token | Değer | Rol | Kontrast |
|---|---|---|---|
| `--color-bg` | `#F3EFE8` Porcelain | Gündüz zemini | — |
| `--color-surface` | `#FBF9F5` Bone | Kart, input | — |
| `--color-surface-alt` | `#E8E1D6` Linen | İkincil yüzey | — |
| `--color-primary` | `#1F3A36` Enamel Pine | Hover dolgusu, derin vurgu | beyaz üzerinde 11.6:1 |
| `--color-secondary` | `#8E9B8C` Sage | Dekoratif | yalnızca dekor |
| `--color-accent` | `#B08D57` Champagne | Çizgi, ikon, nokta | yalnızca dekor (2.7:1) |
| `--color-accent-strong` | `#7A5E33` | Metin olarak şampanya | 5.3:1 |
| `--color-cta` / `--color-cta-text` | `#16181B` / `#FBF9F5` | Birincil buton | 16.9:1 |
| `--color-text` | `#16181B` Obsidian | Metin | 15.5:1 |
| `--color-muted` | `#57534D` Warm Graphite | İkincil metin | 6.7:1 |
| `--color-border` | `#D8D0C3` | Çizgiler | — |
| `--color-success / warning / error` | `#2F6B4F` / `#8F5A14` / `#9E3A30` | Durumlar | ≥5.4:1 |
| `--lab-bg` / `--lab-surface` | `#0D0F10` / `#171A1C` | Laboratuvar sahneleri | — |
| `--lab-text` / `--lab-muted` | `#EDE8DF` / `#A39D93` | Koyu zeminde metin | 15.8:1 / 7.1:1 |
| `--lab-accent` | `#D2B688` | Koyu zeminde şampanya | 9.9:1 |
| `--lab-glow` | `#9DB6C1` Clinical Glow | Yalnızca teknoloji (tarama halkası, AI) | 9.1:1 |

"Beyaz + mavi + turkuaz" klişesinden kaçış: steriliteyi soğuk maviyle değil **porselen beyazı + obsidyen** ile,
teknolojiyi tek bir soluk klinik mavi ışıltıyla anlatıyoruz. Klinik paletleri: Kütahya Akademi (varsayılan),
Kadriye Özkul (patlıcan-grafit + gül kili), Nazlı Yoluç (espresso + sıcak bronz) — hepsi AA doğrulandı.

### Tipografi

| Rol | Font | Neden |
|---|---|---|
| Display | **Newsreader** (variable, italik) | Editoryal/tıbbi yayın ciddiyeti; ince ağırlıklarda lüks, italikte insani sıcaklık; Türkçe latin-ext tam |
| Body | **Manrope** (variable) | Geometrik, yüksek okunabilirlik, sayılar net (saat/telefon) |
| Mono | **Geist Mono** | Ölçü, etiket, "01 — Anatomi" dili; teknoloji hissi |

Ölçek (akışkan, 375→1920 px): Display XL `3.4→10.5rem` · Display L `3→7.5rem` · Display M `2.5→5.25rem` ·
H1 `2.25→3.75rem` · H2 `1.75→2.75rem` · H3 `1.2→1.5rem` · Body XL `1.2→1.5rem` · Body L `1.05→1.175rem` ·
Body `1rem` · Small `.875rem` · Caption `.75rem` mono büyük harf.

### Art direction (fotoğraf)
Kuzey ışığı, sıcak-nötr beyaz, porselen/traverten/keten/şampanya metal, orta format editoryal, rötuşsuz insan, yazı/logo yok.
Ayrıntı: [02-GOOGLE-FLOW-PROMPT-PACK.md](02-GOOGLE-FLOW-PROMPT-PACK.md).

### Hareket dili

| Seviye | Nerede | Teknik |
|---|---|---|
| L1 Micro | Buton dolgu süpürmesi, manyetik CTA, kart eğimi, link alt çizgisi | CSS + GSAP quickTo (yalnızca ince imleç) |
| L2 Reveal | Başlık satırları, paragraf/kart yükselmesi, görsel perde açılışı | IntersectionObserver + CSS (JS'siz animasyon) |
| L3 Parallax | Klinik galerisi | GSAP ScrollTrigger scrub (yalnızca desktop) |
| L4 Transition | Gündüz→lab zemin geçişi, yuvarlak köşeli "sayfa kayması", pinned süreç rayı | ScrollTrigger |
| L5 Storytelling | 3D diş: sağdan sola kayma, dönüş, dijital tarama, mine→dentin→pulpa | Tek deterministik master timeline + Three.js |

Easing ailesi tek: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out). Hızlar: 160 / 320 / 640 / 1100 ms.

---

## C. TECHNOLOGY DECISIONS

| Teknoloji | Karar | Gerekçe |
|---|---|---|
| **Angular 22** | ✅ | İstenen; standalone, signals, zoneless, `@defer` + artımlı hydration, typed forms, `inject()`, yeni control flow |
| **SSG (prerender)** | ✅ | 9 sayfa build'de statik HTML → SEO etiketleri/JSON-LD HTML'de, sunucusuz Vercel, hızlı LCP |
| **Zoneless + OnPush** | ✅ | Daha az change detection; sinyal tabanlı güncelleme |
| **Artımlı hydration** | ✅ | Ekran altı bölümler `hydrate on idle` → ilk yüklemede tek uzun görev yok |
| **GSAP + ScrollTrigger** | ✅ (sınırlı) | Yalnızca scrub/pin gereken yerlerde (3D timeline, zemin geçişi, süreç rayı, parallax); boşta tembel yüklenir |
| **GSAP SplitText** | ❌ kaldırıldı | Ölçümde layout thrashing yarattı; başlık satırları template'te zaten ayrı |
| **L2 reveal'lar** | IntersectionObserver + CSS | GSAP'a göre layout okuması yok; Lighthouse "forced reflow" uyarısı kalktı |
| **Lenis** | ✅ desktop | Wheel'de sinematik akış; dokunmatikte yerel kaydırma (daha doğal ve hızlı) |
| **Three.js / WebGL** | ✅ gerekçeli | Anatomi katmanlarını *göstermek* (eğitim = mevzuata uygun güven) — dekoratif değil |
| **GLB** | ❌ | Prosedürel SDF: 0 KB model, katmanlar birebir hizalı, çözünürlükle LOD |
| **Web Worker** | ✅ | Marching cubes ana thread dışında; TBT/INP korunur |
| **WebGL yükleme zamanı** | İlk etkileşimde | GPU'suz ortamlar (PageSpeed) ve ilk yükleme metrikleri korunur; poster aynı katmanları gösterir |
| **CSS (SCSS, tokens)** | ✅ | Tüm tasarım sistemi CSS değişkenleri; klinik paleti çalışma zamanında `:root`'a yazılır (SSR'da da) |
| **Signals** | ✅ | Config türevleri, UI durumu, asistan durum makinesi |
| **Lazy loading** | ✅ | Rotalar, 3D sahne, asistan paneli (`@defer when`), GSAP, Lenis |
| **Tailwind / UI kit** | ❌ | Özgün dil; bağımlılık ve jenerik görünüm riski |

### Ölçülen performans (yerel, gzip, `kutahyaakademi`)

| Metrik | Desktop (Lighthouse) | Mobil (Lighthouse simülasyonu*) | Mobil (gerçek Chrome, 4× CPU, ağ kısıtsız) |
|---|---|---|---|
| Performance skoru | **97–98** | 45–55 (koşudan koşuya değişken) | — |
| FCP | 0.7–0.8 s | ~3.4 s | ~0.9 s |
| LCP | 0.9–1.0 s | ~4.5 s | ~0.9–1.5 s |
| TBT | 40–80 ms | 0.8–1.5 s | — |
| CLS | 0.002 | 0.001 | — |
| Best practices | 96 | 100 | — |
| Erişilebilirlik (axe-core, WCAG 2.2 AA) | **0 ihlal** — `/`, `/hizmetler/implant`, `/kvkk` | | |

\* Lighthouse mobil simülasyonu (yavaş 4G + 4× CPU) yerel sunucuda kötümserdir ve bu makinede yüksek sapma gösterdi;
mobil en zayıf halka olarak kalıyor (kalan yükün çoğu Angular hydration + ilk layout). Deploy sonrası PageSpeed Insights'ta
ölçün. Lighthouse SEO skoru (66) demo `noindex` ayarından gelir — bilinçli; `seo.noindex: false` ile düzelir.
Lighthouse erişilebilirlik (97) animasyon ortasında ölçülen kontrast örneklerini işaretliyor; hareket azaltılmış modda axe 0 ihlal.

Uygulanan performans kararları (ölçüme dayalı): 3D ilk etkileşime ertelendi · marching cubes Web Worker'a taşındı ·
reveal'lar GSAP'tan IntersectionObserver+CSS'e geçti (layout thrashing kalktı) · SplitText kaldırıldı · ekran altı
bölümlerde artımlı hydration + `content-visibility` · `text-wrap: pretty` kaldırıldı · tek font preload · GSAP boşta yükleniyor.

İlk JS: ~118 KB gzip (neredeyse tamamı Angular çekirdeği + router). Three.js ~111 KB gzip, yalnızca etkileşimde.

---

## D. SITE STORYBOARD

Dönüşüm yolculuğu: **DISCOVER → UNDERSTAND → DESIRE → TRUST → BOOK**

| # | Sahne | Amaç | Kullanıcı psikolojisi | Görsel dil | Hareket | CTA | Geçiş |
|---|---|---|---|---|---|---|---|
| 01 | **Hero — THE SMILE** | İlk 3 sn premium + dental algısı | "Burası farklı" | Porselen zemin, dev editoryal serif, sağda gerçek zamanlı 3D azı dişi, anatomik etiketler | Satırlar CSS ile yükselir, diş imleçle eğilir, nefes alır | Randevu Al · Tedavileri keşfedin | Diş sola kayar, döner; zemin koyulaşmaya başlar |
| 02 | **Anatomi — THE SCIENCE** | Güveni eğitimle kurmak | "Anlıyorum, bana anlatılıyor" | Obsidyen lab, cam kartlar, mono ölçüler | Tarama halkası → mine şeffaflaşır → dentin → pulpa (scrub); ilerleme rayı | İlgili hizmet pill'leri | Sahne söner, porselen "sayfa" yuvarlak köşeyle üste kayar |
| 03 | **Tedaviler — TREATMENTS** | İhtiyacı eşleştirmek | "Benim sorunum burada" | Numaralı editoryal indeks, dev serif satırlar | Hover'da satır italikleşir, imleci izleyen görsel perde açılır | Her satır → hizmet sayfası; Muayene randevusu planla | — |
| 04 | **Süreç — EXPERIENCE** | Belirsizlik kaygısını azaltmak | "Ne olacağını biliyorum" | Keten zemin, 4 kart + koyu CTA kartı | Desktop'ta sabitlenmiş yatay ray + ilerleme çizgisi | İlk muayeneyi planla | — |
| 05 | **Klinik — THE CLINIC** | Fiziksel güven | "Temiz, düzenli, sakin" | Yapışkan metin + özellik kartları, asimetrik galeri | Görsel perde açılışı + parallax, kart eğimi | — | — |
| 06 | **Hekim — THE DOCTOR** | İnsani güven | "Kiminle görüşeceğim" | Tek hekimde geniş editoryal düzen | Reveal | Randevu planla | Obsidyen AI sahnesi yuvarlak köşeyle gelir |
| 07 | **AI Asistan — APPOINTMENT** | Farklılaşma + dönüşüm | "Hemen, zahmetsiz" | Lab zemin içinde gündüz paletli "cihaz" | Sohbet canlı çalışır (desktop inline, mobil panel) | Asistanı başlat | — |
| 08 | **İletişim — NEXT SMILE** | Son dönüşüm | "Hangi kanal bana uygunsa" | Geniş ışık bandı, 3 kanal kartı | Manyetik birincil kart | Asistan · Telefon · WhatsApp | Obsidyen footer, kontur wordmark |

Ek sayfalar: `/hizmetler/:id` (7 adet, prerender, MedicalProcedure + Breadcrumb JSON-LD, SSS, sonraki hizmet geçişi),
`/kvkk` (aydınlatma metni şablonu), 404.
