import { Component, computed, effect, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router } from '@angular/router'
import { map } from 'rxjs'

import { PlanetsService } from '@/api/swapi/resources/planets/planets.service'
import { CRITICAL_HTTP_RETRY_POLICY } from '@/api/swapi/shared/http/http-retry.interceptor'
import { ImageSlider } from '@/components/image-slider/image-slider'
import { LabeledBox } from '@/components/labeled-box/labeled-box'
import { LinkList } from '@/components/link-list/link-list'
import { LinkListItem } from '@/components/link-list/link-list-item/link-list-item'
import { PageHeading } from '@/components/page-heading/page-heading'
import { ResourceDetailLayout } from '@/components/resource-detail-layout/resource-detail-layout'
import { RowDescriptionList } from '@/components/row-description-list/row-description-list'
import type { InputValue } from '@/shared/types/component.types'

@Component({
  selector: 'app-planet',
  imports: [
    PageHeading,
    RowDescriptionList,
    ImageSlider,
    LinkList,
    LabeledBox,
    LabeledBox,
    LinkListItem,
    ResourceDetailLayout,
  ],
  templateUrl: './planet.html',
  styleUrl: './planet.css',
})
export class Planet {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly planetsService = inject(PlanetsService)

  readonly id = toSignal(this.route.paramMap.pipe(map((pm) => pm.get('id')!)), {
    initialValue: this.route.snapshot.paramMap.get('id')!,
  })
  readonly item = this.planetsService.getItem(this.id, {
    retryPolicy: CRITICAL_HTTP_RETRY_POLICY,
  })

  readonly descriptionRows = computed<InputValue<typeof RowDescriptionList, 'items'>>(
    () => {
      const data = this.item.data()
      if (!data) {
        return []
      }
      const rows = []
      if (data.gravity) {
        rows.push({ term: 'Gravity:', detail: data.gravity })
      }
      if (data.population) {
        rows.push({ term: 'Population:', detail: data.population })
      }
      if (data.diameter) {
        rows.push({ term: 'Diameter:', detail: data.diameter })
      }
      if (data.surfaceWater) {
        rows.push({ term: 'Surface Water:', detail: data.surfaceWater })
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
