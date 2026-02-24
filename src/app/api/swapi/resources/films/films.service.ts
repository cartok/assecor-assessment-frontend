import { httpResource } from '@angular/common/http'
import { computed, effect, inject, Injectable, signal } from '@angular/core'
import { Router } from '@angular/router'

import type { FilmDto } from '@/api/swapi/resources/films/films.dto'
import { mapFilmDtoToModel } from '@/api/swapi/resources/films/films.mapper'
import type { Film } from '@/api/swapi/resources/films/films.model'
import {
  swapiResourceCollectionUrl,
  swapiResourceDetailUrlOptional,
} from '@/api/swapi/shared/http/api-client'
import type { SwapiResourceCollectionDto } from '@/api/swapi/shared/types/dto'
import type { SwapiResourceCollection } from '@/api/swapi/shared/types/model'
import { toUndefinedIfNullish } from '@/api/swapi/shared/utils/mapping'

@Injectable({
  providedIn: 'root',
})
export class FilmsService {
  private readonly router = inject(Router)
  private readonly resourcePath = 'films'

  readonly collectionResource = httpResource<SwapiResourceCollectionDto<FilmDto>>(() =>
    swapiResourceCollectionUrl(this.resourcePath),
  )
  readonly collection = computed<SwapiResourceCollection<Film>>(() => {
    const response = this.collectionResource.hasValue()
      ? this.collectionResource.value()
      : undefined
    const items: Film[] = []

    for (const dto of response?.results ?? []) {
      try {
        items.push(mapFilmDtoToModel(dto))
      } catch {
        // skip invalid items in collection responses
      }
    }

    return {
      count: response?.count,
      next: toUndefinedIfNullish(response?.next),
      previous: toUndefinedIfNullish(response?.previous),
      items,
    }
  })

  readonly itemId = signal<string | undefined>(undefined)
  readonly itemResource = httpResource<FilmDto>(() =>
    swapiResourceDetailUrlOptional(this.resourcePath, this.itemId()),
  )
  readonly item = computed<Film | undefined>(() => {
    if (!this.itemResource.hasValue()) {
      return undefined
    }

    try {
      return mapFilmDtoToModel(this.itemResource.value())
    } catch {
      return undefined
    }
  })

  constructor() {
    effect(() => {
      const hasHttpError = this.itemResource.error() !== undefined
      const hasMappingError = this.itemResource.hasValue() && this.item() === undefined

      if (hasHttpError || hasMappingError) {
        void this.router.navigate(['/error']).catch(() => undefined)
      }
    })
  }
}
