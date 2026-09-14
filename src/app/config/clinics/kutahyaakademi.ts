import { defineClinic } from '../define-clinic';

/**
 * Özel Kütahya Akademi Ağız ve Diş Sağlığı Polikliniği — DEMO
 *
 * Kaynak: herkese açık profiller (Instagram @kutahyaakademidis, arama sonuçları).
 * ⚠ DOĞRULA işaretli alanları sunumdan önce klinikle teyit edin.
 */
export default defineClinic({
  id: 'kutahyaakademi',

  clinic: {
    name: 'Özel Kütahya Akademi Ağız ve Diş Sağlığı Polikliniği',
    shortName: 'Kütahya Akademi',
    monogram: 'KA',
    tagline: 'Ağız ve Diş Sağlığı Polikliniği',
    city: 'Kütahya',
    district: '[DISTRICT]',
    foundedYear: 2023, // ⚠ DOĞRULA
  },

  contact: {
    phone: '+905309930043', // ⚠ DOĞRULA
    phoneDisplay: '0530 993 00 43',
    whatsapp: '905309930043', // ⚠ DOĞRULA — WhatsApp hattı aynı numara mı?
    email: '[info@kutahyaakademidis.com]',
    address: {
      street: '[ADDRESS]',
      district: '[DISTRICT]',
      city: 'Kütahya',
      postalCode: '',
      country: 'TR',
    },
    mapsUrl: '',
    workingHours: [
      // ⚠ DOĞRULA — herkese açık kaynakta 09:00–21:00 görünüyor; günler teyit edilmeli
      { days: [1, 2, 3, 4, 5, 6], open: '09:00', close: '21:00', breaks: [{ start: '13:00', end: '14:00' }] },
    ],
  },

  social: {
    instagram: 'https://www.instagram.com/kutahyaakademidis/',
  },

  seo: {
    siteUrl: '', // örn. https://kutahyaakademi-demo.vercel.app
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
      focus: ['[Odak Alanı]'],
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
