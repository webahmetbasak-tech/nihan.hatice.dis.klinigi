import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { QuickActionId } from '../../config/clinic.types';
import { Appointment, DateKey } from '../appointment/appointment.models';

export type AssistantStep = 'idle' | 'service' | 'doctor' | 'date' | 'time' | 'name' | 'phone' | 'consent' | 'summary' | 'done';

export type Intent =
  | 'book'
  | 'service'
  | 'services-list'
  | 'doctors'
  | 'contact'
  | 'hours'
  | 'price'
  | 'symptom'
  | 'emergency'
  | 'greeting'
  | 'thanks'
  | 'restart'
  | 'date'
  | 'time'
  | 'name'
  | 'phone'
  | 'yes'
  | 'no'
  | 'unknown';

export interface AssistantDraft {
  serviceId: string | null; // null + generalVisit → genel muayene
  generalVisit: boolean;
  doctorId: string | null;
  date: DateKey | null;
  time: string | null;
  name: string;
  phone: string;
  consentKvkk: boolean;
  consentContact: boolean;
}

export interface AssistantContext {
  step: AssistantStep;
  draft: AssistantDraft;
  services: { id: string; title: string; keywords: string[] }[];
  doctors: { id: string; name: string }[];
  clinicName: string;
}

/** Motorun çıktısı: tek bir niyet + çıkarılan varlıklar. */
export interface Interpretation {
  intent: Intent;
  serviceId?: string;
  date?: DateKey;
  time?: string;
  partOfDay?: 'morning' | 'afternoon' | 'evening';
  name?: string;
  phone?: string;
  /** LLM tabanlı motor serbest metin cevap üretebilir (güvenlik filtresinden geçirilir). */
  reply?: string;
}

/**
 * Niyet motoru soyutlaması.
 * - LocalAssistantEngine: tarayıcıda çalışan Türkçe kural tabanlı NLU (demo, sıfır maliyet, sıfır veri aktarımı)
 * - HttpAssistantEngine: config.aiAssistant.endpoint'teki LLM servisine bağlanır
 */
export interface AssistantEngine {
  interpret(message: string, context: AssistantContext): Observable<Interpretation>;
}

export const ASSISTANT_ENGINE = new InjectionToken<AssistantEngine>('ASSISTANT_ENGINE');

export type Widget =
  | { kind: 'quick-actions'; actions: QuickActionId[] }
  | { kind: 'services' }
  | { kind: 'service-card'; serviceId: string }
  | { kind: 'doctors' }
  | { kind: 'calendar' }
  | { kind: 'slots' }
  | { kind: 'consent' }
  | { kind: 'summary' }
  | { kind: 'confirmed'; appointment: Appointment }
  | { kind: 'contact' }
  | { kind: 'hours' }
  | { kind: 'emergency' };

export interface ChatMessage {
  id: number;
  from: 'assistant' | 'user';
  text?: string;
  widget?: Widget;
  tone?: 'default' | 'notice' | 'safety';
}
