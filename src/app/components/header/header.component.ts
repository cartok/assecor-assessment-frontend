import { Component } from '@angular/core'
import { RouterLinkWithHref } from '@angular/router'

@Component({
  selector: 'app-header',
  imports: [RouterLinkWithHref],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
