import { Component } from '@angular/core'

import { PageHeading } from '@/components/page-heading/page-heading'

@Component({
  selector: 'app-movies',
  imports: [PageHeading],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies {
  // TODO: such ids should maybe be random generated and less explicit
  protected readonly sectionId = 'section-id-movies'
}
