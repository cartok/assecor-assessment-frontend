import type express from 'express'
import { parseItem, parseList } from 'structured-headers'

import type { DeviceContext } from '@/shared/render/context'

export function addDeviceHandler(server: express.Express): void {
  server.use(async (req, res, next) => {
    // Get client hints from low-entropy headers.
    const mobileHeader = req.get('sec-ch-ua-mobile')

    // Get client hints from high-entropy headers.
    const formFactorsHeader = req.get('sec-ch-ua-form-factors')
    const widthHeader = req.get('sec-ch-viewport-width')
    const heightHeader = req.get('sec-ch-viewport-height')

    // Parse headers and store them.
    const deviceContext: DeviceContext = {
      format: resolveDeviceFormat({ formFactorsHeader, mobileHeader }),
      width: parseViewportDimensionHeader(widthHeader),
      height: parseViewportDimensionHeader(heightHeader),
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

function parseFormFactorHeader(
  value: string | undefined,
): DeviceContext['format'] | undefined {
  if (!value) {
    return undefined
  }

  try {
    const parsed = parseList(value)
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

function parseViewportDimensionHeader(value: string | undefined): number | undefined {
  if (!value) {
    return undefined
  }

  try {
    const [bareItem] = parseItem(value)
    if (typeof bareItem !== 'number' || !Number.isInteger(bareItem) || bareItem <= 0) {
      return undefined
    }

    return bareItem
  } catch {
    return undefined
  }
}

function resolveDeviceFormat({
  formFactorsHeader: formFactorHeader,
  mobileHeader,
}: {
  formFactorsHeader: string | undefined
  mobileHeader: string | undefined
}): DeviceContext['format'] {
  const formFactor = parseFormFactorHeader(formFactorHeader)
  if (formFactor) {
    return formFactor
  }

  return mobileHeader === '?0' ? 'desktop' : 'mobile'
}
