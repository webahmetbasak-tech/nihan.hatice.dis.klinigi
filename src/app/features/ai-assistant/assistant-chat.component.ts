import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AssistantStore, formatDateLong } from '../../core/ai/assistant.store';
import { formatPhone } from '../../core/ai/turkish-nlu';
import { Appointment, TimeSlot, fromDateKey } from '../../core/appointment/appointment.models';
import { ClinicConfigService } from '../../core/config/clinic-config.service';
import { UiStateService } from '../../core/ui/ui-state.service';
import { IconComponent } from '../../shared/ui/icon.component';
import { downloadIcs } from './ics';

const QUICK_LABELS: Record<string, { label: string; icon: 'calendar' | 'layers' | 'user' | 'pin' | 'clock' }> = {
  book: { label: 'Randevu Al', icon: 'calendar' },
  services: { label: 'Tedavileri İncele', icon: 'layers' },
  doctors: { label: 'Hekimlerimiz', icon: 'user' },
  contact: { label: 'İletişim', icon: 'pin' },
  hours: { label: 'Çalışma Saatleri', icon: 'clock' },
};

const PERIODS: { id: TimeSlot['period']; label: string }[] = [
  { id: 'morning', label: 'Sabah' },
  { id: 'afternoon', label: 'Öğleden sonra' },
  { id: 'evening', label: 'Akşam' },
];

@Component({
  selector: 'app-assistant-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, IconComponent],
  host: { '[class.is-inline]': 'variant() === "inline"' },
  templateUrl: './assistant-chat.component.html',
  styleUrl: './assistant-chat.component.scss',
})
export class AssistantChatComponent {
  protected readonly store = inject(AssistantStore);
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly ui = inject(UiStateService);

  readonly variant = input<'panel' | 'inline'>('panel');

  protected readonly quick = QUICK_LABELS;
  protected readonly periods = PERIODS;
  protected readonly formatDateLong = formatDateLong;
  protected readonly formatPhone = formatPhone;

  protected readonly message = new FormControl('', { nonNullable: true, validators: [Validators.maxLength(400)] });
  protected readonly consent = new FormGroup({
    kvkk: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
    contact: new FormControl(false, { nonNullable: true }),
  });

  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  protected readonly weeks = computed(() => {
    const days = this.store.days();
    const months = new Map<string, typeof days>();
    for (const d of days) {
      const label = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(fromDateKey(d.date));
      months.set(label, [...(months.get(label) ?? []), d]);
    }
    return [...months.entries()].map(([label, list]) => ({ label, days: list }));
  });

  protected readonly slotGroups = computed(() =>
    PERIODS.map((p) => ({ ...p, slots: this.store.slots().filter((s) => s.period === p.id) })).filter((g) => g.slots.length),
  );

  constructor() {
    // Yeni mesaj / yüklenen takvim sonrası en alta kaydır
    afterRenderEffect(() => {
      this.store.messages();
      this.store.typing();
      this.store.days();
      this.store.slots();
      const el = this.scroller()?.nativeElement;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }

  protected send(): void {
    const text = this.message.value;
    if (!text.trim() || this.message.invalid) return;
    this.message.reset();
    void this.store.send(text);
    this.field()?.nativeElement.focus();
  }

  protected isActive(id: number): boolean {
    return this.store.activeWidgetId() === id && !this.store.busy();
  }

  protected dayParts(key: string) {
    const d = fromDateKey(key);
    return {
      weekday: new Intl.DateTimeFormat('tr-TR', { weekday: 'short' }).format(d),
      day: d.getDate(),
      label: formatDateLong(key),
    };
  }

  protected density(left: number): number {
    return left === 0 ? 0 : left < 7 ? 1 : left < 13 ? 2 : 3;
  }

  protected submitConsent(): void {
    if (this.consent.invalid) {
      this.consent.markAllAsTouched();
      return;
    }
    const { kvkk, contact } = this.consent.getRawValue();
    void this.store.giveConsent(kvkk, contact);
  }

  protected addToCalendar(appt: Appointment): void {
    downloadIcs(appt, this.cfg.clinic().name, this.cfg.addressLine());
  }

  protected whatsappSummary(): string | null {
    return this.cfg.whatsappHref(this.store.summaryText());
  }

  protected newBooking(): void {
    this.consent.reset();
    this.store.restart();
  }
}
