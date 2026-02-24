import { Component } from '@angular/core'

import { PageHeading } from '@/components/page-heading/page-heading'

@Component({
  selector: 'app-movies',
  imports: [PageHeading],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies {
  // TODO: such ids should be random generated automatically
  protected readonly sectionId = 'movie-title'
}
