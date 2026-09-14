import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClinicConfigService } from '../../../core/config/clinic-config.service';
import { UiStateService } from '../../../core/ui/ui-state.service';
import { RevealDirective } from '../../../shared/motion/motion.directives';
import { HeadlineComponent } from '../../../shared/ui/headline.component';
import { IconComponent } from '../../../shared/ui/icon.component';
import { MediaComponent } from '../../../shared/ui/media.component';

/**
 * SCENE 02 — TREATMENTS
 * Sitenin dikkat çeken alanı: hastanın kendi cümlesiyle derdi → hizmet → görsel.
 * Bir bakışta tüm hizmetler; her kart prerender edilmiş hizmet sayfasına gider.
 * Yapışkan 3D sahnenin içinde: diş solda döner, kartlar sağ sütunda kayar. İlk hizmet öne çıkan büyük kart.
 */
@Component({
  selector: 'app-services-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HeadlineComponent, IconComponent, MediaComponent, RevealDirective],
  host: { 'data-tone': 'lab', class: 'services scene--lab', id: 'tedaviler' },
  template: `
    <div class="wrap services__col">
      <div class="services__content">
      <header class="services__head">
        <p class="eyebrow"><span class="eyebrow__index">01</span><span class="eyebrow__rule"></span>{{ s().eyebrow }}</p>
        <app-headline [lines]="s().title" size="h1" />
        <p class="t-body-l t-muted services__intro" appReveal>{{ s().intro }}</p>
      </header>

      <ul class="grid" role="list" appReveal="stagger">
        @for (svc of cfg.services(); track svc.id; let i = $index) {
          <li class="card" [class.card--feature]="i === 0">
            <a class="card__link" [routerLink]="['/hizmetler', svc.id]">
              <span class="card__frame">
                <app-media
                  class="card__media"
                  [image]="svc.image"
                  [icon]="svc.icon"
                  [sizes]="i === 0 ? '(max-width: 767px) 100vw, 28vw' : '(max-width: 767px) 50vw, 22vw'"
                />
                <span class="card__index" aria-hidden="true">{{ (i + 1).toString().padStart(2, '0') }}</span>
              </span>

              <span class="card__body">
                <span class="card__concern">“{{ svc.concern }}”</span>
                <span class="card__title">{{ svc.title }}</span>
                <span class="card__summary">{{ svc.summary }}</span>
                <span class="card__footer">
                  <span class="card__meta">{{ svc.discipline }}</span>
                  <span class="card__arrow" aria-hidden="true"><app-icon name="arrow-up-right" /></span>
                </span>
              </span>
            </a>
          </li>
        }
      </ul>

      <div class="services__foot" appReveal>
        <p class="t-body-l">Hangisi size uygun, emin değil misiniz?</p>
        <p class="t-small t-muted">Bir genel muayene ile başlayın; hekiminiz seçenekleri sizinle birlikte değerlendirsin.</p>
        <button type="button" class="btn btn--lg" (click)="ui.openAssistant()">
          <span class="btn__dot" aria-hidden="true"></span>
          Muayene randevusu planla
          <span class="btn__icon"><app-icon name="arrow-right" /></span>
        </button>
      </div>
      </div>
    </div>
  `,
  styleUrl: './services.section.scss',
})
export class ServicesSection {
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly ui = inject(UiStateService);
  protected readonly s = computed(() => this.cfg.config().servicesSection);
}
