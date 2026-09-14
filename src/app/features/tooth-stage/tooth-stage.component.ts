import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ClinicConfigService } from '../../core/config/clinic-config.service';
import { ViewportService } from '../../core/platform/viewport.service';
import type { ToothScene } from './tooth-scene';
import { ToothPosterComponent } from './tooth-poster.component';

/**
 * Hero + Anatomi boyunca yapışkan (sticky) duran sahne katmanı.
 * Three.js yalnızca: config.features.webgl && cihaz yeterli && tarayıcı boşta → dinamik import.
 * Aksi halde vektör poster kalır. Görünür alan dışındayken render döngüsü durur.
 */
@Component({
  selector: 'app-tooth-stage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToothPosterComponent],
  host: { '[class.is-ready]': 'ready()', 'aria-hidden': 'true' },
  template: `
    <div class="stage__poster">
      <app-tooth-poster [layer]="layer()" />
    </div>
    <canvas #canvas class="stage__canvas"></canvas>
  `,
  styles: `
    :host {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .stage__canvas,
    .stage__poster {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
    .stage__poster {
      transition: opacity 1s var(--ease-out);
    }
    @media (min-width: 1100px) {
      .stage__poster {
        padding-left: 36%;
        transition:
          opacity 1s var(--ease-out),
          padding 1.2s var(--ease-in-out);
      }
      :host-context(.in-lab) .stage__poster {
        padding-left: 0;
        padding-right: 42%;
      }
    }
    :host-context(.in-lab) app-tooth-poster {
      --poster-shadow: none;
    }
    @media (max-width: 767px) {
      /* Hero'daki 3D alanına (--hero-visual-*) hizalanır; ölçüm yoksa güvenli varsayılan */
      .stage__poster {
        inset: auto 0 auto 0;
        top: var(--hero-visual-top, 42svh);
        height: var(--hero-visual-h, 34svh);
        opacity: 0.9;
      }
      .stage__poster app-tooth-poster {
        --poster-size: calc(var(--hero-visual-h, 34svh) * 0.72);
      }
    }
    .stage__canvas {
      opacity: 0;
      transition: opacity 1.4s var(--ease-out);
    }
    :host(.is-ready) .stage__canvas {
      opacity: 1;
    }
    :host(.is-ready) .stage__poster {
      opacity: 0;
    }
  `,
})
export class ToothStageComponent {
  private readonly cfg = inject(ClinicConfigService);
  private readonly viewport = inject(ViewportService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  readonly ready = signal(false);
  readonly layer = signal<'enamel' | 'dentin' | 'pulp'>('enamel');

  private scene: ToothScene | null = null;
  private resolveReady!: (scene: ToothScene | null) => void;
  private readonly readyPromise = new Promise<ToothScene | null>((r) => (this.resolveReady = r));

  constructor() {
    const destroyRef = inject(DestroyRef);
    let disposed = false;
    destroyRef.onDestroy(() => {
      disposed = true;
      this.scene?.dispose();
    });

    afterNextRender(() => {
      if (!this.cfg.features().webgl || !this.viewport.canRunWebGL()) {
        this.resolveReady(null);
        return;
      }
      const quality = this.viewport.isMobile() ? 'low' : 'high';
      const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
        .requestIdleCallback;

      // 1) HAZIRLIK — sayfa yüklendikten sonra arka planda: Three.js modülü indirilir,
      //    geometri Web Worker'da hesaplanır. Kaydırmayı ve ilk yükleme metriklerini etkilemez.
      let prepared: Promise<{ mod: typeof import('./tooth-scene'); layers: ReturnType<typeof import('./tooth-scene').computeLayers> }> | null = null;
      const prepare = () =>
        (prepared ??= import('./tooth-scene').then((mod) => ({ mod, layers: mod.computeLayers(quality) })));
      // 2) BAŞLATMA — sayfa yüklenip tarayıcı boşta kaldığında otomatik (dokunuş beklenmez);
      //    kullanıcı daha önce dokunur/kaydırırsa hemen. Yazılımsal GPU ortamları canRunWebGL() ile zaten elendi.
      let booted = false;
      const boot = async () => {
        if (booted) return;
        booted = true;
        try {
          const { mod, layers } = await prepare();
          const { ToothScene } = mod;
          if (disposed) return;
          const css = getComputedStyle(document.documentElement);
          const scene = new ToothScene(this.canvas().nativeElement, {
            quality,
            colors: {
              accent: css.getPropertyValue('--color-accent').trim() || '#b08d57',
              glow: css.getPropertyValue('--lab-glow').trim() || '#9db6c1',
              enamel: '#eee5d5',
            },
          });
          await scene.build(layers);
          if (disposed) {
            scene.dispose();
            return;
          }
          this.scene = scene;
          this.bindVisibility(scene, destroyRef);
          this.bindPointer(scene, destroyRef);
          if (this.viewport.reducedMotion()) scene.renderOnce();
          this.ready.set(true);
          this.resolveReady(scene);
        } catch (err) {
          console.warn('[tooth-stage] WebGL sahnesi başlatılamadı, poster kullanılıyor.', err);
          this.resolveReady(null);
        }
      };
      const events = ['pointermove', 'pointerdown', 'wheel', 'touchstart', 'keydown', 'scroll'] as const;
      const start = () => {
        events.forEach((e) => window.removeEventListener(e, start));
        void boot();
      };
      events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
      destroyRef.onDestroy(() => events.forEach((e) => window.removeEventListener(e, start)));

      // Modül indirme + Worker geometrisi sayfa çizilir çizilmez başlar (ana thread dışı işler)
      void prepare();
      const scheduleBoot = () => {
        if (idle) idle(() => void boot(), { timeout: 800 });
        else setTimeout(() => void boot(), 300);
      };
      if (document.readyState === 'complete') scheduleBoot();
      else window.addEventListener('load', scheduleBoot, { once: true });
    });
  }

  /** WebGL sahnesi hazır olduğunda (veya poster moduna düşüldüğünde null ile) çözülür. */
  whenReady(): Promise<ToothScene | null> {
    return this.readyPromise;
  }

  private bindVisibility(scene: ToothScene, destroyRef: DestroyRef): void {
    if (this.viewport.reducedMotion()) return;
    let inView = true;
    const sync = () => scene.setActive(inView && document.visibilityState === 'visible');
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(this.host);
    document.addEventListener('visibilitychange', sync);
    sync();
    destroyRef.onDestroy(() => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    });
  }

  private bindPointer(scene: ToothScene, destroyRef: DestroyRef): void {
    if (!this.viewport.finePointer()) return;
    const onMove = (e: PointerEvent) =>
      scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    window.addEventListener('pointermove', onMove, { passive: true });
    destroyRef.onDestroy(() => window.removeEventListener('pointermove', onMove));
  }
}
