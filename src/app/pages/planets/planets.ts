import { Component, inject, signal } from '@angular/core'

import type { Planet } from '@/api/swapi/resources/planets/planets.model'
import { PlanetsService } from '@/api/swapi/resources/planets/planets.service'
import { ImageGrid } from '@/components/image-grid/image-grid'
import { ImageGridItem } from '@/components/image-grid/image-grid-item/image-grid-item'
import { PageHeading } from '@/components/page-heading/page-heading'
import { ResourceGridLayout } from '@/components/resource-grid-layout/resource-grid-layout'

@Component({
  selector: 'app-planets',
  imports: [PageHeading, ResourceGridLayout, ImageGrid, ImageGridItem],
  templateUrl: './planets.html',
  styleUrl: './planets.css',
})
export class Planets {
  readonly planetsService = inject(PlanetsService)
  readonly page = signal('1')
  readonly collection = this.planetsService.getCollection(this.page)

  imageTitle = (planet: Planet) => `Image of "${planet.name}"`
  linkUri = (planet: Planet) => `/planet/${planet.id}`
}
