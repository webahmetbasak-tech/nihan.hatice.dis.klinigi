import { DestroyRef, Directive, ElementRef, afterNextRender, inject, input } from '@angular/core';
import { MotionService } from '../../core/motion/motion.service';
import { ViewportService } from '../../core/platform/viewport.service';

type Cleanup = () => void;

/** Boş attribute (appMagnetic) → varsayılan; değer → sayı */
const num = (fallback: number) => (v: number | string | undefined) => (v === '' || v === undefined ? fallback : Number(v));

/** Ortak yaşam döngüsü: tarayıcıda, render sonrası, motion açıksa çalıştır; destroy'da temizle. */
function useMotion(setup: (el: HTMLElement, motion: MotionService) => Promise<Cleanup | void> | Cleanup | void) {
  const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  const motion = inject(MotionService);
  let cleanup: Cleanup | void;
  let destroyed = false;
  inject(DestroyRef).onDestroy(() => {
    destroyed = true;
    cleanup?.();
  });
  afterNextRender(async () => {
    if (!motion.enabled) return;
    const result = await setup(el, motion);
    if (destroyed) result?.();
    else cleanup = result;
  });
}

/**
 * Paylaşılan IntersectionObserver: tüm reveal öğeleri için tek gözlemci, scroll sırasında layout okuması yok.
 * Öğe görünür alana girince `is-revealed` sınıfı eklenir; animasyonun kendisi CSS'tedir (styles/_motion.scss).
 */
let revealObserver: IntersectionObserver | null = null;
export function observeReveal(el: HTMLElement): () => void {
  revealObserver ??= new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-revealed');
        revealObserver?.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  revealObserver.observe(el);
  return () => revealObserver?.unobserve(el);
}

/**
 * L2 — Section reveal (IntersectionObserver + CSS, GSAP'sız).
 * appReveal (yükselme) · appReveal="stagger" (çocuklar sırayla) · appReveal="clip" (görsel perde açılışı) · appReveal="fade"
 * SSR'da içerik görünür gelir; JS yalnızca ekran dışındaki öğeleri işaretler. Hareket azaltılmışsa hiç dokunmaz.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  readonly appReveal = input<'' | 'up' | 'stagger' | 'clip' | 'fade'>('');

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const motion = inject(MotionService);
    let stop: (() => void) | undefined;
    inject(DestroyRef).onDestroy(() => stop?.());
    afterNextRender(() => {
      if (!motion.enabled) return;
      // Zaten görünür alandaysa (ör. sayfa ortasından yenileme) gizleyip yanıp sönme yaratma
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) return;
      const mode = this.appReveal() || 'up';
      el.setAttribute('data-reveal', mode);
      if (mode === 'stagger') {
        Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty('--i', String(i)));
      }
      stop = observeReveal(el);
    });
  }
}

/** L3 — Parallax. Yalnızca desktop + ince imleç. Değer: hareket oranı (yPercent). */
@Directive({ selector: '[appParallax]' })
export class ParallaxDirective {
  readonly appParallax = input(12, { transform: num(12) });

  constructor() {
    const viewport = inject(ViewportService);
    useMotion(async (el, motion) => {
      if (viewport.isMobile()) return;
      const { gsap } = await motion.load();
      const amount = this.appParallax();
      const tween = gsap.fromTo(
        el,
        { yPercent: -amount / 2 },
        {
          yPercent: amount / 2,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
  }
}

/** L1 — Manyetik buton: imlece doğru hafif çekilme. Dokunmatikte devre dışı. */
@Directive({ selector: '[appMagnetic]' })
export class MagneticDirective {
  readonly appMagnetic = input(0.28, { transform: num(0.28) });

  constructor() {
    const viewport = inject(ViewportService);
    useMotion(async (el, motion) => {
      if (!viewport.finePointer()) return;
      const { gsap } = await motion.load();
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * this.appMagnetic());
        yTo((e.clientY - (r.top + r.height / 2)) * this.appMagnetic());
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    });
  }
}

/** L1 — Kartlarda çok hafif 3D eğim. */
@Directive({ selector: '[appTilt]' })
export class TiltDirective {
  readonly appTilt = input(5, { transform: num(5) });

  constructor() {
    const viewport = inject(ViewportService);
    useMotion(async (el, motion) => {
      if (!viewport.finePointer()) return;
      const { gsap } = await motion.load();
      gsap.set(el, { transformPerspective: 900, transformStyle: 'preserve-3d' });
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3.out' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3.out' });
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * this.appTilt());
        rx(-py * this.appTilt());
      };
      const onLeave = () => {
        rx(0);
        ry(0);
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      return () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      };
    });
  }
}

export const MOTION_DIRECTIVES = [RevealDirective, ParallaxDirective, MagneticDirective, TiltDirective] as const;
