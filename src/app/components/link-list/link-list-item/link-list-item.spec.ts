import type { ComponentFixture } from '@angular/core/testing'
import { TestBed } from '@angular/core/testing'

import { LinkListItem } from './link-list-item'

describe('LinkListItem', () => {
  let component: LinkListItem
  let fixture: ComponentFixture<LinkListItem>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkListItem],
    }).compileComponents()

    fixture = TestBed.createComponent(LinkListItem)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
