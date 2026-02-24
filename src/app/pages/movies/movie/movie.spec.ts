import type { ComponentFixture } from '@angular/core/testing'
import { TestBed } from '@angular/core/testing'
import { ActivatedRoute, convertToParamMap } from '@angular/router'
import { of } from 'rxjs'

import { Movie } from './movie'

describe('Movie', () => {
  let component: Movie
  let fixture: ComponentFixture<Movie>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Movie],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
          },
        },
      ],
    })
      .compileComponents()

    fixture = TestBed.createComponent(Movie)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
