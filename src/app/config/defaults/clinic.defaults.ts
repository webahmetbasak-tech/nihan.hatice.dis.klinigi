import { ClinicConfig } from '../clinic.types';
import { DEFAULT_PALETTE } from './palette';

/**
 * Tüm kliniklerin miras aldığı taban config.
 * Metinlerde {name}, {shortName}, {city}, {assistant} değişkenleri kullanılabilir.
 * Klinik dosyaları yalnızca farklı olan alanları yazar (bkz. define-clinic.ts).
 */
export const CLINIC_DEFAULTS: Omit<ClinicConfig, 'id' | 'services' | 'doctors'> = {
  locale: 'tr-TR',

  clinic: {
    name: '[CLINIC_NAME]',
    shortName: '[CLINIC_SHORT_NAME]',
    monogram: 'D',
    tagline: 'Ağız ve Diş Sağlığı',
    city: '[CITY]',
    district: '[DISTRICT]',
    description:
      '{name}; muayene, dijital planlama ve tedavi süreçlerini anlaşılır bir bakım deneyiminde bir araya getirir.',
    foundedYear: null,
  },

  branding: {
    logo: null,
    palette: DEFAULT_PALETTE,
  },

  contact: {
    phone: '[PHONE]',
    phoneDisplay: '[PHONE]',
    whatsapp: '[WHATSAPP]',
    email: '[EMAIL]',
    address: {
      street: '[ADDRESS]',
      district: '[DISTRICT]',
      city: '[CITY]',
      postalCode: '',
      country: 'TR',
    },
    mapsUrl: '',
    geo: null,
    workingHours: [
      { days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00', breaks: [{ start: '12:30', end: '13:30' }] },
      { days: [6], open: '09:00', close: '14:00' },
    ],
  },

  social: {},

  hero: {
    eyebrow: '{city} · Ağız ve Diş Sağlığı',
    title: [{ text: 'Her gülüş,' }, { text: 'milimetrik', emphasis: true }, { text: 'bir karardır.' }],
    tagline: 'Kişiye özel. Hassas. Doğal.',
    primaryCta: { label: 'Randevu Al', action: 'appointment' },
  },

  process: {
    eyebrow: 'Tedavi Yolculuğu',
    steps: [
      {
        title: 'Sizi dinleriz',
        description:
          'Şikâyetinizi, beklentinizi ve varsa kaygılarınızı konuşuruz. Ağız içi muayene ile genel durumunuz değerlendirilir.',
        meta: 'İlk görüşme',
      },
      {
        title: 'Net bir plan sunarız',
        description:
          'Gerekirse dijital görüntüleme yapılır. Seçenekler, süreler ve alternatifler sade bir dille anlatılır; karar birlikte verilir.',
        meta: 'Sürpriz yok',
      },
      {
        title: 'Konforunuzu gözetiriz',
        description:
          'Onayladığınız plan randevulara bölünür. Her seanstan önce ne yapılacağı açıklanır ve uygulamalar size uygun şekilde planlanır.',
        meta: 'Adım adım',
      },
      {
        title: 'Gülüşünüzü birlikte koruruz',
        description: 'Kontrol randevuları ve evde bakım önerileriyle sonucun uzun süre korunması hedeflenir.',
        meta: 'Düzenli takip',
      },
    ],
  },

  servicesSection: {
    eyebrow: 'Hizmetlerimiz',
    title: [{ text: 'Size en uygun' }, { text: 'tedaviyi', emphasis: true }, { text: 'birlikte bulalım.' }],
    intro:
      'İhtiyacınıza en yakın başlığı seçin; ayrıntıları inceleyin ya da doğrudan randevu planlayın. Size uygun yöntem muayenenin ardından hekiminizle birlikte belirlenir.',
  },

  clinicSection: {
    eyebrow: 'Klinik',
    title: [{ text: 'Sakin bir ortam,' }, { text: 'özenli', emphasis: true }, { text: 'bir protokol.' }],
    intro: 'Kliniğin çalışma düzeni ve hasta deneyimine dair bilgiler.',
    features: [
      {
        icon: 'shield',
        title: 'Sterilizasyon',
        description:
          'Aletler her hastadan sonra temizlik, paketleme ve sterilizasyon adımlarından geçirilir; tek kullanımlık malzemeler hasta başında açılır.',
      },
      {
        icon: 'scan',
        title: 'Görüntüleme',
        description: 'İhtiyaç duyulan görüntüleme yöntemi hekim tarafından belirlenir; bulgular size ekran üzerinden anlatılır.',
      },
      {
        icon: 'chair',
        title: 'Konfor',
        description: 'Randevular, bekleme süresini kısa tutacak şekilde planlanır.',
      },
      {
        icon: 'calendar',
        title: 'Planlı takip',
        description: 'Tedavi sonrası kontrol tarihleri önceden planlanır ve size hatırlatılır.',
      },
    ],
    images: [
      {
        id: 'interior',
        caption: 'Muayene odası',
        image: {
          src: '/clinic/interior-01.webp',
          avif: '/clinic/interior-01.avif',
          alt: 'Aydınlık, sade tasarımlı muayene odası',
          width: 1600,
          height: 1000,
          code: 'CLN-INTERIOR-01',
        },
      },
      {
        id: 'sterilization',
        caption: 'Aletler ve sterilizasyon',
        image: {
          src: '/clinic/sterilization-01.webp',
          avif: '/clinic/sterilization-01.avif',
          alt: 'Beyaz yüzey üzerinde dental ayna ve sond',
          width: 1200,
          height: 1500,
          code: 'CLN-STERIL-01',
        },
      },
      {
        id: 'lounge',
        caption: 'Tedavi alanı',
        image: {
          src: '/clinic/lounge-01.webp',
          avif: '/clinic/lounge-01.avif',
          alt: 'Aydınlık, sade bir tedavi odası',
          width: 1200,
          height: 1500,
          code: 'CLN-LOUNGE-01',
        },
      },
    ],
  },

  doctorsSection: {
    eyebrow: 'Hekimlerimiz',
    title: [{ text: 'Tedavinizi' }, { text: 'birlikte', emphasis: true }, { text: 'planlayacağınız hekim.' }],
    intro: 'Hekim bilgileri kliniğin paylaştığı belgelere dayanır.',
  },

  assistantSection: {
    eyebrow: 'Dijital Asistan',
    title: [{ text: 'Randevunuzu' }, { text: 'konuşarak', emphasis: true }, { text: 'planlayın.' }],
    intro:
      'Hangi tedavi için gelmek istediğinizi yazın; asistan uygun ilk randevu tipini, günü ve saati birlikte seçmenize yardımcı olur. Tanı koymaz, değerlendirmeyi hekiminize bırakır.',
    points: [
      'Yazdığınız ihtiyaca göre ilk randevu tipini önerir',
      'Uygun gün ve saatleri takvim üzerinde gösterir',
      'Randevu özetini onayınıza sunar',
      'Bilgileriniz yalnızca randevu talebi için kullanılır',
    ],
  },

  contactSection: {
    eyebrow: 'İletişim',
    title: [{ text: 'Bir sonraki adım,' }, { text: 'bir muayene.', emphasis: true }],
    intro: 'Sorularınız için arayabilir, WhatsApp üzerinden yazabilir ya da asistanla randevu planlayabilirsiniz.',
  },

  seo: {
    siteUrl: '',
    title: '{shortName} — {city} Ağız ve Diş Sağlığı',
    titleTemplate: '%s — {shortName}',
    description:
      '{name}, {city}. İmplant, gülüş tasarımı, kanal tedavisi, diş beyazlatma, şeffaf plak, zirkonyum & lamina ve pedodonti hakkında bilgi ve online randevu talebi.',
    keywords: ['diş hekimi', 'diş kliniği', 'implant', 'gülüş tasarımı', 'kanal tedavisi', 'şeffaf plak', 'zirkonyum', 'pedodonti'],
    ogImage: '/clinic/og.jpg',
    themeColor: '#F3EFE8',
    noindex: true,
  },

  appointment: {
    provider: 'mock',
    endpoint: '',
    slotMinutes: 30,
    daysAhead: 21,
    leadHours: 3,
    closedDates: ['2026-10-29', '2027-01-01'],
    showDemoNotice: true,
  },

  aiAssistant: {
    enabled: true,
    name: 'Mine',
    provider: 'local',
    endpoint: '',
    greeting:
      'Merhaba, ben {assistant}. {shortName} için size uygun randevuyu birlikte planlayabiliriz. Hangi konuda destek almak istersiniz?',
    disclosure:
      'Yapay zekâ destekli bir dijital asistanım. Tıbbi tanı veya tedavi önerisi vermem; paylaştığınız bilgiler yalnızca randevu talebiniz için kullanılır.',
    quickActions: ['book', 'services', 'doctors', 'contact'],
  },

  features: {
    webgl: true,
    smoothScroll: true,
    showPrices: false,
    stickyMobileCta: true,
    whatsappHandoff: true,
  },

  legal: {
    dataController: '{name}',
    kvkkEmail: '[KVKK_EMAIL]',
    disclaimer:
      'Bu sitedeki içerikler genel bilgilendirme amaçlıdır; tanı ve tedavi yerine geçmez. Size uygun tedavi, hekim muayenesinin ardından belirlenir.',
    lastUpdated: '2026-09-14',
  },
};
