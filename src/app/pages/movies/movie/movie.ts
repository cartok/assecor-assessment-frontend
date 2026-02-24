import { Component, computed, effect, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute } from '@angular/router'
import { map } from 'rxjs'

import { FilmsService } from '@/api/swapi/resources/films/films.service'
import { PageHeading } from '@/components/page-heading/page-heading'

@Component({
  selector: 'app-movie',
  imports: [PageHeading],
  templateUrl: './movie.html',
  styleUrl: './movie.css',
})
export class Movie {
  private readonly route = inject(ActivatedRoute)
  readonly filmsService = inject(FilmsService)

  readonly id = toSignal(
    this.route.paramMap.pipe(map((pm) => pm.get('id') ?? undefined)),
    {
      initialValue: undefined,
    },
  )
  readonly itemJson = computed(() => {
    if (this.filmsService.itemResource.hasValue()) {
      return JSON.stringify(this.filmsService.itemResource.value(), null, 2)
    }

    return JSON.stringify(
      {
        status: this.filmsService.itemResource.status(),
        error: this.filmsService.itemResource.error(),
      },
      null,
      2,
    )
  })

  constructor() {
    effect(() => {
      const id = this.id()
      this.filmsService.itemId.set(id?.trim() === '' ? undefined : id)
    })
  }
}
