import { Component, input } from '@angular/core'

import type { ImageGridItem } from '@/components/image-grid/image-grid-item/image-grid-item'
import type { InputValues } from '@/shared/types/component.types'

@Component({
  selector: 'app-image-grid',
  imports: [],
  templateUrl: './image-grid.html',
  styleUrl: './image-grid.css',
})
export class ImageGrid {
  readonly items =
    input.required<
      InputValues<typeof ImageGridItem, 'imageUrl' | 'label' | 'linkLabel' | 'imageAlt'>[]
    >()
}
