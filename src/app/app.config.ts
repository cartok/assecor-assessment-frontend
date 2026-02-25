import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http'
import type { ApplicationConfig } from '@angular/core'
import { provideZonelessChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'

import { httpRetryInterceptor } from '@/api/swapi/shared/http/http-retry.interceptor'
import { routes } from '@/app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([httpRetryInterceptor])),
  ],
}
