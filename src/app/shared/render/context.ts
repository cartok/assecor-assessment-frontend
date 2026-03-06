import { makeStateKey } from '@angular/core'

export interface RequestContext {
  device: DeviceContext
}

export interface DeviceContext {
  format: 'desktop' | 'tablet' | 'mobile'
  width?: number
  height?: number
  touch?: boolean
  hover?: boolean
}

export const DEFAULT_DEVICE_RENDER_CONTEXT: DeviceContext = {
  format: 'mobile',
}

export const REQUEST_CONTEXT_TRANSFER = makeStateKey<RequestContext>(
  'request-context-transfer',
)
