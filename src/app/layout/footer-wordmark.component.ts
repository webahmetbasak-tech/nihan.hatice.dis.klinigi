import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ViewportService } from '../core/platform/viewport.service';

/**
 * Footer wordmark — üç katmanlı "canlı" tipografi:
 *  1) kontur: footer görünür alana girince soldan sağa süpürülerek açılır (katmanlar birebir hizalı)
 *  2) dolgu: markanın renkleri arasında yavaş akan gradyan (yumuşak ama görünür)
 *  3) ışık: ince imleçte, farenin çevresinde parlak dolgu açığa çıkar
 * Yazı genişliği harf sayısına göre otomatik ölçeklenir (uzun klinik adları taşmaz).
 */
@Component({
  selector: 'app-footer-wordmark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[class.is-in]': 'inView()',
    '[style.--chars]': 'chars().length',
  },
  template: `
    <span class="wm wm--outline">{{ text() }}</span>
    <span class="wm wm--fill">{{ text() }}</span>
    <span class="wm wm--spot">{{ text() }}</span>
  `,
  styles: `
    :host {
      --mx: 50%;
      --my: 50%;
      --spot: 0;
      position: relative;
      display: grid;
      width: 100%;
      margin-block: 1.5rem 2.5rem;
      padding-block: 0.08em 0.14em;
      overflow: hidden;
      font-family: var(--font-display);
      font-weight: 300;
      font-size: min(15rem, calc((100vw - 2 * var(--gutter)) / (var(--chars) * 0.5)));
      line-height: 0.9;
      letter-spacing: -0.05em;
      white-space: nowrap;
      user-select: none;
    }

    .wm {
      grid-area: 1 / 1;
    }

    /* 1 — kontur, soldan sağa süpürülerek açılır */
    .wm--outline {
      color: transparent;
      -webkit-text-stroke: 1px color-mix(in oklab, var(--lab-accent) 38%, transparent);
    }
    .wm--outline {
      clip-path: inset(0 100% 0 0);
      transform: translateY(18%);
      transition:
        clip-path 1.6s var(--ease-in-out),
        transform 1.6s var(--ease-out);
    }
    :host(.is-in) .wm--outline {
      clip-path: inset(0 0 0 0);
      transform: none;
    }

    /* 2 — yumuşak akan renk dolgusu */
    .wm--fill {
      background-image: linear-gradient(
        100deg,
        var(--lab-accent) 0%,
        #ede8df 22%,
        var(--lab-glow) 44%,
        #8e9b8c 62%,
        #ede8df 80%,
        var(--lab-accent) 100%
      );
      background-size: 250% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      opacity: 0;
      clip-path: inset(0 100% 0 0);
      transition:
        opacity 1.8s var(--ease-out) 0.6s,
        clip-path 1.8s var(--ease-in-out) 0.6s;
      animation: wm-flow 16s ease-in-out infinite alternate;
    }
    :host(.is-in) .wm--fill {
      opacity: 0.42;
      clip-path: inset(0 0 0 0);
    }

    /* 3 — imleç ışığı */
    .wm--spot {
      background-image: linear-gradient(100deg, #fffdf8, var(--lab-accent) 55%, #fffdf8);
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      opacity: var(--spot);
      -webkit-mask-image: radial-gradient(circle min(22vw, 320px) at var(--mx) var(--my), #000 0%, rgb(0 0 0 / 55%) 35%, transparent 72%);
      mask-image: radial-gradient(circle min(22vw, 320px) at var(--mx) var(--my), #000 0%, rgb(0 0 0 / 55%) 35%, transparent 72%);
      transition: opacity 600ms var(--ease-out);
      animation: wm-flow 9s linear infinite alternate;
    }

    @keyframes wm-flow {
      from {
        background-position: 0% 50%;
      }
      to {
        background-position: 100% 50%;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .wm--outline {
        clip-path: none;
        transform: none;
        transition: none;
      }
      .wm--fill,
      .wm--spot {
        animation: none;
      }
      .wm--fill {
        opacity: 0.42;
        clip-path: none;
      }
    }
  `,
})
export class FooterWordmarkComponent {
  readonly text = input.required<string>();
  protected readonly chars = computed(() => Array.from(this.text()));
  protected readonly inView = signal(false);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const viewport = inject(ViewportService);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.inView.set(true);
            io.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      io.observe(host);

      if (!viewport.finePointer()) {
        destroyRef.onDestroy(() => io.disconnect());
        return;
      }

      // İmleç ışığı — rAF ile tek yazım, layout thrash yok
      let raf = 0;
      let x = 0;
      let y = 0;
      const apply = () => {
        raf = 0;
        host.style.setProperty('--mx', `${x}px`);
        host.style.setProperty('--my', `${y}px`);
      };
      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect();
        x = e.clientX - r.left;
        y = e.clientY - r.top;
        if (!raf) raf = requestAnimationFrame(apply);
      };
      const onEnter = () => host.style.setProperty('--spot', '1');
      const onLeave = () => host.style.setProperty('--spot', '0');
      host.addEventListener('pointermove', onMove, { passive: true });
      host.addEventListener('pointerenter', onEnter);
      host.addEventListener('pointerleave', onLeave);

      destroyRef.onDestroy(() => {
        io.disconnect();
        cancelAnimationFrame(raf);
        host.removeEventListener('pointermove', onMove);
        host.removeEventListener('pointerenter', onEnter);
        host.removeEventListener('pointerleave', onLeave);
      });
    });
  }
}
