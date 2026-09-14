import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo/seo.service';

@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="nf wrap">
      <p class="eyebrow">404</p>
      <h1 class="t-display-l">Bu sayfa <em>bulunamadı.</em></h1>
      <p class="t-body-l t-muted">Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.</p>
      <a routerLink="/" class="btn btn--lg">Ana sayfaya dön</a>
    </section>
  `,
  styles: `
    .nf {
      display: grid;
      align-content: center;
      justify-items: start;
      gap: 1.5rem;
      min-height: 80svh;
      padding-top: var(--header-h);
    }
  `,
})
export class NotFoundPage {
  constructor() {
    inject(SeoService).set({ title: 'Sayfa bulunamadı', path: '/404', noindex: true });
  }
}
