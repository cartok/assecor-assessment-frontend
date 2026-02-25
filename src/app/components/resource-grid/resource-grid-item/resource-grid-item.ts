import { Component, input } from '@angular/core'

@Component({
  selector: 'app-resource-grid-item',
  imports: [],
  templateUrl: './resource-grid-item.html',
  styleUrl: './resource-grid-item.css',
})
export class ResourceGridItem {
  readonly imageUrl = input.required<string>()
  readonly label = input.required<string>()
}
