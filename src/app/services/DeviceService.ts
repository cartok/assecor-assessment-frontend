import { inject, Injectable, REQUEST_CONTEXT, signal, TransferState } from '@angular/core'

import {
  DEFAULT_DEVICE_RENDER_CONTEXT,
  type DeviceRenderContext,
  RENDER_CONTEXT,
  type RequestContext,
} from '@/app/shared/render/context'
import { injectIsBrowser, injectIsServer } from '@/app/shared/utils/platform'

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly isBrowser = injectIsBrowser()
  private readonly isServer = injectIsServer()
  private readonly renderContext = inject<RequestContext>(REQUEST_CONTEXT, {
    optional: true,
  })
  private readonly transferState = inject(TransferState)

  private readonly format = signal<DeviceRenderContext['format']>(
    DEFAULT_DEVICE_RENDER_CONTEXT.format,
  )
  private readonly width = signal<DeviceRenderContext['width']>(undefined)
  private readonly height = signal<DeviceRenderContext['height']>(undefined)
  private readonly touch = signal<DeviceRenderContext['touch']>(undefined)
  private readonly hover = signal<DeviceRenderContext['hover']>(undefined)

  constructor() {
    const deviceContext = this.getInitialDeviceContext()
    this.applyDeviceContext(deviceContext)
    console.log('APP:', { deviceContext }, { ssr: this.isServer })
  }

  updateDeviceContext(context: Partial<DeviceRenderContext>): void {
    this.applyDeviceContext(context)
  }

  private getInitialDeviceContext(): DeviceRenderContext {
    if (this.isServer && this.renderContext) {
      this.transferState.set(RENDER_CONTEXT, this.renderContext)
      return this.renderContext.device
    }

    if (this.isBrowser && this.transferState.hasKey(RENDER_CONTEXT)) {
      const transferredContext = this.transferState.get(RENDER_CONTEXT, {
        device: DEFAULT_DEVICE_RENDER_CONTEXT,
      })
      this.transferState.remove(RENDER_CONTEXT)
      return transferredContext.device
    }

    return DEFAULT_DEVICE_RENDER_CONTEXT
  }

  private applyDeviceContext(context: Partial<DeviceRenderContext>): void {
    if (context.format !== undefined) {
      this.format.set(context.format)
    }
    if (context.width !== undefined) {
      this.width.set(context.width)
    }
    if (context.height !== undefined) {
      this.height.set(context.height)
    }
    if (context.touch !== undefined) {
      this.touch.set(context.touch)
    }
    if (context.hover !== undefined) {
      this.hover.set(context.hover)
    }
  }
}
