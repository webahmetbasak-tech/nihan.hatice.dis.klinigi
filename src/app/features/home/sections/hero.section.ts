import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ClinicConfigService } from '../../../core/config/clinic-config.service';
import { NavService } from '../../../layout/nav.service';
import { MagneticDirective } from '../../../shared/motion/motion.directives';
import { HeadlineComponent } from '../../../shared/ui/headline.component';
import { IconComponent } from '../../../shared/ui/icon.component';

/**
 * SCENE 01 — THE SMILE
 * Editoryal kompozisyon: metin bloğu sol yarıda, sağdaki 3D dişle aynı dikey eksende.
 * Başlık kademeli dizilir (vurgulu satır içeriden başlar); altında CTA + ayraç + kısa ifade tek hatta.
 * Metin SSR ile anında gelir (LCP), satırlar CSS ile açılır; 3D diş arkada ilk etkileşimde yüklenir.
 */
@Component({
  selector: 'app-hero-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeadlineComponent, IconComponent, MagneticDirective],
  host: { 'data-tone': 'day', class: 'hero', id: 'top' },
  template: `
    <div class="hero__inner wrap">
      <div class="hero__block">
        <p class="hero__eyebrow">
          <span class="hero__eyebrow-rule" aria-hidden="true"></span>
          {{ hero().eyebrow }}
        </p>

        <app-headline class="hero__title" [lines]="hero().title" [level]="1" size="display-xl" [immediate]="true" [markEmphasis]="true" />

        <!-- Mobil: 3D dişe ayrılmış esnek alan (sahne bu alanın konumunu ölçüp dişi ortalar) -->
        <div class="hero__visual" aria-hidden="true"></div>

        <div class="hero__actions">
          <button type="button" class="btn btn--lg hero__cta" appMagnetic (click)="nav.run(hero().primaryCta)">
            <span class="btn__dot" aria-hidden="true"></span>
            {{ hero().primaryCta.label }}
            <span class="btn__icon"><app-icon name="arrow-right" /></span>
          </button>

          @if (taglineParts().length) {
            <span class="hero__divider" aria-hidden="true"></span>
            <p class="hero__tagline">
              @for (part of taglineParts(); track part; let last = $last) {
                <span>{{ part }}</span>
                @if (!last) {
                  <span class="hero__tagline-dot" aria-hidden="true"></span>
                }
              }
            </p>
          }
        </div>
      </div>

      <button type="button" class="hero__scroll" (click)="nav.goTo('tedaviler')">
        <span class="hero__scroll-track" aria-hidden="true"><span></span></span>
        <span class="hero__scroll-label">Keşfedin</span>
      </button>
    </div>
  `,
  styleUrl: './hero.section.scss',
})
export class HeroSection {
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly nav = inject(NavService);
  protected readonly hero = computed(() => this.cfg.config().hero);

  /** "Kişiye özel. Hassas. Doğal." → ['Kişiye özel', 'Hassas', 'Doğal'] */
  protected readonly taglineParts = computed(() =>
    this.hero()
      .tagline.split('.')
      .map((s) => s.trim())
      .filter(Boolean),
  );
}
