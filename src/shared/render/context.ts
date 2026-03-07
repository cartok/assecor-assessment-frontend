import { makeStateKey } from '@angular/core'

export const DEVICE_FORMATS = ['desktop', 'tablet', 'mobile'] as const

export type DeviceFormat = (typeof DEVICE_FORMATS)[number]

export function isDeviceFormat(value: unknown): value is DeviceFormat {
  if (typeof value !== 'string') {
    return false
  }
  return DEVICE_FORMATS.some((format) => value === format)
}

export interface RequestContext {
  device: DeviceContext
}

export interface DeviceContext {
  format: DeviceFormat
  width?: number
  height?: number
  touch?: boolean
  hover?: boolean
}

export const DEFAULT_DEVICE_FORMAT: DeviceFormat = 'mobile'
export const DEFAULT_DEVICE_RENDER_CONTEXT: DeviceContext = {
  format: DEFAULT_DEVICE_FORMAT,
}

export const REQUEST_CONTEXT_TRANSFER = makeStateKey<RequestContext>(
  'request-context-transfer',
)
