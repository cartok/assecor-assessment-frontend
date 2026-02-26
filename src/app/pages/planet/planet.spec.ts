import type { ComponentFixture } from '@angular/core/testing'
import { TestBed } from '@angular/core/testing'

import { Planet } from './planet'

describe('Planet', () => {
  let component: Planet
  let fixture: ComponentFixture<Planet>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Planet],
    }).compileComponents()

    fixture = TestBed.createComponent(Planet)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
