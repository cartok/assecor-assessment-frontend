import cookieParser from 'cookie-parser'
import express from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'

import type { DeviceCookie } from '@/generated/types/device-cookie.types'
import { validate } from '@/generated/validators/device-cookie.validator.mjs'

const isProd = process.env['NODE_ENV'] === 'production'
const DEVICE_COOKIE_KEY = 'device'

export function addDeviceCookieHandler(server: express.Express): void {
  server.post(
    '/device-cookie',
    express.json({ limit: '200b' }),
    cookieParser(),
    deviceCookieHandler,
  )
}

/**
 * How to test cookies:
 *
 * @example
 * curl http://localhost:4200/bootstrap \
 *   --json '{ "format": "desktop", "touch": false }' \
 *   --cookie-jar cookie \
 *   --cookie cookie \
 * && echo "\n\nCookie is:"; cat cookie
 */
const deviceCookieHandler: express.RequestHandler<ParamsDictionary, unknown, unknown> = (
  req,
  res,
) => {
  const deviceCookieValue = validateBoostrapCookie(req.cookies[DEVICE_COOKIE_KEY])
  console.debug({ deviceCookieValue })

  if (!deviceCookieValue) {
    res.clearCookie(DEVICE_COOKIE_KEY, { path: '/' })
  }

  let deviceCookie: DeviceCookie
  try {
    deviceCookie = validate(req.body)
    console.debug({ deviceCookie })
  } catch (error) {
    return res.status(400).json({ message: `Invalid body: ${JSON.stringify(req.body)}` })
  }

  res.cookie(DEVICE_COOKIE_KEY, deviceCookie, {
    sameSite: 'lax',
    secure: isProd,
    path: '/',
    maxAge: isProd ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 2,
  })

  return res.status(200).json({
    message: `Successfully set ${DEVICE_COOKIE_KEY} cookie to ${JSON.stringify(deviceCookie)}`,
  })
}

function validateBoostrapCookie(
  value: Record<string, unknown> | undefined,
): DeviceCookie | false {
  if (value === undefined) {
    return false
  }
  try {
    return validate(value)
  } catch (error) {
    return false
  }
}
