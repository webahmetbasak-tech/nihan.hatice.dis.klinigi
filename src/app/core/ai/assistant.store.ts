import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ClinicConfigService } from '../config/clinic-config.service';
import {
  APPOINTMENT_PROVIDER,
  Appointment,
  AvailabilityQuery,
  AvailableDay,
  DateKey,
  TimeSlot,
  fromDateKey,
} from '../appointment/appointment.models';
import {
  ASSISTANT_ENGINE,
  AssistantDraft,
  AssistantStep,
  ChatMessage,
  Interpretation,
  Widget,
} from './assistant.models';
import { formatPhone } from './turkish-nlu';

const EMPTY_DRAFT: AssistantDraft = {
  serviceId: null,
  generalVisit: false,
  doctorId: null,
  date: null,
  time: null,
  name: '',
  phone: '',
  consentKvkk: false,
  consentContact: false,
};

const GENERAL_VISIT = { title: 'Genel muayene', appointmentType: 'Genel muayene ve değerlendirme', minutes: 30 };

export const formatDateLong = (key: DateKey) =>
  new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' }).format(fromDateKey(key));

/**
 * AI RANDEVU ASİSTANI — konuşma durum makinesi.
 *
 * Hizmet → Hekim → Tarih → Saat → Ad → Telefon → KVKK onayı → Özet → Talep
 * Her adım hem serbest metinle (niyet motoru) hem yapılandırılmış UI ile (widget) ilerler.
 * Güvenlik: tanı koymaz; semptomda muayeneye, acil ifadede telefonla aramaya yönlendirir;
 * fiyat sorularında mevzuat gereği online fiyat paylaşmaz.
 */
@Injectable({ providedIn: 'root' })
export class AssistantStore {
  private readonly cfg = inject(ClinicConfigService);
  private readonly provider = inject(APPOINTMENT_PROVIDER);
  private readonly engine = inject(ASSISTANT_ENGINE);
  private nextId = 1;

  readonly messages = signal<ChatMessage[]>([]);
  readonly step = signal<AssistantStep>('idle');
  readonly draft = signal<AssistantDraft>({ ...EMPTY_DRAFT });
  readonly typing = signal(false);
  readonly busy = signal(false);
  readonly days = signal<AvailableDay[]>([]);
  readonly slots = signal<TimeSlot[]>([]);
  readonly appointment = signal<Appointment | null>(null);

  /** Yalnızca en son widget etkileşimlidir — geçmiş adımlar "donmuş" görünür. */
  readonly activeWidgetId = computed(() => {
    const list = this.messages();
    for (let i = list.length - 1; i >= 0; i--) if (list[i].widget) return list[i].id;
    return -1;
  });

  readonly service = computed(() => this.cfg.serviceById(this.draft().serviceId));
  readonly doctor = computed(() => this.cfg.doctors().find((d) => d.id === this.draft().doctorId));
  readonly visit = computed(() => {
    const s = this.service();
    return s
      ? { title: s.title, appointmentType: s.appointmentType, minutes: s.sessionMinutes }
      : GENERAL_VISIT;
  });

  readonly inputHint = computed(() => {
    switch (this.step()) {
      case 'name':
        return { placeholder: 'Adınız ve soyadınız', mode: 'text' as const, autocomplete: 'name' };
      case 'phone':
        return { placeholder: '05xx xxx xx xx', mode: 'tel' as const, autocomplete: 'tel' };
      default:
        return { placeholder: 'Mesajınızı yazın… örn. “implant için randevu”', mode: 'text' as const, autocomplete: 'off' };
    }
  });

  private get query(): AvailabilityQuery {
    const d = this.draft();
    return { serviceId: d.serviceId, doctorId: d.doctorId, durationMinutes: this.visit().minutes };
  }

  // ───────────────────────────── lifecycle

  start(serviceId?: string): void {
    const ai = this.cfg.config().aiAssistant;
    if (!this.messages().length) {
      this.say(ai.greeting);
      this.say(ai.disclosure, undefined, 'notice');
    }
    if (serviceId && this.cfg.serviceById(serviceId)) {
      void this.selectService(serviceId, true);
    } else if (this.step() === 'idle') {
      this.say(undefined, { kind: 'quick-actions', actions: ai.quickActions });
    }
  }

  restart(): void {
    this.draft.set({ ...EMPTY_DRAFT });
    this.appointment.set(null);
    this.step.set('idle');
    this.say('Tamam, baştan başlayalım. Hangi konuda randevu planlamak istersiniz?', { kind: 'services' });
    this.step.set('service');
  }

  // ───────────────────────────── free text

  async send(raw: string): Promise<void> {
    const text = raw.trim();
    if (!text || this.busy()) return;
    const step = this.step();
    this.echo(text);
    this.typing.set(true);
    try {
      const ctx = {
        step,
        draft: this.draft(),
        services: this.cfg.services().map((s) => ({ id: s.id, title: s.title, keywords: s.keywords })),
        doctors: this.cfg.doctors().map((d) => ({ id: d.id, name: d.name })),
        clinicName: this.cfg.clinic().name,
      };
      const result = await firstValueFrom(this.engine.interpret(text, ctx));
      await wait(380);
      await this.route(result);
    } finally {
      this.typing.set(false);
    }
  }

  private async route(r: Interpretation): Promise<void> {
    const step = this.step();
    switch (r.intent) {
      case 'emergency':
        this.say(
          'Yazdıklarınız hızlı değerlendirme gerektirebilecek bir durumu işaret ediyor olabilir. Tanı koymam mümkün değil; lütfen vakit kaybetmeden kliniği arayın. Yüzde yayılan şişlik, ateş, nefes almada güçlük ya da durmayan kanama varsa 112 Acil Çağrı Merkezi’ne başvurun.',
          { kind: 'emergency' },
          'safety',
        );
        return;
      case 'symptom': {
        this.say(
          'Geçmiş olsun. Şikâyetinizin nedenini buradan değerlendiremem; bunu ancak hekim muayenesi netleştirebilir. İsterseniz sizin için bir muayene randevusu planlayayım.',
          undefined,
          'safety',
        );
        if (r.serviceId) await this.selectService(r.serviceId, true);
        else await this.selectGeneral(true);
        return;
      }
      case 'price':
        this.say(
          'Sağlık hizmetlerinde fiyat bilgisi, mevzuat gereği online olarak paylaşılmıyor. Ücretlendirme, muayene sonrasında size özel tedavi planıyla birlikte klinikte açıkça bilgilendirilir.',
          { kind: 'quick-actions', actions: ['book', 'contact'] },
        );
        return;
      case 'restart':
        this.restart();
        return;
      case 'service':
        await this.selectService(r.serviceId!, true);
        if (r.date && this.step() === 'date') await this.selectDate(r.date, true);
        return;
      case 'date':
        if (step === 'service' || step === 'idle') {
          this.draft.update((d) => ({ ...d, date: null }));
          this.say('Önce hangi hizmet için geleceğinizi seçelim; ardından o gün için uygun saatlere bakarım.', { kind: 'services' });
          this.step.set('service');
          return;
        }
        await this.selectDate(r.date!, true);
        return;
      case 'time':
        return this.handleTimeText(r);
      case 'name':
        this.draft.update((d) => ({ ...d, name: r.name! }));
        this.say(`Teşekkürler ${r.name!.split(' ')[0]}. Klinik ekibinin sizi arayabilmesi için telefon numaranızı yazar mısınız?`);
        this.step.set('phone');
        return;
      case 'phone':
        this.draft.update((d) => ({ ...d, phone: r.phone! }));
        this.say(
          'Son bir adım: randevu talebinizi iletebilmem için kişisel verilerinizin bu amaçla işlenmesine onay vermeniz gerekiyor.',
          { kind: 'consent' },
        );
        this.step.set('consent');
        return;
      case 'yes':
        if (step === 'summary') return this.confirm();
        break;
      case 'no':
        if (step === 'summary') {
          this.say('Hangi bilgiyi değiştirmek istersiniz? Aşağıdan yeniden seçebilirsiniz.', { kind: 'calendar' });
          this.step.set('date');
          return;
        }
        break;
      case 'book':
        await this.beginBooking();
        return;
      case 'services-list':
        this.showServices();
        return;
      case 'doctors':
        this.showDoctors();
        return;
      case 'contact':
        this.say('İletişim bilgilerimiz:', { kind: 'contact' });
        return;
      case 'hours':
        this.say('Çalışma saatlerimiz:', { kind: 'hours' });
        return;
      case 'greeting':
        this.say(r.reply ?? 'Merhaba! Randevu planlamak, tedaviler hakkında bilgi almak ya da iletişim bilgilerine ulaşmak için buradayım.', {
          kind: 'quick-actions',
          actions: this.cfg.config().aiAssistant.quickActions,
        });
        return;
      case 'thanks':
        this.say('Rica ederim. Başka bir konuda yardımcı olabilirsem buradayım.');
        return;
    }

    // Adım bazlı yardımcı geri dönüşler
    if (step === 'name') {
      this.say('Adınızı ve soyadınızı harf olarak yazar mısınız? (örn. Ayşe Yılmaz)');
      return;
    }
    if (step === 'phone') {
      this.say('Numarayı tam anlayamadım. 05xx xxx xx xx biçiminde yazabilir misiniz?');
      return;
    }
    this.say(
      r.reply ??
        'Bunu tam anlayamadım. Size randevu planlama, tedaviler, hekimlerimiz ya da iletişim konusunda yardımcı olabilirim.',
      { kind: 'quick-actions', actions: this.cfg.config().aiAssistant.quickActions },
    );
  }

  // ───────────────────────────── structured actions (widgets)

  async quickAction(id: string): Promise<void> {
    const labels: Record<string, string> = {
      book: 'Randevu almak istiyorum',
      services: 'Tedavileri incelemek istiyorum',
      doctors: 'Hekimlerinizi görmek istiyorum',
      contact: 'İletişim bilgileri',
      hours: 'Çalışma saatleri',
    };
    this.echo(labels[id] ?? id);
    await this.withTyping(async () => {
      if (id === 'book') await this.beginBooking();
      else if (id === 'services') this.showServices();
      else if (id === 'doctors') this.showDoctors();
      else if (id === 'contact') this.say('İletişim bilgilerimiz:', { kind: 'contact' });
      else if (id === 'hours') this.say('Çalışma saatlerimiz:', { kind: 'hours' });
    });
  }

  async pickService(id: string | null): Promise<void> {
    this.echo(id ? (this.cfg.serviceById(id)?.title ?? id) : 'Emin değilim, genel muayene');
    await this.withTyping(() => (id ? this.selectService(id) : this.selectGeneral()));
  }

  async pickDoctor(id: string | null): Promise<void> {
    this.echo(id ? (this.cfg.doctors().find((d) => d.id === id)?.name ?? id) : 'Fark etmez');
    await this.withTyping(async () => {
      this.draft.update((d) => ({ ...d, doctorId: id, generalVisit: d.serviceId ? d.generalVisit : true }));
      await this.goDate();
    });
  }

  async pickDate(key: DateKey): Promise<void> {
    this.echo(formatDateLong(key));
    await this.withTyping(() => this.selectDate(key));
  }

  async pickTime(time: string): Promise<void> {
    this.echo(time);
    await this.withTyping(async () => this.selectTime(time));
  }

  async giveConsent(kvkk: boolean, contact: boolean): Promise<void> {
    if (!kvkk) return;
    this.draft.update((d) => ({ ...d, consentKvkk: true, consentContact: contact }));
    this.echo('Onaylıyorum');
    await this.withTyping(async () => {
      this.say('Harika. Randevu talebinizin özeti aşağıda; bilgiler doğruysa onaylayın.', { kind: 'summary' });
      this.step.set('summary');
    });
  }

  async editSummary(field: 'service' | 'date' | 'time'): Promise<void> {
    await this.withTyping(async () => {
      if (field === 'service') {
        this.say('Hangi hizmet için gelmek istersiniz?', { kind: 'services' });
        this.step.set('service');
      } else if (field === 'date') {
        await this.goDate();
      } else {
        this.say('Uygun saatlerden birini seçin:', { kind: 'slots' });
        this.step.set('time');
      }
    });
  }

  async confirm(): Promise<void> {
    const d = this.draft();
    const v = this.visit();
    if (!d.date || !d.time || !d.name || !d.phone || !d.consentKvkk) return;
    this.busy.set(true);
    this.typing.set(true);
    try {
      const appt = await firstValueFrom(
        this.provider.createAppointment({
          serviceId: d.serviceId,
          serviceTitle: v.title,
          appointmentType: v.appointmentType,
          doctorId: d.doctorId,
          doctorName: this.doctor()?.name ?? null,
          date: d.date,
          time: d.time,
          durationMinutes: v.minutes,
          patient: { name: d.name, phone: d.phone },
          consent: { kvkk: true, contactPermission: d.consentContact, timestamp: new Date().toISOString() },
          channel: 'ai-assistant',
        }),
      );
      this.appointment.set(appt);
      this.say(
        'Randevu talebiniz oluşturuldu. Klinik ekibi talebinizi kısa süre içinde telefonla teyit edecektir.',
        { kind: 'confirmed', appointment: appt },
      );
      this.step.set('done');
    } catch {
      this.say('Talebinizi şu anda iletemedim. Lütfen biraz sonra tekrar deneyin ya da kliniği doğrudan arayın.', {
        kind: 'contact',
      });
    } finally {
      this.busy.set(false);
      this.typing.set(false);
    }
  }

  summaryText(): string {
    const d = this.draft();
    const v = this.visit();
    return [
      `Merhaba, ${this.cfg.clinic().shortName} web sitesindeki asistan üzerinden randevu talebi oluşturdum.`,
      `Hizmet: ${v.title} (${v.appointmentType})`,
      this.doctor() ? `Hekim: ${this.doctor()!.name}` : '',
      d.date && d.time ? `Tarih: ${formatDateLong(d.date)}, ${d.time}` : '',
      `Ad Soyad: ${d.name}`,
      `Telefon: ${formatPhone(d.phone)}`,
      this.appointment() ? `Referans: ${this.appointment()!.reference}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }

  // ───────────────────────────── flow internals

  private async beginBooking(): Promise<void> {
    const d = this.draft();
    if (d.serviceId || d.generalVisit) {
      await this.goDoctor();
      return;
    }
    this.say('Memnuniyetle. Hangi hizmet için randevu planlamak istersiniz? Emin değilseniz genel muayene seçebilirsiniz.', {
      kind: 'services',
    });
    this.step.set('service');
  }

  private async selectService(id: string, fromText = false): Promise<void> {
    const s = this.cfg.serviceById(id);
    if (!s) return;
    this.draft.update((d) => ({ ...d, serviceId: id, generalVisit: false, doctorId: null, date: null, time: null }));
    if (fromText) this.say(undefined, { kind: 'service-card', serviceId: id });
    this.say(
      `${s.title} için ilk adım, yaklaşık ${s.sessionMinutes} dakikalık bir “${s.appointmentType}” randevusudur. Size uygun tedavi yöntemi bu görüşmede hekim tarafından değerlendirilir.`,
    );
    await this.goDoctor();
  }

  private async selectGeneral(fromText = false): Promise<void> {
    this.draft.update((d) => ({ ...d, serviceId: null, generalVisit: true, doctorId: null, date: null, time: null }));
    if (!fromText) this.say(`Genel muayene yaklaşık ${GENERAL_VISIT.minutes} dakika sürer; ihtiyacınız muayenede birlikte belirlenir.`);
    await this.goDoctor();
  }

  private async goDoctor(): Promise<void> {
    const s = this.service();
    const all = this.cfg.doctors();
    const pool = s?.doctorIds.length ? all.filter((d) => s.doctorIds.includes(d.id)) : all;
    if (pool.length > 1) {
      this.say('Randevunuzu hangi hekimle planlamak istersiniz?', { kind: 'doctors' });
      this.step.set('doctor');
      return;
    }
    this.draft.update((d) => ({ ...d, doctorId: pool[0]?.id ?? null }));
    await this.goDate();
  }

  private async goDate(): Promise<void> {
    this.step.set('date');
    this.days.set([]);
    const doc = this.doctor();
    this.say(
      doc && !this.cfg.isPlaceholder(doc.name)
        ? `${doc.name} için önümüzdeki günlerdeki uygunluk durumu aşağıda. Size uyan günü seçin ya da “cuma”, “15 ekim” gibi yazın.`
        : 'Önümüzdeki günlerdeki uygunluk durumu aşağıda. Size uyan günü seçin ya da “cuma”, “15 ekim” gibi yazın.',
      { kind: 'calendar' },
    );
    try {
      this.days.set(await firstValueFrom(this.provider.getAvailableDates(this.query)));
    } catch {
      this.say('Takvimi şu anda yükleyemedim. Kliniği arayarak da randevu alabilirsiniz.', { kind: 'contact' });
    }
  }

  private async selectDate(key: DateKey, fromText = false): Promise<void> {
    let days = this.days();
    if (!days.length) days = await firstValueFrom(this.provider.getAvailableDates(this.query));
    const day = days.find((d) => d.date === key);
    if (!day) {
      this.say('Bu tarih şu an planlama aralığımın dışında. Takvimden yakın bir gün seçebilir misiniz?', { kind: 'calendar' });
      return;
    }
    if (!day.available) {
      this.say(`${formatDateLong(key)} için uygun saat görünmüyor. Takvimden başka bir gün seçebilirsiniz.`, {
        kind: 'calendar',
      });
      return;
    }
    if (fromText) this.say(`${formatDateLong(key)} için uygun saatlere bakıyorum.`);
    this.draft.update((d) => ({ ...d, date: key, time: null }));
    this.slots.set([]);
    this.step.set('time');
    this.say('Uygun saatlerden birini seçin:', { kind: 'slots' });
    this.slots.set(await firstValueFrom(this.provider.getAvailableSlots(key, this.query)));
  }

  private async handleTimeText(r: Interpretation): Promise<void> {
    const open = this.slots().filter((s) => s.available);
    if (r.time) {
      const hit = open.find((s) => s.time === r.time);
      if (hit) return this.selectTime(hit.time);
      this.say(`${r.time} dolu ya da uygun değil. Aşağıdaki saatlerden birini seçebilirsiniz.`, { kind: 'slots' });
      return;
    }
    const first = open.find((s) => s.period === r.partOfDay);
    if (first) {
      this.say(`Bu dilimde en erken ${first.time} uygun görünüyor. Seçmek için dokunun:`, { kind: 'slots' });
    } else {
      this.say('Bu zaman diliminde uygun saat görünmüyor. Başka bir saat ya da gün seçebilirsiniz.', { kind: 'slots' });
    }
  }

  private selectTime(time: string): void {
    this.draft.update((d) => ({ ...d, time }));
    const d = this.draft();
    if (d.name && d.phone && d.consentKvkk) {
      this.say('Güncellenmiş özetiniz:', { kind: 'summary' });
      this.step.set('summary');
      return;
    }
    this.say(`${formatDateLong(d.date!)}, saat ${time} sizin için ayrıldı. Randevu talebi için adınızı ve soyadınızı yazar mısınız?`);
    this.step.set('name');
  }

  private showServices(): void {
    this.say('Klinikte sunulan hizmet alanları aşağıda. Birini seçerek randevu planlamaya başlayabilirsiniz.', {
      kind: 'services',
    });
    this.step.set('service');
  }

  private showDoctors(): void {
    const doctors = this.cfg.doctors();
    if (!doctors.length) {
      this.say('Hekim bilgileri yakında eklenecek. Dilerseniz randevu planlamaya geçebiliriz.', {
        kind: 'quick-actions',
        actions: ['book', 'contact'],
      });
      return;
    }
    this.say('Hekimlerimiz:', { kind: 'doctors' });
    if (this.step() === 'idle') this.step.set('doctor');
  }

  // ───────────────────────────── helpers

  private say(text?: string, widget?: Widget, tone: ChatMessage['tone'] = 'default'): void {
    this.messages.update((m) => [...m, { id: this.nextId++, from: 'assistant', text, widget, tone }]);
  }

  private echo(text: string): void {
    this.messages.update((m) => [...m, { id: this.nextId++, from: 'user', text }]);
  }

  private async withTyping(fn: () => Promise<void> | void): Promise<void> {
    this.typing.set(true);
    try {
      await wait(320);
      await fn();
    } finally {
      this.typing.set(false);
    }
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
