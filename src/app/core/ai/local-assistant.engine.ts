import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AssistantContext, AssistantEngine, Interpretation } from './assistant.models';
import { includesAny, normalize, parseDate, parseName, parsePhone, parseTime } from './turkish-nlu';

/** Acil yönlendirme gerektirebilecek ifadeler → asistan randevu yerine hemen aramayı önerir. */
const EMERGENCY = [
  'dayanilmaz',
  'siddetli agri',
  'yuzum sisti',
  'yuzumde sislik',
  'yanagim sisti',
  'atesim',
  'ates var',
  'yuksek ates',
  'kanama durmuyor',
  'durmayan kanama',
  'nefes',
  'yutkunam',
  'kaza',
  'darbe',
  'disim kirildi',
  'dis kirildi',
  'disim cikti',
];
const SYMPTOM = ['agri', 'agriyor', 'sizla', 'zonkl', 'hassas', 'iltihap', 'apse', 'sislik', 'kaniyor', 'kanama', 'sallaniyor', 'aciyor'];
const PRICE = ['fiyat', 'ucret', 'kac para', 'ne kadar tutar', 'maliyet', 'taksit', 'indirim', 'kampanya', 'kac tl'];
const SERVICES_LIST = ['hizmet', 'tedaviler', 'tedavileri', 'neler yapiyorsunuz', 'hangi tedavi'];
const DOCTORS = ['doktor', 'hekim', 'disci kim', 'dis hekimi kim'];
const CONTACT = ['adres', 'nerede', 'konum', 'telefon', 'iletisim', 'ulas', 'yol tarifi', 'whatsapp', 'harita'];
const HOURS = ['calisma saat', 'kacta', 'acik mi', 'mesai', 'kaca kadar', 'saatleriniz'];
const BOOK = ['randevu', 'musait', 'uygun gun', 'gelmek istiyorum', 'yer var mi', 'muayene olmak', 'kontrol'];
const GREETING = ['merhaba', 'selam', 'iyi gunler', 'gunaydin', 'iyi aksamlar'];
const THANKS = ['tesekkur', 'sagol', 'sag ol', 'eyvallah'];
const RESTART = ['bastan', 'iptal', 'vazgec', 'yeniden basla', 'sifirla'];
const YES = ['evet', 'tamam', 'olur', 'onayliyorum', 'onayla', 'dogru'];
const NO = ['hayir', 'degil', 'yanlis', 'duzelt'];

/**
 * Tarayıcıda çalışan Türkçe kural tabanlı niyet motoru.
 * Tanı KOYMAZ: semptom ifadelerini "symptom"/"emergency" niyetine çevirir,
 * store bu niyetlere güvenli, yönlendirici yanıt verir.
 */
@Injectable({ providedIn: 'root' })
export class LocalAssistantEngine implements AssistantEngine {
  interpret(message: string, ctx: AssistantContext): Observable<Interpretation> {
    return of(this.run(message, ctx));
  }

  private run(message: string, ctx: AssistantContext): Interpretation {
    const t = normalize(message);
    const serviceId = this.matchService(t, ctx);

    // Adım bağlamı: beklenen veri tipi önceliklidir
    if (ctx.step === 'phone') {
      const phone = parsePhone(message);
      if (phone) return { intent: 'phone', phone };
    }
    if (ctx.step === 'name' && !includesAny(t, [...RESTART, ...PRICE, ...CONTACT, ...SYMPTOM]) && !parseDate(message) && !parseTime(message).time) {
      const name = parseName(message);
      if (name && !serviceId) return { intent: 'name', name };
    }

    if (includesAny(t, EMERGENCY)) return { intent: 'emergency' };
    if (includesAny(t, RESTART)) return { intent: 'restart' };
    if (includesAny(t, PRICE)) return { intent: 'price', serviceId };
    if (includesAny(t, SYMPTOM)) return { intent: 'symptom', serviceId };

    const date = parseDate(message);
    const { time, partOfDay } = parseTime(message);
    if (ctx.step === 'time' && (time || partOfDay)) return { intent: 'time', time, partOfDay };
    if (serviceId) return { intent: 'service', serviceId, date, time };
    if (date && ['date', 'time', 'summary'].includes(ctx.step)) return { intent: 'date', date, time };
    if ((ctx.step === 'summary' || ctx.step === 'consent') && includesAny(t, YES)) return { intent: 'yes' };
    if (ctx.step === 'summary' && includesAny(t, NO)) return { intent: 'no' };

    if (includesAny(t, HOURS)) return { intent: 'hours' };
    if (includesAny(t, CONTACT)) return { intent: 'contact' };
    if (includesAny(t, DOCTORS)) return { intent: 'doctors' };
    if (includesAny(t, SERVICES_LIST)) return { intent: 'services-list' };
    if (includesAny(t, BOOK)) return { intent: 'book', date };
    if (date) return { intent: 'date', date, time };
    if (includesAny(t, THANKS)) return { intent: 'thanks' };
    if (includesAny(t, GREETING)) return { intent: 'greeting' };
    return { intent: 'unknown' };
  }

  private matchService(t: string, ctx: AssistantContext): string | undefined {
    let best: { id: string; score: number } | undefined;
    for (const s of ctx.services) {
      const score = [s.title, ...s.keywords].reduce((acc, k) => {
        const nk = normalize(k);
        return (` ${t}`).includes(` ${nk}`) ? acc + nk.length : acc;
      }, 0);
      if (score > 0 && (!best || score > best.score)) best = { id: s.id, score };
    }
    return best?.id;
  }
}
