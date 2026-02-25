import type { ComponentFixture } from '@angular/core/testing'
import { TestBed } from '@angular/core/testing'

import { ImageGridItem } from '@/components/image-grid/image-grid-item/image-grid-item'

describe('ImageGridItem', () => {
  let component: ImageGridItem
  let fixture: ComponentFixture<ImageGridItem>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageGridItem],
    }).compileComponents()

    fixture = TestBed.createComponent(ImageGridItem)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
