import { Component, computed, inject, signal } from '@angular/core'

import { FilmsService } from '@/api/swapi/resources/films/films.service'
import { PageHeading } from '@/components/page-heading/page-heading'
import { ResourceGrid } from '@/components/resource-grid/resource-grid'
import type { InputValue } from '@/shared/types/component.types'

@Component({
  selector: 'app-movies',
  imports: [PageHeading, ResourceGrid],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies {
  readonly filmsService = inject(FilmsService)
  readonly page = signal('1')
  readonly collection = this.filmsService.getCollection(this.page)
  readonly gridItems = computed<InputValue<typeof ResourceGrid, 'items'>>(() =>
    this.collection.data().items.map((film) => ({
      imageUrl: film.images[0],
      label: film.title,
    })),
  )
}
