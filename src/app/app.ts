import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { Header } from './components/header/header'
import { Footer } from './components/footer/footer'
import { Separator } from './components/separator/separator'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Separator],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  title = 'assecor-assessment-frontend'
}
