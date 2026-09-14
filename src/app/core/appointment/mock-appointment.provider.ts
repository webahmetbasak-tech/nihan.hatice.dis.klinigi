import { Injectable, inject } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { ClinicConfigService } from '../config/clinic-config.service';
import {
  Appointment,
  AppointmentProvider,
  AppointmentRequest,
  AvailabilityQuery,
  AvailableDay,
  DateKey,
  TimeSlot,
  fromDateKey,
  fromMinutes,
  isoWeekday,
  toDateKey,
  toMinutes,
} from './appointment.models';

/**
 * DEMO randevu kaynağı.
 * Klinik çalışma saatlerinden (config) slot üretir; doluluk deterministik bir hash ile
 * simüle edilir → aynı gün her açılışta aynı görünür, takvim gerçekçi durur.
 * Veri SAKLANMAZ; hiçbir sunucuya gönderilmez.
 */
@Injectable({ providedIn: 'root' })
export class MockAppointmentProvider implements AppointmentProvider {
  private readonly cfg = inject(ClinicConfigService);
  private readonly booked = new Set<string>();

  getAvailableDates(query: AvailabilityQuery): Observable<AvailableDay[]> {
    const { daysAhead } = this.cfg.config().appointment;
    const today = new Date();
    const days: AvailableDay[] = [];
    for (let i = 0; i < daysAhead; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const key = toDateKey(d);
      const slots = this.buildSlots(key, query);
      const left = slots.filter((s) => s.available).length;
      days.push({ date: key, weekday: isoWeekday(d), available: left > 0, slotsLeft: left });
    }
    return of(days).pipe(delay(420));
  }

  getAvailableSlots(date: DateKey, query: AvailabilityQuery): Observable<TimeSlot[]> {
    return of(this.buildSlots(date, query)).pipe(delay(360));
  }

  createAppointment(request: AppointmentRequest): Observable<Appointment> {
    this.booked.add(`${request.date}|${request.time}|${request.doctorId ?? '*'}`);
    const id = crypto.randomUUID?.() ?? String(Date.now());
    const reference = `RND-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    return of<Appointment>({
      ...request,
      id,
      reference,
      status: 'requested',
      createdAt: new Date().toISOString(),
    }).pipe(delay(900));
  }

  private buildSlots(date: DateKey, query: AvailabilityQuery): TimeSlot[] {
    const c = this.cfg.config();
    const d = fromDateKey(date);
    const weekday = isoWeekday(d);
    if (c.appointment.closedDates.includes(date)) return [];

    const doctor = c.doctors.find((x) => x.id === query.doctorId);
    if (doctor?.workingDays.length && !doctor.workingDays.includes(weekday)) return [];

    const hours = c.contact.workingHours.filter((h) => h.days.includes(weekday));
    const step = c.appointment.slotMinutes;
    const duration = Math.max(query.durationMinutes, step);
    const now = new Date();
    const earliest = now.getTime() + c.appointment.leadHours * 3_600_000;

    const slots: TimeSlot[] = [];
    for (const h of hours) {
      const open = toMinutes(h.open);
      const close = toMinutes(h.close);
      for (let m = open; m + duration <= close; m += step) {
        const inBreak = h.breaks?.some((b) => m < toMinutes(b.end) && m + duration > toMinutes(b.start));
        if (inBreak) continue;
        const time = fromMinutes(m);
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), Math.floor(m / 60), m % 60);
        const past = start.getTime() < earliest;
        const busy = hash(`${c.id}|${date}|${time}|${query.doctorId ?? ''}`) % 100 < 38;
        const taken = this.booked.has(`${date}|${time}|${query.doctorId ?? '*'}`);
        slots.push({
          time,
          available: !past && !busy && !taken,
          period: m < 12 * 60 ? 'morning' : m < 17 * 60 ? 'afternoon' : 'evening',
        });
      }
    }
    return slots;
  }
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
