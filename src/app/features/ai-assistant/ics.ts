import { Appointment, fromDateKey } from '../../core/appointment/appointment.models';

/** Randevu talebini takvim dosyası (.ics) olarak indirir. */
export function downloadIcs(appt: Appointment, clinicName: string, address: string): void {
  const start = fromDateKey(appt.date);
  const [h, m] = appt.time.split(':').map(Number);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + appt.durationMinutes * 60_000);
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const esc = (s: string) => s.replace(/[,;\\]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dental Experience//TR',
    'BEGIN:VEVENT',
    `UID:${appt.id}`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(`${appt.appointmentType} — ${clinicName}`)}`,
    `DESCRIPTION:${esc(`Randevu talebi (${appt.reference}). Klinik tarafından teyit edilecektir.`)}`,
    `LOCATION:${esc(address)}`,
    'STATUS:TENTATIVE',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `randevu-${appt.reference}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const pad = (n: number) => String(n).padStart(2, '0');
