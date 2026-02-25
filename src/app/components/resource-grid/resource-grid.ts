import { Component, input } from '@angular/core'

import { ResourceGridItem } from '@/components/resource-grid/resource-grid-item/resource-grid-item'

@Component({
  selector: 'app-resource-grid',
  imports: [ResourceGridItem],
  templateUrl: './resource-grid.html',
  styleUrl: './resource-grid.css',
})
export class ResourceGrid {
  // TODO: The type of `items` could be tightly coupled to the inputs of `ResourceGridItem`
  readonly items = input.required<{ imageUrl: string; label: string }[]>()
}
