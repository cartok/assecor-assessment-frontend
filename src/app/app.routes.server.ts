import { inject } from '@angular/core'
import { Router } from '@angular/router'
import type { ServerRoute } from '@angular/ssr'
import { RenderMode } from '@angular/ssr'

// const baseRoutesSSG: ServerRoute[] = []
export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Client,
    // renderMode: RenderMode.Prerender,
    // async getPrerenderParams() {
    //   const router = inject(Router)
    //   console.log('STATE:', router.routerState)
    //   throw "ho"
    // },
  },
  // {
  //   path: 'error',
  //   renderMode: RenderMode.Prerender,
  // },
  {
    path: '**',
    // renderMode: RenderMode.Server,
    renderMode: RenderMode.Client,
  },
]
