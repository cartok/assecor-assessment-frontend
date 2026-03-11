import type { Route } from '@angular/router'
import type { UrlSegment } from '@angular/router'
import { defaultUrlMatcher, type Routes, UrlSegmentGroup } from '@angular/router'

import {
  DEVICE_CONTEXT_PATH_PARAM_PREFIX,
  deviceContextToPathSegment,
  findClosestBreakpoints,
  findClosestHeightBreakpoint,
  findClosestWidthBreakpoint,
  isHeightBreakpointValid,
  isWidthBreakpointValid,
  objectToDeviceContext,
} from '@/shared/device/context'

export const APP_ERROR_PATH_NAME = 'error'

const actualRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@/app/pages/home/home').then(({ Home }) => Home),
    pathMatch: 'full',
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

export const routes: Routes = [
  /**
   * This route is made to patch bad device parameters.
   *
   * It checks if the path has device parameters set, corrects the values to whats closest and redirects to it. If the path had no device parameters, the router continues with the next route.
   */
  {
    matcher(segments) {
      console.log('matcher', { segments })
      const firstSegment = segments[0]
      if (firstSegment.path !== DEVICE_CONTEXT_PATH_PARAM_PREFIX) {
        return null
      }
      const deviceContext = objectToDeviceContext(firstSegment.parameters)
      if (!deviceContext) {
        console.error('Detected Device URL with no context data.', firstSegment)
        return null
      }
      if (
        (deviceContext.width && !isWidthBreakpointValid(deviceContext.width)) ||
        (deviceContext.height && !isHeightBreakpointValid(deviceContext.height))
      ) {
        console.warn('Detected invalid width or height in device context.', deviceContext)
        return { consumed: [] }
      }
      return null
    },
    redirectTo(redirectData) {
      console.log('redirect', { redirectData })
      const firstSegment = redirectData.url[0]
      const deviceContext = objectToDeviceContext(firstSegment.parameters)

      if (!deviceContext) {
        console.error(
          "Matcher should've already made sure that device context exists, but with invalid data.",
        )
        return '/error'
      }

      const actualPathSegments: UrlSegment[] = redirectData.url.slice(1)

      const { widthBreakpoint, heightBreakpoint } = findClosestBreakpoints({
        width: deviceContext.width,
        height: deviceContext.height,
      })
      deviceContext.width = widthBreakpoint ?? undefined
      deviceContext.height = heightBreakpoint ?? undefined

      const correctedFirstSegment: string = deviceContextToPathSegment(deviceContext)

      const correctedPath = actualPathSegments.length
        ? [
            correctedFirstSegment,
            ...actualPathSegments.map((segment) => segment.toString()),
          ].join('/')
        : correctedFirstSegment

      return `/${correctedPath}`
    },
  },
  {
    path: DEVICE_CONTEXT_PATH_PARAM_PREFIX,
    children: actualRoutes,
  },
  ...actualRoutes,
  {
    path: APP_ERROR_PATH_NAME,
    loadComponent: () =>
      import('@/app/pages/error/error').then(({ ErrorPage }) => ErrorPage),
  },

  {
    path: '**',
    redirectTo: '/error',
  },
]

const actualRouteMatchers = Object.freeze(
  actualRoutes
    .map((route) => createActualRouteMatcher(route))
    .filter((matcher): matcher is ActualRouteMatcher => matcher !== null),
)

type ActualRouteMatcher = (segmentGroup: UrlSegmentGroup) => boolean

function createActualRouteMatcher(route: Route): ActualRouteMatcher | null {
  if (route.path === undefined || route.path === '**') {
    return null
  }
  if (route.path === '') {
    return (segmentGroup) => segmentGroup.segments.length === 0
  }

  const routeForMatching: Route = {
    path: route.path,
    pathMatch: 'full',
  }

  return (segmentGroup) =>
    defaultUrlMatcher(segmentGroup.segments, segmentGroup, routeForMatching) !== null
}

function actualPathExists(segments: UrlSegment[]): boolean {
  const segmentGroup = new UrlSegmentGroup(segments, {})
  return actualRouteMatchers.some((matcher) => matcher(segmentGroup))
}
