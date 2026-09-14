import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ImageAsset, IconName } from '../../config/clinic.types';
import { IconComponent } from './icon.component';

/**
 * Art-directed görsel.
 * - AVIF → WebP/orijinal <picture> zinciri, width/height ile CLS = 0
 * - Görsel henüz üretilmemişse (dosya yok) marka dilinde tasarlanmış bir placeholder
 *   gösterir: porselen ışık gradyanı + ince çizgi ikon + Google Flow prompt kodu.
 *   Böylece demo, görseller eklenmeden önce de bütünlüklü görünür.
 */
@Component({
  selector: 'app-media',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: {
    class: 'media',
    '[class.media--loaded]': 'loaded()',
    '[class.media--lab]': 'tone() === "lab"',
    '[style.aspect-ratio]': 'ratio()',
  },
  template: `
    <div class="media__art" aria-hidden="true">
      <span class="media__glow"></span>
      @if (icon()) {
        <app-icon class="media__icon" [name]="icon()!" [stroke]="0.9" />
      }
      <span class="media__code t-mono">{{ image().code }}</span>
    </div>
    @if (image().src) {
      <picture>
        @if (image().avif) {
          <source [attr.srcset]="image().avif" type="image/avif" />
        }
        <img
          #img
          [src]="image().src"
          [alt]="image().alt"
          [attr.width]="image().width"
          [attr.height]="image().height"
          [attr.loading]="priority() ? 'eager' : 'lazy'"
          [attr.fetchpriority]="priority() ? 'high' : null"
          [attr.sizes]="sizes()"
          decoding="async"
          [style.object-position]="image().position ?? null"
          (load)="loaded.set(true)"
          (error)="loaded.set(false)"
        />
      </picture>
    } @else {
      <span class="visually-hidden">{{ image().alt }}</span>
    }
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      overflow: hidden;
      border-radius: var(--media-radius, var(--radius-m));
      background: var(--color-surface-alt);
      isolation: isolate;
      max-width: 100%;
    }
    .media__art {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      background:
        radial-gradient(120% 80% at 30% 20%, color-mix(in oklab, var(--color-surface) 95%, white) 0%, transparent 60%),
        radial-gradient(90% 70% at 80% 90%, color-mix(in oklab, var(--color-accent) 22%, transparent) 0%, transparent 70%),
        linear-gradient(160deg, var(--color-surface-alt), color-mix(in oklab, var(--color-surface-alt) 70%, var(--color-accent) 18%));
    }
    :host(.media--lab) .media__art {
      background:
        radial-gradient(90% 70% at 30% 25%, color-mix(in oklab, var(--lab-glow) 22%, transparent), transparent 65%),
        radial-gradient(80% 60% at 80% 90%, color-mix(in oklab, var(--lab-accent) 18%, transparent), transparent 70%),
        var(--lab-surface);
    }
    .media__glow {
      position: absolute;
      width: 70%;
      aspect-ratio: 1;
      border-radius: 50%;
      border: 1px solid color-mix(in oklab, var(--color-accent) 45%, transparent);
      opacity: 0.6;
    }
    .media__glow::after {
      content: '';
      position: absolute;
      inset: 14%;
      border-radius: 50%;
      border: 1px solid color-mix(in oklab, var(--color-accent) 30%, transparent);
    }
    .media__icon {
      position: relative;
      font-size: clamp(3rem, 22%, 7rem);
      color: color-mix(in oklab, var(--color-text) 55%, var(--color-accent));
    }
    .media__code {
      position: absolute;
      left: 1rem;
      bottom: 0.9rem;
      color: var(--color-muted);
      opacity: 0.7;
      font-size: 0.625rem;
    }
    picture {
      position: absolute;
      inset: 0;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transform: scale(1.03);
      transition:
        opacity 900ms var(--ease-out),
        transform 1400ms var(--ease-out);
    }
    :host(.media--loaded) img {
      opacity: 1;
      transform: none;
    }
  `,
})
export class MediaComponent {
  readonly image = input.required<ImageAsset>();
  readonly icon = input<IconName | null>(null);
  readonly priority = input(false);
  readonly sizes = input('(max-width: 767px) 100vw, 50vw');
  readonly tone = input<'day' | 'lab'>('day');
  /** Kutu oranını görselden bağımsız zorlamak için, örn. "4 / 5" */
  readonly aspect = input<string | null>(null);

  protected readonly loaded = signal(false);
  protected readonly ratio = computed(() => this.aspect() ?? `${this.image().width} / ${this.image().height}`);
  private readonly img = viewChild<ElementRef<HTMLImageElement>>('img');

  constructor() {
    // Hydration öncesi/sonrası yarış durumunda load olayı kaçırılabilir (artımlı hydration, lazy görseller).
    // decode(): görsel zaten yüklüyse hemen, değilse yüklenip çözümlendiğinde çözülür → olay kaçsa bile görünür olur.
    afterNextRender(() => {
      const el = this.img()?.nativeElement;
      if (!el) return;
      if (el.complete && el.naturalWidth > 0) {
        this.loaded.set(true);
        return;
      }
      el.decode?.()
        .then(() => this.loaded.set(true))
        .catch(() => {
          if (el.complete && el.naturalWidth > 0) this.loaded.set(true);
        });
    });
  }
}
