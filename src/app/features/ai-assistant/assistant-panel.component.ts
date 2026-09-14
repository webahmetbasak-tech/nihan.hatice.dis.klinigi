import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { AssistantStore } from '../../core/ai/assistant.store';
import { ClinicConfigService } from '../../core/config/clinic-config.service';
import { UiStateService } from '../../core/ui/ui-state.service';
import { FocusTrapDirective } from '../../shared/a11y/focus-trap.directive';
import { IconComponent } from '../../shared/ui/icon.component';
import { AssistantAvatarComponent } from './assistant-avatar.component';
import { AssistantChatComponent } from './assistant-chat.component';

/** Sağdan açılan asistan paneli (desktop drawer / mobil tam ekran). */
@Component({
  selector: 'app-assistant-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AssistantChatComponent, AssistantAvatarComponent, IconComponent, FocusTrapDirective],
  template: `
    <div class="scrim" (click)="ui.closeAssistant()" aria-hidden="true"></div>
    <aside
      class="drawer panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-title"
      appFocusTrap
      (escape)="ui.closeAssistant()"
    >
      <header class="panel__head">
        <app-assistant-avatar />
        <div class="panel__id">
          <h2 id="assistant-title" class="panel__name">{{ cfg.config().aiAssistant.name }}</h2>
          <p class="panel__status t-caption"><span class="dot"></span> Dijital randevu asistanı</p>
        </div>
        <button type="button" class="btn btn--glass btn--icon btn--sm" (click)="store.restart()" data-tooltip="Baştan başla" aria-label="Konuşmayı baştan başlat">
          <app-icon name="arrow-left" />
        </button>
        <button type="button" class="btn btn--glass btn--icon btn--sm" (click)="ui.closeAssistant()" aria-label="Asistanı kapat">
          <app-icon name="close" />
        </button>
      </header>
      <app-assistant-chat variant="panel" />
    </aside>
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: var(--z-assistant);
    }
    .panel {
      width: min(500px, 100vw);
      background: var(--color-bg);
      border-left: 1px solid var(--color-hairline);
    }
    .panel__head {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.9rem 1rem 0.9rem 1.25rem;
      border-bottom: 1px solid var(--color-hairline);
    }
    .panel__id {
      flex: 1;
      min-width: 0;
    }
    .panel__name {
      font-family: var(--font-display);
      font-weight: 400;
      font-size: 1.35rem;
      letter-spacing: -0.02em;
      line-height: 1.1;
    }
    .panel__status {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.5625rem;
      color: var(--color-muted);
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--color-success);
      box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-success) 25%, transparent);
    }
    .btn--sm.btn--icon {
      width: 40px;
    }
    app-assistant-chat {
      flex: 1;
      min-height: 0;
    }
    @media (max-width: 560px) {
      .panel {
        width: 100vw;
        height: 100dvh;
      }
    }
  `,
})
export class AssistantPanelComponent {
  protected readonly ui = inject(UiStateService);
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly store = inject(AssistantStore);

  constructor() {
    effect(() => {
      const intent = this.ui.assistantIntent();
      if (!intent) return;
      untracked(() => this.store.start(intent.serviceId));
    });
  }
}
