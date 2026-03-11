import type express from 'express'
import { parseItem, parseList } from 'structured-headers'

import type { DeviceContext } from '@/shared/device/context'

type HeaderType = ReturnType<express.Request['get']>

export function addDeviceContextHandler(server: express.Express): void {
  server.get(/.*/, (req, res, next) => {
    // Get client hints from low-entropy headers.
    const mobileHeader = req.get('sec-ch-ua-mobile')

    // Get client hints from high-entropy headers.
    const formFactorsHeader = req.get('sec-ch-ua-form-factors')
    const widthHeader = req.get('sec-ch-viewport-width')
    const heightHeader = req.get('sec-ch-viewport-height')

    // Parse headers and store them.
    // TODO: Add, inject and process info from device cookie
    const deviceContext: DeviceContext = {
      format: resolveDeviceFormat({ formFactorsHeader, mobileHeader }),
      ...parseViewportDimensionHeaders({ widthHeader, heightHeader }),
    }
    res.locals['deviceContext'] = deviceContext

    console.log('SERVER:', {
      deviceContext,
    })

    // Request high-entropy client hints (available from the next navigation/request).
    res.setHeader(
      'accept-ch',
      'sec-ch-ua-form-factors, sec-ch-viewport-width, sec-ch-viewport-height',
    )
    res.setHeader('vary', 'sec-ch-ua-form-factors')
    next()
  })
}

function resolveDeviceFormat({
  formFactorsHeader,
  mobileHeader,
}: {
  formFactorsHeader: HeaderType
  mobileHeader: HeaderType
}): DeviceContext['format'] {
  const formFactor = parseFormFactorHeader(formFactorsHeader)
  if (formFactor) {
    return formFactor
  }

  return mobileHeader === '?0' ? 'desktop' : 'mobile'
}

function parseFormFactorHeader(header: HeaderType): DeviceContext['format'] | undefined {
  if (!header) {
    return undefined
  }

  try {
    const parsed = parseList(header)
    for (const member of parsed) {
      if (Array.isArray(member[0])) {
        continue
      }

      const bareItem = member[0]
      if (typeof bareItem !== 'string') {
        continue
      }

      const normalized = bareItem.toLowerCase()
      if (
        normalized === 'desktop' ||
        normalized === 'tablet' ||
        normalized === 'mobile'
      ) {
        return normalized
      }
    }
  } catch {
    return undefined
  }

  return undefined
}

/**
 * Notice: The `width` and `height` values the browser sends in the `Sec-CH-Viewport-*` will
 * not exactly match `window.innerWidth` and `window.InnerHeight`. The browser somewhat seems
 * to calculate in the zoom level. Accurate values can only be received by client-side detection
 * and redirection.
 */
function parseViewportDimensionHeaders({
  widthHeader,
  heightHeader,
}: {
  widthHeader: HeaderType
  heightHeader: HeaderType
}): { width?: number; height?: number } {
  return {
    width: parseViewportDimensionHeader(widthHeader),
    height: parseViewportDimensionHeader(heightHeader),
  }
}

function parseViewportDimensionHeader(headerValue: HeaderType): number | undefined {
  if (!headerValue) {
    return undefined
  }

  try {
    const [bareItem] = parseItem(headerValue)
    if (typeof bareItem !== 'number' || !Number.isInteger(bareItem) || bareItem <= 0) {
      return undefined
    }

    return bareItem
  } catch {
    return undefined
  }
}
