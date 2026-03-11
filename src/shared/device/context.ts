import { DefaultUrlSerializer, PRIMARY_OUTLET } from '@angular/router'
import type { Static } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import type { HeightBreakpoint, WidthBreakpoint } from 'breakpoints'
import { BREAKPOINTS } from 'breakpoints'

export const DEVICE_FORMATS = ['desktop', 'mobile', 'tablet'] as const

const DeviceFormatSchema = Type.Union(DEVICE_FORMATS.map((f) => Type.Literal(f)))

type DeviceFormat = (typeof DEVICE_FORMATS)[number]

const DeviceContextSchema = Type.Object(
  {
    format: DeviceFormatSchema,
    width: Type.Optional(Type.Integer({ minimum: 1 })),
    height: Type.Optional(Type.Integer({ minimum: 1 })),
  },
  {
    additionalProperties: false,
  },
)

export type DeviceContext = Static<typeof DeviceContextSchema>

export const DEFAULT_DEVICE_FORMAT: DeviceFormat = 'mobile'

export function findClosestWidthBreakpoint(value: number): WidthBreakpoint | null {
  return findClosestBreakpoint(BREAKPOINTS.width, value)
}

export function findClosestHeightBreakpoint(value: number): HeightBreakpoint | null {
  return findClosestBreakpoint(BREAKPOINTS.height, value)
}

function findClosestBreakpoint<T extends WidthBreakpoint | HeightBreakpoint>(
  breakpoints: readonly T[],
  value: number,
): T | null {
  let closestBreakpoint: T | null = null

  for (const breakpoint of breakpoints) {
    if (breakpoint >= value) {
      if (closestBreakpoint !== null) {
        if (breakpoint < closestBreakpoint) {
          closestBreakpoint = breakpoint
        }
      } else {
        closestBreakpoint = breakpoint
      }
    }
  }

  return closestBreakpoint
}

export function findClosestBreakpoints({
  width,
  height,
}: {
  width?: number
  height?: number
}): {
  widthBreakpoint: WidthBreakpoint | null
  heightBreakpoint: HeightBreakpoint | null
} {
  const widthBreakpoint =
    typeof width == 'undefined' ? null : findClosestWidthBreakpoint(width)
  const heightBreakpoint =
    typeof height == 'undefined' ? null : findClosestHeightBreakpoint(height)

  return { widthBreakpoint, heightBreakpoint }
}

export function isWidthBreakpointValid(width: number): width is WidthBreakpoint {
  return BREAKPOINTS.width.some((x) => x === width)
}

export function isHeightBreakpointValid(height: number): height is HeightBreakpoint {
  return BREAKPOINTS.height.some((x) => x === height)
}

export const DEVICE_CONTEXT_PATH_PARAM_PREFIX = 'r'

/**
 * Creates a prefix path that makes use of Angular's matrix parameters to pass
 * device-specific information.
 */
export function deviceContextToPathSegment(deviceContext: DeviceContext): string {
  const matrixParams = [`format=${deviceContext.format}`]
  const { widthBreakpoint, heightBreakpoint } = findClosestBreakpoints({
    width: deviceContext.width,
    height: deviceContext.height,
  })

  if (widthBreakpoint !== null) {
    matrixParams.push(`width=${widthBreakpoint}`)
  }

  if (heightBreakpoint !== null) {
    matrixParams.push(`height=${heightBreakpoint}`)
  }

  return [DEVICE_CONTEXT_PATH_PARAM_PREFIX, ...matrixParams].join(';')
}

const urlSerializer = new DefaultUrlSerializer()

export function urlPathToDeviceContext(urlPath: string): DeviceContext | null {
  const urlTree = urlSerializer.parse(urlPath)
  if (!urlTree.root.hasChildren()) {
    return null
  }
  const urlSegments = urlTree.root.children[PRIMARY_OUTLET].segments
  if (!urlSegments.length) {
    return null
  }
  const firstSegment = urlSegments[0]
  if (firstSegment.path !== DEVICE_CONTEXT_PATH_PARAM_PREFIX) {
    return null
  }
  return objectToDeviceContext(firstSegment.parameters)
}

export function objectToDeviceContext(
  value: Record<string, string>,
): DeviceContext | null {
  try {
    return Value.Parse(DeviceContextSchema, value)
  } catch (error) {
    return null
  }
}
