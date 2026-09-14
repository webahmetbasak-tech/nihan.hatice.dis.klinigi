import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClinicConfigService } from '../core/config/clinic-config.service';
import { UiStateService } from '../core/ui/ui-state.service';
import { FocusTrapDirective } from '../shared/a11y/focus-trap.directive';
import { MagneticDirective } from '../shared/motion/motion.directives';
import { IconComponent } from '../shared/ui/icon.component';
import { BrandMarkComponent } from './brand-mark.component';
import { NavService } from './nav.service';

/**
 * Header davranışı:
 *  - Sayfa başında şeffaf → kaydırınca cam (blur) yüzey
 *  - Aşağı kaydırırken gizlenir, yukarı kaydırınca geri gelir
 *  - Koyu "lab" sahnelerinin üzerindeyken renkleri tersine döner
 */
@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent, BrandMarkComponent, MagneticDirective, FocusTrapDirective],
  host: {
    '[class.is-scrolled]': 'scrolled()',
    '[class.is-hidden]': 'hidden() && !ui.menuOpen()',
    '[class.is-lab]': 'overLab() && !ui.menuOpen()',
  },
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly ui = inject(UiStateService);
  protected readonly nav = inject(NavService);

  protected readonly scrolled = signal(false);
  protected readonly hidden = signal(false);
  protected readonly overLab = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      let lastY = window.scrollY;
      let ticking = false;
      let lastProbe = 0;
      const update = () => {
        ticking = false;
        const y = window.scrollY;
        this.scrolled.set(y > 24);
        if (Math.abs(y - lastY) > 6) {
          this.hidden.set(y > lastY && y > 480 && !this.ui.assistantOpen());
          lastY = y;
        }
        // Zemin tonu kontrolü layout okuması gerektirir → saniyede en fazla ~7 kez
        const now = performance.now();
        if (now - lastProbe > 140) {
          lastProbe = now;
          const hit = document
            .elementsFromPoint(window.innerWidth / 2, 36)
            .find((el) => !el.closest('app-header') && el.closest('[data-tone]'));
          this.overLab.set(hit?.closest('[data-tone]')?.getAttribute('data-tone') === 'lab');
        }
      };
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
      // Kaydırma bitince son durumu garanti et
      window.addEventListener('scrollend', () => ((lastProbe = 0), update()), { passive: true });
      destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });
  }
}
