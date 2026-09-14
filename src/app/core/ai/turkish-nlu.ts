import { DateKey, isoWeekday, toDateKey } from '../appointment/appointment.models';

/** Türkçe küçük harfe çevirir ve karşılaştırma için aksanları sadeleştirir (ı→i, ş→s …). */
export function normalize(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/[ıİ]/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^\p{L}\p{N}:.\s/+-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const includesAny = (haystack: string, needles: string[]): boolean =>
  needles.some((n) => haystack.includes(normalize(n)));

const WEEKDAYS: [string, number][] = [
  ['pazartesi', 1],
  ['sali', 2],
  ['carsamba', 3],
  ['persembe', 4],
  ['cuma', 5],
  ['cumartesi', 6],
  ['pazar', 7],
];

const MONTHS = ['ocak', 'subat', 'mart', 'nisan', 'mayis', 'haziran', 'temmuz', 'agustos', 'eylul', 'ekim', 'kasim', 'aralik'];

/** "yarın", "cuma", "15 ekim", "15.10" gibi ifadelerden tarih çıkarır. */
export function parseDate(input: string, now = new Date()): DateKey | undefined {
  const t = normalize(input);
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const add = (n: number) => toDateKey(new Date(base.getFullYear(), base.getMonth(), base.getDate() + n));

  if (/\bbugun\b/.test(t)) return add(0);
  if (/\b(obur gun|ertesi gun)\b/.test(t)) return add(2);
  if (/\byarin\b/.test(t)) return add(1);

  // 15 ekim
  const named = t.match(/\b(\d{1,2})\s+(ocak|subat|mart|nisan|mayis|haziran|temmuz|agustos|eylul|ekim|kasim|aralik)\b/);
  if (named) return futureDate(base, Number(named[1]), MONTHS.indexOf(named[2]));

  // 15.10 veya 15/10
  const numeric = t.match(/\b(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?\b/);
  if (numeric && Number(numeric[2]) <= 12) return futureDate(base, Number(numeric[1]), Number(numeric[2]) - 1);

  // gün adı ("cumartesi" "cuma"dan önce eşleşmeli)
  const words = t.split(' ');
  const sorted = [...WEEKDAYS].sort((a, b) => b[0].length - a[0].length);
  for (const [name, wd] of sorted) {
    if (words.some((w) => w.startsWith(name))) {
      const nextWeek = /\b(haftaya|gelecek hafta|onumuzdeki)\b/.test(t) ? 7 : 0;
      let diff = (wd - isoWeekday(base) + 7) % 7;
      if (diff === 0 && !/\bbugun\b/.test(t)) diff = 7;
      return add(diff + nextWeek);
    }
  }
  return undefined;
}

function futureDate(base: Date, day: number, month: number): DateKey | undefined {
  if (day < 1 || day > 31 || month < 0) return undefined;
  let d = new Date(base.getFullYear(), month, day);
  if (d < base) d = new Date(base.getFullYear() + 1, month, day);
  return toDateKey(d);
}

/** "10:30", "saat 14", "14.00" → "HH:mm"; "sabah", "öğleden sonra" → gün dilimi */
export function parseTime(input: string): { time?: string; partOfDay?: 'morning' | 'afternoon' | 'evening' } {
  const t = normalize(input);
  const hm = t.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/);
  if (hm) return { time: `${hm[1].padStart(2, '0')}:${hm[2]}` };
  const h = t.match(/\bsaat\s+([01]?\d|2[0-3])\b/);
  if (h) return { time: `${h[1].padStart(2, '0')}:00` };
  if (/\b(ogleden sonra|ogle)\b/.test(t)) return { partOfDay: 'afternoon' };
  if (/\b(sabah|erken)\b/.test(t)) return { partOfDay: 'morning' };
  if (/\b(aksam|is cikisi|mesai sonrasi)\b/.test(t)) return { partOfDay: 'evening' };
  return {};
}

/** TR telefon: 05xx xxx xx xx, 5xx…, +90 5xx… , sabit hat 0xxx… → E.164 */
export function parsePhone(input: string): string | undefined {
  const digits = input.replace(/\D/g, '');
  let national = digits;
  if (national.startsWith('90') && national.length === 12) national = national.slice(2);
  if (national.startsWith('0') && national.length === 11) national = national.slice(1);
  if (national.length !== 10 || !/^[2-5]/.test(national)) return undefined;
  return `+90${national}`;
}

export const formatPhone = (e164: string): string => {
  const n = e164.replace(/^\+90/, '');
  return n.length === 10 ? `0${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6, 8)} ${n.slice(8)}` : e164;
};

/** Ad-soyad: harf içeren, rakamsız, 2–60 karakter; "adım …", "ben …" önekleri temizlenir. */
export function parseName(input: string): string | undefined {
  const cleaned = input
    .replace(/^\s*(benim\s+)?(ad[ıi]m|ismim|ad[ıi]\s*soyad[ıi]m|ben)(\s*[:,-]\s*|\s+)/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (cleaned.length < 2 || cleaned.length > 60 || /\d/.test(cleaned) || !/\p{L}{2,}/u.test(cleaned)) return undefined;
  return cleaned
    .split(' ')
    .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
    .join(' ');
}
