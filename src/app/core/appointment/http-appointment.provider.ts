import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClinicConfigService } from '../config/clinic-config.service';
import {
  Appointment,
  AppointmentProvider,
  AppointmentRequest,
  AvailabilityQuery,
  AvailableDay,
  DateKey,
  TimeSlot,
} from './appointment.models';

/**
 * Üretim randevu kaynağı — REST sözleşmesi:
 *
 *   GET  {endpoint}/availability?serviceId&doctorId&duration   → AvailableDay[]
 *   GET  {endpoint}/slots?date=YYYY-MM-DD&serviceId&doctorId&duration → TimeSlot[]
 *   POST {endpoint}/appointments   body: AppointmentRequest    → Appointment
 *
 * Backend; KVKK gereği veriyi yurt içinde/sözleşmeli işleyicide saklamalı,
 * HTTPS zorunlu olmalı ve açık rıza zaman damgasını kaydetmelidir.
 */
@Injectable({ providedIn: 'root' })
export class HttpAppointmentProvider implements AppointmentProvider {
  private readonly http = inject(HttpClient);
  private readonly cfg = inject(ClinicConfigService);

  private get base(): string {
    return this.cfg.config().appointment.endpoint.replace(/\/$/, '');
  }

  private params(query: AvailabilityQuery, extra: Record<string, string> = {}): HttpParams {
    let p = new HttpParams({ fromObject: extra }).set('duration', query.durationMinutes);
    if (query.serviceId) p = p.set('serviceId', query.serviceId);
    if (query.doctorId) p = p.set('doctorId', query.doctorId);
    return p;
  }

  getAvailableDates(query: AvailabilityQuery): Observable<AvailableDay[]> {
    return this.http.get<AvailableDay[]>(`${this.base}/availability`, { params: this.params(query) });
  }

  getAvailableSlots(date: DateKey, query: AvailabilityQuery): Observable<TimeSlot[]> {
    return this.http.get<TimeSlot[]>(`${this.base}/slots`, { params: this.params(query, { date }) });
  }

  createAppointment(request: AppointmentRequest): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.base}/appointments`, request);
  }
}
