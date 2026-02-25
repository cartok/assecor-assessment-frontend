import { Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-image-grid-item',
  imports: [RouterLink],
  templateUrl: './image-grid-item.html',
  styleUrl: './image-grid-item.css',
})
export class ImageGridItem {
  readonly imageUrl = input.required<string>()
  readonly imageAlt = input.required<string>()
  readonly label = input.required<string>()
  readonly linkLabel = input.required<string>()
}
