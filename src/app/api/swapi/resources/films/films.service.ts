import { httpResource } from '@angular/common/http'
import type { ResourceStatus, Signal } from '@angular/core'
import { computed, Injectable } from '@angular/core'

import type { FilmDto } from '@/api/swapi/resources/films/films.dto'
import { mapFilmDtoToModel } from '@/api/swapi/resources/films/films.mapper'
import type { Film } from '@/api/swapi/resources/films/films.model'
import {
  swapiResourceCollectionUrl,
  swapiResourceDetailUrlOptional,
} from '@/api/swapi/shared/http/api-client'
import {
  type HttpRetryPolicy,
  retryableHttpResourceRequest,
} from '@/api/swapi/shared/http/http-retry.interceptor'
import type { SwapiResourceCollectionDto } from '@/api/swapi/shared/types/dto'
import type { SwapiResourceCollection } from '@/api/swapi/shared/types/model'
import { extractSwapiIdOptional } from '@/api/swapi/shared/utils/mapping'

export interface SwapiServiceResult<T> {
  status: Signal<ResourceStatus>
  data: Signal<T | undefined>
  error: Signal<Error | undefined>
  reload: () => boolean
}

@Injectable({
  providedIn: 'root',
})
export class FilmsService {
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
      next: extractSwapiIdOptional(response?.next),
      previous: extractSwapiIdOptional(response?.previous),
      items,
    }
  })

  getItem(
    id: Signal<string | undefined>,
    options?: {
      retryPolicy?: Partial<HttpRetryPolicy>
    },
  ): SwapiServiceResult<Film> {
    const resource = httpResource<Film>(
      retryableHttpResourceRequest(
        () => swapiResourceDetailUrlOptional(this.resourcePath, id()),
        options?.retryPolicy,
      ),
      {
        parse: (value: unknown): Film => mapFilmDtoToModel(value as FilmDto),
      },
    )

    return {
      data: resource.value,
      status: resource.status,
      error: resource.error,
      reload: () => resource.reload(),
    }
  }
}
