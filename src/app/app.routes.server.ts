import type { ServerRoute } from '@angular/ssr'
import { RenderMode } from '@angular/ssr'

// TODO: Wenn ich die boostrap story grundlegend drin hab müsste ich für alle prerendered routes (SSG) mehrere versionen erzeugen lassen, falls das denn verbindbar ist. Ansonsten erstmal alles auf SSR setzen, oder eben auf fallback behavior (default werte falls seite ohne bootstrap laden soll) setzen.
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
