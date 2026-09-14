import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClinicConfigService } from '../../core/config/clinic-config.service';
import { SeoService } from '../../core/seo/seo.service';
import { UiStateService } from '../../core/ui/ui-state.service';
import { RevealDirective } from '../../shared/motion/motion.directives';
import { HeadlineComponent } from '../../shared/ui/headline.component';
import { IconComponent } from '../../shared/ui/icon.component';
import { MediaComponent } from '../../shared/ui/media.component';
import { NotFoundPage } from '../legal/not-found.page';

/** Hizmet detay sayfası — config'ten üretilir, her hizmet için statik HTML olarak prerender edilir. */
@Component({
  selector: 'app-service-detail-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HeadlineComponent, IconComponent, MediaComponent, RevealDirective, NotFoundPage],
  template: `
    @if (service(); as s) {
      <article class="svc">
        <header class="svc__hero wrap">
          <nav class="svc__crumbs t-small" aria-label="Sayfa konumu">
            <a routerLink="/">Ana sayfa</a>
            <span aria-hidden="true">/</span>
            <a routerLink="/" fragment="tedaviler">Hizmetlerimiz</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{{ s.shortTitle }}</span>
          </nav>

          <div class="svc__hero-grid">
            <div class="svc__hero-text">
              <p class="eyebrow">
                <app-icon [name]="s.icon" class="svc__eyebrow-icon" />
                {{ s.discipline }}
              </p>
              <app-headline [lines]="[{ text: s.title }]" [level]="1" size="display-l" [immediate]="true" />
              <p class="t-body-xl t-muted svc__summary">{{ s.summary }}</p>
              <div class="svc__ctas">
                <button type="button" class="btn btn--lg" (click)="ui.openAssistant(s.id)">
                  <span class="btn__dot" aria-hidden="true"></span> Bu tedavi için randevu planla
                  <span class="btn__icon"><app-icon name="arrow-right" /></span>
                </button>
                @if (cfg.phoneHref(); as tel) {
                  <a class="btn btn--lg btn--ghost" [href]="tel"><app-icon name="phone" /> Arayın</a>
                }
              </div>
            </div>
            <app-media class="svc__media" [image]="s.image" [icon]="s.icon" [priority]="true" aspect="4 / 5" sizes="(max-width: 767px) 100vw, 42vw" />
          </div>
        </header>

        <section class="svc__body wrap">
          <div class="svc__col">
            <h2 class="t-caption svc__label">Genel bilgi</h2>
            <div class="prose t-body-l">
              @for (p of s.description; track $index) {
                <p>{{ p }}</p>
              }
            </div>

            <dl class="svc__meta">
              <div>
                <dt class="t-caption">İlk randevu</dt>
                <dd>{{ s.appointmentType }}</dd>
              </div>
              <div>
                <dt class="t-caption">İlk görüşme süresi</dt>
                <dd>Yaklaşık {{ s.sessionMinutes }} dakika</dd>
              </div>
              <div>
                <dt class="t-caption">Süreç</dt>
                <dd>{{ s.duration }}</dd>
              </div>
              @if (cfg.features().showPrices && s.price) {
                <div>
                  <dt class="t-caption">Ücret bilgisi</dt>
                  <dd>{{ s.price.label }} <small class="t-muted">{{ s.price.note }}</small></dd>
                </div>
              }
            </dl>
          </div>

          <aside class="svc__side">
            <h2 class="t-caption svc__label">Değerlendirmede ele alınanlar</h2>
            <ul class="svc__highlights" role="list">
              @for (h of s.highlights; track h) {
                <li><app-icon name="check" /> {{ h }}</li>
              }
            </ul>
          </aside>
        </section>

        <section class="svc__steps scene--lab" data-tone="lab" aria-labelledby="steps-title">
          <div class="wrap">
            <h2 id="steps-title" class="t-display-m">Süreç <em>nasıl</em> ilerler?</h2>
            <ol class="steps" role="list" appReveal="stagger">
              @for (st of s.steps; track st.title; let i = $index) {
                <li class="steps__item">
                  <span class="steps__num t-mono">0{{ i + 1 }}</span>
                  <h3 class="t-h3">{{ st.title }}</h3>
                  <p class="t-muted">{{ st.description }}</p>
                </li>
              }
            </ol>
            <p class="t-small t-muted svc__disclaimer">{{ cfg.config().legal.disclaimer }}</p>
          </div>
        </section>

        @if (s.faq.length) {
          <section class="svc__faq wrap" aria-labelledby="faq-title">
            <h2 id="faq-title" class="t-h1">Sık sorulanlar</h2>
            <div class="faq">
              @for (f of s.faq; track f.q) {
                <details class="faq__item">
                  <summary>
                    <span class="t-h3">{{ f.q }}</span>
                    <span class="faq__plus" aria-hidden="true"></span>
                  </summary>
                  <p class="t-body-l t-muted">{{ f.a }}</p>
                </details>
              }
            </div>
          </section>
        }

        @if (next(); as n) {
          <a class="svc__next" [routerLink]="['/hizmetler', n.id]">
            <span class="wrap svc__next-inner">
              <span class="t-caption t-muted">Sonraki hizmet</span>
              <span class="svc__next-title">{{ n.title }}</span>
              <span class="svc__next-arrow"><app-icon name="arrow-right" /></span>
            </span>
          </a>
        }
      </article>
    } @else {
      <app-not-found-page />
    }
  `,
  styleUrl: './service-detail.page.scss',
})
export class ServiceDetailPage {
  protected readonly cfg = inject(ClinicConfigService);
  protected readonly ui = inject(UiStateService);
  private readonly seo = inject(SeoService);

  /** Route parametresi (withComponentInputBinding) */
  readonly id = input.required<string>();

  protected readonly service = computed(() => this.cfg.serviceById(this.id()));
  protected readonly next = computed(() => {
    const list = this.cfg.services();
    const i = list.findIndex((s) => s.id === this.id());
    return i < 0 || list.length < 2 ? null : list[(i + 1) % list.length];
  });

  constructor() {
    effect(() => {
      const s = this.service();
      if (!s) return;
      this.seo.set({
        title: s.title,
        description: `${s.summary} ${this.cfg.clinic().shortName}, ${this.cfg.clinic().city}.`,
        path: `/hizmetler/${s.id}`,
        image: s.image.src.replace(/\.webp$/, '.jpg'),
        jsonLd: this.seo.serviceSchema(s),
      });
    });
  }
}
