import { httpResource } from '@angular/common/http'
import { computed, Injectable, type ResourceStatus, type Signal } from '@angular/core'

import type { FilmDto } from '@/api/swapi/resources/films/films.dto'
import { mapFilmDtoToModel } from '@/api/swapi/resources/films/films.mapper'
import type { Film } from '@/api/swapi/resources/films/films.model'
import { swapiUrl } from '@/api/swapi/shared/http/api-client'
import {
  MINIMAL_HTTP_RETRY_POLICY,
  type RetryableHttpResourceMethodOptions,
  retryableHttpResourceRequest,
} from '@/api/swapi/shared/http/http-retry.interceptor'
import type { SwapiResourceCollectionDto } from '@/api/swapi/shared/types/dto'
import type { SwapiResourceCollection } from '@/api/swapi/shared/types/model'
import { extractSwapiIdOptional } from '@/api/swapi/shared/utils/mapping'

export interface SwapiServiceResult<T> {
  status: Signal<ResourceStatus>
  data: Signal<T | undefined>
  errors: Signal<Error[] | undefined>
  reload: () => boolean
}

@Injectable({
  providedIn: 'root',
})
export class FilmsService {
  private readonly resourcePath = 'films'

  // TODO: 'page' query parameter hinzufügen (Signal<string>)
  getCollection(
    options?: RetryableHttpResourceMethodOptions,
  ): SwapiServiceResult<SwapiResourceCollection<Film>> {
    const resource = httpResource<SwapiResourceCollectionDto<FilmDto>>(
      retryableHttpResourceRequest(
        () => swapiUrl([this.resourcePath]),
        options?.retryPolicy,
      ),
    )
    const data = computed<SwapiResourceCollection<Film> | undefined>(() => {
      if (!resource.hasValue()) {
        return undefined
      }

      const response = resource.value()
      const items: Film[] = []

      for (const dto of response.results ?? []) {
        try {
          items.push(mapFilmDtoToModel(dto))
        } catch {
          // skip invalid items in collection responses
        }
      }

      return {
        count: response.count,
        next: extractSwapiIdOptional(response.next),
        previous: extractSwapiIdOptional(response.previous),
        items,
      }
    })

    return {
      data,
      status: resource.status,
      errors: computed<Error[] | undefined>(() => {
        const currentError = resource.error()
        if (currentError === undefined) {
          return undefined
        }

        return [currentError]
      }),
      reload: () => resource.reload(),
    }
  }

  getItem(
    id: Signal<string>,
    options?: RetryableHttpResourceMethodOptions,
  ): SwapiServiceResult<Film> {
    const resource = httpResource<Film>(
      retryableHttpResourceRequest(
        () => swapiUrl([this.resourcePath, id()]),
        options?.retryPolicy,
      ),
      {
        parse: (value: unknown): Film => mapFilmDtoToModel(value as FilmDto),
      },
    )

    return {
      data: resource.value,
      status: resource.status,
      errors: computed<Error[] | undefined>(() => {
        const currentError = resource.error()
        if (currentError === undefined) {
          return undefined
        }

        return [currentError]
      }),
      reload: () => resource.reload(),
    }
  }

  getItems(
    ids: Signal<string[] | undefined>,
    options?: RetryableHttpResourceMethodOptions,
  ): SwapiServiceResult<Film[]> {
    const resourcesById = new Map<string, SwapiServiceResult<Film>>()

    // cache
    const getOrCreateResource = (id: string): SwapiServiceResult<Film> => {
      const existingResource = resourcesById.get(id)
      if (existingResource !== undefined) {
        return existingResource
      }

      const idSignal = computed(() => id)
      const newResource = this.getItem(idSignal, {
        ...options,
        retryPolicy: {
          ...MINIMAL_HTTP_RETRY_POLICY,
          ...options?.retryPolicy,
        },
      })
      resourcesById.set(id, newResource)

      return newResource
    }

    const resources = computed<SwapiServiceResult<Film>[] | undefined>(() => {
      const currentIds = ids()
      if (currentIds === undefined) {
        return undefined
      }

      return currentIds.map((id) => getOrCreateResource(id))
    })

    const data = computed<Film[] | undefined>(() => {
      const currentIds = ids()
      if (currentIds === undefined) {
        return undefined
      }

      const items: Film[] = []
      for (const id of currentIds) {
        const item = getOrCreateResource(id).data()
        if (item !== undefined) {
          items.push(item)
        }
      }

      return items
    })

    const status = computed<ResourceStatus>(() => {
      const currentResources = resources()
      if (currentResources === undefined) {
        return 'idle'
      }

      if (currentResources.length === 0) {
        return 'resolved'
      }

      let hasLoading = false
      let hasReloading = false
      for (const resource of currentResources) {
        const resourceStatus = resource.status()
        if (resourceStatus === 'error') {
          return 'error'
        }

        if (resourceStatus === 'loading') {
          hasLoading = true
        }

        if (resourceStatus === 'reloading') {
          hasReloading = true
        }
      }

      if (hasLoading) {
        return 'loading'
      }

      if (hasReloading) {
        return 'reloading'
      }

      return 'resolved'
    })

    const errors = computed<Error[] | undefined>(() => {
      const currentResources = resources()
      if (currentResources === undefined) {
        return undefined
      }

      const currentErrors: Error[] = []
      for (const resource of currentResources) {
        const itemErrors = resource.errors()
        if (itemErrors !== undefined) {
          currentErrors.push(...itemErrors)
        }
      }

      if (currentErrors.length === 0) {
        return undefined
      }

      return currentErrors
    })

    return {
      data,
      status,
      errors,
      reload: () => {
        const currentResources = resources()
        if (currentResources === undefined) {
          return false
        }

        let hasReloaded = false
        for (const id of new Set(ids())) {
          hasReloaded = getOrCreateResource(id).reload() || hasReloaded
        }

        return hasReloaded
      },
    }
  }
}
