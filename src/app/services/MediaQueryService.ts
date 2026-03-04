import { DOCUMENT } from '@angular/common'
import { inject, Injectable, signal } from '@angular/core'

import { injectIsBrowser } from '@/shared/utils/platform'

@Injectable({ providedIn: 'root' })
export class MediaQueryService {
  private readonly document = inject(DOCUMENT)
  private readonly isBrowser = injectIsBrowser()

  private matches(query: string) {
    if (!this.isBrowser || !this.document.defaultView) {
      return this.matchesSSR(query)
    }

    const mediaQueryList = this.document.defaultView.matchMedia(query)
    const isMatch = signal<boolean>(mediaQueryList.matches)

    const listener = (event: MediaQueryListEvent): void => {
      isMatch.set(event.matches)
    }

    mediaQueryList.addEventListener('change', listener)

    return isMatch.asReadonly()
  }

  private matchesSSR(query: string) {
    // TODO: WIP
    return false
  }
}
