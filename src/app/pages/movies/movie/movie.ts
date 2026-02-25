import { Component, effect, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router'
import { map } from 'rxjs'

import { FilmsService } from '@/api/swapi/resources/films/films.service'
import { CRITICAL_HTTP_RETRY_POLICY } from '@/api/swapi/shared/http/http-retry.interceptor'
import { PageHeading } from '@/components/page-heading/page-heading'

@Component({
  selector: 'app-movie',
  imports: [PageHeading],
  templateUrl: './movie.html',
  styleUrl: './movie.css',
})
export class Movie {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly filmsService = inject(FilmsService)

  readonly id = toSignal(
    this.route.paramMap.pipe(map((pm) => pm.get('id') ?? undefined)),
    {
      initialValue: undefined,
    },
  )
  readonly item = this.filmsService.getItem(this.id, {
    retryPolicy: CRITICAL_HTTP_RETRY_POLICY,
  })

  constructor() {
    effect(() => {
      if (this.item.status() === 'error') {
        void this.router.navigate(['/error'])
      }
    })
  }
}
