import { Component } from '@angular/core'

import bp from '#/variables/breakpoints.json'
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  constructor() {
    console.log({ bp })
    console.log(typeof bp.foo)
    console.log(typeof bp.bar)
  }
}
