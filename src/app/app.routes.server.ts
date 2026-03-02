import type { ServerRoute } from '@angular/ssr'
import { RenderMode } from '@angular/ssr'

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'error',
    renderMode: RenderMode.Prerender,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
]
