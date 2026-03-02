import { DatePipe } from '@angular/common'
import { Component, inject, signal } from '@angular/core'

import type { Film } from '@/api/swapi/resources/films/films.model'
import { FilmsService } from '@/api/swapi/resources/films/films.service'
import { Heading } from '@/components/heading/heading'
import { ImageGrid } from '@/components/image-grid/image-grid'
import { ImageGridItem } from '@/components/image-grid/image-grid-item/image-grid-item'
import { DefaultLayout } from '@/layouts/default-layout/default-layout'

@Component({
  selector: 'app-movies',
  imports: [DatePipe, Heading, ImageGrid, ImageGridItem, DefaultLayout],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies {
  readonly filmsService = inject(FilmsService)
  readonly page = signal('1')
  readonly collection = this.filmsService.getCollection(this.page)

  imageTitle = (film: Film) => `Image of "${film.title}"`
  linkTitle = (film: Film) => `Go to "${film.title}" detail page`
  linkUri = (film: Film) => `/movie/${film.id}`
}
