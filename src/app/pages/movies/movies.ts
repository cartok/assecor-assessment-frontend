import { Component, inject, signal } from '@angular/core'

import { FilmsService } from '@/api/swapi/resources/films/films.service'
import { PageHeading } from '@/components/page-heading/page-heading'
import { ResourceGrid } from '@/components/resource-grid/resource-grid'

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
}
