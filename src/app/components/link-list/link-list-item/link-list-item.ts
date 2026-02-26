import { Component, input } from '@angular/core'

@Component({
  selector: 'app-link-list-item',
  imports: [],
  templateUrl: './link-list-item.html',
  styleUrl: './link-list-item.css',
})
export class LinkListItem {
  readonly text = input.required<string>()
}
