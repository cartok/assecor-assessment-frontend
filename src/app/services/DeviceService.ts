import { PlatformLocation } from '@angular/common'
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router } from '@angular/router'
import type { WidthBreakpoint } from 'breakpoints'
import { BREAKPOINTS } from 'breakpoints'
import { distinctUntilChanged, filter, map } from 'rxjs'

import {
  DEFAULT_DEVICE_FORMAT,
  type DeviceContext,
  urlPathToDeviceContext,
} from '@/shared/device/context'

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly destroyRef = inject(DestroyRef)
  private readonly platformLocation = inject(PlatformLocation)
  private readonly router = inject(Router)
  private initialized = false

  private readonly format = signal<DeviceContext['format']>(DEFAULT_DEVICE_FORMAT)

  // TODO: width und height updates
  // TODO: DeviceContext width und height mit BREAKPOINTS kombinieren
  private readonly width = signal<DeviceContext['width']>(undefined)
  private readonly height = signal<DeviceContext['height']>(undefined)

  readonly isMobile = computed(() => this.format() === 'mobile')
  readonly isTablet = computed(() => this.format() === 'tablet')
  readonly isDesktop = computed(() => this.format() === 'desktop')

  // WIP
  readonly isWidth601 = computed(() => {
    const width = this.width()
    // TODO: Media Query API verwenden?
    return width !== undefined && width <= 601 && width >= 430
  })

  constructor() {
    this.init()
  }

  init(): void {
    if (this.initialized) {
      return
    }
    this.initialized = true
    this.subscribeToRouterNavigation()
  }

  private subscribeToRouterNavigation(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map((event) => event.urlAfterRedirects),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((urlPath) => {
        const deviceContext = urlPathToDeviceContext(urlPath)
        console.log('device service', { deviceContext })
        if (!deviceContext) {
          return
        }

        this.format.set(deviceContext.format)
        this.width.set(deviceContext.width)
        this.height.set(deviceContext.height)
      })
  }
}
