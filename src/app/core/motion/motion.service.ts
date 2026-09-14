import { Injectable, NgZone, inject } from '@angular/core';
import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';
import { ClinicConfigService } from '../config/clinic-config.service';
import { ViewportService } from '../platform/viewport.service';

export interface MotionLibs {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
}

/**
 * MOTION ENGINE
 *
 * GSAP + ScrollTrigger + Lenis tek noktadan, TEMBEL yüklenir
 * (ilk boyamayı/LCP'yi bloklamaz). Hareket hiyerarşisi:
 *   L1 micro (magnetic, hover)   → directive'ler, yalnızca ince imleçte
 *   L2 section reveal            → appReveal / app-headline (IntersectionObserver + CSS)
 *   L3 parallax                  → appParallax, yalnızca desktop
 *   L4 cinematic transition      → zemin rengi geçişleri, pinned rail
 *   L5 hero storytelling         → WebGL diş sahnesi + scroll timeline
 * prefers-reduced-motion: L2–L5 kapatılır, içerik statik ve tam görünür kalır.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly zone = inject(NgZone);
  private readonly viewport = inject(ViewportService);
  private readonly cfg = inject(ClinicConfigService);
  private libs?: Promise<MotionLibs>;
  private lenis: Lenis | null = null;

  get enabled(): boolean {
    return this.viewport.isBrowser && !this.viewport.reducedMotion();
  }

  load(): Promise<MotionLibs> {
    if (!this.viewport.isBrowser) return new Promise(() => undefined);
    this.libs ??= this.zone.runOutsideAngular(async () => {
      // İlk boyama ve hydration bitene kadar bekle: hareket kütüphaneleri LCP/TBT'yi etkilemesin
      await new Promise<void>((resolve) => {
        const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
          .requestIdleCallback;
        if (ric) ric(() => resolve(), { timeout: 1200 });
        else setTimeout(resolve, 300);
      });
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      gsap.registerPlugin(ScrollTrigger);
      gsap.defaults({ ease: 'expo.out', duration: 1.1 });
      ScrollTrigger.config({ ignoreMobileResize: true });

      const wantsSmooth =
        this.cfg.features().smoothScroll && this.enabled && this.viewport.finePointer() && !this.viewport.isMobile();
      if (wantsSmooth) {
        const { default: LenisCtor } = await import('lenis');
        this.lenis = new LenisCtor({ lerp: 0.1, wheelMultiplier: 0.95, anchors: false });
        this.lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t) => this.lenis?.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      }

      // Fontlar yüklendiğinde satır bölmeleri ve trigger konumları yeniden hesaplanır
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
      return { gsap, ScrollTrigger };
    });
    return this.libs;
  }

  scrollTo(target: string | HTMLElement | number, opts: { offset?: number; immediate?: boolean } = {}): void {
    if (!this.viewport.isBrowser) return;
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (el === null) return;
    const offset = opts.offset ?? -(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0);
    if (this.lenis) {
      this.lenis.scrollTo(el, { offset, immediate: opts.immediate, duration: 1.4 });
      return;
    }
    const top = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: opts.immediate || !this.enabled ? 'auto' : 'smooth' });
  }

  /** Modal/drawer açıkken arka plan kaydırmasını durdurur. */
  lockScroll(locked: boolean): void {
    if (!this.viewport.isBrowser) return;
    if (this.lenis) {
      if (locked) this.lenis.stop();
      else this.lenis.start();
      return;
    }
    document.documentElement.style.overflow = locked ? 'hidden' : '';
  }

  refresh(): void {
    this.libs?.then(({ ScrollTrigger }) => ScrollTrigger.refresh());
  }
}
