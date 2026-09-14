import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ClinicConfigService } from '../../../core/config/clinic-config.service';
import { ParallaxDirective, RevealDirective, TiltDirective } from '../../../shared/motion/motion.directives';
import { HeadlineComponent } from '../../../shared/ui/headline.component';
import { IconComponent } from '../../../shared/ui/icon.component';
import { MediaComponent } from '../../../shared/ui/media.component';

/**
 * SCENE 05 — THE CLINIC
 * Amaç: fiziksel güven (sterilizasyon, ortam, düzen). Görseller clip-reveal + parallax (L2/L3).
 * ÖNEMLİ: Üretimde bu bölümde kliniğin GERÇEK fotoğrafları kullanılmalıdır.
 */
@Component({
  selector: 'app-clinic-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeadlineComponent, IconComponent, MediaComponent, RevealDirective, ParallaxDirective, TiltDirective],
  host: { 'data-tone': 'day', class: 'clinic', id: 'klinik' },
  template: `
    <div class="wrap clinic__grid">
      <div class="clinic__text">
        <p class="eyebrow"><span class="eyebrow__index">03</span><span class="eyebrow__rule"></span>{{ c().eyebrow }}</p>
        <app-headline [lines]="c().title" size="display-m" />
        <p class="t-body-l t-muted" appReveal>{{ c().intro }}</p>

        <ul class="features" role="list" appReveal="stagger">
          @for (f of c().features; track f.title) {
            <li class="feature" appTilt>
              <span class="feature__icon"><app-icon [name]="f.icon" [stroke]="1.2" /></span>
              <h3 class="t-h3">{{ f.title }}</h3>
              <p class="t-small t-muted">{{ f.description }}</p>
            </li>
          }
        </ul>
      </div>

      <div class="clinic__gallery">
        @for (img of c().images; track img.id; let i = $index) {
          <figure class="shot" [class]="'shot shot--' + i">
            <div class="shot__frame" appReveal="clip">
              <div class="shot__parallax" [appParallax]="i === 0 ? 10 : 16">
                <app-media [image]="img.image" [icon]="galleryIcons[i % 3]" [aspect]="i === 0 ? '16 / 11' : '4 / 5'" sizes="(max-width: 767px) 90vw, 40vw" />
              </div>
            </div>
            <figcaption class="t-caption">
              <span class="shot__index">0{{ i + 1 }}</span> {{ img.caption }}
            </figcaption>
          </figure>
        }
      </div>
    </div>
  `,
  styleUrl: './clinic.section.scss',
})
export class ClinicSection {
  private readonly cfg = inject(ClinicConfigService);
  protected readonly c = computed(() => this.cfg.config().clinicSection);
  protected readonly galleryIcons = ['chair', 'shield', 'sparkle'] as const;
}
