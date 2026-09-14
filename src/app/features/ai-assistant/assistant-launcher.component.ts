import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { ClinicConfigService } from '../../core/config/clinic-config.service';
import { UiStateService } from '../../core/ui/ui-state.service';
import { AssistantAvatarComponent } from './assistant-avatar.component';

/**
 * Desktop'ta sağ altta duran asistan başlatıcı (mobilde sticky CTA bu işi üstlenir).
 * Hero'da gizli (hero zaten CTA taşır); kaydırınca kompakt küre olarak belirir, hover'da etiketi açılır.
 */
@Component({
  selector: 'app-assistant-launcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AssistantAvatarComponent],
  host: { '[class.is-hidden]': 'ui.assistantOpen() || !visible()' },
  template: `
    <button type="button" class="launcher" (click)="ui.openAssistant()" aria-haspopup="dialog">
      <app-assistant-avatar />
      <span class="launcher__text">
        <span class="launcher__title">{{ cfg.config().aiAssistant.name }} ile planlayın</span>
        <span class="launcher__sub t-caption">AI randevu asistanı</span>
      </span>
    </button>
  `,
  styles: `
    :host {
      position: fixed;
      right: clamp(1rem, 2vw, 2rem);
      bottom: clamp(1rem, 2vw, 2rem);
      z-index: var(--z-cta-bar);
      transition:
        opacity var(--dur-3),
        transform var(--dur-3) var(--ease-out);
    }
    :host(.is-hidden) {
      opacity: 0;
      transform: translateY(20px) scale(0.9);
      pointer-events: none;
    }
    @media (max-width: 767px) {
      :host {
        display: none;
      }
    }
    .launcher {
      --avatar-size: 48px;
      display: flex;
      align-items: center;
      padding: 4px;
      border-radius: var(--radius-pill);
      background: color-mix(in oklab, var(--color-surface) 86%, transparent);
      backdrop-filter: blur(18px) saturate(1.3);
      border: 1px solid var(--color-hairline);
      box-shadow: var(--shadow-float);
      text-align: left;
      color: var(--color-text);
    }
    .launcher__text {
      display: grid;
      max-width: 0;
      overflow: hidden;
      white-space: nowrap;
      line-height: 1.2;
      opacity: 0;
      transition:
        max-width 600ms var(--ease-out),
        opacity 400ms var(--ease-out),
        padding 600ms var(--ease-out);
    }
    .launcher:hover .launcher__text,
    .launcher:focus-visible .launcher__text {
      max-width: 220px;
      opacity: 1;
      padding: 0 1.1rem 0 0.7rem;
    }
    .launcher__title {
      font-weight: 650;
      font-size: 0.875rem;
    }
    .launcher__sub {
      font-size: 0.5625rem;
      color: var(--color-muted);
    }
  `,
})
export class AssistantLauncherComponent {
  protected readonly ui = inject(UiStateService);
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly visible = signal(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const onScroll = () => this.visible.set(window.scrollY > window.innerHeight * 0.8 || location.pathname !== '/');
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });
  }
}
