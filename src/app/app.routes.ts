import type { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@/pages/home/home').then(({ Home }) => Home),
  },
  {
    path: 'movies',
    loadComponent: () => import('@/pages/movies/movies').then(({ Movies }) => Movies),
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('@/pages/movies/movie/movie').then(({ Movie }) => Movie),
  },
  {
    path: 'characters',
    loadComponent: () =>
      import('@/pages/characters/characters').then(({ Characters }) => Characters),
  },
  {
    path: 'character/:id',
    loadComponent: () =>
      import('@/pages/characters/character/character').then(
        (component) => component.Character,
      ),
  },
  {
    path: 'planets',
    loadComponent: () => import('@/pages/planets/planets').then(({ Planets }) => Planets),
  },
  {
    path: 'planet/:id',
    loadComponent: () =>
      import('@/pages/planets/planet/planet').then(({ Planet }) => Planet),
  },
]
