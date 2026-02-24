import { Component, computed, inject } from '@angular/core'

import { FilmsService } from '@/api/swapi/resources/films/films.service'
import { PageHeading } from '@/components/page-heading/page-heading'

@Component({
  selector: 'app-movies',
  imports: [PageHeading],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies {
  readonly filmsService = inject(FilmsService)
  readonly collectionJson = computed(() => {
    if (this.filmsService.collectionResource.hasValue()) {
      return JSON.stringify(this.filmsService.collectionResource.value(), null, 2)
    }

    return JSON.stringify(
      {
        status: this.filmsService.collectionResource.status(),
        error: this.filmsService.collectionResource.error(),
      },
      null,
      2,
    )
  })
}
