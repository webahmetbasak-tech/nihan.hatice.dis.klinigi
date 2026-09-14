import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ClinicConfigService } from '../../../core/config/clinic-config.service';
import { UiStateService } from '../../../core/ui/ui-state.service';
import { RevealDirective } from '../../../shared/motion/motion.directives';
import { HeadlineComponent } from '../../../shared/ui/headline.component';
import { IconComponent } from '../../../shared/ui/icon.component';
import { MediaComponent } from '../../../shared/ui/media.component';

/**
 * SCENE 06 — THE DOCTOR
 * Amaç: insani güven. Yalnızca belgelenmiş bilgi; placeholder'lar açıkça görünür.
 * Tek hekimde editoryal geniş düzen, çok hekimde grid.
 */
@Component({
  selector: 'app-doctors-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeadlineComponent, IconComponent, MediaComponent, RevealDirective],
  host: { 'data-tone': 'day', class: 'doctors', id: 'hekimler' },
  template: `
    <div class="wrap">
      <header class="doctors__head">
        <p class="eyebrow"><span class="eyebrow__index">04</span><span class="eyebrow__rule"></span>{{ d().eyebrow }}</p>
        <app-headline [lines]="d().title" size="display-m" />
        <p class="t-small t-muted" appReveal>{{ d().intro }}</p>
      </header>

      <div class="doctors__list" [class.is-single]="cfg.doctors().length === 1">
        @for (doc of cfg.doctors(); track doc.id) {
          <article class="doc" appReveal>
            <div class="doc__portrait">
              <app-media [image]="doc.image" icon="user" aspect="4 / 5" sizes="(max-width: 767px) 90vw, 36vw" />
            </div>
            <div class="doc__body">
              <p class="t-caption doc__title">{{ doc.title }}</p>
              <h3 class="t-display-m doc__name">{{ doc.name }}</h3>
              <p class="t-body-l t-muted doc__bio">{{ doc.bio }}</p>

              <dl class="doc__facts">
                <div>
                  <dt class="t-caption">Eğitim</dt>
                  <dd>
                    <ul role="list">
                      @for (e of doc.education; track e) {
                        <li>{{ e }}</li>
                      }
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt class="t-caption">Çalışma alanları</dt>
                  <dd class="doc__focus">
                    @for (f of doc.focus; track f) {
                      <span class="pill">{{ f }}</span>
                    }
                  </dd>
                </div>
              </dl>

              <button type="button" class="btn" (click)="ui.openAssistant()">
                Randevu planla <span class="btn__icon"><app-icon name="arrow-right" /></span>
              </button>
            </div>
          </article>
        } @empty {
          <p class="t-muted">[DOCTORS] — Hekim bilgileri config dosyasına eklendiğinde burada görünür.</p>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      position: relative;
      z-index: 2;
      display: block;
      padding-block: 0 var(--space-section);
      background: var(--color-bg);
    }
    .doctors__head {
      display: grid;
      gap: 1.25rem;
      max-width: 52rem;
      margin-bottom: var(--space-2xl);
    }
    .doctors__list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }
    .doc {
      display: grid;
      gap: 1.5rem;
      align-items: center;
    }
    .is-single .doc {
      grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
      gap: clamp(2rem, 5vw, 6rem);
    }
    .doc__portrait {
      --media-radius: var(--radius-l);
    }
    .doc__body {
      display: grid;
      gap: 1.25rem;
      justify-items: start;
    }
    .doc__title {
      color: var(--color-accent-strong);
    }
    .doc__bio {
      max-width: 52ch;
    }
    .doc__facts {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.5rem;
      width: 100%;
      margin: 0.5rem 0;
      padding-top: 1.25rem;
      border-top: 1px solid var(--color-hairline);
    }
    .doc__facts dt {
      color: var(--color-muted);
      margin-bottom: 0.6rem;
    }
    .doc__facts dd {
      margin: 0;
    }
    .doc__facts ul {
      display: grid;
      gap: 0.3rem;
    }
    .doc__focus {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    @media (max-width: 767px) {
      .is-single .doc {
        grid-template-columns: 1fr;
      }
      .doc__facts {
        grid-template-columns: 1fr;
      }
      .doc .btn {
        width: 100%;
      }
    }
  `,
})
export class DoctorsSection {
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly ui = inject(UiStateService);
  protected readonly d = computed(() => this.cfg.config().doctorsSection);
}
