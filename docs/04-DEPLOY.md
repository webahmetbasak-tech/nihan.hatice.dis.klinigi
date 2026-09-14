# G. DEPLOY GUIDE — Vercel

Çıktı tamamen statiktir (SSG). Sunucu fonksiyonu gerekmez.

## Yerel doğrulama

```bash
npm install
npm run build:kutahyaakademi     # → dist/kutahyaakademi/browser  +  dist/app/browser
npm run preview                  # → http://localhost:4300
```

Build çıktısında şunları görmelisiniz:
```
✔ Sızıntı kontrolü: yalnızca "kutahyaakademi" config'i paketlendi.
✔ 9 sayfa prerender edildi (noindex — demo modu).
```

## Yöntem 1 — Tek repo, 3 Vercel projesi (önerilen)

Aynı Git reposunu 3 kez import edin; her projede yalnızca ortam değişkeni farklıdır.
`vercel.json` build/çıktı ayarlarını zaten içerir.

| Vercel projesi | Environment Variable | Örnek domain |
|---|---|---|
| `kutahyaakademi-demo` | `CLINIC=kutahyaakademi` | kutahyaakademi-demo.vercel.app |
| `kadriye-ozkul-demo` | `CLINIC=kadriye-ozkul` | kadriye-ozkul-demo.vercel.app |
| `dtnazliyoluc-demo` | `CLINIC=dtnazliyoluc` | dtnazliyoluc-demo.vercel.app |

Ayarlar (vercel.json'dan otomatik gelir, UI'da değiştirmeyin):
- Framework Preset: **Other**
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist/app/browser`
- Node.js: 22.x veya 24.x

Deploy sonrası her klinik config'inde `seo.siteUrl` değerini gerçek domain ile doldurup yeniden deploy edin
(canonical, OpenGraph görseli ve `sitemap.xml` bu değere bağlıdır).

## Yöntem 2 — Vercel CLI (repo olmadan, hızlı demo)

```bash
npm i -g vercel
vercel login

npm run build:all        # üç klinik → dist/<id>/browser

cd dist/kutahyaakademi/browser && vercel --prod   # ilk seferde proje adı sorar → kutahyaakademi-demo
cd ../../kadriye-ozkul/browser && vercel --prod   # → kadriye-ozkul-demo
cd ../../dtnazliyoluc/browser && vercel --prod    # → dtnazliyoluc-demo
```

> Build betiği her `browser` klasörüne minimal bir `vercel.json` (clean URL + bilinmeyen rota yönlendirmesi)
> yazar; klasörü doğrudan deploy etmek yeterlidir. Angular build `dist/<id>` klasörünü her seferinde temizlediği için
> ilk deploy'da oluşan `.vercel/` bağlantısı da silinir: sonraki deploy'larda CLI proje adını tekrar sorar —
> **mevcut projeyi seçip aynı adı girin** (yeni proje açmayın). Sık güncelleme yapacaksanız Yöntem 1 daha pratiktir.

## Windows'ta ortam değişkeniyle build

```powershell
$env:CLINIC = "dtnazliyoluc"; npm run build
```
```bash
CLINIC=dtnazliyoluc npm run build
```

## Yayına alma (demo → gerçek site)

1. `seo.noindex: false`, `seo.siteUrl` gerçek domain
2. `appointment.showDemoNotice: false` ve `appointment.provider: 'http'` (gerçek randevu API'si)
3. KVKK metnindeki placeholder'lar hukuk onayıyla doldurulmuş olmalı
4. Gerçek klinik ve hekim fotoğrafları
5. Deploy sonrası PageSpeed Insights + Google Rich Results Test (JSON-LD `Dentist`)
