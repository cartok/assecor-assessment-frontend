import cookieParser from 'cookie-parser'
import express from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import value from 'typebox/value'

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
 * curl http://localhost:4200/device-cookie \
 *    --json '{ "version": 1, "pointer": "fine", "hover": true}' \
 *    --cookie-jar cookie \
 *    --cookie cookie \
 *  && echo "\n\nCookie is:"; cat cookie
 */
const deviceCookieHandler: express.RequestHandler<ParamsDictionary, unknown, unknown> = (
  req,
  res,
) => {
  const existingDeviceCookie = parseExistingDeviceCookie(req.cookies[DEVICE_COOKIE_KEY])
  if (!existingDeviceCookie) {
    res.clearCookie(DEVICE_COOKIE_KEY, { path: '/' })
    console.info('Cleared invalid device cookie.')
  }

  let deviceCookie: DeviceCookie
  try {
    const valid = validate(req.body)
    if (!valid) {
      throw JSON.stringify(validate.errors)
    }
    deviceCookie = req.body as DeviceCookie
    console.debug({ deviceCookie })
  } catch (error) {
    console.error('Invalid request body.', error)
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

function parseExistingDeviceCookie(value: unknown): DeviceCookie | null {
  try {
    const valid = validate(value)
    if (!valid) {
      throw JSON.stringify(validate.errors)
    }
    return value as DeviceCookie
  } catch (error) {
    console.warn('Device cookie was invalid.', error)
    return null
  }
}
