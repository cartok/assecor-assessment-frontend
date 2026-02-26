import { Component, input } from '@angular/core'

import { LinkListItem } from '@/components/link-list/link-list-item/link-list-item'

@Component({
  selector: 'app-link-list',
  imports: [LinkListItem],
  templateUrl: './link-list.html',
  styleUrl: './link-list.css',
})
export class LinkList {
  readonly heading = input.required<string>()
  readonly links = input.required<string[]>()
}
