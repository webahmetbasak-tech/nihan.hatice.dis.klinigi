# F. CONFIG GUIDE

Kliniğe özel **hiçbir** bilgi component içinde yoktur. Her şey şu katmanlardan gelir:

```
src/app/config/
├── clinic.types.ts              # Şema (TypeScript tipleri — IDE otomatik tamamlama sağlar)
├── defaults/
│   ├── clinic.defaults.ts       # Tüm kliniklerin miras aldığı metinler, saatler, SEO, asistan, özellikler
│   ├── services.catalog.ts      # 7 hizmetin tam içeriği (mevzuata uygun metinler)
│   └── palette.ts               # Varsayılan marka renkleri
├── clinics/
│   ├── kutahyaakademi.ts        # ← SADECE farklı olan alanlar
│   ├── kadriye-ozkul.ts
│   └── dtnazliyoluc.ts
├── active/<id>.ts               # Build'de seçilir (dokunmayın)
├── clinic.active.ts             # Varsayılan aktif klinik (ng serve)
└── define-clinic.ts             # Birleştirme + doğrulama + {değişken} çözümleme
```

Klinik dosyası `defineClinic({...})` ile yazılır: **nesneler derin birleşir, diziler tamamen değiştirilir.**
Metinlerde `{name}`, `{shortName}`, `{city}`, `{assistant}` değişkenleri kullanılabilir.

## Neyi nerede değiştiririm?

| Değiştirmek istediğim | Dosya → alan |
|---|---|
| Klinik adı, kısa ad, monogram, slogan, şehir | `clinics/<id>.ts` → `clinic` |
| Logo | `public/clinics/<id>/logo.svg` + `branding.logo: { src: '/clinic/logo.svg', alt, width, height }` (yoksa monogram + wordmark) |
| Renkler | `branding.palette` → örn. `{ primary, accent, accentStrong, labAccent }` (geliştirme modunda kontrast uyarısı konsola düşer) |
| Telefon / WhatsApp / e-posta | `contact.phone` (E.164 `+90…`), `contact.phoneDisplay`, `contact.whatsapp` (`90…`, + olmadan), `contact.email` |
| Adres, harita | `contact.address`, `contact.mapsUrl` (boşsa adresten Google Maps araması üretilir), `contact.geo` (JSON-LD) |
| Çalışma saatleri, öğle arası | `contact.workingHours: [{ days: [1..7], open, close, breaks }]` — asistan slotları buradan üretir |
| Sosyal medya | `social.instagram / facebook / youtube / x` |
| Hero başlığı ve metni | `hero.title` (satır dizisi, `emphasis: true` → italik şampanya), `hero.lead`, `hero.eyebrow`, CTA'lar |
| Hero anatomik etiketler | `hero.annotations` |
| Bölüm başlıkları | `anatomy`, `process`, `servicesSection`, `clinicSection`, `doctorsSection`, `assistantSection`, `contactSection` |
| Hangi hizmetler, hangi sırayla | `services.include: ['implant', 'smile-design', …]` |
| Bir hizmetin metni/süresi/görseli | `services.overrides: { implant: { summary: '…', sessionMinutes: 45 } }` |
| Katalogda olmayan yeni hizmet | `services.extra: [ServiceConfig]` + `include` içine id |
| Hizmeti belirli hekime bağlama | `services.overrides.<id>.doctorIds: ['hekim-id']` (asistan hekim adımını buna göre açar) |
| Hekimler | `doctors: [{ id, name, title, education[], focus[], bio, image, workingDays }]` |
| Klinik özellikleri ve galerisi | `clinicSection.features`, `clinicSection.images` |
| SEO | `seo.siteUrl` (**canonical/OG/sitemap için zorunlu**), `seo.title`, `seo.description`, `seo.keywords`, `seo.ogImage`, `seo.noindex` |
| Asistan adı, karşılama, açıklama | `aiAssistant.name`, `aiAssistant.greeting`, `aiAssistant.disclosure`, `aiAssistant.quickActions` |
| Gerçek LLM bağlamak | `aiAssistant.provider: 'http'`, `aiAssistant.endpoint` → bkz. [AI-ASSISTANT.md](AI-ASSISTANT.md) |
| Gerçek randevu API'si | `appointment.provider: 'http'`, `appointment.endpoint` |
| Slot süresi, kaç gün ileri, en erken saat | `appointment.slotMinutes`, `daysAhead`, `leadHours` |
| Tatil / kapalı günler | `appointment.closedDates: ['2026-10-29']` |
| "Demo takvim" uyarısı | `appointment.showDemoNotice` |
| 3D sahne, smooth scroll, mobil CTA, WhatsApp | `features.webgl`, `smoothScroll`, `stickyMobileCta`, `whatsappHandoff` |
| Fiyat gösterimi | `features.showPrices` + `services.overrides.<id>.price` — **hukuki onay olmadan açmayın** |
| KVKK metni bilgileri | `legal.dataController`, `legal.kvkkEmail`, `legal.disclaimer` (+ `features/legal/kvkk.page.ts` içindeki `[SAKLAMA_SÜRESİ]`, `[AKTARIM_YAPILAN_TARAFLAR]`) |

## Görseller

| Görsel | Konum (kaynak) | Yayınlanan yol |
|---|---|---|
| Ortak hizmet/süreç/iletişim görselleri | `public/images/shared/…` | `/images/shared/…` |
| Kliniğe özel (iç mekân, hekim, OG, logo) | `public/clinics/<id>/…` | `/clinic/…` (her build yalnızca kendi klasörünü alır) |

Dosya adları config'teki `image.src` ile eşleşirse **kod değişikliği gerekmez**. Görsel yoksa tasarlanmış placeholder görünür.
Ham görsel → `assets-src/` → `npm run images:optimize`.

## Placeholder kuralı

`[PHONE]`, `[ADDRESS]`, `[DOCTOR_NAME]` gibi köşeli parantezli değerler bilinçli placeholder'dır:
tıklanabilir link üretmez, JSON-LD'ye yazılmaz, ekranda açıkça görünür. **Asla uydurma bilgi girmeyin.**
Klinik dosyalarındaki `⚠ DOĞRULA` yorumları herkese açık kaynaklardan alınmış, teyit bekleyen bilgilerdir.

## Yeni klinik eklemek (4 adım)

1. `src/app/config/clinics/yeni-klinik.ts` oluşturun (mevcut bir dosyayı kopyalayın, `id: 'yeni-klinik'`).
2. `src/app/config/active/yeni-klinik.ts`:
   ```ts
   export { default as ACTIVE_CLINIC } from '../clinics/yeni-klinik';
   ```
3. `angular.json` → `build.configurations` içine mevcut bir klinik bloğunu kopyalayıp id'yi değiştirin
   (`fileReplacements`, `assets` → `public/clinics/yeni-klinik`, `outputPath: dist/yeni-klinik`);
   `serve.configurations` içine de `"yeni-klinik": { "buildTarget": "dental-experience:build:development,yeni-klinik" }`.
4. `scripts/build.mjs` → `CLINICS` dizisine ve `package.json` script'lerine ekleyin. `public/clinics/yeni-klinik/` klasörünü açın.

`define-clinic.ts` bilinmeyen hizmet id'si veya hizmete bağlı olmayan hekim id'si görürse **build'i durdurur**.
