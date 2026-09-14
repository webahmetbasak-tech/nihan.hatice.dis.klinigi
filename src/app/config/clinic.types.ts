/**
 * Klinik konfigürasyon şeması.
 *
 * Kliniğe özel HİÇBİR bilgi component içine yazılmaz; hepsi bu şemaya uyan
 * config dosyalarından gelir (src/app/config/clinics/*.ts).
 *
 * Köşeli parantezli değerler ("[PHONE]" gibi) bilinçli placeholder'dır.
 * UI bunları tanır: tıklanabilir link üretmez, SEO/JSON-LD'ye yazmaz.
 */

export type IconName =
  | 'tooth'
  | 'implant'
  | 'smile'
  | 'canal'
  | 'whitening'
  | 'aligner'
  | 'veneer'
  | 'child'
  | 'shield'
  | 'scan'
  | 'sparkle'
  | 'chair'
  | 'calendar'
  | 'clock'
  | 'phone'
  | 'whatsapp'
  | 'mail'
  | 'pin'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-left'
  | 'close'
  | 'menu'
  | 'check'
  | 'send'
  | 'user'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'x'
  | 'chevron-left'
  | 'chevron-right'
  | 'layers'
  | 'info';

export interface ImageAsset {
  /** Public path, örn. "/images/services/implant.webp". Boş bırakılırsa tasarlanmış placeholder gösterilir. */
  src: string;
  /** Opsiyonel AVIF kaynağı (scripts/optimize-images.mjs üretir). */
  avif?: string;
  /** Opsiyonel WebP kaynağı. */
  webp?: string;
  alt: string;
  width: number;
  height: number;
  /** object-position, örn. "50% 30%" */
  position?: string;
  /** Google Flow prompt kodu — görsel yokken placeholder üzerinde gösterilir. */
  code: string;
}

export interface BrandPalette {
  bg: string;
  surface: string;
  surfaceAlt: string;
  primary: string;
  secondary: string;
  accent: string;
  /** Açık zeminde metin olarak kullanılabilen accent tonu (WCAG AA). */
  accentStrong: string;
  cta: string;
  ctaText: string;
  text: string;
  muted: string;
  border: string;
  labBg: string;
  labSurface: string;
  labText: string;
  labMuted: string;
  labAccent: string;
  labGlow: string;
  success: string;
  warning: string;
  error: string;
}

export interface HeadlineLine {
  text: string;
  /** true ise italik serif ile vurgulanır. */
  emphasis?: boolean;
}

export interface CtaLink {
  label: string;
  /** 'appointment' → AI asistanı açar, 'section:<id>' → sayfa içi, 'tel' | 'whatsapp' | url */
  action: string;
}

export interface WorkingHours {
  /** ISO hafta günü: 1 = Pazartesi … 7 = Pazar */
  days: number[];
  open: string; // "09:00"
  close: string; // "19:00"
  /** Öğle arası gibi randevu verilmeyen aralıklar */
  breaks?: { start: string; end: string }[];
}

export interface ServiceStep {
  title: string;
  description: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ServiceConfig {
  id: string;
  enabled: boolean;
  title: string;
  shortTitle: string;
  /** Küçük üst etiket: "Protetik diş hekimliği" */
  discipline: string;
  /** Hastanın kendi cümlesiyle ihtiyacı — hizmet kartında başlığın üstünde görünür. */
  concern: string;
  summary: string;
  description: string[];
  highlights: string[];
  steps: ServiceStep[];
  /** Bilgilendirici süre metni. Kesin süre vaadi içermemeli. */
  duration: string;
  /** İlk randevu tipi — AI asistan bu randevuyu oluşturur. */
  appointmentType: string;
  /** İlk randevu süresi (dakika) */
  sessionMinutes: number;
  /**
   * Fiyat. Türkiye'de sağlık hizmetlerinde fiyat ilanı reklam yasağı kapsamındadır;
   * yalnızca features.showPrices = true ise ve hukuki onay alındıysa gösterilir.
   */
  price: { label: string; note?: string } | null;
  doctorIds: string[];
  icon: IconName;
  image: ImageAsset;
  /** AI asistanın niyet tanıması için anahtar kelimeler (küçük harf, Türkçe). */
  keywords: string[];
  faq: FaqItem[];
}

export interface DoctorConfig {
  id: string;
  enabled: boolean;
  name: string;
  title: string;
  /** Yalnızca belgelenmiş bilgiler. Uydurma diploma/ödül YOK. */
  education: string[];
  focus: string[];
  bio: string;
  image: ImageAsset;
  /** Hekimin çalıştığı günler (ISO). Boşsa klinik saatleri geçerli. */
  workingDays: number[];
}

export interface ClinicImage {
  id: string;
  caption: string;
  image: ImageAsset;
}

export interface ClinicFeature {
  icon: IconName;
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
  meta: string;
}

export type QuickActionId = 'book' | 'services' | 'doctors' | 'contact' | 'hours';

export interface ClinicConfig {
  /** URL-safe kimlik; build configuration adıyla aynı olmalı. */
  id: string;
  locale: 'tr-TR';

  clinic: {
    name: string;
    shortName: string;
    /** Logo yoksa kullanılan 1–2 harflik monogram */
    monogram: string;
    tagline: string;
    city: string;
    district: string;
    description: string;
    foundedYear: number | null;
  };

  branding: {
    /** Logo dosyası yoksa null → tipografik wordmark kullanılır. */
    logo: { src: string; alt: string; width: number; height: number } | null;
    /** Varsayılan paletin üzerine yazılacak renkler. */
    palette: Partial<BrandPalette>;
  };

  contact: {
    phone: string; // E.164: +905xxxxxxxxx
    phoneDisplay: string;
    whatsapp: string; // E.164 rakamları, + olmadan: 905xxxxxxxxx
    email: string;
    address: {
      street: string;
      district: string;
      city: string;
      postalCode: string;
      country: string;
    };
    mapsUrl: string;
    geo: { lat: number; lng: number } | null;
    workingHours: WorkingHours[];
  };

  social: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    x?: string;
  };

  hero: {
    eyebrow: string;
    title: HeadlineLine[];
    /** Başlık altında tek satırlık kısa ifade; boş string → gösterilmez. */
    tagline: string;
    primaryCta: CtaLink;
  };

  process: {
    eyebrow: string;
    steps: ProcessStep[];
  };

  servicesSection: {
    eyebrow: string;
    title: HeadlineLine[];
    intro: string;
  };

  services: ServiceConfig[];

  clinicSection: {
    eyebrow: string;
    title: HeadlineLine[];
    intro: string;
    features: ClinicFeature[];
    images: ClinicImage[];
  };

  doctorsSection: {
    eyebrow: string;
    title: HeadlineLine[];
    intro: string;
  };

  doctors: DoctorConfig[];

  assistantSection: {
    eyebrow: string;
    title: HeadlineLine[];
    intro: string;
    points: string[];
  };

  contactSection: {
    eyebrow: string;
    title: HeadlineLine[];
    intro: string;
  };

  seo: {
    /** Canonical/OG için kök URL, örn. "https://kutahyaakademi-demo.vercel.app". Boşsa canonical üretilmez. */
    siteUrl: string;
    title: string;
    titleTemplate: string; // "%s — Klinik Adı"
    description: string;
    keywords: string[];
    ogImage: string;
    themeColor: string;
    /** Demo linklerinin arama motorunda indekslenmemesi için true bırakın. */
    noindex: boolean;
  };

  appointment: {
    provider: 'mock' | 'http';
    endpoint: string;
    slotMinutes: number;
    daysAhead: number;
    /** Şu andan itibaren en erken kaç saat sonrası randevu verilir */
    leadHours: number;
    /** Resmî tatil vb. kapalı günler: "2026-10-29" */
    closedDates: string[];
    /** true → asistanda "demo takvim" uyarısı görünür */
    showDemoNotice: boolean;
  };

  aiAssistant: {
    enabled: boolean;
    name: string;
    provider: 'local' | 'http';
    endpoint: string;
    greeting: string;
    disclosure: string;
    quickActions: QuickActionId[];
  };

  features: {
    webgl: boolean;
    smoothScroll: boolean;
    /** Hukuki onay olmadan TRUE yapmayın (sağlık reklamı mevzuatı). */
    showPrices: boolean;
    stickyMobileCta: boolean;
    whatsappHandoff: boolean;
  };

  legal: {
    dataController: string;
    kvkkEmail: string;
    disclaimer: string;
    lastUpdated: string;
  };
}

/** Clinic dosyalarında yalnızca farklı olan alanları yazmak için. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (infer U)[]
    ? U[]
    : T[K] extends object | null
      ? DeepPartial<T[K]> | null
      : T[K];
};

export interface ClinicOverrides extends DeepPartial<Omit<ClinicConfig, 'services' | 'doctors'>> {
  id: string;
  /** Varsayılan hizmet kataloğundan seçim + alan bazlı override */
  services?: {
    include: string[];
    overrides?: Record<string, Partial<ServiceConfig>>;
    extra?: ServiceConfig[];
  };
  doctors?: DoctorConfig[];
}
