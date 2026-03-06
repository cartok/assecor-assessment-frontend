import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node'
import cookieParser from 'cookie-parser'
import express from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import { parseItem, parseList } from 'structured-headers'
import Type from 'typebox'
import { Compile } from 'typebox/compile'

import {
  DEFAULT_DEVICE_RENDER_CONTEXT,
  type DeviceContext,
  type RequestContext,
} from '@/app/shared/render/context'

const isProd = process.env['NODE_ENV'] === 'production'
const serverDistFolder = dirname(fileURLToPath(import.meta.url))
const browserDistFolder = resolve(serverDistFolder, '../browser')

const server = express()
const angularApp = new AngularNodeAppEngine()

// --- DEVICE BOOTSTRAP STORY: start ---

// TODO: Device-Bootstrap-Story grundlegend auslagern und Teile kuppeln

interface RangeOptions {
  /**
   * @default true
   */
  inclusive: boolean
}

export class Range {
  public readonly min: number
  public readonly max: number
  public readonly options: RangeOptions

  constructor(min: number, max: number, options?: RangeOptions) {
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      throw new TypeError('min and max must be finite numbers')
    }

    if (min > max) {
      throw new RangeError('min must be <= max')
    }

    this.min = min
    this.max = max

    this.options = {
      ...{ inclusive: true },
      ...options,
    }
  }

  contains(value: number): boolean {
    if (!Number.isFinite(value)) return false

    return this.options.inclusive
      ? value >= this.min && value <= this.max
      : value > this.min && value < this.max
  }

  clamp(value: number): number {
    if (!Number.isFinite(value)) {
      throw new TypeError('value must be a finite number')
    }

    return Math.min(Math.max(value, this.min), this.max)
  }
}

function mapDimensionsToBreakpoint({
  width,
  height,
}: {
  width: number
  height: number
}): Parameters<typeof mapDimensionsToBreakpoint>[0] {
  return {
    width: 1,
    height: 1,
  }
}

const BootstrapSchema = Type.Object(
  {
    touch: Type.Boolean(),
    maxWidth: Type.Number(),
    maxHeight: Type.Number(),
  },
  {
    additionalProperties: false,
  },
)

type BootstrapRequest = Type.Static<typeof BootstrapSchema>

const bootstrapRequestValidator = Compile(BootstrapSchema)

type BootstrapCookie = Type.Static<typeof BootstrapSchema>

const bootstrapCookieValidator = Compile(BootstrapSchema)

function validateBoostrapCookie(
  value: Record<string, unknown> | undefined,
): BootstrapCookie | false {
  if (value === undefined) {
    return false
  }
  try {
    return bootstrapCookieValidator.Parse(value)
  } catch (error) {
    return false
  }
}

const BOOTSTRAP_COOKIE_KEY = 'bootstrap'

/**
 * How to test cookies:
 *
 * @example
 * curl http://localhost:4200/bootstrap \
 *   --json '{ "touch": true, "width": 802 }' \
 *   --cookie-jar cookie \
 *   --cookie cookie \
 * && echo "\n\nCookie is:"; cat cookie
 */
const bootstrapHandler: express.RequestHandler<
  ParamsDictionary,
  unknown,
  BootstrapRequest
> = (req, res) => {
  const bootstrapCookieValue = validateBoostrapCookie(req.cookies[BOOTSTRAP_COOKIE_KEY])
  console.debug({ bootstrapCookieValue })

  if (!bootstrapCookieValue) {
    res.clearCookie(BOOTSTRAP_COOKIE_KEY, { path: '/' })
  }

  let bootstrapRequestValue: BootstrapRequest
  try {
    bootstrapRequestValue = bootstrapRequestValidator.Parse(req.body)
    console.debug({ bootstrapRequestValue })
  } catch (error) {
    return res.status(400).json({ message: `Invalid body: ${JSON.stringify(req.body)}` })
  }

  res.cookie(BOOTSTRAP_COOKIE_KEY, bootstrapRequestValue, {
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    maxAge: isProd ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 2,
  })

  return res.status(200).json({
    message: `Successfully set ${BOOTSTRAP_COOKIE_KEY} cookie to ${JSON.stringify(bootstrapRequestValue)}`,
  })
}

server.post(
  '/bootstrap',
  express.json({ limit: '200b' }),
  cookieParser(),
  bootstrapHandler,
)

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

// --- BOOTSTRAP STORY: end ---

server.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
)

server.use(async (req, res, next) => {
  try {
    const requestContext: RequestContext = {
      device:
        (res.locals['deviceContext'] as DeviceContext | undefined) ??
        DEFAULT_DEVICE_RENDER_CONTEXT,
    }
    const response = await angularApp.handle(req, requestContext)
    if (response) {
      writeResponseToNodeResponse(response, res)
      return
    }

    next()
  } catch (error) {
    next(error)
  }
})

server.use((error: unknown, req: express.Request, res: express.Response) => {
  console.error(error)

  if (res.headersSent) {
    return
  }

  if (req.path === '/error') {
    res.status(500).send('Server Error')
    return
  }

  res.redirect(302, '/error')
})

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000
  server.listen(port, (error) => {
    if (error) {
      throw error
    }

    console.log(`Node Express server listening on http://localhost:${port}`)
  })
}

export const reqHandler = createNodeRequestHandler(server)
