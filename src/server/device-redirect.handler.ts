import type express from 'express'

import { APP_ERROR_PATH_NAME } from '@/app/app.routes'
import type { DeviceContext } from '@/shared/device/context'
import {
  deviceContextToPathSegment,
  urlPathToDeviceContext,
} from '@/shared/device/context'

export function addDeviceRedirectHandler(server: express.Express): void {
  server.get(/.*/, (req, res, next) => {
    if (req.path.startsWith(`/${APP_ERROR_PATH_NAME}`)) {
      return next()
    }

    if (/\.[a-zA-Z0-9]+$/.test(decodeURIComponent(req.path))) {
      return next()
    }

    const deviceContextFromUrlPath = urlPathToDeviceContext(req.path)
    if (deviceContextFromUrlPath) {
      // TODO: Patch bad device context parameters instead.
      return next()
    }

    const deviceContext = res.locals['deviceContext'] as null | DeviceContext
    if (!deviceContext) {
      console.warn('No device context available for redirect.')
      return next()
    }

    const deviceContextPathSegment = deviceContextToPathSegment(deviceContext)
    const redirectPath =
      req.path === '/'
        ? `/${deviceContextPathSegment}`
        : `/${deviceContextPathSegment}${req.path}`
    res.setHeader('cache-control', 'no-store, private')

    return res.redirect(302, redirectPath)
  })
}
