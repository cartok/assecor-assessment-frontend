import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import type { ApplicationConfig } from '@angular/core'
import { LOCALE_ID, provideZonelessChangeDetection } from '@angular/core'
import { provideRouter, withInMemoryScrolling } from '@angular/router'

import { httpRetryInterceptor } from '@/app/api/swapi/shared/http/http-retry.interceptor'
import { routes } from '@/app/app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US' },
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),
    provideHttpClient(withFetch(), withInterceptors([httpRetryInterceptor])),
  ],
}
