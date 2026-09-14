import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AssistantStore } from '../../../core/ai/assistant.store';
import { ClinicConfigService } from '../../../core/config/clinic-config.service';
import { ViewportService } from '../../../core/platform/viewport.service';
import { UiStateService } from '../../../core/ui/ui-state.service';
import { RevealDirective } from '../../../shared/motion/motion.directives';
import { HeadlineComponent } from '../../../shared/ui/headline.component';
import { IconComponent } from '../../../shared/ui/icon.component';
import { AssistantAvatarComponent } from '../../ai-assistant/assistant-avatar.component';
import { AssistantChatComponent } from '../../ai-assistant/assistant-chat.component';

/**
 * SCENE 07 — THE AI APPOINTMENT
 * Amaç: farklılaşma + dönüşüm. Desktop'ta asistan sayfanın içinde canlı çalışır;
 * mobilde odaklı tam ekran panel açılır.
 */
@Component({
  selector: 'app-assistant-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeadlineComponent, IconComponent, RevealDirective, AssistantChatComponent, AssistantAvatarComponent],
  host: { 'data-tone': 'lab', class: 'ai scene--lab', id: 'asistan' },
  template: `
    <div class="ai__glow" aria-hidden="true"></div>
    <div class="wrap ai__grid">
      <div class="ai__text">
        <p class="eyebrow"><span class="eyebrow__index">05</span><span class="eyebrow__rule"></span>{{ a().eyebrow }}</p>
        <app-headline [lines]="a().title" size="display-l" />
        <p class="t-body-l t-muted" appReveal>{{ a().intro }}</p>
        <ul class="ai__points" role="list" appReveal="stagger">
          @for (p of a().points; track p) {
            <li><span class="ai__check"><app-icon name="check" [stroke]="1.8" /></span>{{ p }}</li>
          }
        </ul>
        <div class="ai__mobile-cta">
          <button type="button" class="btn btn--lg" (click)="ui.openAssistant()">
            <span class="btn__dot" aria-hidden="true"></span> Asistanı başlat
            <span class="btn__icon"><app-icon name="arrow-right" /></span>
          </button>
        </div>
        <p class="ai__legal t-caption">
          <app-icon name="info" /> {{ cfg.config().aiAssistant.disclosure }}
        </p>
      </div>

      <div class="ai__device" appReveal>
        <div class="ai__device-head">
          <app-assistant-avatar />
          <div>
            <p class="ai__device-name">{{ cfg.config().aiAssistant.name }}</p>
            <p class="t-caption t-muted"><span class="ai__online"></span> Çevrimiçi · Dijital asistan</p>
          </div>
          <button type="button" class="btn btn--glass btn--icon btn--sm" (click)="store.restart()" aria-label="Konuşmayı baştan başlat">
            <app-icon name="arrow-left" />
          </button>
        </div>
        @defer (on viewport; prefetch on idle) {
          <app-assistant-chat variant="inline" />
        } @placeholder {
          <div class="ai__placeholder">
            <p class="bubble-ph">{{ cfg.config().aiAssistant.greeting }}</p>
            <span class="skeleton"></span>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './assistant.section.scss',
})
export class AssistantSection {
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly ui = inject(UiStateService);
  protected readonly store = inject(AssistantStore);
  private readonly viewport = inject(ViewportService);
  protected readonly a = computed(() => this.cfg.config().assistantSection);

  constructor() {
    if (this.viewport.isBrowser) this.store.start();
  }
}
