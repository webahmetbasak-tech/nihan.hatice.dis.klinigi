import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ClinicConfigService } from '../../../core/config/clinic-config.service';
import { UiStateService } from '../../../core/ui/ui-state.service';
import { MagneticDirective, RevealDirective } from '../../../shared/motion/motion.directives';
import { HeadlineComponent } from '../../../shared/ui/headline.component';
import { IconComponent } from '../../../shared/ui/icon.component';
import { MediaComponent } from '../../../shared/ui/media.component';

/**
 * SCENE 07 — İLETİŞİM
 * Footer öncesi büyük tipografik çağrı + satır satır iletişim listesi (okunabilirlik öncelikli).
 * Görsel metnin arkasında değil, kendi kartında. Harita iframe'i yok (KVKK + performans) → "Yol tarifi" linki.
 */
@Component({
  selector: 'app-contact-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeadlineComponent, IconComponent, MediaComponent, RevealDirective, MagneticDirective],
  host: { 'data-tone': 'day', class: 'contact', id: 'iletisim' },
  template: `
    <div class="wrap">
      <header class="contact__head">
        <div class="contact__title">
          <p class="eyebrow"><span class="eyebrow__index">06</span><span class="eyebrow__rule"></span>{{ c().eyebrow }}</p>
          <app-headline [lines]="c().title" size="display-l" />
        </div>
        <div class="contact__lead" appReveal>
          <p class="t-body-l t-muted">{{ c().intro }}</p>
          <button type="button" class="btn btn--lg" [appMagnetic]="0.12" (click)="ui.openAssistant()">
            <span class="btn__dot" aria-hidden="true"></span>
            Randevu planla
            <span class="btn__icon"><app-icon name="arrow-right" /></span>
          </button>
        </div>
      </header>

      <div class="contact__body">
        <ul class="rows" role="list" appReveal="stagger">
          <li>
            @if (cfg.phoneHref(); as tel) {
              <a class="row" [href]="tel">
                <span class="row__label"><app-icon name="phone" /> Telefon</span>
                <span class="row__value">{{ cfg.contact().phoneDisplay }}</span>
                <span class="row__action">Ara <span class="row__arrow"><app-icon name="arrow-up-right" /></span></span>
              </a>
            } @else {
              <div class="row is-static">
                <span class="row__label"><app-icon name="phone" /> Telefon</span>
                <span class="row__value">{{ cfg.contact().phoneDisplay }}</span>
              </div>
            }
          </li>

          @if (cfg.whatsappHref('Merhaba, randevu hakkında bilgi almak istiyorum.'); as wa) {
            <li>
              <a class="row" [href]="wa" target="_blank" rel="noopener">
                <span class="row__label"><app-icon name="whatsapp" /> WhatsApp</span>
                <span class="row__value">Mesaj gönderin</span>
                <span class="row__action">Yaz <span class="row__arrow"><app-icon name="arrow-up-right" /></span></span>
              </a>
            </li>
          }

          <li>
            @if (cfg.mapsHref(); as maps) {
              <a class="row" [href]="maps" target="_blank" rel="noopener">
                <span class="row__label"><app-icon name="pin" /> Adres</span>
                <span class="row__value row__value--small">{{ cfg.addressLine() }}</span>
                <span class="row__action">Yol tarifi <span class="row__arrow"><app-icon name="arrow-up-right" /></span></span>
              </a>
            } @else {
              <div class="row is-static">
                <span class="row__label"><app-icon name="pin" /> Adres</span>
                <span class="row__value row__value--small">{{ cfg.addressLine() }}</span>
              </div>
            }
          </li>

          <li>
            <div class="row is-static">
              <span class="row__label"><app-icon name="clock" /> Çalışma saatleri</span>
              <span class="row__value row__value--small">
                @for (h of cfg.hoursSummary(); track $index) {
                  <span class="row__hours">{{ h.days }} <b>{{ h.time }}</b></span>
                }
              </span>
            </div>
          </li>
        </ul>

        <figure class="visit" appReveal="clip">
          <app-media class="visit__media" [image]="visitImage" icon="pin" aspect="4 / 5" sizes="(max-width: 1099px) 100vw, 34vw" />
          <figcaption class="visit__caption">
            <span class="visit__title">Kliniğimize bekleriz</span>
            <span class="visit__sub">{{ cfg.clinic().name }}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  `,
  styleUrl: './contact.section.scss',
})
export class ContactSection {
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly ui = inject(UiStateService);
  protected readonly c = computed(() => this.cfg.config().contactSection);
  protected readonly visitImage = {
    src: '/images/shared/contact-band.webp',
    avif: '/images/shared/contact-band.avif',
    alt: 'Aydınlık, beyaz bir muayene odası',
    width: 2400,
    height: 1030,
    position: '60% 50%',
    code: 'CTA-LIGHT-01',
  };
}
