import { RenderMode, ServerRoute } from '@angular/ssr';
import { ACTIVE_CLINIC } from './config/clinic.active';

/**
 * Tüm sayfalar build sırasında statik HTML olarak üretilir (SSG).
 * → Vercel'de sunucu gerekmez, SEO etiketleri ve JSON-LD HTML'de hazır gelir, LCP hızlıdır.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  {
    path: 'hizmetler/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => ACTIVE_CLINIC.services.map((s) => ({ id: s.id })),
  },
  { path: 'kvkk', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
