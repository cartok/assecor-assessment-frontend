import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { Footer } from '@/blocks/footer/footer'
import { Header } from '@/blocks/header/header'
import { Separator } from '@/components/separator/separator'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Separator],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'Angular Signals-based SWAPI Frontend'
}
