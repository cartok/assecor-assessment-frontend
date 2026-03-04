import { isPlatformBrowser } from '@angular/common'
import { inject, PLATFORM_ID } from '@angular/core'

export function injectIsBrowser(): boolean {
  return isPlatformBrowser(inject(PLATFORM_ID))
}
