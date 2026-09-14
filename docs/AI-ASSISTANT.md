# AI Randevu Asistanı — Mimari

## Katmanlar

```
AssistantChatComponent  (UI: sohbet + widget'lar — takvim, saat, hizmet kartları, KVKK, özet)
        │ sinyaller
AssistantStore          (durum makinesi: service → doctor → date → time → name → phone → consent → summary → done)
        │                          │
ASSISTANT_ENGINE              APPOINTMENT_PROVIDER
 ├─ LocalAssistantEngine       ├─ MockAppointmentProvider   (demo: config saatlerinden deterministik slot)
 └─ HttpAssistantEngine (LLM)  └─ HttpAppointmentProvider   (REST)
```

Seçim `app.config.ts` içinde config'e göre yapılır; UI ve store bu seçimden habersizdir.

## Akış

| Adım | Serbest metin örneği | Yapılandırılmış UI |
|---|---|---|
| Hizmet | "implant yaptırmak istiyorum", "dişlerim çapraşık" | Hizmet kartları + "Emin değilim / genel muayene" |
| Hekim | "fark etmez" | Hekim listesi (tek hekimde otomatik atlanır) |
| Tarih | "cuma", "yarın", "15 ekim", "15.10" | 21 günlük takvim, doluluk noktaları |
| Saat | "14:30", "öğleden sonra" | Sabah / Öğleden sonra / Akşam slotları |
| Ad | "Adım Ayşe Yılmaz" | — |
| Telefon | "0532 123 45 67" | `inputmode=tel` |
| KVKK | "onaylıyorum" | Zorunlu + isteğe bağlı onay kutuları |
| Özet | "evet" / "hayır" | Değiştir bağlantıları, Gönder |
| Sonuç | — | Referans kodu, Takvime ekle (.ics), WhatsApp ile ilet |

## Güvenlik kuralları (kod içinde zorunlu)

- **Tanı yok.** Semptom ifadeleri (`ağrı, şişlik, kanama, apse…`) → "değerlendiremem, muayene gerekir" + randevu önerisi.
- **Acil yönlendirme.** `yüzüm şişti, ateş, durmayan kanama, nefes, kaza…` → kliniği ara + 112.
- **Fiyat yok.** Fiyat soruları → mevzuat açıklaması.
- **AI açıklaması** her konuşmanın başında.
- **Veri minimizasyonu:** yalnızca ad, telefon, hizmet, tarih/saat; sağlık verisi istenmez. Mock provider hiçbir şey saklamaz.
- **Açık rıza zaman damgası** randevu talebine eklenir.
- HTTP motorunun cevabında "teşhis / garanti / en iyi / ağrısız / tek seansta" geçerse cevap atılır, güvenli şablon kullanılır.

## HTTP sözleşmeleri

### Randevu API'si (`appointment.provider: 'http'`)

```
GET  {endpoint}/availability?serviceId=implant&doctorId=hekim-1&duration=30
→ [{ "date": "2026-09-15", "weekday": 2, "available": true, "slotsLeft": 7 }]

GET  {endpoint}/slots?date=2026-09-15&serviceId=implant&doctorId=hekim-1&duration=30
→ [{ "time": "10:30", "available": true, "period": "morning" }]

POST {endpoint}/appointments
body: AppointmentRequest  (core/appointment/appointment.models.ts)
→ Appointment { id, reference, status: "requested", createdAt, ...request }
```

### Niyet motoru (`aiAssistant.provider: 'http'`)

```
POST {aiAssistant.endpoint}
body: { "message": "cuma öğleden sonra olur", "context": AssistantContext, "clinicId": "kutahyaakademi" }
→ { "intent": "date", "date": "2026-09-18", "partOfDay": "afternoon", "reply": "opsiyonel metin" }
```

`intent` değerleri: `book | service | services-list | doctors | contact | hours | price | symptom | emergency |
greeting | thanks | restart | date | time | name | phone | yes | no | unknown`.
Hata/zaman aşımında (8 sn) yerel motora düşülür.

**API anahtarı asla frontend'e konmaz.** Endpoint bir sunucu fonksiyonu (ör. Vercel Function) olmalıdır.

### Önerilen sistem talimatı (sunucu tarafı LLM)

```
Sen {clinicName} için çalışan bir dijital randevu asistanısın. Görevin yalnızca kullanıcının mesajını
aşağıdaki JSON şemasına dönüştürmek ve gerekirse kısa, nazik, Türkçe bir "reply" yazmaktır.

Kurallar:
- Tıbbi tanı koyma, olası hastalık adı söyleme, tedavi önerme, sonuç vaat etme.
- Şikâyet bildiren kullanıcıya intent "symptom" ver; hızlı müdahale gerektirebilecek durumlarda (yüzde şişlik,
  ateş, durmayan kanama, nefes darlığı, travma) intent "emergency" ver.
- Fiyat, indirim, kampanya sorularında intent "price" ver; fiyat uydurma.
- "En iyi", "uzman", "garantili", "ağrısız", "tek seansta" gibi ifadeler kullanma.
- Sağlık verisi (tahlil, hastalık geçmişi) isteme.
- Tarihleri context.step ve bugünün tarihine göre YYYY-MM-DD biçiminde çöz.
- Yalnızca şu hizmet id'lerini kullan: {services}.
- Yalnızca JSON döndür: {"intent": "...", "serviceId"?: "...", "date"?: "...", "time"?: "HH:mm",
  "partOfDay"?: "morning|afternoon|evening", "name"?: "...", "phone"?: "+90...", "reply"?: "..."}
```

## KVKK notları

- Asistan verisi randevu talebi amacıyla işlenir (KVKK md. 5/2-c); hatırlatma iletişimi için ayrı, isteğe bağlı açık rıza alınır.
- Gerçek API: veriyi TLS ile alın, erişim loglayın, saklama süresi tanımlayın, yurt dışı aktarım varsa md. 9'a uyun.
- LLM kullanılıyorsa: kişisel veri (ad/telefon) LLM'e gönderilmemeli — `name`/`phone` adımları yerel motorla ayrıştırılabilir.
