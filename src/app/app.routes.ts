import type { ParamMap } from '@angular/router'
import { type Routes } from '@angular/router'
import BREAKPOINTS from 'breakpoints.json' with { type: 'json' }

import type { DeviceFormat } from '@/shared/render/context'
import {
  DEFAULT_DEVICE_FORMAT,
  DEVICE_FORMATS,
  isDeviceFormat,
} from '@/shared/render/context'

const actualRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@/app/pages/home/home').then(({ Home }) => Home),
    pathMatch: 'full',
  },
  {
    path: 'error',
    loadComponent: () =>
      import('@/app/pages/error/error').then(({ ErrorPage }) => ErrorPage),
  },
  {
    path: 'movies',
    loadComponent: () => import('@/app/pages/movies/movies').then(({ Movies }) => Movies),
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('@/app/pages/movie/movie').then(({ Movie }) => Movie),
  },
  {
    path: 'characters',
    loadComponent: () =>
      import('@/app/pages/characters/characters').then(({ Characters }) => Characters),
  },
  {
    path: 'character/:id',
    loadComponent: () =>
      import('@/app/pages/character/character').then((component) => component.Character),
  },
  {
    path: 'planets',
    loadComponent: () =>
      import('@/app/pages/planets/planets').then(({ Planets }) => Planets),
  },
  {
    path: 'planet/:id',
    loadComponent: () => import('@/app/pages/planet/planet').then(({ Planet }) => Planet),
  },
]

const VARIANT_PATHS: string[] = [...DEVICE_FORMATS]
for (const deviceFormat of DEVICE_FORMATS) {
  for (const width of BREAKPOINTS.width) {
    for (const height of BREAKPOINTS.height) {
      VARIANT_PATHS.push(`${deviceFormat}/${width}/${height}`)
    }
  }
}
Object.freeze(VARIANT_PATHS)

const variableRoutes = Object.freeze(
  VARIANT_PATHS.map((path) => ({ path, children: actualRoutes })),
)

// FYI: SSR redirect hätte nur initial effekt, ich kann also nicht alle redirects allein im server machen.
// TODO: sollte vermutlich die actual routes raus nehmen, beides mal mit anderer base href testen wenn ich die raus nehmen würde, müsste ich aber ein redirect erzeugen, aber was wenn ich keine oder kaum device context infos habe...
export const routes: Routes = [
  ...variableRoutes,
  ...actualRoutes,
  {
    /**
     * URLs for manual testing:
     * - http://localhost:4200/desktop/1385/400
     * - http://localhost:4200/desktop/1385/000
     * - http://localhost:4200/desktop/99999999999/400
     * - http://localhost:4200/desktop/1385/99999999999
     * - http://localhost:4200/desktop/99999999999/99999999999
     * - http://localhost:4200/desktop/1385/xxx
     * - http://localhost:4200/desktop/1385/400/planets
     * - http://localhost:4200/desktop/1385/400/planet/1
     * - http://localhost:4200/desktop/1385/400/planets;one=1
     * - http://localhost:4200/desktop/1385/400/planets;one=1;two=2
     * - http://localhost:4200/desktop/1385/400/planets;one=1;two=2?three=3
     * - http://localhost:4200/desktop/1385/400/planet;one=1/1;one=one
     * - http://localhost:4200/desktop/1385/400/planet;one=1;two=2/1;one=one;two=2
     * - http://localhost:4200/desktop/1385/400/planet;one=1;two=2/1;one=one;two=2?three=3
     * - http://localhost:4200/desktop/1385/751/planets
     * - http://localhost:4200/desktop/0000/750/planets
     * - http://localhost:4200/desktop/1385/000/planets
     * - http://localhost:4200/xxxxxxx/1385/750/planets
     * - http://localhost:4200/xxxxxxx/1385/000/planets
     * - http://localhost:4200/xxxxxxx/0000/000/planets
     * - http://localhost:4200/xxxxxxx/0000/000/planets
     * - http://localhost:4200/xxxxxxx/0000/xxx/planets
     */
    path: ':device-format/:width/:height/**',
    redirectTo(redirectData) {
      // Device format can be auto-corrected.
      const deviceFormatOrFallback = parseDeviceFormatFromParamMapOrFallback(
        redirectData.paramMap,
      )

      // Check if width and height parameters really exist / are numbers.
      // Otherwise it could still be ':device-format/**'
      const width = parseIntFromParamMap(redirectData.paramMap, 'width')
      const height = parseIntFromParamMap(redirectData.paramMap, 'height')
      if (width === null || height === null) {
        return `${deviceFormatOrFallback}/**`
      }

      const actualPath = redirectData.url.slice(3).join('/')
      if (!actualPathExists(actualPath)) {
        return '/error'
      }

      const widthBreakpoint =
        width === null ? null : findClosestBreakpoint(BREAKPOINTS.width, width)

      const heightBreakpoint =
        height === null ? null : findClosestBreakpoint(BREAKPOINTS.height, height)

      const correctedVariantPath =
        widthBreakpoint === null || heightBreakpoint === null
          ? `${deviceFormatOrFallback}`
          : `${deviceFormatOrFallback}/${widthBreakpoint}/${heightBreakpoint}`

      const correctedPath = actualPath.length
        ? [correctedVariantPath, actualPath].join('/')
        : correctedVariantPath

      console.error({
        correctedPath,
        correctedVariantPath,
        heightBreakpoint,
        actualPath,
        widthBreakpoint,
      })
      return correctedPath
    },
  },
  /**
   * URLs for manual testing:
   * - http://localhost:4200/desktop
   * - http://localhost:4200/xxxxxxx
   * - http://localhost:4200/desktop/movies
   * - http://localhost:4200/xxxxxxx/movies
   * - http://localhost:4200/desktop/movie/1
   * - http://localhost:4200/xxxxxxx/movie/1
   */
  {
    path: ':device-format/**',
    redirectTo(redirectData) {
      // Device format can be auto-corrected.
      const deviceFormatOrFallback = parseDeviceFormatFromParamMapOrFallback(
        redirectData.paramMap,
      )
      const actualPath = redirectData.url.slice(1).join('/')
      if (!actualPathExists(actualPath)) {
        return '/error'
      }

      const correctedPath = actualPath.length
        ? [deviceFormatOrFallback, actualPath].join('/')
        : deviceFormatOrFallback

      return correctedPath
    },
  },
  {
    path: '**',
    redirectTo: '/error',
  },
]

function parseIntFromParamMap(paramMap: ParamMap, key: string): number | null {
  const value = paramMap.get(key)
  if (!value) {
    return null
  }

  const parsedValue = parseInt(value)
  if (isNaN(parsedValue)) {
    return null
  }

  return parsedValue
}

function parseDeviceFormatFromParamMapOrFallback(paramMap: ParamMap): DeviceFormat {
  const deviceFormat = paramMap.get('device-format')
  const deviceFormatOrFallback = isDeviceFormat(deviceFormat)
    ? deviceFormat
    : DEFAULT_DEVICE_FORMAT

  return deviceFormatOrFallback
}

function actualPathExists(path: string): boolean {
  return actualRoutes.some((actualRoute) => actualRoute.path === path)
}

function findClosestBreakpoint(breakpoints: number[], value: number) {
  let closestBreakpoint = null

  for (const breakpoint of breakpoints) {
    if (breakpoint >= value) {
      if (closestBreakpoint) {
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
