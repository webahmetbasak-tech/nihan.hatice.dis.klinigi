# H. DEMO CHECKLIST — sunumdan önce

## 1. Bilgi doğruluğu (en kritik)

| Klinik | Doğrulanacak |
|---|---|
| **Kütahya Akademi** | Telefon `0530 993 00 43` ve WhatsApp hattı · çalışma günleri (09:00–21:00 herkese açık kaynaktan) · kuruluş yılı 2023 · adres · e-posta · hekim adları/unvanları |
| **Dt. Kadriye Özkul** | **Adres** (kaynaklarda iki farklı adres: Cumhuriyet Cad. no:62/2 ve Sevgi Yolu Şeker Apt. No:1) · telefon · WhatsApp · çalışma saatleri (şu an taban varsayılan) · Facebook linki |
| **Dt. Nazlı Yoluç** | Resmî unvan · telefon `0546 226 29 91` · e-posta · adres (Atatürk Blv., Özer Apt., Servi Mah. — kapı no eksik) · çalışma saatleri (şu an taban varsayılan) |

- [ ] Klinik dosyalarındaki tüm `⚠ DOĞRULA` yorumları kontrol edildi
- [ ] Hiçbir yerde uydurma diploma, ödül, yıl, hasta yorumu yok
- [ ] Placeholder'lar (`[EMAIL]`, `[DOCTOR_NAME]`…) bilinçli olarak görünür ya da gerçek veriyle dolduruldu
- [ ] Hizmet listesi kliniğin gerçekten sunduğu hizmetlerle eşleşiyor (`services.include`)

## 2. Mevzuat & etik

- [ ] Fiyat yok (`features.showPrices: false`)
- [ ] Önce/sonra, hasta yorumu, "en iyi / uzman / garantili / ağrısız / tek seansta" ifadesi yok (özel metin eklendiyse tekrar okuyun)
- [ ] Yapay zekâ ile üretilmiş klinik iç mekânı kullanılıyorsa caption'da "Temsili görsel" yazıyor
- [ ] Hekim yüzü yapay zekâ ile üretilmedi
- [ ] Asistan açılış mesajında AI açıklaması görünüyor
- [ ] KVKK sayfası açılıyor, veri sorumlusu adı doğru

## 3. Görseller

- [ ] 7 hizmet + 4 süreç + iletişim bandı görselleri `npm run images:optimize` ile eklendi (ya da placeholder bilinçli)
- [ ] `public/clinics/<id>/og.jpg` mevcut (WhatsApp'ta link önizlemesi)
- [ ] Logo varsa `branding.logo` dolduruldu, yoksa monogram iyi görünüyor

## 4. Fonksiyon testi (her klinik linkinde)

- [ ] Hero'da fareyi oynatınca 3D diş belirir (1–3 sn), kaydırınca sola kayıp döner
- [ ] Anatomi: Mine → Dentin → Pulpa katmanları sırayla açılıyor; zemin koyulaşıyor
- [ ] Menü linkleri doğru bölüme gidiyor (Tedaviler, Süreç, Klinik, Hekimler, Asistan, İletişim)
- [ ] Tedaviler listesinde hover önizlemesi + hizmet sayfası açılıyor, "Bu tedavi için randevu planla" asistanı hizmetle açıyor
- [ ] Asistan akışı: "implant yaptırmak istiyorum" → tarih → saat → ad → telefon → KVKK onayı → özet → **referans kodu**
- [ ] Güvenlik: "dişim çok ağrıyor" → tanı koymadan muayeneye yönlendiriyor; "yüzüm şişti" → kliniği ara / 112
- [ ] "implant fiyatı ne kadar" → mevzuat açıklaması
- [ ] WhatsApp ile ilet / Takvime ekle çalışıyor
- [ ] Telefon butonu gerçek numarayı arıyor (placeholder ise buton görünmez)

## 5. Cihazlar

- [ ] iPhone (Safari) 375–430 px: hero, sticky "Randevu Al" çubuğu, tam ekran menü, tam ekran asistan
- [ ] Android (Chrome)
- [ ] Tablet 768–1024 px
- [ ] Laptop 1440 px, büyük ekran 1920 px
- [ ] Klavye: Tab ile gezinme, odak halkaları, Escape ile menü/asistan kapanıyor
- [ ] Sistem ayarında "Hareketi azalt" açıkken site statik ve eksiksiz

## 6. Teknik

- [ ] `npm run build:<klinik>` → "Sızıntı kontrolü" ✔
- [ ] `seo.siteUrl` deploy domainiyle dolduruldu → yeniden deploy
- [ ] Demo linkleri `noindex` (arama motorunda çıkmaz) — gerçek siteye geçerken kapatın
- [ ] PageSpeed Insights (mobil + desktop) ölçüldü
- [ ] Sunumda internet yavaşsa: sayfa önceden bir kez açılıp tarayıcı önbelleğine alındı

## 7. Sunum akışı önerisi (3 dk)

1. Hero (3 sn sessiz bekleyin) → fareyi dişin üzerinde gezdirin
2. Yavaşça kaydırın: gündüz → laboratuvar, katmanlar (eğitim = mevzuata uygun güven)
3. Tedaviler hover → bir hizmet sayfası
4. Asistanla canlı randevu: "implant yaptırmak istiyorum" → referans kodu → "WhatsApp ile ilet"
5. Telefonda aynı linki açın: mobil deneyim + sticky CTA
6. Kapanış: "Aynı sistem sizin renginiz, hekimleriniz ve takviminizle."
