import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

/** "YYYY-MM-DD" (klinik yerel saati) */
export type DateKey = string;

export interface AvailabilityQuery {
  serviceId: string | null;
  doctorId: string | null;
  durationMinutes: number;
}

export interface AvailableDay {
  date: DateKey;
  /** ISO hafta günü 1–7 */
  weekday: number;
  available: boolean;
  /** Kalan uygun slot sayısı (UI'da yoğunluk göstergesi) */
  slotsLeft: number;
}

export interface TimeSlot {
  time: string; // "10:30"
  available: boolean;
  period: 'morning' | 'afternoon' | 'evening';
}

export interface AppointmentRequest {
  serviceId: string | null;
  serviceTitle: string;
  appointmentType: string;
  doctorId: string | null;
  doctorName: string | null;
  date: DateKey;
  time: string;
  durationMinutes: number;
  patient: { name: string; phone: string };
  consent: { kvkk: true; contactPermission: boolean; timestamp: string };
  channel: 'ai-assistant';
}

export interface Appointment extends AppointmentRequest {
  id: string;
  reference: string;
  status: 'requested' | 'confirmed';
  createdAt: string;
}

/**
 * Randevu kaynağı soyutlaması.
 * Demo: MockAppointmentProvider · Üretim: HttpAppointmentProvider (veya klinik yazılımı adaptörü).
 * config.appointment.provider ile seçilir; UI ve AI katmanı değişmez.
 */
export interface AppointmentProvider {
  getAvailableDates(query: AvailabilityQuery): Observable<AvailableDay[]>;
  getAvailableSlots(date: DateKey, query: AvailabilityQuery): Observable<TimeSlot[]>;
  createAppointment(request: AppointmentRequest): Observable<Appointment>;
}

export const APPOINTMENT_PROVIDER = new InjectionToken<AppointmentProvider>('APPOINTMENT_PROVIDER');

export const toDateKey = (d: Date): DateKey =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const fromDateKey = (key: DateKey): Date => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const isoWeekday = (d: Date): number => ((d.getDay() + 6) % 7) + 1;

export const toMinutes = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const fromMinutes = (min: number): string =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
