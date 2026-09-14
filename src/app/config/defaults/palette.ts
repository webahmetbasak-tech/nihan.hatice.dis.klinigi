import { BrandPalette } from '../clinic.types';

/**
 * "Porcelain & Light" — varsayılan marka paleti.
 *
 * Açık sahneler (gündüz): sıcak porselen zemin, obsidyen mürekkep, şampanya metal detay.
 * Koyu sahneler (laboratuvar): obsidyen zemin, kemik beyazı metin, şampanya + soğuk klinik ışık.
 *
 * Kontrast (WCAG 2.2, geliştirme modunda ThemeService de kontrol eder):
 *  text/bg 15.5:1 · muted/bg 6.7:1 · accentStrong/bg 5.3:1 · ctaText/cta 16.9:1
 *  labText/labBg 15.8:1 · labMuted/labBg 7.1:1 · labAccent/labBg 9.9:1
 *  accent (2.7:1) ve secondary (2.5:1) yalnızca dekoratif çizgi/ikon içindir — metin için kullanılmaz.
 */
export const DEFAULT_PALETTE: BrandPalette = {
  bg: '#F3EFE8', // porcelain
  surface: '#FBF9F5', // bone white
  surfaceAlt: '#E8E1D6', // linen
  primary: '#1F3A36', // deep enamel pine
  secondary: '#8E9B8C', // muted sage (dekoratif)
  accent: '#B08D57', // champagne metal (dekoratif çizgi/ikon)
  accentStrong: '#7A5E33', // metin olarak kullanılabilen şampanya
  cta: '#16181B', // obsidian
  ctaText: '#FBF9F5',
  text: '#16181B',
  muted: '#57534D', // warm graphite
  border: '#D8D0C3',
  labBg: '#0D0F10',
  labSurface: '#171A1C',
  labText: '#EDE8DF',
  labMuted: '#A39D93',
  labAccent: '#D2B688',
  labGlow: '#9DB6C1', // soft clinical blue — yalnızca teknoloji/AI vurgusu
  success: '#2F6B4F',
  warning: '#8F5A14',
  error: '#9E3A30',
};
