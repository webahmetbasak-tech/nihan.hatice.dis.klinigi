# Porcelain & Light — Premium Dental Digital Experience

Config-driven, çok klinikli **Angular 22** diş kliniği deneyimi: sinematik scroll anlatımı,
prosedürel WebGL diş anatomisi ve **AI randevu asistanı**.

Tek kod tabanı → config değiştir → build → her klinik için ayrı demo linki.

```bash
npm install
npm run start:kutahyaakademi      # http://localhost:4200
npm run build:kutahyaakademi      # dist/kutahyaakademi/browser (+ dist/app/browser)
```

## Klinikler

| Klinik | Config | Build |
|---|---|---|
| Özel Kütahya Akademi ADSP | `src/app/config/clinics/kutahyaakademi.ts` | `npm run build:kutahyaakademi` |
| Dt. Kadriye Özkul | `src/app/config/clinics/kadriye-ozkul.ts` | `npm run build:kadriye-ozkul` |
| Dt. Nazlı Yoluç | `src/app/config/clinics/dtnazliyoluc.ts` | `npm run build:dtnazliyoluc` |

Her build **yalnızca** kendi kliniğinin config'ini ve `public/clinics/<id>/` görsellerini paketler
(build sonunda otomatik sızıntı kontrolü yapılır).

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run start:<klinik>` | Geliştirme sunucusu |
| `npm run build:<klinik>` | Prerender (SSG) build + sitemap/robots + sızıntı kontrolü |
| `npm run build` | `CLINIC` ortam değişkenine göre build (Vercel) |
| `npm run build:all` | Üç kliniği sırayla build eder |
| `npm run preview` | `dist/app/browser` çıktısını yerelde sunar |
| `npm run images:optimize` | `assets-src/` → AVIF + WebP (`public/`) |

## Dokümantasyon

| Belge | İçerik |
|---|---|
| [docs/01-RESEARCH-CREATIVE.md](docs/01-RESEARCH-CREATIVE.md) | Araştırma, creative direction, marka sistemi, teknoloji kararları, storyboard |
| [docs/02-GOOGLE-FLOW-PROMPT-PACK.md](docs/02-GOOGLE-FLOW-PROMPT-PACK.md) | Tüm görseller için Google Flow promptları + 3D asset stratejisi |
| [docs/03-CONFIG-GUIDE.md](docs/03-CONFIG-GUIDE.md) | Hangi bilgi hangi dosyada, yeni klinik ekleme |
| [docs/04-DEPLOY.md](docs/04-DEPLOY.md) | Vercel deploy (3 proje / tek repo) |
| [docs/05-DEMO-CHECKLIST.md](docs/05-DEMO-CHECKLIST.md) | Sunum öncesi kontrol listesi |
| [docs/AI-ASSISTANT.md](docs/AI-ASSISTANT.md) | Asistan mimarisi, API sözleşmesi, LLM talimatı, mevzuat |

## Mimari (özet)

```
src/app/
├── config/                 # ← kliniğe özel her şey burada
│   ├── clinic.types.ts     # şema
│   ├── defaults/           # taban metinler, palet, hizmet kataloğu
│   ├── clinics/            # 3 klinik (yalnızca farklı olan alanlar)
│   ├── active/             # build'de fileReplacements ile seçilen klinik
│   └── define-clinic.ts    # birleştirme + doğrulama + {değişken} çözümleme
├── core/
│   ├── config/  theme/  seo/  motion/  platform/  ui/
│   ├── appointment/        # AppointmentProvider (mock | http)
│   └── ai/                 # AssistantEngine (local | http) + AssistantStore (durum makinesi)
├── shared/                 # icon, media, headline, motion & a11y direktifleri
├── layout/                 # header, footer, mobil CTA
└── features/
    ├── home/               # 8 sahnelik storyboard
    ├── tooth-stage/        # WebGL diş (SDF + marching cubes, Web Worker)
    ├── ai-assistant/       # sohbet + yapılandırılmış widget'lar
    ├── services/           # prerender edilen hizmet detay sayfaları
    └── legal/              # KVKK, 404
```
