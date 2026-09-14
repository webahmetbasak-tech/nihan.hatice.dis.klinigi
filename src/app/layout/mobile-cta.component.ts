import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { ClinicConfigService } from '../core/config/clinic-config.service';
import { UiStateService } from '../core/ui/ui-state.service';
import { IconComponent } from '../shared/ui/icon.component';

/** Mobilde başparmak bölgesinde kalıcı randevu çubuğu. Hero geçildikten sonra belirir. */
@Component({
  selector: 'app-mobile-cta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: { '[class.is-visible]': 'visible() && !ui.assistantOpen() && !ui.menuOpen()' },
  template: `
    <div class="cta" role="region" aria-label="Hızlı iletişim">
      @if (cfg.phoneHref(); as tel) {
        <a class="cta__icon" [href]="tel" aria-label="Kliniği arayın"><app-icon name="phone" /></a>
      }
      @if (cfg.whatsappHref('Merhaba, randevu hakkında bilgi almak istiyorum.'); as wa) {
        <a class="cta__icon" [href]="wa" target="_blank" rel="noopener" aria-label="WhatsApp ile yazın"><app-icon name="whatsapp" /></a>
      }
      <button type="button" class="btn cta__main" (click)="ui.openAssistant()">
        <span class="btn__dot" aria-hidden="true"></span>
        Randevu Al
      </button>
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: var(--z-cta-bar);
      padding: 0 12px max(12px, env(safe-area-inset-bottom));
      transform: translateY(130%);
      transition: transform var(--dur-3) var(--ease-out);
      pointer-events: none;
    }
    :host(.is-visible) {
      transform: none;
      pointer-events: auto;
    }
    @media (min-width: 768px) {
      :host {
        display: none;
      }
    }
    .cta {
      display: flex;
      gap: 8px;
      padding: 8px;
      border-radius: var(--radius-pill);
      background: rgb(22 24 27 / 78%);
      backdrop-filter: blur(18px) saturate(1.3);
      border: 1px solid rgb(237 232 223 / 12%);
      color: var(--lab-text);
      box-shadow: var(--shadow-float);
    }
    .cta__icon {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      flex: none;
      border-radius: 50%;
      border: 1px solid rgb(237 232 223 / 18%);
      color: var(--lab-text);
      font-size: 1.2rem;
    }
    .cta__main {
      flex: 1;
      --btn-bg: var(--lab-text);
      --btn-fg: var(--lab-bg);
    }
  `,
})
export class MobileCtaComponent {
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly ui = inject(UiStateService);
  protected readonly visible = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const onScroll = () => this.visible.set(window.scrollY > window.innerHeight * 0.7);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });
  }
}
