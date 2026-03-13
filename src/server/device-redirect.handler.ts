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
    const deviceContext = res.locals['deviceContext'] as null | DeviceContext
    if (!deviceContext) {
      console.info('No device context available.')
      return next()
    }

    // TODO: Patch bad device context parameters
    if (deviceContextFromUrlPath) {
      // WIP: if url already has device context, it could be wrong (bookmark with lower width for example) --- hm ok but angular would correct it, at least at the moment as of my redirect route in app.routes... maybe i would'nt have needed it at all in case i do not update urls during SPA navigations and do not forward the device path prefix to other routes?
      // if (
      //   deviceContextFromUrlPath.width &&
      //   !isWidthBreakpointValid(deviceContextFromUrlPath.width)
      // ) {
      //   console.warn('Detected invalid device width in URL Path.', req.path)
      // } else {
      //   return next()
      // }
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
