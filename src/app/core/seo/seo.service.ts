import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ClinicConfigService } from '../config/clinic-config.service';
import { ServiceConfig } from '../../config/clinic.types';
import { isPlaceholder } from '../../config/define-clinic';

export interface PageSeo {
  title?: string; // şablona girer; boşsa ana başlık
  description?: string;
  path: string; // "/hizmetler/implant"
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
}

const DAY_SCHEMA = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * Title, meta, OpenGraph, Twitter, canonical ve JSON-LD üretimi.
 * Prerender sırasında çalıştığı için tüm etiketler statik HTML'de yer alır.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly cfg = inject(ClinicConfigService);

  set(page: PageSeo): void {
    const c = this.cfg.config();
    const fullTitle = page.title ? c.seo.titleTemplate.replace('%s', page.title) : c.seo.title;
    const description = page.description ?? c.seo.description;
    const base = c.seo.siteUrl.replace(/\/$/, '');
    const url = base ? `${base}${page.path === '/' ? '/' : page.path}` : '';
    const imagePath = page.image ?? c.seo.ogImage;
    const image = base && imagePath ? `${base}${imagePath}` : '';
    const robots = page.noindex || c.seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';

    this.title.setTitle(fullTitle);
    const tags: [string, string, 'name' | 'property'][] = [
      ['description', description, 'name'],
      ['robots', robots, 'name'],
      ['keywords', c.seo.keywords.join(', '), 'name'],
      ['og:type', 'website', 'property'],
      ['og:locale', 'tr_TR', 'property'],
      ['og:site_name', c.clinic.name, 'property'],
      ['og:title', fullTitle, 'property'],
      ['og:description', description, 'property'],
      ['twitter:card', 'summary_large_image', 'name'],
      ['twitter:title', fullTitle, 'name'],
      ['twitter:description', description, 'name'],
    ];
    if (url) tags.push(['og:url', url, 'property']);
    if (image) {
      tags.push(['og:image', image, 'property'], ['twitter:image', image, 'name']);
    }
    for (const [key, content, attr] of tags) {
      this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
    }
    if (!url) this.meta.removeTag('property="og:url"');

    this.setCanonical(url);
    this.setJsonLd([this.clinicSchema(), ...(page.jsonLd ?? [])]);
  }

  serviceSchema(service: ServiceConfig): Record<string, unknown>[] {
    const c = this.cfg.config();
    const base = c.seo.siteUrl.replace(/\/$/, '');
    const url = base ? `${base}/hizmetler/${service.id}` : undefined;
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'MedicalProcedure',
        name: service.title,
        description: service.summary,
        procedureType: 'https://schema.org/NoninvasiveProcedure',
        howPerformed: service.steps.map((s) => `${s.title}: ${s.description}`).join(' '),
        ...(url ? { url } : {}),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ana sayfa', ...(base ? { item: `${base}/` } : {}) },
          { '@type': 'ListItem', position: 2, name: 'Hizmetlerimiz', ...(base ? { item: `${base}/#tedaviler` } : {}) },
          { '@type': 'ListItem', position: 3, name: service.title, ...(url ? { item: url } : {}) },
        ],
      },
    ];
  }

  /** schema.org/Dentist ⊂ MedicalBusiness ⊂ LocalBusiness — diş kliniği için en doğru tip. */
  private clinicSchema(): Record<string, unknown> {
    const c = this.cfg.config();
    const base = c.seo.siteUrl.replace(/\/$/, '');
    const a = c.contact.address;
    const clean = (v: string) => (isPlaceholder(v) ? undefined : v);
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Dentist',
      name: c.clinic.name,
      alternateName: c.clinic.shortName,
      description: c.clinic.description,
      medicalSpecialty: 'Dentistry',
      telephone: clean(c.contact.phone),
      email: clean(c.contact.email),
      url: base ? `${base}/` : undefined,
      image: base ? `${base}${c.seo.ogImage}` : undefined,
      foundingDate: c.clinic.foundedYear ? String(c.clinic.foundedYear) : undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: clean(a.street),
        addressLocality: clean(a.district),
        addressRegion: clean(a.city),
        postalCode: a.postalCode || undefined,
        addressCountry: a.country,
      },
      geo: c.contact.geo ? { '@type': 'GeoCoordinates', latitude: c.contact.geo.lat, longitude: c.contact.geo.lng } : undefined,
      openingHoursSpecification: c.contact.workingHours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: h.days.map((d) => DAY_SCHEMA[d]),
        opens: h.open,
        closes: h.close,
      })),
      sameAs: Object.values(c.social).filter(Boolean),
      availableService: c.services.map((s) => ({
        '@type': 'MedicalProcedure',
        name: s.title,
        description: s.summary,
      })),
    };
    return prune(schema);
  }

  private setCanonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!url) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(data: Record<string, unknown>[]): void {
    this.doc.head.querySelectorAll('script[data-seo="ld"]').forEach((n) => n.remove());
    for (const item of data) {
      const script = this.doc.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo', 'ld');
      script.textContent = JSON.stringify(item).replace(/</g, '\\u003c');
      this.doc.head.appendChild(script);
    }
  }
}

function prune<T>(value: T): T {
  if (Array.isArray(value)) return value.map(prune).filter((v) => v !== undefined) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      const p = prune(v);
      if (p !== undefined && !(Array.isArray(p) && p.length === 0)) out[k] = p;
    }
    return out as T;
  }
  return value;
}
