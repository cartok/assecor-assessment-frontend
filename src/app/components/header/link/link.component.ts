import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'

type HeaderRouterLink = RouterLink['routerLink']

@Component({
  selector: 'app-header-link',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './link.component.html',
  styleUrl: './link.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  readonly label = input.required<string>()
  readonly routerLink = input.required<HeaderRouterLink>()
  readonly exact = input(false)
}
