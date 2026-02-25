import { Component, inject } from '@angular/core'

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
  readonly collection = this.filmsService.getCollection()
}
