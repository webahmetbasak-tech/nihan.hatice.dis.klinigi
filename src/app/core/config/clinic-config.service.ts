import { Injectable, InjectionToken, computed, inject, signal } from '@angular/core';
import { ACTIVE_CLINIC } from '../../config/clinic.active';
import { isPlaceholder } from '../../config/define-clinic';
import { ClinicConfig, ServiceConfig, WorkingHours } from '../../config/clinic.types';

export const CLINIC_CONFIG = new InjectionToken<ClinicConfig>('CLINIC_CONFIG', {
  providedIn: 'root',
  factory: () => ACTIVE_CLINIC,
});

const DAY_SHORT = ['', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

/**
 * Uygulamanın config'e tek erişim noktası.
 * Component'ler config nesnesini değil bu servisin türetilmiş sinyallerini kullanır.
 */
@Injectable({ providedIn: 'root' })
export class ClinicConfigService {
  private readonly source = signal(inject(CLINIC_CONFIG));

  readonly config = this.source.asReadonly();
  readonly clinic = computed(() => this.config().clinic);
  readonly contact = computed(() => this.config().contact);
  readonly features = computed(() => this.config().features);
  readonly services = computed(() => this.config().services);
  readonly doctors = computed(() => this.config().doctors);

  readonly phoneHref = computed(() => {
    const p = this.contact().phone;
    return isPlaceholder(p) ? null : `tel:${p.replace(/\s/g, '')}`;
  });

  readonly emailHref = computed(() => {
    const e = this.contact().email;
    return isPlaceholder(e) ? null : `mailto:${e}`;
  });

  readonly hasWhatsapp = computed(() => this.features().whatsappHandoff && !isPlaceholder(this.contact().whatsapp));

  readonly addressLine = computed(() => {
    const a = this.contact().address;
    return [a.street, a.district, a.city].filter((p) => p && !isPlaceholder(p)).join(', ') || '[ADDRESS]';
  });

  readonly mapsHref = computed(() => {
    const c = this.contact();
    if (c.mapsUrl) return c.mapsUrl;
    const line = this.addressLine();
    if (isPlaceholder(line) || isPlaceholder(c.address.street)) return null;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${this.clinic().name}, ${line}`)}`;
  });

  readonly hoursSummary = computed(() => this.contact().workingHours.map((h) => this.formatHours(h)));

  readonly socialLinks = computed(() => {
    const s = this.config().social;
    return (
      [
        ['instagram', 'Instagram', s.instagram],
        ['facebook', 'Facebook', s.facebook],
        ['youtube', 'YouTube', s.youtube],
        ['x', 'X', s.x],
      ] as const
    )
      .filter(([, , url]) => !!url)
      .map(([icon, label, url]) => ({ icon, label, url: url! }));
  });

  serviceById(id: string | null | undefined): ServiceConfig | undefined {
    return id ? this.services().find((s) => s.id === id) : undefined;
  }

  whatsappHref(message: string): string | null {
    if (!this.hasWhatsapp()) return null;
    return `https://wa.me/${this.contact().whatsapp}?text=${encodeURIComponent(message)}`;
  }

  isPlaceholder = isPlaceholder;

  private formatHours(h: WorkingHours): { days: string; time: string } {
    const days = [...h.days].sort((a, b) => a - b);
    const contiguous = days.every((d, i) => i === 0 || d === days[i - 1] + 1);
    const label =
      days.length > 2 && contiguous
        ? `${DAY_SHORT[days[0]]} – ${DAY_SHORT[days[days.length - 1]]}`
        : days.map((d) => DAY_SHORT[d]).join(', ');
    return { days: label, time: `${h.open} – ${h.close}` };
  }
}
