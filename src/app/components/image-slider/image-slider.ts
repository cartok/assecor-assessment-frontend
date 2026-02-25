import { Component, input, signal } from '@angular/core'

@Component({
  selector: 'app-image-slider',
  imports: [],
  templateUrl: './image-slider.html',
  styleUrl: './image-slider.css',
})
export class ImageSlider {
  readonly images =
    input.required<{ url: string; alt: string; width: number; height: number }[]>()
  readonly viewportHeight = input.required<number>()
  activeIndex = signal(0)
}
