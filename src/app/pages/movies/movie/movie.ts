import { Component, computed, effect, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router'
import { map } from 'rxjs'

import { FilmsService } from '@/api/swapi/resources/films/films.service'
import { CRITICAL_HTTP_RETRY_POLICY } from '@/api/swapi/shared/http/http-retry.interceptor'
import { PageHeading } from '@/components/page-heading/page-heading'
import { RowDescriptionList } from '@/components/row-description-list/row-description-list'
import type { InputValue } from '@/shared/types/component.types'

@Component({
  selector: 'app-movie',
  imports: [PageHeading, RowDescriptionList],
  templateUrl: './movie.html',
  styleUrl: './movie.css',
})
export class Movie {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly filmsService = inject(FilmsService)

  readonly id = toSignal(this.route.paramMap.pipe(map((pm) => pm.get('id')!)), {
    initialValue: this.route.snapshot.paramMap.get('id')!,
  })
  readonly item = this.filmsService.getItem(this.id, {
    retryPolicy: CRITICAL_HTTP_RETRY_POLICY,
  })

  readonly descriptionRows = computed<InputValue<typeof RowDescriptionList, 'items'>>(
    () => {
      const data = this.item.data()
      if (!data) {
        return []
      }
      const rows = []
      if (data.director) {
        rows.push({ term: 'Regie:', detail: data.director })
      }
      if (data.releaseDate) {
        rows.push({
          term: 'Erscheinungsjahr:',
          detail: String(data.releaseDate.getFullYear()),
        })
      }
      return rows
    },
  )

  constructor() {
    effect(() => {
      if (this.item.status() === 'error') {
        void this.router.navigate(['/error'])
      }
    })
  }
}
