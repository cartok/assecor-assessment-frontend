import type { Signal } from '@angular/core'
import { inject, Injectable, signal } from '@angular/core'

import { MediaQueryService } from '@/app/services/MediaQueryService'
import { injectIsBrowser } from '@/app/shared/utils/platform'

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly mediaQueryService = inject(MediaQueryService)
  private readonly isBrowser = injectIsBrowser()

  readonly touch: Signal<boolean | undefined> = signal(undefined)
  readonly device: Signal<string | undefined> = signal(undefined)
  readonly width: Signal<number | undefined> = signal(undefined)
  readonly height: Signal<number | undefined> = signal(undefined)
}
