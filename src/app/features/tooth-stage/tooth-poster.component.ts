import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * WebGL'in çalışmadığı / gerekmediği durumlar için vektör "poster":
 * düşük güçlü mobil, Save-Data, WebGL desteği yok, SSR ilk boyama.
 * Aynı üç katmanı (mine, dentin, pulpa) taşır; anatomi sahnesi `layer` ile vurgular.
 */
@Component({
  selector: 'app-tooth-poster',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-layer]': 'layer()', 'aria-hidden': 'true' },
  template: `
    <svg viewBox="0 0 240 320" fill="none">
      <defs>
        <radialGradient id="tp-enamel" cx="38%" cy="26%" r="80%">
          <stop offset="0" stop-color="#FFFDF8" />
          <stop offset=".55" stop-color="#EFE7DA" />
          <stop offset="1" stop-color="#D9CCB7" />
        </radialGradient>
        <linearGradient id="tp-dentin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#EEDDBA" />
          <stop offset="1" stop-color="#D8BE8E" />
        </linearGradient>
        <radialGradient id="tp-pulp" cx="50%" cy="30%" r="70%">
          <stop offset="0" stop-color="#E49A80" />
          <stop offset="1" stop-color="#B85A45" />
        </radialGradient>
      </defs>
      <g class="rings">
        <ellipse cx="120" cy="160" rx="112" ry="38" transform="rotate(-12 120 160)" />
        <ellipse cx="120" cy="160" rx="100" ry="30" transform="rotate(18 120 160)" />
      </g>
      <g class="tooth">
        <path
          class="enamel"
          d="M70 30C40 30 22 52 22 86c0 26 10 44 18 64 8 22 10 54 18 86 6 26 22 30 28 8l10-40c4-16 14-22 24-22s20 6 24 22l10 40c6 22 22 18 28-8 8-32 10-64 18-86 8-20 18-38 18-64 0-34-18-56-48-56-20 0-32 12-50 12S90 30 70 30Z"
        />
        <path
          class="dentin"
          d="M76 52c-19 0-32 15-32 37 0 21 9 36 15 53 7 20 9 50 15 78 3 13 9 14 12 4l12-38c4-14 12-21 22-21s18 7 22 21l12 38c3 10 9 9 12-4 6-28 8-58 15-78 6-17 15-32 15-53 0-22-13-37-32-37-16 0-27 9-44 9S92 52 76 52Z"
        />
        <path
          class="pulp"
          d="M98 98c0-13 10-16 22-12 12-4 22-1 22 12 0 15-7 25-10 38l8 84c1 6-4 8-6 2l-12-72h-4l-12 72c-2 6-7 4-6-2l8-84c-3-13-10-23-10-38Z"
        />
      </g>
    </svg>
  `,
  styles: `
    :host {
      display: grid;
      place-items: center;
      width: 100%;
      height: 100%;
    }
    svg {
      width: min(62%, 48vh, var(--poster-size, 100%));
      height: auto;
      overflow: visible;
      filter: var(--poster-shadow, drop-shadow(0 40px 60px rgb(22 24 27 / 18%)));
      animation: float 7s var(--ease-in-out) infinite;
    }
    .rings ellipse {
      stroke: var(--color-accent);
      stroke-width: 0.6;
      opacity: 0.6;
    }
    .enamel {
      fill: url(#tp-enamel);
      stroke: color-mix(in oklab, var(--color-accent) 60%, transparent);
      stroke-width: 0.8;
      transition: opacity 900ms var(--ease-out);
    }
    .dentin,
    .pulp {
      opacity: 0;
      transition: opacity 900ms var(--ease-out);
    }
    .dentin {
      fill: url(#tp-dentin);
    }
    .pulp {
      fill: url(#tp-pulp);
    }
    :host([data-layer='dentin']) .enamel,
    :host([data-layer='pulp']) .enamel {
      opacity: 0.35;
    }
    :host([data-layer='dentin']) .dentin {
      opacity: 1;
    }
    :host([data-layer='pulp']) .dentin {
      opacity: 0.45;
    }
    :host([data-layer='pulp']) .pulp {
      opacity: 1;
    }
    @keyframes float {
      50% {
        transform: translateY(-10px) rotate(-1.5deg);
      }
    }
  `,
})
export class ToothPosterComponent {
  readonly layer = input<'enamel' | 'dentin' | 'pulp'>('enamel');
}
