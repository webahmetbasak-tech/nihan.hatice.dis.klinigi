import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { ASSISTANT_ENGINE } from './core/ai/assistant.models';
import { HttpAssistantEngine } from './core/ai/http-assistant.engine';
import { LocalAssistantEngine } from './core/ai/local-assistant.engine';
import { APPOINTMENT_PROVIDER } from './core/appointment/appointment.models';
import { HttpAppointmentProvider } from './core/appointment/http-appointment.provider';
import { MockAppointmentProvider } from './core/appointment/mock-appointment.provider';
import { CLINIC_CONFIG } from './core/config/clinic-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }),
    ),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideHttpClient(withFetch()),

    // Config'e göre değiştirilebilir altyapı — UI katmanı bu seçimden habersizdir
    {
      provide: APPOINTMENT_PROVIDER,
      useFactory: () =>
        inject(CLINIC_CONFIG).appointment.provider === 'http' ? inject(HttpAppointmentProvider) : inject(MockAppointmentProvider),
    },
    {
      provide: ASSISTANT_ENGINE,
      useFactory: () =>
        inject(CLINIC_CONFIG).aiAssistant.provider === 'http' ? inject(HttpAssistantEngine) : inject(LocalAssistantEngine),
    },
  ],
};
