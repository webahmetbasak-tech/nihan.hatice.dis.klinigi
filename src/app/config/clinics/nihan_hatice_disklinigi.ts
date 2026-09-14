import { defineClinic } from '../define-clinic';

/**
 * Nihan Hatice Diş Kliniği — DEMO
 *
 * ⚠ Bu dosyadaki köşeli parantezli değerler ([PHONE] gibi) yer tutucudur; gerçek bilgilerle değiştirin.
 *   Yer tutucular sitede tıklanabilir link üretmez ve SEO verisine yazılmaz.
 *   Gerçek bir değer yazarken köşeli parantezleri KALDIRIN (örn. 'info@klinik.com', '[info@klinik.com]' değil).
 *
 * Görseller: public/clinics/nihan_hatice_disklinigi/ (interior-01, sterilization-01, lounge-01, doctor-hekim-1, og)
 * Build:     npm run build:nihan_hatice_disklinigi   ·   Vercel env: CLINIC=nihan_hatice_disklinigi
 */
export default defineClinic({
  id: 'nihan_hatice_disklinigi',

  clinic: {
    name: 'Nihan Hatice Diş Kliniği', // ⚠ DOĞRULA — resmî unvan
    shortName: 'Nihan Hatice',
    monogram: 'NH',
    tagline: 'Diş Kliniği',
    city: 'KÜTAHYA',
    district: '[DISTRICT]',
    foundedYear: null,
  },

  // İsteğe bağlı: klinik renkleri. Boş bırakılırsa varsayılan "Porcelain & Light" paleti kullanılır.
  branding: {
    palette: {},
  },

  contact: {
    phone: '05351031143', // örn. '+905xxxxxxxxx'
    phoneDisplay: '05351031143', // örn. '05xx xxx xx xx'
    whatsapp: '905351031143', // örn. '905xxxxxxxxx' (+ olmadan)
    email: '[EMAIL]',
    address: {
      street: '[ADDRESS]',
      district: '[DISTRICT]',
      city: 'KÜTAHYA',
      postalCode: '',
      country: 'TR',
    },
    mapsUrl: '', // Google Maps paylaşım linki (boşsa adresten otomatik üretilir)
    workingHours: [
      // ⚠ DOĞRULA — varsayılan örnek saatler
      { days: [1, 2, 3, 4, 5], open: '09:00', close: '18:00', breaks: [{ start: '12:30', end: '13:30' }] },
      { days: [6], open: '09:00', close: '14:00' },
    ],
  },

  social: {
    // instagram: 'https://www.instagram.com/.../',
  },

  seo: {
    siteUrl: '', // Vercel adresi, örn. https://nihan-hatice-disklinigi.vercel.app
  },

  services: {
    include: ['smile-design', 'implant', 'endodontics', 'whitening', 'orthodontics', 'zirconium-laminate', 'pedodontics'],
  },

  doctors: [
    {
      id: 'hekim-1',
      enabled: true,
      name: '[Doktor Adı Soyadı]',
      title: 'Diş Hekimi',
      education: ['[Eğitim Bilgisi]'],
      focus: ['[Odak Alanı'],
      bio: '[Biyografi] — Hekim biyografisi yalnızca klinikten alınan, belgelenmiş bilgilerle doldurulmalıdır.',
      image: {
        src: '/clinic/doctor-hekim-1.webp',
        alt: 'Hekim portresi',
        width: 1000,
        height: 1250,
        code: 'DOC-PORTRAIT-REAL',
      },
      workingDays: [],
    },
  ],
});
