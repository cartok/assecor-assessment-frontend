import { Component, computed, effect, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router'
import { map } from 'rxjs'

import { PeopleService } from '@/api/swapi/resources/people/people.service'
import { CRITICAL_HTTP_RETRY_POLICY } from '@/api/swapi/shared/http/http-retry.interceptor'
import { ImageSlider } from '@/components/image-slider/image-slider'
import { LabeledBox } from '@/components/labeled-box/labeled-box'
import { LinkList } from '@/components/link-list/link-list'
import { LinkListItem } from '@/components/link-list/link-list-item/link-list-item'
import { PageHeading } from '@/components/page-heading/page-heading'
import { RowDescriptionList } from '@/components/row-description-list/row-description-list'
import type { InputValue } from '@/shared/types/component.types'

@Component({
  selector: 'app-character',
  imports: [
    PageHeading,
    RowDescriptionList,
    ImageSlider,
    LinkList,
    LabeledBox,
    LabeledBox,
    LinkListItem,
  ],
  templateUrl: './character.html',
  styleUrl: './character.css',
})
export class Character {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly peopleService = inject(PeopleService)

  readonly id = toSignal(this.route.paramMap.pipe(map((pm) => pm.get('id')!)), {
    initialValue: this.route.snapshot.paramMap.get('id')!,
  })
  readonly item = this.peopleService.getItem(this.id, {
    retryPolicy: CRITICAL_HTTP_RETRY_POLICY,
  })

  readonly descriptionRows = computed<InputValue<typeof RowDescriptionList, 'items'>>(
    () => {
      const data = this.item.data()
      if (!data) {
        return []
      }
      const rows = []
      if (data.gender) {
        rows.push({ term: 'Geschlecht:', detail: data.gender })
      }
      if (data.birthYear) {
        rows.push({ term: 'Geburtsjahr:', detail: data.birthYear })
      }
      if (data.height) {
        rows.push({ term: 'Größe:', detail: data.height })
      }
      if (data.mass) {
        rows.push({ term: 'Masse:', detail: data.mass })
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
