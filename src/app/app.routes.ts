import type { Routes } from '@angular/router'

export const routes: Routes = [
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
  {
    path: '**',
    redirectTo: '/error',
  },
]
