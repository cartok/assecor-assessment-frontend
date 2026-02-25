import { Component, input } from '@angular/core'

import { ResourceGridItem } from '@/components/resource-grid/resource-grid-item/resource-grid-item'
import type { InputValues } from '@/shared/types/component.types'

@Component({
  selector: 'app-resource-grid',
  imports: [ResourceGridItem],
  templateUrl: './resource-grid.html',
  styleUrl: './resource-grid.css',
})
export class ResourceGrid {
  readonly items =
    input.required<InputValues<typeof ResourceGridItem, 'imageUrl' | 'label'>[]>()
}
