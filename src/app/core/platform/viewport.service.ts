import { DestroyRef, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Cihaz / tercih sinyalleri. SSR'da güvenli varsayılanlar döner (desktop, hareket açık).
 * Desktop ve mobile deneyimi ayrıştırmak için tek kaynak.
 */
@Injectable({ providedIn: 'root' })
export class ViewportService {
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly isMobile = signal(false); // < 768px
  readonly isTablet = signal(false); // 768–1099px
  readonly finePointer = signal(true);
  readonly reducedMotion = signal(false);
  readonly saveData = signal(false);

  constructor() {
    if (!this.isBrowser) return;
    const destroyRef = inject(DestroyRef);
    const bind = (query: string, target: ReturnType<typeof signal<boolean>>) => {
      const mql = window.matchMedia(query);
      target.set(mql.matches);
      const handler = (e: MediaQueryListEvent) => target.set(e.matches);
      mql.addEventListener('change', handler);
      destroyRef.onDestroy(() => mql.removeEventListener('change', handler));
    };
    bind('(max-width: 767px)', this.isMobile);
    bind('(min-width: 768px) and (max-width: 1099px)', this.isTablet);
    bind('(hover: hover) and (pointer: fine)', this.finePointer);
    bind('(prefers-reduced-motion: reduce)', this.reducedMotion);

    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    this.saveData.set(!!conn?.saveData);
  }

  /** WebGL sahnesini çalıştırmaya değer mi? (cihaz kapasitesi + kullanıcı tercihi) */
  canRunWebGL(): boolean {
    if (!this.isBrowser || this.saveData()) return false;
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') ?? c.getContext('webgl');
      if (!gl) return false;

      // Yazılımsal (GPU'suz) çizim: SwiftShader / llvmpipe → 3D çok yavaş olur (PageSpeed, sanal makineler, eski cihazlar)
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      if (/swiftshader|llvmpipe|softpipe|software/i.test(renderer)) return false;

      const cores = navigator.hardwareConcurrency ?? 4;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
      return !(this.isMobile() && (cores < 4 || memory < 3));
    } catch {
      return false;
    }
  }
}
