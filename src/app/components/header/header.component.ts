import { NgOptimizedImage } from '@angular/common'
import { Component } from '@angular/core'
import { RouterLinkWithHref } from '@angular/router'

@Component({
  selector: 'app-header',
  imports: [RouterLinkWithHref, NgOptimizedImage],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
