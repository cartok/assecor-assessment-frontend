import { Component, input } from '@angular/core'

import type { ResourceGridItem } from '@/components/resource-grid/resource-grid-item/resource-grid-item'
import type { InputValues } from '@/shared/types/component.types'

// TODO: Rename. It's not a resouce specific component, is a raw UI component
@Component({
  selector: 'app-resource-grid',
  imports: [],
  templateUrl: './resource-grid.html',
  styleUrl: './resource-grid.css',
})
export class ResourceGrid {
  readonly items =
    input.required<
      InputValues<
        typeof ResourceGridItem,
        'imageUrl' | 'label' | 'linkLabel' | 'imageAlt'
      >[]
    >()
}
