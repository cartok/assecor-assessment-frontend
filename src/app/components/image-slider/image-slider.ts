import type { ElementRef } from '@angular/core'
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
  viewChild,
} from '@angular/core'

import { SwipeDirective } from '@/shared/directives/swipe/swipe'

@Component({
  selector: 'app-image-slider',
  imports: [SwipeDirective],
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
  readonly isSwiping = signal(false)
  private readonly _activeIndex = signal(0)
  readonly activeIndex = this._activeIndex.asReadonly()
  readonly slidesX = computed<number>(() => this.activeIndex() * this.viewportWidth())

  setActiveIndex(index: number): void {
    const imageCount = this.images().length
    if (imageCount === 0) {
      this._activeIndex.set(0)
      return
    }

    const wrappedIndex = ((index % imageCount) + imageCount) % imageCount
    this._activeIndex.set(wrappedIndex)
  }

  decrementActiveIndex(): void {
    this.setActiveIndex(this._activeIndex() - 1)
  }

  incrementActiveIndex(): void {
    this.setActiveIndex(this._activeIndex() + 1)
  }

  enableDraggingCursor(): void {
    this.isSwiping.set(true)
  }

  disableDraggingCursor(): void {
    this.isSwiping.set(false)
  }

  constructor() {
    effect((onCleanup) => {
      const viewportElement = this.viewport().nativeElement
      let lastWidth = 0

      this.viewportWidth.set(viewportElement.getBoundingClientRect().width)
      lastWidth = this.viewportWidth()

      const observer = new ResizeObserver(([entry]) => {
        const nextWidth = entry.contentRect.width
        if (nextWidth === lastWidth) {
          return
        }
        lastWidth = nextWidth
        this.viewportWidth.set(lastWidth)
      })

      observer.observe(viewportElement)
      onCleanup(() => observer.disconnect())
    })
  }
}
