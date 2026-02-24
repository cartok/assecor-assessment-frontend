import { Component } from '@angular/core'

import { PageHeading } from '@/components/page-heading/page-heading'

@Component({
  selector: 'app-movies',
  imports: [PageHeading],
  templateUrl: './movies.html',
  styleUrl: './movies.css',
})
export class Movies {}
