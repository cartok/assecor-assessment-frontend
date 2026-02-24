import { Component, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router'
import { map } from 'rxjs'

import { PageHeading } from '@/components/page-heading/page-heading'

@Component({
  selector: 'app-movie',
  imports: [PageHeading],
  templateUrl: './movie.html',
  styleUrl: './movie.css',
})
export class Movie {
  private readonly route = inject(ActivatedRoute)

  readonly id = toSignal(this.route.paramMap.pipe(map((pm) => pm.get('id'))), {
    initialValue: null,
  })
}
