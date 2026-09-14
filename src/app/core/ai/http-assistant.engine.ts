import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, timeout } from 'rxjs';
import { ClinicConfigService } from '../config/clinic-config.service';
import { AssistantContext, AssistantEngine, Interpretation } from './assistant.models';
import { LocalAssistantEngine } from './local-assistant.engine';

/**
 * LLM tabanlı niyet motoru (opsiyonel).
 *
 * POST {aiAssistant.endpoint}
 *   body:  { message: string, context: AssistantContext }
 *   yanıt: Interpretation  (intent + varlıklar + opsiyonel reply)
 *
 * Sunucu tarafında önerilen sistem talimatı: docs/AI-ASSISTANT.md
 * Hata/zaman aşımında yerel motora düşer → demo asla kırılmaz.
 * API anahtarları ASLA frontend'e konmaz; endpoint bir sunucu fonksiyonu olmalıdır.
 */
@Injectable({ providedIn: 'root' })
export class HttpAssistantEngine implements AssistantEngine {
  private readonly http = inject(HttpClient);
  private readonly cfg = inject(ClinicConfigService);
  private readonly fallback = inject(LocalAssistantEngine);

  interpret(message: string, context: AssistantContext): Observable<Interpretation> {
    // KVKK veri minimizasyonu: ad ve telefon adımları LLM'e HİÇ gönderilmez, yerelde ayrıştırılır;
    // diğer adımlarda da taslaktaki kişisel alanlar maskelenir.
    if (context.step === 'name' || context.step === 'phone') {
      return this.fallback.interpret(message, context);
    }
    const safeContext: AssistantContext = { ...context, draft: { ...context.draft, name: '', phone: '' } };
    return this.http
      .post<Interpretation>(this.cfg.config().aiAssistant.endpoint, {
        message,
        context: safeContext,
        clinicId: this.cfg.config().id,
      })
      .pipe(
        timeout(8000),
        map((r) => ({ ...r, reply: sanitizeReply(r.reply) })),
        catchError(() => this.fallback.interpret(message, context)),
      );
  }
}

/** LLM yanıtında tanı/garanti dili varsa yanıtı düşürür; store güvenli şablon metni kullanır. */
function sanitizeReply(reply: string | undefined): string | undefined {
  if (!reply) return undefined;
  const risky = /(tanınız|teşhisiniz|hastalığınız var|kesin(likle)? (iyileş|geçer)|garanti|en iyi|ağrısız|tek seansta)/i;
  return risky.test(reply) ? undefined : reply.slice(0, 600);
}
