import { defineClinic } from '../define-clinic';

/**
 * Dt. Kadriye Özkul Muayenehanesi — DEMO
 *
 * Kaynak: herkese açık rehber profilleri (doktortakvimi, doktorsitesi, facebook).
 * Kaynaklar arasında ADRES ÇELİŞKİLİ olduğu için adres placeholder bırakıldı.
 * ⚠ DOĞRULA işaretli alanları sunumdan önce klinikle teyit edin.
 */
export default defineClinic({
  id: 'kadriye-ozkul',

  clinic: {
    name: 'Dt. Kadriye Özkul Muayenehanesi',
    shortName: 'Dt. Kadriye Özkul',
    monogram: 'KÖ',
    tagline: 'Diş Hekimi Muayenehanesi',
    city: 'Kütahya',
    district: '[DISTRICT]',
  },

  branding: {
    palette: {
      primary: '#2F2B38', // aubergine graphite
      accent: '#A7837A', // rose clay
      accentStrong: '#7A554B',
      labAccent: '#D9B3A8',
    },
  },

  contact: {
    phone: '[PHONE]',
    phoneDisplay: '[PHONE]',
    whatsapp: '[WHATSAPP]',
    email: '[EMAIL]',
    address: {
      street: '[ADDRESS]', // ⚠ Kaynaklarda iki farklı adres var — klinikten alın
      district: '[DISTRICT]',
      city: 'Kütahya',
      postalCode: '',
      country: 'TR',
    },
    mapsUrl: '',
  },

  social: {
    facebook: 'https://www.facebook.com/DisHekimiKadriyeOzkul/', // ⚠ DOĞRULA
  },

  hero: {
    title: [{ text: 'Sağlıklı bir gülüş,' }, { text: 'sakin', emphasis: true }, { text: 'bir süreçle başlar.' }],
  },

  seo: {
    siteUrl: '',
  },

  services: {
    include: ['implant', 'smile-design', 'endodontics', 'whitening', 'orthodontics', 'zirconium-laminate', 'pedodontics'],
  },

  doctors: [
    {
      id: 'kadriye-ozkul',
      enabled: true,
      name: 'Dt. Kadriye Özkul',
      title: 'Diş Hekimi',
      education: ['[EDUCATION]'],
      focus: ['[FOCUS_AREA]'],
      bio: '[DOCTOR_BIO] — Yalnızca hekimin onayladığı, belgelenmiş bilgiler eklenmelidir.',
      image: {
        src: '/clinic/doctor-kadriye-ozkul.webp',
        alt: 'Dt. Kadriye Özkul portresi',
        width: 1000,
        height: 1250,
        code: 'DOC-PORTRAIT-REAL',
      },
      workingDays: [],
    },
  ],
});
