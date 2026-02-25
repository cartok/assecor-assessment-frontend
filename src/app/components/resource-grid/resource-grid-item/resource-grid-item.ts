import { Component, input } from '@angular/core'
import { RouterLink } from '@angular/router'

// TODO: Rename. It's not a resouce specific component, is a raw UI component
@Component({
  selector: 'app-resource-grid-item',
  imports: [RouterLink],
  templateUrl: './resource-grid-item.html',
  styleUrl: './resource-grid-item.css',
})
export class ResourceGridItem {
  readonly imageUrl = input.required<string>()
  readonly imageAlt = input.required<string>()
  readonly label = input.required<string>()
  readonly linkLabel = input.required<string>()
}
