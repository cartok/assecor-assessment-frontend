import type { ElementRef } from '@angular/core'
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core'

@Component({
  selector: 'app-image-slider',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image-slider.html',
  styleUrl: './image-slider.css',
})
export class ImageSlider {
  readonly images =
    input.required<{ url: string; alt: string; width: number; height: number }[]>()
  readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport')
  readonly viewportWidth = signal(0)
  readonly viewportHeight = input.required<number>()
  readonly activeIndex = signal(0)

  constructor() {
    effect((onCleanup) => {
      const el = this.viewport().nativeElement
      let lastWidth = 0

      this.viewportWidth.set(el.getBoundingClientRect().width)
      lastWidth = this.viewportWidth()

      const observer = new ResizeObserver(([entry]) => {
        const nextWidth = entry.contentRect.width
        if (nextWidth === lastWidth) {
          return
        }
        lastWidth = nextWidth
        this.viewportWidth.set(lastWidth)
      })

      observer.observe(el, { box: 'content-box' })
      onCleanup(() => observer.disconnect())
    })
  }
}
