import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@/pages/home/home').then((component) => component.Home),
  },
  {
    path: 'movies',
    loadComponent: () =>
      import('@/pages/movies/movies').then((component) => component.Movies),
  },
  {
    path: 'characters',
    loadComponent: () =>
      import('@/pages/characters/characters').then((component) => component.Characters),
  },
  {
    path: 'planets',
    loadComponent: () =>
      import('@/pages/planets/planets').then((component) => component.Planets),
  },
]
