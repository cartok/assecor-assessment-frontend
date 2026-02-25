import type { ElementRef } from '@angular/core'
import { Component, effect, input, signal, viewChild } from '@angular/core'

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

  readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport')
  readonly width = signal(0)
  constructor() {
    effect((onCleanup) => {
      const el = this.viewport().nativeElement
      this.width.set(el.getBoundingClientRect().width)

      const observer = new ResizeObserver(([entry]) => {
        this.width.set(entry.contentRect.width)
      })

      observer.observe(el)
      onCleanup(() => observer.disconnect())
    })
  }
}
