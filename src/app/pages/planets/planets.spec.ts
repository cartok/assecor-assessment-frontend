import type { ComponentFixture } from '@angular/core/testing'
import { TestBed } from '@angular/core/testing'

import { Planets } from '@/pages/planets/planets'

describe('Planets', () => {
  let component: Planets
  let fixture: ComponentFixture<Planets>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Planets],
    }).compileComponents()

    fixture = TestBed.createComponent(Planets)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
