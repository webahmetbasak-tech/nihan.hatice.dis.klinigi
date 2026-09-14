import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ClinicConfigService } from '../core/config/clinic-config.service';

/** Logo varsa logo; yoksa monogram + tipografik wordmark (config-driven). */
@Component({
  selector: 'app-brand-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cfg.config().branding.logo; as logo) {
      <img [src]="logo.src" [alt]="logo.alt" [width]="logo.width" [height]="logo.height" class="brand__logo" />
    } @else {
      <span class="brand__mono" aria-hidden="true">
        <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19.25" /></svg>
        <span>{{ cfg.clinic().monogram }}</span>
      </span>
      <span class="brand__text">
        <span class="brand__name">{{ cfg.clinic().shortName }}</span>
        @if (showTagline()) {
          <span class="brand__tag">{{ cfg.clinic().tagline }}</span>
        }
      </span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      color: inherit;
    }
    .brand__logo {
      height: 36px;
      width: auto;
    }
    .brand__mono {
      position: relative;
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      flex: none;
      padding-top: 1px;
      font-family: var(--font-display);
      font-size: 0.875rem;
      font-style: italic;
      font-weight: 400;
      letter-spacing: -0.01em;

      svg {
        position: absolute;
        inset: 0;
        fill: none;
        stroke: var(--color-accent);
        stroke-width: 0.75;
      }
    }
    .brand__text {
      display: grid;
      gap: 0.3rem;
      line-height: 1;
    }
    .brand__name {
      font-family: var(--font-display);
      font-size: 1.125rem;
      font-weight: 350;
      font-variation-settings: 'wght' 350;
      letter-spacing: -0.012em;
      white-space: nowrap;
    }
    .brand__tag {
      font-family: var(--font-body);
      font-size: 0.5rem;
      font-weight: 400;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      opacity: 0.6;
      white-space: nowrap;
    }
    @media (max-width: 480px) {
      .brand__tag {
        display: none;
      }
      .brand__name {
        font-size: 1.02rem;
      }
    }
  `,
})
export class BrandMarkComponent {
  protected readonly cfg = inject(ClinicConfigService);
  readonly showTagline = input(true);
}
