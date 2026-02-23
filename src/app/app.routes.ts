import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'movies',
    loadComponent: () =>
      import('./pages/movies/movies.component').then(
        (component) => component.MoviesComponent,
      ),
  },
  {
    path: 'characters',
    loadComponent: () =>
      import('./pages/characters/characters.component').then(
        (component) => component.CharactersComponent,
      ),
  },
  {
    path: 'planets',
    loadComponent: () =>
      import('./pages/planets/planets.component').then(
        (component) => component.PlanetsComponent,
      ),
  },
]
