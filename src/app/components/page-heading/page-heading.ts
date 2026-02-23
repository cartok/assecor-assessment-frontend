import { Component, input } from '@angular/core'

@Component({
  selector: 'app-page-heading',
  imports: [],
  templateUrl: './page-heading.html',
  styleUrl: './page-heading.css',
})
export class PageHeading {
  readonly location = input<string>()
  readonly title = input.required<string>()
  readonly titleId = input<string>()
  readonly subtitle = input<string>()
}
