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
import Type from 'typebox'
import { Compile } from 'typebox/compile'

const isProd = process.env['NODE_ENV'] === 'production'
const serverDistFolder = dirname(fileURLToPath(import.meta.url))
const browserDistFolder = resolve(serverDistFolder, '../browser')

const server = express()
const angularApp = new AngularNodeAppEngine()

// --- DEVICE BOOTSTRAP STORY: start ---

//  TODO: Device-Bootstrap-Story grundlegend auslagern und Teile kuppeln
/**
 * TODO: Hier hab ich keine single source of truth. Ggf. eine statische CSS-In-JS Lösung verwenden (vermutlich am saubersten; PostCSS würde dann nicht mehr gebraucht werden und könnte raus), oder alternativ `media.css` per build step oder ein kleines vite plugin generieren (nur wenn es keine bessere Lösung gibt).
 *   - Grundlagen auf App-Seite einbauen
 *   - Gucken ob z.b. vanilla-extract-css zudem eine Utility zur breakpoint Bestimmung mitbringen würde.
 *   - Lösung für korrekte Breakpoint-Bestimming erstellen (`mapWidthToBreakpoint`) und ggf. den `Ranges` code dropen, falls nicht nötig. Auf jeden Fall brauche ich JS-Based Breakpoint-Matching hierfür auch im Frontend. Allgemein sollten hier server und client code unabhängig sein, und nur fürs development gelten.
 *
 * Letzendlich will ich im render code so was benutzen:
 * ```ts
 *
 * const foo = 1
 * ```
 */
const breakpointMap = new Map<number, string>([
  [1385, '--desktop-gradation-1'],
  [1100, '--desktop-gradation-2'],
  [768, '--media-tablet-target'],
  [601, '--media-tablet-min'],
  [1280, '--media-tablet-max'],
  [360, '--media-mobile-target'],
  [360, '--media-mobile-min'],
  [430, '--media-mobile-max'],
])

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

function mapWidthToBreakpoint(width: number): BootstrapCookie['breakpoint'] {
  // TODO: Der return value ist schlecht getyped. Daher verbessern sobald klar ist wie das breakpoint mapping aussehen wird und wie die responsibilities genau sein sollte (client vs. server: "Wer definiert?").
  return '--media-mobile-min'
}

const BootstrapRequestSchema = Type.Object(
  {
    touch: Type.Boolean(),
    width: Type.Number(),
  },
  {
    additionalProperties: false,
  },
)

type BootstrapRequest = Type.Static<typeof BootstrapRequestSchema>

const bootstrapRequestValidator = Compile(BootstrapRequestSchema)

const BootstrapCookieSchema = Type.Object(
  {
    touch: Type.Boolean(),
    breakpoint: Type.Enum(Object.values(breakpointMap)),
  },
  {
    additionalProperties: false,
  },
)

type BootstrapCookie = Type.Static<typeof BootstrapCookieSchema>

const bootstrapCookieValidator = Compile(BootstrapCookieSchema)

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
 * TODO: Grad bin ich mir nicht mehr ganz sicher mit dem Ablauf. Ggf. erstmal grundlegend dafür sorgen dass ich die bootstrap Parameter in die App rein bekomme. Es bestanden zwei grundlegend verschieden Ideen:
 *
 * Idee 1 (Client Post):
 * 1. Client (Browser) fragt beliebige Seite an.
 * 2. Server prüft ob er weiß, was der Client für aktuelle Parameter hat (`BootstrapBody`).
 * 3. ...
 *
 * Idee 2 (Server Redirect):
 * 1. ...
 *
 * Manual test command:
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
    res.clearCookie(BOOTSTRAP_COOKIE_KEY, {
      sameSite: 'lax',
      secure: isProd,
      path: '/',
    })
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
    const response = await angularApp.handle(req)
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
    res.status(500).send('Es ist ein Serverfehler aufgetreten.')
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
