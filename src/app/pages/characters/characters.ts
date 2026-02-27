import { Component, inject, signal } from '@angular/core'

import type { Person } from '@/api/swapi/resources/people/people.model'
import { PeopleService } from '@/api/swapi/resources/people/people.service'
import { Heading } from '@/components/heading/heading'
import { ImageGrid } from '@/components/image-grid/image-grid'
import { ImageGridItem } from '@/components/image-grid/image-grid-item/image-grid-item'
import { ResourceGridLayout } from '@/layouts/resource-grid-layout/resource-grid-layout'

@Component({
  selector: 'app-characters',
  imports: [Heading, ResourceGridLayout, ImageGrid, ImageGridItem],
  templateUrl: './characters.html',
  styleUrl: './characters.css',
})
export class Characters {
  readonly peopleService = inject(PeopleService)
  readonly page = signal('1')
  readonly collection = this.peopleService.getCollection(this.page)

  imageTitle = (person: Person) => `Image of "${person.name}"`
  linkUri = (person: Person) => `/character/${person.id}`
}
