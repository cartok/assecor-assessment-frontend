import { inject, Injectable, REQUEST_CONTEXT, signal, TransferState } from '@angular/core'

import { injectIsBrowser, injectIsServer } from '@/app/shared/utils/platform'
import {
  DEFAULT_DEVICE_RENDER_CONTEXT,
  type DeviceContext,
  REQUEST_CONTEXT_TRANSFER,
  type RequestContext,
} from '@/shared/render/context'

@Injectable({ providedIn: 'root' })
export class DeviceService {
  private readonly isBrowser = injectIsBrowser()
  private readonly isServer = injectIsServer()
  private readonly renderContext = inject<RequestContext>(REQUEST_CONTEXT, {
    optional: true,
  })
  private readonly transferState = inject(TransferState)

  private readonly format = signal<DeviceContext['format']>(
    DEFAULT_DEVICE_RENDER_CONTEXT.format,
  )
  private readonly width = signal<DeviceContext['width']>(undefined)
  private readonly height = signal<DeviceContext['height']>(undefined)
  private readonly touch = signal<DeviceContext['touch']>(undefined)
  private readonly hover = signal<DeviceContext['hover']>(undefined)

  constructor() {
    const deviceContext = this.getInitialDeviceContext()
    this.applyDeviceContext(deviceContext)
    console.log('APP:', { deviceContext }, { ssr: this.isServer })
  }

  updateDeviceContext(context: Partial<DeviceContext>): void {
    this.applyDeviceContext(context)
  }

  private getInitialDeviceContext(): DeviceContext {
    if (this.isServer && this.renderContext) {
      this.transferState.set(REQUEST_CONTEXT_TRANSFER, this.renderContext)
      return this.renderContext.device
    }

    if (this.isBrowser && this.transferState.hasKey(REQUEST_CONTEXT_TRANSFER)) {
      const transferredContext = this.transferState.get(REQUEST_CONTEXT_TRANSFER, {
        device: DEFAULT_DEVICE_RENDER_CONTEXT,
      })
      this.transferState.remove(REQUEST_CONTEXT_TRANSFER)
      return transferredContext.device
    }

    return DEFAULT_DEVICE_RENDER_CONTEXT
  }

  private applyDeviceContext(context: Partial<DeviceContext>): void {
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
