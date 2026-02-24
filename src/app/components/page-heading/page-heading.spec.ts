import type { ComponentFixture } from '@angular/core/testing'
import { TestBed } from '@angular/core/testing'

import { PageHeading } from '@/components/page-heading/page-heading'

describe('PageHeading', () => {
  let component: PageHeading
  let fixture: ComponentFixture<PageHeading>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeading],
    }).compileComponents()

    fixture = TestBed.createComponent(PageHeading)
    fixture.componentRef.setInput('title', 'Test Title')
    fixture.detectChanges()
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
