import { DOCUMENT, Injectable, inject, isDevMode } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { BrandPalette } from '../../config/clinic.types';
import { DEFAULT_PALETTE } from '../../config/defaults/palette';
import { ClinicConfigService } from '../config/clinic-config.service';

const VAR_MAP: Record<keyof BrandPalette, string> = {
  bg: '--color-bg',
  surface: '--color-surface',
  surfaceAlt: '--color-surface-alt',
  primary: '--color-primary',
  secondary: '--color-secondary',
  accent: '--color-accent',
  accentStrong: '--color-accent-strong',
  cta: '--color-cta',
  ctaText: '--color-cta-text',
  text: '--color-text',
  muted: '--color-muted',
  border: '--color-border',
  labBg: '--lab-bg',
  labSurface: '--lab-surface',
  labText: '--lab-text',
  labMuted: '--lab-muted',
  labAccent: '--lab-accent',
  labGlow: '--lab-glow',
  success: '--color-success',
  warning: '--color-warning',
  error: '--color-error',
};

/**
 * Config paletini :root CSS değişkenlerine yazar.
 * SSR/prerender sırasında da çalışır → HTML'e gömülür, renk "flash"ı olmaz.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly config = inject(ClinicConfigService);

  apply(): void {
    const palette: BrandPalette = { ...DEFAULT_PALETTE, ...this.config.config().branding.palette };
    const root = this.doc.documentElement;
    const css = (Object.keys(VAR_MAP) as (keyof BrandPalette)[])
      .map((k) => `${VAR_MAP[k]}:${palette[k]}`)
      .join(';');
    root.setAttribute('style', css);
    root.setAttribute('lang', 'tr');
    this.meta.updateTag({ name: 'theme-color', content: this.config.config().seo.themeColor || palette.bg });

    if (isDevMode()) this.auditContrast(palette);
  }

  /** Geliştirme modunda WCAG AA kontrolü — config'te renk değiştiren kişiyi uyarır. */
  private auditContrast(p: BrandPalette): void {
    const pairs: [keyof BrandPalette, keyof BrandPalette, number][] = [
      ['text', 'bg', 4.5],
      ['muted', 'bg', 4.5],
      ['accentStrong', 'bg', 4.5],
      ['ctaText', 'cta', 4.5],
      ['ctaText', 'primary', 4.5],
      ['labText', 'labBg', 4.5],
      ['labMuted', 'labBg', 4.5],
      ['labAccent', 'labBg', 4.5],
    ];
    for (const [fg, bg, min] of pairs) {
      const ratio = contrast(p[fg], p[bg]);
      if (ratio < min) {
        console.warn(`[theme] Kontrast yetersiz: ${fg} (${p[fg]}) / ${bg} (${p[bg]}) = ${ratio.toFixed(2)}:1 < ${min}:1`);
      }
    }
  }
}

function luminance(hex: string): number {
  const v = hex.replace('#', '');
  const rgb = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
  const [r, g, b] = rgb.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
