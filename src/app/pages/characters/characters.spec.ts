import type { ComponentFixture } from '@angular/core/testing'
import { TestBed } from '@angular/core/testing'

import { Characters } from '@/pages/characters/characters'
import { provideRouter } from '@angular/router'

describe('Characters', () => {
  let component: Characters
  let fixture: ComponentFixture<Characters>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Characters],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(Characters)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
