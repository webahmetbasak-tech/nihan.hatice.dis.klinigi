import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClinicConfigService } from './core/config/clinic-config.service';
import { ThemeService } from './core/theme/theme.service';
import { UiStateService } from './core/ui/ui-state.service';
import { AssistantLauncherComponent } from './features/ai-assistant/assistant-launcher.component';
import { AssistantPanelComponent } from './features/ai-assistant/assistant-panel.component';
import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/header.component';
import { MobileCtaComponent } from './layout/mobile-cta.component';
import { IconComponent } from './shared/ui/icon.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MobileCtaComponent,
    AssistantLauncherComponent,
    AssistantPanelComponent,
    IconComponent,
  ],
  template: `
    <a class="skip-link" href="#main">İçeriğe geç</a>
    <app-header />
    <main id="main" tabindex="-1">
      <router-outlet />
    </main>
    @defer (on immediate; hydrate on idle) {
      <app-footer />
    }

    @if (cfg.features().stickyMobileCta) {
      <app-mobile-cta />
    }

    @if (cfg.config().aiAssistant.enabled) {
      <app-assistant-launcher />
      @defer (when ui.assistantOpen(); prefetch on idle) {
        @if (ui.assistantOpen()) {
          <app-assistant-panel />
        }
      }
    }

    <div class="toasts" aria-live="polite">
      @for (t of ui.toasts(); track t.id) {
        <p class="toast"><app-icon name="check" /> {{ t.message }}</p>
      }
    </div>
  `,
  styles: `
    main {
      display: block;
      outline: none;
    }
    .toasts {
      position: fixed;
      left: 50%;
      bottom: 1.5rem;
      z-index: var(--z-toast);
      display: grid;
      gap: 0.5rem;
      transform: translateX(-50%);
    }
  `,
})
export class App {
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly ui = inject(UiStateService);

  constructor() {
    inject(ThemeService).apply();
  }
}
