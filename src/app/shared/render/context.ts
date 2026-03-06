import { makeStateKey } from '@angular/core'

export interface RequestContext {
  device: DeviceRenderContext
}

export interface DeviceRenderContext {
  format: 'desktop' | 'tablet' | 'mobile'
  width?: number
  height?: number
  touch?: boolean
  hover?: boolean
}

export const DEFAULT_DEVICE_RENDER_CONTEXT: DeviceRenderContext = {
  format: 'desktop',
}

export const RENDER_CONTEXT = makeStateKey<RequestContext>('render-context')
