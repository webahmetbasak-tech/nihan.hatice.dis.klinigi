import { defineClinic } from '../define-clinic';

/**
 * Dt. Nazlı Yoluç — DEMO
 *
 * Kaynak: dtnazliyoluc.com ve herkese açık sosyal medya profilleri.
 * ⚠ DOĞRULA işaretli alanları sunumdan önce klinikle teyit edin.
 */
export default defineClinic({
  id: 'dtnazliyoluc',

  clinic: {
    name: 'Dt. Nazlı Yoluç Diş Kliniği', // ⚠ DOĞRULA — resmî unvan
    shortName: 'Dt. Nazlı Yoluç',
    monogram: 'NY',
    tagline: 'Gülümsemek bir sanattır',
    city: 'Kütahya',
    district: 'Servi Mahallesi', // ⚠ DOĞRULA
  },

  branding: {
    palette: {
      primary: '#35291F', // espresso
      accent: '#B58D63', // warm bronze
      accentStrong: '#7D5C3B',
      labAccent: '#DDBD95',
    },
  },

  contact: {
    phone: '+905462262991', // ⚠ DOĞRULA
    phoneDisplay: '0546 226 29 91',
    whatsapp: '905462262991', // ⚠ DOĞRULA
    email: 'dtnazliyoluc@gmail.com', // ⚠ DOĞRULA
    address: {
      street: 'Atatürk Bulvarı, Özer Apt.', // ⚠ DOĞRULA — kapı numarası eksik
      district: 'Servi Mah.',
      city: 'Kütahya',
      postalCode: '',
      country: 'TR',
    },
    mapsUrl: '',
  },

  social: {
    instagram: 'https://www.instagram.com/dtnazliyoluc/',
    youtube: 'https://www.youtube.com/@dtnazliyoluc',
    x: 'https://x.com/dtnazliyoluc',
  },

  hero: {
    eyebrow: '{city} · Gülümsemek bir sanattır',
    title: [{ text: 'Gülüşünüz,' }, { text: 'ışıkla', emphasis: true }, { text: 'şekillenir.' }],
  },

  seo: {
    siteUrl: '',
  },

  services: {
    include: ['smile-design', 'whitening', 'zirconium-laminate', 'implant', 'endodontics', 'orthodontics', 'pedodontics'],
  },

  doctors: [
    {
      id: 'nazli-yoluc',
      enabled: true,
      name: 'Dt. Nazlı Yoluç',
      title: 'Diş Hekimi',
      education: ['[EDUCATION]'],
      focus: ['[FOCUS_AREA]'],
      bio: '[DOCTOR_BIO] — Yalnızca hekimin onayladığı, belgelenmiş bilgiler eklenmelidir.',
      image: {
        src: '/clinic/doctor-nazli-yoluc.webp',
        alt: 'Dt. Nazlı Yoluç portresi',
        width: 1000,
        height: 1250,
        code: 'DOC-PORTRAIT-REAL',
      },
      workingDays: [],
    },
  ],
});
