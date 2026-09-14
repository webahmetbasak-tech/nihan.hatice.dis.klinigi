import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CtaLink } from '../config/clinic.types';
import { ClinicConfigService } from '../core/config/clinic-config.service';
import { MotionService } from '../core/motion/motion.service';
import { UiStateService } from '../core/ui/ui-state.service';

export interface NavItem {
  id: string;
  label: string;
}

/** Sayfa içi bölüm navigasyonu + config'teki CTA eylemlerinin tek yorumlayıcısı. */
@Injectable({ providedIn: 'root' })
export class NavService {
  private readonly router = inject(Router);
  private readonly motion = inject(MotionService);
  private readonly ui = inject(UiStateService);
  private readonly cfg = inject(ClinicConfigService);

  readonly items: NavItem[] = [
    { id: 'tedaviler', label: 'Tedaviler' },
    { id: 'surec', label: 'Süreç' },
    { id: 'klinik', label: 'Klinik' },
    { id: 'hekimler', label: 'Hekimler' },
    { id: 'asistan', label: 'Asistan' },
    { id: 'iletisim', label: 'İletişim' },
  ];

  goTo(id: string): void {
    this.ui.toggleMenu(false);
    const onHome = this.router.url.split('#')[0].split('?')[0] === '/';
    if (onHome) {
      this.motion.scrollTo(`#${id}`);
      history.replaceState(null, '', `#${id}`);
      // content-visibility tahmini boyutları render sonrası değişebilir → hedefe ikinci, kısa hizalama
      setTimeout(() => {
        const el = document.getElementById(id);
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
        if (el && Math.abs(el.getBoundingClientRect().top - offset) > 48) this.motion.scrollTo(el, { offset: -offset });
      }, 1500);
    } else {
      this.router.navigate(['/'], { fragment: id });
    }
  }

  run(cta: CtaLink, serviceId?: string): void {
    const action = cta.action;
    if (action === 'appointment') this.ui.openAssistant(serviceId);
    else if (action.startsWith('section:')) this.goTo(action.slice(8));
    else if (action === 'tel') {
      const href = this.cfg.phoneHref();
      if (href) location.href = href;
    } else if (action === 'whatsapp') {
      const href = this.cfg.whatsappHref('Merhaba, randevu hakkında bilgi almak istiyorum.');
      if (href) window.open(href, '_blank', 'noopener');
    } else {
      window.open(action, '_blank', 'noopener');
    }
  }
}
