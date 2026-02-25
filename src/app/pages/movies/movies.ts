import { Component, computed, inject, signal } from '@angular/core'

import { FilmsService } from '@/api/swapi/resources/films/films.service'
import { ImageGrid } from '@/components/image-grid/image-grid'
import { ImageGridItem } from '@/components/image-grid/image-grid-item/image-grid-item'
import { PageHeading } from '@/components/page-heading/page-heading'
import type { InputValue } from '@/shared/types/component.types'

@Component({
  selector: 'app-movies',
  imports: [PageHeading, ImageGrid, ImageGridItem],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies {
  readonly filmsService = inject(FilmsService)
  readonly page = signal('1')
  readonly collection = this.filmsService.getCollection(this.page)
  readonly gridItems = computed<InputValue<typeof ImageGrid, 'items'>>(() =>
    this.collection.data().items.map((film) => ({
      imageUrl: film.images[0],
      imageAlt: `Image of "${film.title}"`,
      label: film.title,
      linkLabel: `Go to "${film.title}" detail page`,
    })),
  )
}
